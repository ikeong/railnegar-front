<template>
  <Transition name="modal-slide">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      dir="rtl"
      @click.self="close"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="close"></div>

      <!-- Modal Card / Mobile Bottom Sheet -->
      <div
        class="bg-white dark:bg-gray-800 w-full md:max-w-xl rounded-t-3xl md:rounded-2xl h-[85vh] md:h-[80vh] flex flex-col z-10 shadow-2xl relative overflow-hidden transition-all transform"
      >
        <!-- Mobile Handle Bar -->
        <div class="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-2.5 mb-1 md:hidden shrink-0"></div>

        <!-- Modal Header -->
        <div class="px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM15 7a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
                انتخاب مسافر سابق
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                جایگذاری مسافر {{ toPersianDigits(targetIndex + 1) }} از لیست مسافران شما
              </p>
            </div>
          </div>
          <button
            @click="close"
            class="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
            aria-label="بستن"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Search Bar & Filters -->
        <div class="p-3.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/50 space-y-2.5 shrink-0">
          <div class="relative">
            <svg class="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref="searchInputRef"
              v-model="searchTerm"
              type="text"
              placeholder="جستجوی نام، نام خانوادگی، کد ملی یا شماره پاسپورت..."
              class="w-full pr-10 pl-9 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-gray-100 transition shadow-sm"
              @input="onSearchInput"
            >
            <button
              v-if="searchTerm"
              @click="searchTerm = ''; filterPassengers()"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Quick Category Filters -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              type="button"
              v-for="filter in genderFilters"
              :key="filter.id"
              @click="activeFilter = filter.id; filterPassengers()"
              :class="[
                'px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap border shrink-0',
                activeFilter === filter.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- Passengers Fulltext List -->
        <div class="overflow-y-auto flex-1 p-3 bg-white dark:bg-gray-800 space-y-2">
          <!-- Loading State -->
          <div v-if="loading" class="py-12 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
            <p class="text-xs text-gray-500">در حال دریافت مسافران سابق...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredList.length === 0" class="py-12 text-center text-gray-500">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <p class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">مسافری یافت نشد</p>
            <p class="text-xs text-gray-400">نتیجهای با مشخصات وارد شده پیدا نشد.</p>
          </div>

          <!-- Passenger Cards -->
          <div
            v-for="p in filteredList"
            :key="p.id || p.nationalId"
            @click="selectPassenger(p)"
            class="p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group relative"
            :class="[
              isAlreadySelected(p.nationalId)
                ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800'
                : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-teal-50/50 dark:hover:bg-teal-900/20 shadow-sm'
            ]"
          >
            <!-- Left Info -->
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs"
                :class="p.gender === 'FEMALE' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ (p.firstName || '؟')[0] }}
              </div>
              <div class="min-w-0">
                <div class="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors flex items-center gap-2 flex-wrap">
                  <span>{{ p.firstName }} {{ p.lastName }}</span>
                  <span
                    v-if="getPassengerAgeCategory(p.birthDate, p.isForeign)"
                    :class="[
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                      getPassengerAgeCategory(p.birthDate, p.isForeign)?.label === 'کودک'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    ]"
                  >
                    {{ getPassengerAgeCategory(p.birthDate, p.isForeign)?.label }}
                  </span>
                  <span v-if="isAlreadySelected(p.nationalId)" class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    انتخاب شده
                  </span>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 flex-wrap">
                  <!-- National ID: Iranian = Persian digits, Foreign passport = English digits -->
                  <span v-if="p.nationalId" class="font-mono font-bold" dir="ltr">
                    {{ p.isForeign ? p.nationalId : toPersianDigits(p.nationalId) }}
                  </span>
                  <span v-if="p.isForeign" class="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-full px-2 py-0.2">
                    اتباع
                  </span>
                  <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] rounded-full px-2 py-0.2">
                    {{ p.gender === 'FEMALE' ? 'زن' : 'مرد' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div class="shrink-0">
              <button
                type="button"
                class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                :class="[
                  isAlreadySelected(p.nationalId)
                    ? 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                    : 'bg-primary text-white hover:bg-teal-600 shadow-sm'
                ]"
              >
                <span>انتخاب</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span>مجموع مسافران ثبت شده: {{ toPersianDigits(allPassengers.length) }}</span>
          <button @click="close" class="px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-300">
            بستن
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { usePassengers } from '~/composables/api/usePassengers'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import { getPassengerAgeCategory } from '~/composables/utils/usePassengerAge'

const props = defineProps<{
  isOpen: boolean
  targetIndex: number
  alreadySelectedNationalIds?: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', passenger: any): void
}>()

const { listPassengers, searchPassengers } = usePassengers()
const { toPersianDigits, toLatinDigits } = usePersianNumber()

const searchInputRef = ref<HTMLInputElement | null>(null)
const searchTerm = ref('')
const loading = ref(false)
const activeFilter = ref<'all' | 'MALE' | 'FEMALE' | 'FOREIGN'>('all')

const allPassengers = ref<any[]>([])
const filteredList = ref<any[]>([])

const genderFilters = [
  { id: 'all', label: 'همه' },
  { id: 'MALE', label: 'مردان' },
  { id: 'FEMALE', label: 'زنان' },
  { id: 'FOREIGN', label: 'اتباع خارجی' }
]

const close = () => {
  emit('close')
}

const isAlreadySelected = (natId: string): boolean => {
  if (!natId || !props.alreadySelectedNationalIds) return false
  return props.alreadySelectedNationalIds.includes(natId)
}

const fetchAll = async () => {
  loading.value = true
  try {
    const res = await listPassengers({ take: 100 }) as any
    const data = res?.data || res || {}
    allPassengers.value = data.rows || data.items || data.data || []
    filterPassengers()
  } catch (err) {
    console.error('Failed to load passengers for modal:', err)
  } finally {
    loading.value = false
  }
}

let debounceTimer: any = null
const onSearchInput = () => {
  filterPassengers()
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (searchTerm.value.trim().length >= 2) {
      try {
        const res = await searchPassengers(searchTerm.value.trim(), 50) as any
        const data = res?.data || res || []
        const list = Array.isArray(data) ? data : (data.items || data.rows || [])
        // Merge with existing allPassengers
        const map = new Map(allPassengers.value.map(p => [p.nationalId || p.id, p]))
        list.forEach((item: any) => map.set(item.nationalId || item.id, item))
        allPassengers.value = Array.from(map.values())
        filterPassengers()
      } catch (err) {
        console.error('Search passengers API failed:', err)
      }
    }
  }, 300)
}

const filterPassengers = () => {
  let list = [...allPassengers.value]

  // Filter by category tab
  if (activeFilter.value === 'MALE') {
    list = list.filter(p => p.gender === 'MALE' && !p.isForeign)
  } else if (activeFilter.value === 'FEMALE') {
    list = list.filter(p => p.gender === 'FEMALE' && !p.isForeign)
  } else if (activeFilter.value === 'FOREIGN') {
    list = list.filter(p => p.isForeign)
  }

  // Filter by search query (fulltext across name, nationalId in both Persian & Latin digits)
  const q = searchTerm.value.trim().toLowerCase()
  if (q) {
    const qLatin = toLatinDigits(q)
    list = list.filter(p => {
      const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase()
      const natId = String(p.nationalId || '').toLowerCase()
      const phone = String(p.phone || '')

      return fullName.includes(q) ||
             natId.includes(q) ||
             natId.includes(qLatin) ||
             phone.includes(q)
    })
  }

  filteredList.value = list
}

const selectPassenger = (p: any) => {
  emit('select', p)
  close()
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    searchTerm.value = ''
    activeFilter.value = 'all'
    fetchAll()
    nextTick(() => {
      if (searchInputRef.value) {
        searchInputRef.value.focus()
      }
    })
  }
})
</script>

<style scoped>
/* Modal animations */
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.25s ease-out;
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Hide scrollbar for category tabs */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
