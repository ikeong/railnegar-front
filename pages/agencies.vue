<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4" dir="rtl">
    <div class="max-w-2xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">همکاری با ریل‌نگار</h1>
        <p class="text-gray-500 text-sm mt-1.5">فرم درخواست همکاری آژانس‌ها و شرکت‌ها</p>
      </div>

      <!-- Success Banner -->
      <Transition name="fade">
        <div v-if="showSuccessBanner" class="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm text-emerald-800">درخواست شما ثبت شد. همکاران ما به زودی با شما تماس می‌گیرند.</p>
          <button @click="showSuccessBanner = false" class="mr-auto text-emerald-400 hover:text-emerald-600">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>
      </Transition>

      <!-- Form -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <!-- Company -->
          <div class="space-y-4">
            <h3 class="font-bold text-gray-800 text-sm border-b border-gray-100 pb-2">اطلاعات شرکت</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">نام دفتر یا شرکت <span class="text-red-500">*</span></label>
                <input v-model="formData.officeName" type="text" placeholder="نام شرکت"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                  :class="errors.officeName && 'border-red-300 bg-red-50'"
                >
                <p v-if="errors.officeName" class="text-red-500 text-xs mt-1">{{ errors.officeName }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">نوع مجوز <span class="text-red-500">*</span></label>
                <select v-model="formData.licenseType"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm appearance-none"
                  :class="errors.licenseType && 'border-red-300 bg-red-50'"
                >
                  <option value="" disabled>انتخاب</option>
                  <option value="A">الف (A)</option>
                  <option value="B">ب (B)</option>
                  <option value="pilgrimage">زیارتی</option>
                </select>
                <p v-if="errors.licenseType" class="text-red-500 text-xs mt-1">{{ errors.licenseType }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">استان</label>
                <select v-model="formData.province" class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm appearance-none">
                  <option value="" disabled>انتخاب</option>
                  <option>تهران</option><option>خراسان رضوی</option><option>اصفهان</option>
                  <option>فارس</option><option>خوزستان</option><option>تبریز</option>
                  <option>گیلان</option><option>مازندران</option><option>کرمان</option>
                  <option>یزد</option><option>همدان</option><option>قم</option>
                </select>
              </div>
            </div>
          </div>

          <!-- CEO -->
          <div class="space-y-4">
            <h3 class="font-bold text-gray-800 text-sm border-b border-gray-100 pb-2">مدیرعامل</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">نام <span class="text-red-500">*</span></label>
                <input v-model="formData.ceoName" type="text" placeholder="نام و نام خانوادگی"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                  :class="errors.ceoName && 'border-red-300 bg-red-50'"
                >
                <p v-if="errors.ceoName" class="text-red-500 text-xs mt-1">{{ errors.ceoName }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">موبایل <span class="text-red-500">*</span></label>
                <input v-model="formData.ceoMobile" type="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" maxlength="11"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                  :class="errors.ceoMobile && 'border-red-300 bg-red-50'"
                  @input="handleMobileInput($event, 'ceoMobile')"
                >
                <p v-if="errors.ceoMobile" class="text-red-500 text-xs mt-1">{{ errors.ceoMobile }}</p>
              </div>
            </div>
          </div>

          <!-- Technical Manager -->
          <div class="space-y-4">
            <h3 class="font-bold text-gray-800 text-sm border-b border-gray-100 pb-2">مدیر فنی</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">نام <span class="text-red-500">*</span></label>
                <input v-model="formData.technicalManagerName" type="text" placeholder="نام و نام خانوادگی"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                  :class="errors.technicalManagerName && 'border-red-300 bg-red-50'"
                >
                <p v-if="errors.technicalManagerName" class="text-red-500 text-xs mt-1">{{ errors.technicalManagerName }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">موبایل <span class="text-red-500">*</span></label>
                <input v-model="formData.technicalManagerMobile" type="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" maxlength="11"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                  :class="errors.technicalManagerMobile && 'border-red-300 bg-red-50'"
                  @input="handleMobileInput($event, 'technicalManagerMobile')"
                >
                <p v-if="errors.technicalManagerMobile" class="text-red-500 text-xs mt-1">{{ errors.technicalManagerMobile }}</p>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="space-y-4">
            <h3 class="font-bold text-gray-800 text-sm border-b border-gray-100 pb-2">تماس</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">ایمیل <span class="text-red-500">*</span></label>
                <input v-model="formData.email" type="email" placeholder="info@company.com"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                  :class="errors.email && 'border-red-300 bg-red-50'"
                >
                <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">وب‌سایت</label>
                <input v-model="formData.website" type="url" placeholder="https://"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm">
              </div>
            </div>
          </div>

          <!-- Sales Counter -->
          <div class="space-y-4">
            <h3 class="font-bold text-gray-800 text-sm border-b border-gray-100 pb-2">کانتر فروش</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">نام <span class="text-red-500">*</span></label>
                <input v-model="formData.salesCounterName" type="text" placeholder="نام کانتر"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                  :class="errors.salesCounterName && 'border-red-300 bg-red-50'"
                >
                <p v-if="errors.salesCounterName" class="text-red-500 text-xs mt-1">{{ errors.salesCounterName }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">موبایل <span class="text-red-500">*</span></label>
                <input v-model="formData.salesCounterMobile" type="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" maxlength="11"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                  :class="errors.salesCounterMobile && 'border-red-300 bg-red-50'"
                  @input="handleMobileInput($event, 'salesCounterMobile')"
                >
                <p v-if="errors.salesCounterMobile" class="text-red-500 text-xs mt-1">{{ errors.salesCounterMobile }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">ایمیل <span class="text-red-500">*</span></label>
                <input v-model="formData.salesCounterEmail" type="email" placeholder="counter@company.com"
                  class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                  :class="errors.salesCounterEmail && 'border-red-300 bg-red-50'"
                >
                <p v-if="errors.salesCounterEmail" class="text-red-500 text-xs mt-1">{{ errors.salesCounterEmail }}</p>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" :disabled="loading"
            class="w-full py-3 rounded-xl font-medium text-sm transition"
            :class="loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-teal-600 active:bg-teal-700'"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>در حال ثبت...</span>
            </span>
            <span v-else>ثبت درخواست همکاری</span>
          </button>
        </form>
      </div>
    </div>

    <Toast :show="toast.show" :type="toast.type" :message="toast.message" @hide="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import { useApiFetch } from '~/composables/api/useApiFetch'

const { toast, showToast } = useToast()
const { toLatinDigits } = usePersianNumber()

const showSuccessBanner = ref(false)
const loading = ref(false)

const formData = ref({
  officeName: '', licenseType: '', province: '',
  ceoName: '', ceoMobile: '',
  technicalManagerName: '', technicalManagerMobile: '',
  email: '', website: '',
  salesCounterName: '', salesCounterMobile: '', salesCounterEmail: ''
})

const errors = ref<Record<string, string>>({})

const handleMobileInput = (event: Event, field: string) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  const pd: Record<string, string> = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' }
  let cv = ''
  for (let i = 0; i < value.length; i++) cv += pd[value[i]!] ?? value[i]!
  if (cv.length > 11) cv = cv.slice(0, 11)
  formData.value[field as keyof typeof formData.value] = cv
  target.value = cv
  if (errors.value[field]) delete errors.value[field]
}

const validateForm = (): boolean => {
  errors.value = {}
  if (!formData.value.officeName.trim()) errors.value.officeName = 'نام شرکت الزامی است'
  if (!formData.value.licenseType) errors.value.licenseType = 'نوع مجوز را انتخاب کنید'
  if (!formData.value.ceoName.trim()) errors.value.ceoName = 'نام مدیرعامل الزامی است'
  if (!/^09\d{9}$/.test(toLatinDigits(formData.value.ceoMobile))) errors.value.ceoMobile = 'شماره موبایل نامعتبر است'
  if (!formData.value.technicalManagerName.trim()) errors.value.technicalManagerName = 'نام مدیر فنی الزامی است'
  if (!/^09\d{9}$/.test(toLatinDigits(formData.value.technicalManagerMobile))) errors.value.technicalManagerMobile = 'شماره موبایل نامعتبر است'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) errors.value.email = 'ایمیل نامعتبر است'
  if (!formData.value.salesCounterName.trim()) errors.value.salesCounterName = 'نام کانتر الزامی است'
  if (!/^09\d{9}$/.test(toLatinDigits(formData.value.salesCounterMobile))) errors.value.salesCounterMobile = 'شماره موبایل نامعتبر است'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.salesCounterEmail)) errors.value.salesCounterEmail = 'ایمیل نامعتبر است'
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showToast('error', 'لطفاً خطاهای فرم را بررسی کنید')
    return
  }
  loading.value = true
  try {
    await useApiFetch('/api/v1/public/agency-requests', {
      method: 'POST',
      body: {
        agencyName: formData.value.officeName,
        licenseType: formData.value.licenseType || undefined,
        province: formData.value.province || undefined,
        ceoName: formData.value.ceoName,
        ceoPhone: toLatinDigits(formData.value.ceoMobile),
        techName: formData.value.technicalManagerName,
        techPhone: toLatinDigits(formData.value.technicalManagerMobile),
        companyEmail: formData.value.email,
        website: formData.value.website || undefined,
        counterName: formData.value.salesCounterName,
        counterPhone: toLatinDigits(formData.value.salesCounterMobile),
        counterEmail: formData.value.salesCounterEmail
      }
    })
    showSuccessBanner.value = true
    formData.value = { officeName: '', licenseType: '', province: '', ceoName: '', ceoMobile: '', technicalManagerName: '', technicalManagerMobile: '', email: '', website: '', salesCounterName: '', salesCounterMobile: '', salesCounterEmail: '' }
    setTimeout(() => { showSuccessBanner.value = false }, 6000)
    showToast('success', 'درخواست شما با موفقیت ثبت شد')
  } catch {
    showToast('error', 'خطا در ثبت درخواست')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
