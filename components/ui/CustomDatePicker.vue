<template>
  <div class="custom-date-picker">
    <!-- Header -->
    <div class="bg-primary text-white rounded-xl p-1 mb-2 shadow-sm">
      <div class="px-3 py-2">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <CalendarIcon class="w-5 h-5" />
            <span class="hidden sm:inline font-bold">{{ mode === 'presale' ? 'تاریخهای پیشفروش را انتخاب کنید' : 'تاریخ را انتخاب کنید' }}</span>
            <span class="sm:hidden font-bold">تاریخ</span>
          </div>
          <span v-if="selectedDates && selectedDates.length > 0" class="text-sm font-bold opacity-90">
            {{ toPersianDigits(selectedDates.length.toString()) }} تاریخ انتخاب شده
          </span>
          <span v-else class="text-sm opacity-75">
            تاریخ انتخاب نشده
          </span>
        </div>
        <div class="text-right text-sm font-bold opacity-90">
          امروز : {{ todayDayOfWeek }} {{ todayPersianDate }}
        </div>
      </div>
    </div>

    <!-- Content Card -->
    <div class="bg-white border-2 border-gray-200 rounded-xl p-2 sm:p-4 mb-4">
      <!-- Week Toggle Tabs (Only for Normal Mode) -->
      <div v-if="mode !== 'presale'" class="hidden sm:flex gap-2 sm:gap-3 mb-3 sm:mb-4">
        <button
          type="button"
          @click="showWeek1"
          :class="[
            'flex-1 py-2 sm:p-3 rounded-xl transition font-semibold text-xs sm:text-sm',
            currentWeek === 1
              ? 'bg-primary text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
          ]"
        >
          یک هفته بعد
        </button>
        <button
          type="button"
          @click="showWeek2"
          :class="[
            'flex-1 py-2 sm:p-3 rounded-xl transition font-semibold text-xs sm:text-sm',
            currentWeek === 2
              ? 'bg-primary text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
          ]"
        >
          دو هفته بعد
        </button>
      </div>

      <!-- Presale Mode: 5-Column Grid ("در ردیف ۵ تایی") for all dates -->
      <div v-if="mode === 'presale'" class="grid grid-cols-5 gap-1.5 sm:gap-2">
        <template v-for="date in allAvailableDates" :key="'presale-'+date.fullDate">
          <div class="min-h-[55px] sm:min-h-[65px] relative">
            <label :class="getDateClass(date)">
              <input
                type="checkbox"
                :name="datePickerName"
                :value="date.fullDate"
                v-model="selectedDates"
                :disabled="date.isPast"
                class="hidden"
                @change="handleDateChange"
              >
              <div v-if="selectedDates && selectedDates.includes(date.fullDate)" class="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 z-10">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="text-center">
                <div class="font-bold leading-tight text-[11px] sm:text-sm" :class="[date.isPast ? 'text-gray-400' : 'text-gray-800']">
                  {{ toPersianDigits(date.persianDayNumber.toString()) }} {{ persianMonths[date.persianMonth] }}
                </div>
                <div class="text-[9px] sm:text-xs leading-tight mt-0.5" :class="date.isPast ? 'text-gray-400' : 'text-gray-600'">
                  {{ date.dayOfWeekShort || date.dayOfWeek }}
                </div>
              </div>
            </label>
          </div>
        </template>
      </div>

      <!-- Normal Mode: Desktop View (7 columns, active week) -->
      <div v-else class="hidden sm:grid grid-cols-7 gap-1 sm:gap-2">
        <template v-for="week in currentWeekDates">
          <template v-for="date in week.days">
            <div v-if="date" class="min-h-[60px] sm:min-h-20 relative" :key="'desktop-'+date.fullDate">
              <label :class="getDateClass(date)">
                <input
                  type="checkbox"
                  :name="datePickerName"
                  :value="date.fullDate"
                  v-model="selectedDates"
                  :disabled="date.isPast"
                  class="hidden"
                  @change="handleDateChange"
                >
                <div v-if="selectedDates && selectedDates.includes(date.fullDate)" class="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 z-10">
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="text-center">
                  <div class="sm:text-lg font-bold leading-tight" :class="[date.isPast ? 'text-gray-400' : 'text-gray-800', 'text-xs sm:text-base']">
                    {{ toPersianDigits(date.persianDayNumber.toString()) }}
                    <span class="hidden sm:inline">{{ persianMonths[date.persianMonth] }}</span>
                  </div>
                  <div class="text-[10px] sm:text-sm leading-tight mt-0.5" :class="date.isPast ? 'text-gray-400' : 'text-gray-600'">
                    {{ date.dayOfWeekShort || date.dayOfWeek }}
                  </div>
                </div>
              </label>
            </div>
            <div v-else class="min-h-[60px] sm:min-h-20"></div>
          </template>
        </template>
      </div>

      <!-- Normal Mode: Mobile View (3 columns, 15 days) -->
      <div v-if="mode !== 'presale'" class="grid sm:hidden grid-cols-3 gap-1">
        <template v-for="date in mobile15Dates" :key="'mobile-'+date.fullDate">
          <div class="min-h-[60px] relative">
            <label :class="getDateClass(date)">
              <input
                type="checkbox"
                :name="datePickerName"
                :value="date.fullDate"
                v-model="selectedDates"
                :disabled="date.isPast"
                class="hidden"
                @change="handleDateChange"
              >
              <div v-if="selectedDates && selectedDates.includes(date.fullDate)" class="absolute top-0.5 right-0.5 z-10">
                <svg class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="text-center">
                <div class="font-bold leading-tight text-xs" :class="[date.isPast ? 'text-gray-400' : 'text-gray-800']">
                  {{ toPersianDigits(date.persianDayNumber.toString()) }} {{ persianMonths[date.persianMonth] }}
                </div>
                <div class="text-[10px] leading-tight mt-0.5" :class="date.isPast ? 'text-gray-400' : 'text-gray-600'">
                  {{ date.dayOfWeekShort || date.dayOfWeek }}
                </div>
              </div>
            </label>
          </div>
        </template>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        @click="clearSelection"
        class="flex-1 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition font-semibold text-sm shadow-sm"
      >
        <div class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <span>پاک کردن</span>
        </div>
      </button>
      <button
        type="button"
        @click="selectAllVisibleDates"
        class="flex-1 p-3 rounded-xl bg-primary text-white hover:bg-teal-600 transition font-semibold text-sm shadow-md"
      >
        انتخاب همه
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon } from '@heroicons/vue/24/solid'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'

const { toPersianDigits } = usePersianNumber()

const props = defineProps<{
  modelValue: string
  datePickerName?: string
  mode?: 'normal' | 'presale'
  activePresale?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedDates = ref<string[]>(props.modelValue ? props.modelValue.split(',') : [])
const currentWeek = ref(1)

const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
]

const persianDays = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه'
]

const gregorianToPersian = (date: Date) => {
  const persianDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(date)

  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const toLatinDigits = (str: string) => {
    return str.replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d).toString())
  }

  const parts = persianDate.split('/')
  return {
    year: parseInt(toLatinDigits(parts[0] || '')),
    month: parseInt(toLatinDigits(parts[1] || '')),
    day: parseInt(toLatinDigits(parts[2] || ''))
  }
}

const today = new Date()

const todayDayOfWeek = computed(() => {
  const gregorianDay = today.getDay()
  const dayIndex = (gregorianDay + 1) % 7
  return persianDays[dayIndex]
})

const todayPersianDate = computed(() => {
  const persian = gregorianToPersian(today)
  return `${toPersianDigits(persian.day.toString())} ${persianMonths[persian.month - 1]}`
})

const allAvailableDates = computed(() => {
  const result = []
  let startDate = new Date(today)
  let endDate = new Date(today)

  if (props.mode === 'presale') {
    if (props.activePresale && props.activePresale.isActive && props.activePresale.targetStartDate && props.activePresale.targetEndDate) {
      startDate = new Date(props.activePresale.targetStartDate)
      endDate = new Date(props.activePresale.targetEndDate)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
    } else {
      // 30 days into the future if no active presale
      endDate.setDate(today.getDate() + 29)
    }
  } else {
    // Normal mode: today + 13 days (14 days total)
    endDate.setDate(today.getDate() + 13)
  }

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const persianDayIndex = (date.getDay() + 1) % 7
    const persianDay = persianDays[persianDayIndex]
    const dayOffset = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const persianDate = gregorianToPersian(date)

    result.push({
      fullDate: date.toISOString().split('T')[0],
      day: date.getDate(),
      dayOfWeek: persianDay,
      dayOfWeekShort: persianDay,
      persianMonth: persianDate.month - 1,
      persianDay: persianDay,
      persianDate: `${persianMonths[persianDate.month - 1]} / ${toPersianDigits(persianDate.day.toString())}`,
      isToday: dayOffset === 0,
      isPast: dayOffset < 0,
      daysFromNow: dayOffset,
      persianDayNumber: persianDate.day
    })
  }
  return result
})

const week1Dates = computed(() => {
  return allAvailableDates.value.filter(d => d.daysFromNow >= 0 && d.daysFromNow < 7)
})

const week2Dates = computed(() => {
  return allAvailableDates.value.filter(d => d.daysFromNow >= 7 && d.daysFromNow < 14)
})

const mobile15Dates = computed(() => {
  return allAvailableDates.value.slice(0, 15)
})

const currentWeekDates = computed(() => {
  const dates = currentWeek.value === 1 ? week1Dates.value : week2Dates.value
  const weeks: { weekNumber: number; days: any[] }[] = []
  let currentWeekDays: any[] = []
  let weekNumber = 0

  dates.forEach((date, index) => {
    currentWeekDays.push(date)

    if (currentWeekDays.length === 7) {
      weekNumber++
      weeks.push({ weekNumber, days: currentWeekDays })
      currentWeekDays = []
    }
  })

  if (currentWeekDays.length > 0) {
    weeks.push({ weekNumber: weeks.length + 1, days: currentWeekDays })
  }

  return weeks
})

const showWeek1 = () => {
  currentWeek.value = 1
}

const showWeek2 = () => {
  currentWeek.value = 2
}

const getDateClass = (date: any) => {
  const baseClass = 'cursor-pointer p-1.5 sm:p-2.5 rounded-xl border-2 transition-all flex flex-col items-center justify-center relative'

  if (selectedDates.value && selectedDates.value.includes(date.fullDate)) {
    return `${baseClass} border-primary bg-teal-50 shadow-md`
  } else if (date.isPast) {
    return `${baseClass} border-gray-200 bg-gray-100 opacity-50 hover:opacity-75`
  } else {
    return `${baseClass} border-gray-200 hover:border-primary hover:bg-gray-50 hover:shadow-sm transition-shadow`
  }
}

const handleDateChange = () => {
  emit('update:modelValue', selectedDates.value.join(','))
}

const clearSelection = () => {
  selectedDates.value = []
  emit('update:modelValue', '')
}

const selectAllVisibleDates = () => {
  const visibleDates = props.mode === 'presale' ? allAvailableDates.value : (currentWeek.value === 1 ? week1Dates.value : week2Dates.value)
  selectedDates.value = visibleDates.map(d => d.fullDate).filter((date): date is string => date !== undefined)
  emit('update:modelValue', selectedDates.value.join(','))
}

watch(() => props.modelValue, (newValue) => {
  selectedDates.value = newValue ? newValue.split(',') : []
})
</script>
EOF