<template>
  <div class="tickets-page min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        {{ $t('tickets') }}
      </h1>
      
      <div class="space-y-6">
         <div 
           v-for="ticket in tickets" 
           :key="ticket.id" 
           class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
         >
           <div class="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm opacity-80">شماره بلیط</div>
                <div class="text-xl font-bold">{{ ticket.ticket_number }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm opacity-80">قیمت کل</div>
                <div class="text-xl font-bold">{{ formatPrice(ticket.amount) }} تومان</div>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <div class="text-center flex-1">
                <div class="text-sm text-gray-800 mb-1">مبدا</div>
                <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {{ ticket.route.split(' به ')[0] }}
                </div>
              </div>
              
              <div class="flex-1 flex justify-center">
                <div class="flex flex-col items-center">
                  <div class="text-sm text-gray-800 mb-1">{{ ticket.departure_time }}</div>
                  <div class="w-20 h-1 bg-primary-600 relative">
                    <div class="absolute top-1/2 left-0 w-3 h-3 bg-primary-600 rounded-full transform -translate-y-1/2"></div>
                    <div class="absolute top-1/2 right-0 w-3 h-3 bg-primary-600 rounded-full transform -translate-y-1/2"></div>
                  </div>
                  <div class="text-sm text-gray-800 mt-1">{{ ticket.arrival_time }}</div>
                </div>
              </div>
              
              <div class="text-center flex-1">
                <div class="text-sm text-gray-800 mb-1">مقصد</div>
                <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {{ ticket.route.split(' به ')[1] }}
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div>
                <div class="text-sm text-gray-800">نام قطار</div>
                <div class="font-medium">{{ ticket.train_name }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-800">نوع</div>
                <div class="font-medium">{{ ticket.train_type }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-800">تاریخ</div>
                <div class="font-medium">{{ ticket.date }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-800">کوپه</div>
                <div class="font-medium">{{ toPersianDigits(ticket.coach) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-800">صندلی</div>
                <div class="font-medium">{{ toPersianDigits(ticket.seats.join('، ')) }}</div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div class="text-sm text-gray-800 mb-3">مسافران</div>
              <div class="space-y-2">
                <div 
                  v-for="(passenger, index) in ticket.passengers" 
                  :key="index"
                  class="flex justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <span class="font-medium">{{ passenger.name }}</span>
                  <span class="text-gray-800">{{ passenger.national_id }}</span>
                </div>
              </div>
            </div>
            
            <div class="mt-6 flex flex-wrap gap-4 justify-center">
              <img 
                :src="ticket.qr_code" 
                alt="QR Code" 
                class="w-32 h-32 rounded-lg border-2 border-gray-200 dark:border-gray-600"
              >
            </div>
            
            <div class="mt-4 text-center text-sm text-gray-800">
              پشتیبانی: {{ ticket.support_phone }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTickets } from '~/composables/api/useTickets'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'

interface Passenger {
  name: string
  national_id: string
}

interface Ticket {
  id: string
  order_id: string
  status: string
  ticket_number: string
  route: string
  date: string
  departure_time: string
  arrival_time: string
  train_name: string
  train_type: string
  coach: string
  seats: string[]
  passengers: Passenger[]
  amount: number
  qr_code: string
  support_phone: string
}

const { getTickets } = useTickets()
const { formatPrice, toPersianDigits } = usePersianNumber()

const tickets = ref<Ticket[]>([])
const loading = ref(false)

const fetchTickets = async () => {
  loading.value = true
  try {
    const result = await getTickets() as { data: Ticket[] }
    tickets.value = result.data
  } catch (error) {
    console.error('Error fetching tickets:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTickets()
})
</script>
