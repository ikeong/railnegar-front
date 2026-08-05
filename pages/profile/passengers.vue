<template>
  <div class="passengers-page min-h-screen py-8 px-4 bg-gray-50" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">مسافران من</h1>
        <button
          @click="openEdit(null)"
          class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-teal-600 transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          مسافر جدید
        </button>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
        <div class="relative">
          <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو با نام، نام خانوادگی یا کد ملی..."
            class="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            @keyup.enter="fetchPassengers()"
          >
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-600">در حال دریافت مسافران...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 mb-3">{{ error }}</p>
        <button @click="fetchPassengers" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">
          تلاش مجدد
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="passengers.length === 0" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
        <div class="text-4xl mb-3">👤</div>
        <p class="text-gray-500 mb-4">مسافری ثبت نکرده‌اید</p>
        <button @click="openEdit(null)" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-teal-600 transition">
          افزودن اولین مسافر
        </button>
      </div>

      <!-- Passenger List -->
      <div v-else class="space-y-3">
        <div
          v-for="p in passengers"
          :key="p.id"
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                {{ (p.firstName || '؟')[0] }}
              </div>
              <div class="min-w-0">
                <div class="font-bold text-gray-900 flex items-center gap-2">
                  <span>{{ p.firstName }} {{ p.lastName }}</span>
                  <span
                    v-if="getAgeCategory(p.birthDate, p.isForeign)"
                    :class="[
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                      getAgeCategory(p.birthDate, p.isForeign)?.label === 'کودک'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    ]"
                  >
                    {{ getAgeCategory(p.birthDate, p.isForeign)?.label }}
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span v-if="p.nationalId" :class="p.isForeign ? 'font-mono font-bold' : 'font-sans font-bold'" :dir="p.isForeign ? 'ltr' : 'rtl'">{{ p.isForeign ? p.nationalId : toPersianDigits(p.nationalId) }}</span>
                  <span v-if="p.isForeign" class="bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5">اتباع</span>
                  <span class="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{{ p.gender === 'MALE' ? 'مرد' : 'زن' }}</span>
                  <span v-if="p.birthDate" class="text-gray-400">{{ p.isForeign ? p.birthDate.slice(0, 10) : formatShamsiDate(p.birthDate) }}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button
                @click="openEdit(p)"
                class="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-teal-50 transition"
                title="ویرایش"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button
                @click="handleDelete(p)"
                class="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                title="حذف"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Add / Edit Modal ===== -->
      <div v-if="editOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" @click.self="editOpen = false">
        <div class="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-gray-900 text-lg">{{ editMode === 'create' ? 'افزودن مسافر' : 'ویرایش مسافر' }}</h3>
            <button @click="editOpen = false" class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <form @submit.prevent="submitEdit" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-600 mb-1.5">نام *</label>
                <input v-model="editForm.firstName" type="text" required placeholder="نام"
                  class="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary">
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1.5">نام خانوادگی *</label>
                <input v-model="editForm.lastName" type="text" required placeholder="نام خانوادگی"
                  class="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-600 mb-1.5">{{ editForm.isForeign ? 'Passport Number *' : 'کد ملی *' }}</label>
                <input
                  v-model="editForm.nationalId"
                  type="text"
                  required
                  :placeholder="editForm.isForeign ? 'Passport No. (e.g. A1234567)' : '۱۰ رقم'"
                  dir="ltr"
                  :class="editForm.isForeign ? 'font-mono font-bold placeholder:font-mono' : 'font-sans font-bold'"
                  class="w-full p-3 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1.5">رده سنی مسافر</label>
                <div class="flex bg-gray-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    @click="editForm.isChild = false; editForm.birthDate = defaultAdultBirthDateISO()"
                    :class="['flex-1 py-2 text-xs font-bold rounded-lg transition', !editForm.isChild ? 'bg-white text-primary shadow-xs' : 'text-gray-600']"
                  >
                    بزرگسال
                  </button>
                  <button
                    type="button"
                    @click="editForm.isChild = true"
                    :class="['flex-1 py-2 text-xs font-bold rounded-lg transition', editForm.isChild ? 'bg-primary text-white shadow-xs' : 'text-gray-600']"
                  >
                    کودک (زیر ۱۲ سال)
                  </button>
                </div>
              </div>
            </div>

            <!-- Child Birth Date Dropdowns (ONLY shown if isChild is true) -->
            <div v-if="editForm.isChild" class="bg-teal-50/60 border border-teal-200 rounded-xl p-3.5 space-y-2">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-teal-900">
                  🎂 تاریخ تولد کودک *
                </label>
                <span class="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-300">
                  کودک (زیر ۱۲ سال)
                </span>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[10px] text-gray-500 mb-1">روز</label>
                  <select
                    v-model="editForm.birthDay"
                    @change="updateModalChildBirthDate"
                    class="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-primary/20"
                  >
                    <option :value="undefined" disabled>روز...</option>
                    <option v-for="d in 31" :key="d" :value="d">{{ toPersianDigits(d) }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] text-gray-500 mb-1">ماه</label>
                  <select
                    v-model="editForm.birthMonth"
                    @change="updateModalChildBirthDate"
                    class="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-primary/20"
                  >
                    <option :value="undefined" disabled>ماه...</option>
                    <option v-for="m in (editForm.isForeign ? miladiMonthsModal : shamsiMonthsModal)" :key="m.value" :value="m.value">
                      {{ m.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] text-gray-500 mb-1">سال</label>
                  <select
                    v-model="editForm.birthYear"
                    @change="updateModalChildBirthDate"
                    class="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-primary/20"
                  >
                    <option :value="undefined" disabled>سال...</option>
                    <option v-for="y in getModalChildYears(editForm.isForeign)" :key="y" :value="y">
                      {{ editForm.isForeign ? y : toPersianDigits(y) }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-600 mb-1.5">جنسیت</label>
                <select v-model="editForm.gender"
                  class="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="MALE">مرد</option>
                  <option value="FEMALE">زن</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1.5">تلفن (اختیاری)</label>
                <input v-model="editForm.phone" type="text" placeholder="۰۹۱۲..." dir="ltr"
                  class="w-full p-3 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-primary/20 focus:border-primary">
              </div>
            </div>

            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input v-model="editForm.isForeign" type="checkbox" class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/20">
              <span class="text-sm text-gray-700">اتباع خارجی (شماره پاسپورت)</span>
            </label>

            <div class="flex gap-3 pt-2">
              <button type="button" @click="editOpen = false" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                انصراف
              </button>
              <button type="submit" :disabled="saving" class="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-teal-600 transition disabled:opacity-50">
                <span v-if="saving">در حال ذخیره...</span>
                <span v-else>ذخیره</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toast :show="toast.show" :type="toast.type" :message="toast.message" @hide="toast.show = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePassengers } from '~/composables/api/usePassengers'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import {
  getPassengerAgeCategory,
  maskShamsiDate,
  maskMiladiDate,
  shamsiToGregorian,
  gregorianToShamsi
} from '~/composables/utils/usePassengerAge'
import { useToast } from '~/composables/useToast'
import Toast from '~/components/ui/Toast.vue'

const { formatPrice, toPersianDigits, toLatinDigits } = usePersianNumber()
const { listPassengers, savePassenger, updatePassenger, deletePassenger } = usePassengers()
const { toast: toastState, showToast } = useToast()

const shamsiMonthsModal = [
  { value: 1, label: 'فروردین' },
  { value: 2, label: 'اردیبهشت' },
  { value: 3, label: 'خرداد' },
  { value: 4, label: 'تیر' },
  { value: 5, label: 'مرداد' },
  { value: 6, label: 'شهریور' },
  { value: 7, label: 'مهر' },
  { value: 8, label: 'آبان' },
  { value: 9, label: 'آذر' },
  { value: 10, label: 'دی' },
  { value: 11, label: 'بهمن' },
  { value: 12, label: 'اسفند' }
]

const miladiMonthsModal = [
  { value: 1, label: 'Jan - ژانویه' },
  { value: 2, label: 'Feb - فوریه' },
  { value: 3, label: 'Mar - مارس' },
  { value: 4, label: 'Apr - آوریل' },
  { value: 5, label: 'May - مه' },
  { value: 6, label: 'Jun - ژوئن' },
  { value: 7, label: 'Jul - ژوئیه' },
  { value: 8, label: 'Aug - اوت' },
  { value: 9, label: 'Sep - سپتامبر' },
  { value: 10, label: 'Oct - اکتبر' },
  { value: 11, label: 'Nov - نوامبر' },
  { value: 12, label: 'Dec - دسامبر' }
]

const getModalChildYears = (isForeign: boolean) => {
  if (isForeign) {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let y = currentYear - 12; y <= currentYear; y++) years.push(y)
    return years.reverse()
  } else {
    const currentShamsi = 1405
    const years = []
    for (let y = currentShamsi - 12; y <= currentShamsi; y++) years.push(y)
    return years.reverse()
  }
}

const updateModalChildBirthDate = () => {
  if (editForm.birthDay && editForm.birthMonth && editForm.birthYear) {
    const dStr = String(editForm.birthDay).padStart(2, '0')
    const mStr = String(editForm.birthMonth).padStart(2, '0')
    const yStr = String(editForm.birthYear)
    editForm.birthDate = `${yStr}/${mStr}/${dStr}`
  }
}

const defaultAdultBirthDateISO = (): string => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 30)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d)
}

const getAgeCategory = (birthDateStr: string, isForeign = false) => {
  return getPassengerAgeCategory(birthDateStr, isForeign)
}

const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
  message: ''
})

watch(toastState, (v) => {
  toast.show = v.show
  toast.type = v.type
  toast.message = v.message
}, { deep: true })

const passengers = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')

const editOpen = ref(false)
const editMode = ref<'create' | 'edit'>('create')
const editingId = ref<number | null>(null)
const saving = ref(false)
const editForm = reactive({
  firstName: '',
  lastName: '',
  nationalId: '',
  birthDate: '',
  gender: 'MALE' as 'MALE' | 'FEMALE',
  phone: '',
  isForeign: false,
  isChild: false,
  birthDay: undefined as number | undefined,
  birthMonth: undefined as number | undefined,
  birthYear: undefined as number | undefined
})

const formatShamsiDate = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(d)
  } catch {
    return dateStr
  }
}

const fetchPassengers = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await listPassengers({ take: 50, search: searchQuery.value || undefined }) as any
    const data = res?.data || res || {}
    passengers.value = data.rows || data.items || data.data || []
  } catch (e: any) {
    error.value = e?.data?.message || 'خطا در دریافت مسافران'
  } finally {
    loading.value = false
  }
}

const openEdit = (p: any | null) => {
  if (p) {
    editMode.value = 'edit'
    editingId.value = p.id
    editForm.firstName = p.firstName || ''
    editForm.lastName = p.lastName || ''
    editForm.nationalId = p.nationalId || ''
    editForm.isForeign = !!p.isForeign
    editForm.gender = p.gender === 'FEMALE' ? 'FEMALE' : 'MALE'
    editForm.phone = p.phone || ''

    const ageCat = getPassengerAgeCategory(p.birthDate, p.isForeign)
    editForm.isChild = ageCat?.label === 'کودک'

    if (editForm.isChild && p.birthDate) {
      let bStr = p.birthDate
      if (!p.isForeign && bStr.includes('-')) {
        bStr = gregorianToShamsi(bStr)
      } else if (p.isForeign && bStr.includes('-')) {
        bStr = bStr.slice(0, 10).replace(/-/g, '/')
      }
      const digits = toLatinDigits(bStr).replace(/[^\d]/g, '')
      if (digits.length >= 8) {
        editForm.birthYear = parseInt(digits.slice(0, 4), 10)
        editForm.birthMonth = parseInt(digits.slice(4, 6), 10)
        editForm.birthDay = parseInt(digits.slice(6, 8), 10)
        updateModalChildBirthDate()
      }
    } else {
      editForm.birthDate = defaultAdultBirthDateISO()
    }
  } else {
    editMode.value = 'create'
    editingId.value = null
    editForm.firstName = ''
    editForm.lastName = ''
    editForm.nationalId = ''
    editForm.gender = 'MALE'
    editForm.phone = ''
    editForm.isForeign = false
    editForm.isChild = false
    editForm.birthDay = undefined
    editForm.birthMonth = undefined
    editForm.birthYear = undefined
    editForm.birthDate = defaultAdultBirthDateISO()
  }
  editOpen.value = true
}

const submitEdit = async () => {
  if (!editForm.firstName || !editForm.lastName || !editForm.nationalId) return
  saving.value = true
  try {
    let finalBirthDate: string
    if (editForm.isChild) {
      updateModalChildBirthDate()
      if (editForm.birthDate) {
        finalBirthDate = editForm.isForeign ? editForm.birthDate.replace(/\//g, '-') : shamsiToGregorian(editForm.birthDate)
      } else {
        const defShamsi = '1400/01/01'
        finalBirthDate = editForm.isForeign ? '2021-01-01' : shamsiToGregorian(defShamsi)
      }
    } else {
      finalBirthDate = defaultAdultBirthDateISO()
    }

    const payload = {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      nationalId: editForm.nationalId,
      gender: editForm.gender,
      birthDate: finalBirthDate,
      phone: editForm.phone || undefined,
      isForeign: editForm.isForeign,
      resolution: 'replace' as const
    }
    if (editMode.value === 'create') {
      await savePassenger(payload)
      showToast('success', 'مسافر با موفقیت افزوده شد')
    } else if (editingId.value) {
      await updatePassenger(editingId.value, payload)
      showToast('success', 'مسافر با موفقیت ویرایش شد')
    }
    editOpen.value = false
    await fetchPassengers()
  } catch (e: any) {
    showToast('error', e?.data?.message || 'خطا در ذخیره مسافر')
  } finally {
    saving.value = false
  }
}

const handleDelete = async (p: any) => {
  if (!confirm(`آیا از حذف «${p.firstName} ${p.lastName}» مطمئن هستید؟`)) return
  try {
    await deletePassenger(p.id)
    showToast('success', 'مسافر حذف شد')
    await fetchPassengers()
  } catch (e: any) {
    showToast('error', e?.data?.message || 'خطا در حذف مسافر')
  }
}

onMounted(() => {
  fetchPassengers()
})
</script>
