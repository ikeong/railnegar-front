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
                <div class="font-bold text-gray-900">{{ p.firstName }} {{ p.lastName }}</div>
                <div class="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span v-if="p.nationalId" class="font-mono" dir="ltr">{{ toPersianDigits(p.nationalId) }}</span>
                  <span v-if="p.isForeign" class="bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5">اتباع</span>
                  <span class="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{{ p.gender === 'MALE' ? 'مرد' : 'زن' }}</span>
                  <span v-if="p.birthDate" class="text-gray-400">{{ formatShamsiDate(p.birthDate) }}</span>
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
                <label class="block text-xs text-gray-600 mb-1.5">کد ملی / پاسپورت *</label>
                <input v-model="editForm.nationalId" type="text" required placeholder="۱۰ رقم" dir="ltr"
                  class="w-full p-3 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-primary/20 focus:border-primary">
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1.5">تاریخ تولد</label>
                <input v-model="editForm.birthDate" type="text" placeholder="۱۳۷۲/۰۶/۱۵" dir="ltr"
                  class="w-full p-3 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-primary/20 focus:border-primary">
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
import { useToast } from '~/composables/useToast'
import Toast from '~/components/ui/Toast.vue'

const { formatPrice, toPersianDigits } = usePersianNumber()
const { listPassengers, savePassenger, updatePassenger, deletePassenger } = usePassengers()
const { toast: toastState, showToast } = useToast()

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
  isForeign: false
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
    editForm.birthDate = p.birthDate ? p.birthDate.slice(0, 10) : ''
    editForm.gender = p.gender === 'FEMALE' ? 'FEMALE' : 'MALE'
    editForm.phone = p.phone || ''
    editForm.isForeign = !!p.isForeign
  } else {
    editMode.value = 'create'
    editingId.value = null
    editForm.firstName = ''
    editForm.lastName = ''
    editForm.nationalId = ''
    editForm.birthDate = ''
    editForm.gender = 'MALE'
    editForm.phone = ''
    editForm.isForeign = false
  }
  editOpen.value = true
}

const submitEdit = async () => {
  if (!editForm.firstName || !editForm.lastName || !editForm.nationalId) return
  saving.value = true
  try {
    const payload = {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      nationalId: editForm.nationalId,
      gender: editForm.gender,
      birthDate: editForm.birthDate || undefined,
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
