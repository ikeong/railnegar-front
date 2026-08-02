import { useApiFetch } from './useApiFetch'
import type { NewPassengerInput } from './usePassengers'

export interface PassengerInput {
  firstName: string
  lastName: string
  nationalId: string
  gender?: 'MALE' | 'FEMALE'
  birthDate?: string
  phone?: string
  isForeign?: boolean
  resolution?: 'reject' | 'replace' | 'merge'
}

export interface BookingRequestInput {
  fromStationId?: number
  toStationId?: number
  travelDate?: string
  adultsCount?: number
  childrenCount?: number
  priority?: number
  isPresale?: boolean
  allowPartial?: boolean
  exclusiveCoupe?: boolean
  coupeWomenAllowed?: boolean
  coupeMenAllowed?: boolean
  coupeMixedAllowed?: boolean
  notes?: string
  coupeType?: 'FAMILY' | 'MEN' | 'WOMEN'
  passengers?: { passengerId: number; position?: number }[]
  subRequests?: { fromStationId: number; toStationId: number; travelDate: string }[]
  // v2.8.0: passengers created/updated automatically by the backend (upsert by nationalId)
  newPassengers?: NewPassengerInput[]
  metadata?: {
    filters?: {
      departureTimeStart?: string
      departureTimeEnd?: string
      coachTypes?: number[]
      maxPrice?: number
      scattered?: boolean
    }
  }
}

export const useOrders = () => {
  const getOrders = async (params?: {
    status?: string
    skip?: number
    take?: number
    sort?: 'newest' | 'oldest'
  }) => {
    const query = new URLSearchParams()
    if (params?.status) query.set('status', params.status)
    if (params?.skip) query.set('skip', String(params.skip))
    if (params?.take) query.set('take', String(params.take))
    if (params?.sort) query.set('sort', params.sort)
    const qs = query.toString()
    return await useApiFetch<any>(`/api/v1/booking-requests${qs ? `?${qs}` : ''}`, {
      method: 'GET'
    })
  }

  const getOrderDetail = async (uuid: string) => {
    return await useApiFetch<any>(`/api/v1/booking-requests/${uuid}`, {
      method: 'GET'
    })
  }

  const cancelOrder = async (uuid: string, reason?: string) => {
    return await useApiFetch<any>(`/api/v1/booking-requests/${uuid}`, {
      method: 'DELETE',
      body: { reason: reason || 'لغو توسط کاربر' }
    })
  }

  /** Upsert a passenger (by nationalId) and return the passenger id. */
  const savePassenger = async (input: PassengerInput): Promise<number> => {
    const res = await useApiFetch<any>('/api/passengers', {
      method: 'POST',
      body: input
    }) as any
    const data = res?.data || res || {}
    const passenger = data.passenger || data
    const id = Number(passenger?.id)
    if (!id) throw new Error('پاسخ مسافر نامعتبر است')
    return id
  }

  /** Create a booking request. Returns the created request (uuid). */
  const createBookingRequest = async (input: BookingRequestInput) => {
    return await useApiFetch<any>('/api/v1/booking-requests', {
      method: 'POST',
      body: input
    })
  }

  return { getOrders, getOrderDetail, cancelOrder, savePassenger, createBookingRequest }
}
