<template>
  <div class="auth-page min-h-screen bg-gray-50 flex flex-col justify-start md:justify-center pt-16 md:pt-12 px-4 items-center">
    <div class="max-w-sm w-full">
      
      <!-- Logo -->
      <div class="text-center mb-6 md:mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
          <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 3v1H4a2 2 0 00-2 2v2a2 2 0 002 2h5v2H4a2 2 0 00-2 2v2a2 2 0 002 2h5v2a1 1 0 001 1h4a1 1 0 001-1v-2h5a2 2 0 002-2v-2a2 2 0 00-2-2h-5v-2h5a2 2 0 002-2V6a2 2 0 00-2-2h-5V3a1 1 0 00-1-1h-4a1 1 0 00-1 1z"/>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900">ورود به ریل‌نگار</h1>
        <p class="text-gray-500 text-sm mt-1.5">شماره موبایل خود را وارد کنید</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">شماره موبایل</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center px-2">
                <span class="text-gray-400 text-sm ml-2">۹۸+</span>
              </div>
              <input
                v-model="mobile"
                type="tel"
                placeholder="۹۱۲۳۴۵۶۷۸۹"
                maxlength="11"
                class="w-full pl-12 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                @input="handleMobileInput"
                required
                dir="ltr"
              >
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || mobile.length < 10"
            class="w-full py-3 rounded-xl font-medium text-sm transition"
            :class="loading || mobile.length < 10
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-teal-600 active:bg-teal-700'"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>در حال ارسال...</span>
            </span>
            <span v-else>ارسال کد تایید</span>
          </button>
        </form>
      </div>

      <!-- Register link -->
      <p class="text-center text-sm text-gray-500 mt-6">
        حساب کاربری ندارید؟
        <NuxtLink to="/auth/register" class="text-primary font-medium hover:text-teal-600">ثبت‌نام</NuxtLink>
      </p>
    </div>

    <Toast :show="toast.show" :type="toast.type" :message="toast.message" @hide="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/api/useAuth'
import { useToast } from '~/composables/useToast'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import Toast from '~/components/ui/Toast.vue'

const { login } = useAuth()
const { toast, showToast } = useToast()
const { toPersianDigits, toLatinDigits } = usePersianNumber()
const route = useRoute()

const mobile = ref('')
const loading = ref(false)

const handleMobileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  const pd: Record<string, string> = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' }
  let cv = ''
  for (let i = 0; i < value.length; i++) cv += pd[value[i]!] ?? value[i]!
  if (cv.length > 11) cv = cv.slice(0, 11)
  mobile.value = cv
  target.value = cv
}

const handleLogin = async () => {
  loading.value = true
  try {
    const latinMobile = toLatinDigits(mobile.value)
    await login(latinMobile)
    showToast('success', 'کد تایید ارسال شد')
    localStorage.setItem('rn-verify-mobile', latinMobile)
    // Pass redirect param to verify page
    const redirect = route.query.redirect || ''
    navigateTo(`/auth/verify${redirect ? `?redirect=${redirect}` : ''}`)
  } catch (error) {
    showToast('error', 'خطا در ارسال کد تایید')
  } finally {
    loading.value = false
  }
}
</script>
