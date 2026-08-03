import { ref } from 'vue'

export interface City {
  id: number
  name: string
  isHub?: boolean
}

export const defaultCities: City[] = [
  { id: 1, name: 'تهران', isHub: true },
  { id: 191, name: 'مشهد', isHub: true },
  { id: 21, name: 'اصفهان', isHub: true },
  { id: 161, name: 'قم', isHub: true },
  { id: 55, name: 'تبریز', isHub: true },
  { id: 167, name: 'کرمان', isHub: true },
  { id: 219, name: 'یزد', isHub: true },
  { id: 37, name: 'بندر عباس', isHub: true },
  { id: 25, name: 'اهواز', isHub: true },
  { id: 255, name: 'شیراز', isHub: true },
  { id: 451, name: 'رشت' },
  { id: 100, name: 'ساری' },
  { id: 117, name: 'همدان' },
  { id: 14, name: 'اراک' },
  { id: 448, name: 'ارومیه' },
  { id: 160, name: 'قزوین' },
  { id: 15, name: 'ملایر' }
]

export const cities: City[] = [...defaultCities]

export interface PassengerDetails {
  men: number
  women: number
  boys: number
  girls: number
  infants: number
}

export interface SearchRoute {
  from: number
  to: number
  fromName: string
  toName: string
}

export interface PresaleFilters {
  coachTypes?: number[]
  departureTimeStart?: string
  departureTimeEnd?: string
}

export interface SearchParams {
  origins: number[]
  destination: number
  destinations: number[]
  originsMode?: 'single' | 'multiple'
  destinationMode?: 'single' | 'multiple'
  date: string
  passengers: number | PassengerDetails
  selectedTrainIds: string[]
  compartmentType?: 'regular' | 'private' | 'scattered' | 'sisters' | 'brothers'
  dates?: string[]
  routes?: SearchRoute[]
  isPresale?: boolean
  exclusiveCoupe?: boolean
  presaleFilters?: PresaleFilters
}

// --- Singleton state (module-level, shared across all callers) ---
const searchParams = ref<SearchParams>({
  origins: [],
  destination: 0,
  destinations: [],
  date: new Date().toISOString().split('T')[0] ?? '',
  passengers: 1,
  selectedTrainIds: [],
  compartmentType: 'regular',
  dates: [],
  routes: []
})
const selectedTrain = ref<any>(null)
const isAuthenticated = ref(false)
const userRole = ref<'b2b' | 'b2c' | null>(null)

// v2.3.1 fallbacks — match TierConfig BASIC/SPECIAL defaults (in Toman) when API is unreachable.
// API /public/pricing is the single source of truth; these are only offline fallbacks.
const SERVICE_CHARGE = { b2c: 19000, b2b: 16150 }
const MULTI_ORIGIN_SURCHARGE = 6000

export interface PricingData {
  serviceFee: {
    baseFeeRegular: number
    baseFeeAgency: number
    extraRouteFeeRegular: number
    extraRouteFeeAgency: number
    exclusiveCompartmentRegular: number
    exclusiveCompartmentAgency: number
  }
  passengerPricing: {
    description: string
  }
  exclusiveCompartment: {
    label: string
    description: string
    ticketFormula: string
    serviceFeeFormula: string
  }
  currency: string
}

export interface PricingItem {
  label: string
  amount: number
}

export interface PricingResult {
  perPassenger: {
    baseFee: number
    additionalRoutes: number
    additionalRoutesFee: number
    subtotal: number
  }
  passengerCount: number
  exclusiveCompartmentFee?: number
  // v2.5.0: split totals from backend
  ticketTotal?: number   // train ticket cost (full seats + discounted empty seats)
  serviceTotal?: number  // railnegar service fees (base + exclusive coupe fee)
  billedSeatsPerCompartment?: number
  total: number
  items: PricingItem[]
}

export interface TicketFareRequest {
  CircularNumberSerial: number
  MoveDate: string
  PathCode: number
  RateCode: number
  Ration: number
  trainNumber: number | string
  wagonType: number | string
  TarrifCode: number // 0=adult, 1=child, 5=infant
  ToStation: string
  FromStation: string
  isForeign?: boolean
}

export interface TicketFareResult {
  tarrifCode: number
  amountRial: number
  amountToman: number
  formula16: number
}

export const useSearch = () => {
  const pricingData = ref<PricingData | null>(null)
  const activePresale = ref<any>(null)

  const fetchActivePresale = async () => {
    try {
      const res = await $fetch<any>('https://railapi.happyupload.com/api/v1/public/presales/active')
      if (res && res.isActive) {
        activePresale.value = res
        return res
      }
    } catch (err) {
      console.error('Failed to fetch active presale:', err)
    }
    activePresale.value = null
    return null
  }
  const pricingLoading = ref(false)
  const fetchStations = async () => {
    try {
      const response = await $fetch<any>('https://railapi.happyupload.com/api/v1/public/stations')
      if (response && response.stations && Array.isArray(response.stations)) {
        cities.length = 0 // Clear array but keep reference
        response.stations.forEach(s => {
          cities.push({
            id: s.id,
            name: s.nameFa,
            isHub: s.isHub
          })
        })
      }
    } catch (e) {
      console.error('Failed to fetch stations:', e)
    }
  }

  const setParams = (params: SearchParams) => {
    searchParams.value = params
  }

  const setSelectedTrain = (train: any) => {
    selectedTrain.value = train
  }

  const setAuthenticated = (auth: boolean, role: 'b2b' | 'b2c' | null = null) => {
    isAuthenticated.value = auth
    userRole.value = role
  }

  const getServiceCharge = () => {
    if (pricingData.value?.serviceFee) return pricingData.value.serviceFee.baseFeeRegular
    if (!isAuthenticated.value || !userRole.value) return SERVICE_CHARGE.b2c
    return SERVICE_CHARGE[userRole.value as 'b2c' | 'b2b']
  }

  const getTotalServiceCharge = (passengerCount: number, originCount: number) => {
    const baseCharge = getServiceCharge() * passengerCount
    const multiOriginSurcharge = (originCount > 1 ? (originCount - 1) * MULTI_ORIGIN_SURCHARGE : 0) * passengerCount
    return baseCharge + multiOriginSurcharge
  }

  const fetchPricing = async () => {
    try {
      pricingLoading.value = true
      const res = await $fetch<any>('https://railapi.happyupload.com/api/v1/public/pricing')
      if (res?.ok && res?.data) {
        pricingData.value = res.data as PricingData
      }
    } catch (err) {
      console.error('Failed to fetch pricing:', err)
    } finally {
      pricingLoading.value = false
    }
  }

  const calculatePricing = async (params: {
    isAgency: boolean
    passengerCount: number
    subRequests: { fromStationId: number; toStationId: number; travelDate: string }[]
    exclusiveCompartment?: boolean
    compartmentCapacity?: number
    // v2.5.0: per-seat train ticket price (Toman) — enables backend to compute ticketTotal
    ticketCostPerSeat?: number
  }): Promise<PricingResult | null> => {
    try {
      const res = await $fetch<any>('https://railapi.happyupload.com/api/v1/public/pricing/calculate', {
        method: 'POST',
        body: params
      })
      if (res?.ok && res?.data) {
        const data = res.data as PricingResult
        // v2.3.1: API returns amounts directly in Toman (Single Source of Truth from TierConfig).
        // No multiplication needed — display exactly what the API returns.
        data.total = Number(data.total || 0)
        data.ticketTotal = Number(data.ticketTotal || 0)
        data.serviceTotal = Number(data.serviceTotal || 0)
        return data
      }
    } catch (err) {
      console.error('Failed to calculate pricing:', err)
    }
    return null
  }

  const ticketFare = async (params: TicketFareRequest): Promise<TicketFareResult | null> => {
    try {
      const res = await $fetch<any>('https://railapi.happyupload.com/api/v1/public/pricing/ticket-fare', {
        method: 'POST',
        body: params
      })
      if (res?.ok && res?.data) {
        return res.data as TicketFareResult
      }
    } catch (err) {
      console.error('Failed to get ticket fare:', err)
    }
    return null
  }

  const clearSearch = () => {
    searchParams.value = {
      origins: [],
      destination: 0,
      destinations: [],
      date: new Date().toISOString().split('T')[0] ?? '',
      passengers: 1,
      selectedTrainIds: [],
      compartmentType: 'regular',
      dates: [],
      routes: []
    }
    selectedTrain.value = null
  }

  return {
    searchParams,
    selectedTrain,
    isAuthenticated,
    userRole,
    cities,
    pricingData,
    pricingLoading,
    activePresale,
    fetchActivePresale,
    fetchStations,
    setParams,
    setSelectedTrain,
    setAuthenticated,
    getServiceCharge,
    getTotalServiceCharge,
    fetchPricing,
    calculatePricing,
    ticketFare,
    clearSearch
  }
}
