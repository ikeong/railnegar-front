<template>
  <div class="auth-page min-h-screen bg-gray-50 flex flex-col justify-start md:justify-center pt-16 md:pt-12 px-4 items-center">
    <div class="max-w-sm w-full">
      
      <!-- Header -->
      <div class="text-center mb-6 md:mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900">تایید شماره موبایل</h1>
        <p class="text-gray-500 text-sm mt-1.5">
          کد ۵ رقمی ارسال شد به
          <span class="font-medium text-gray-700" dir="ltr">{{ toPersianDigits(mobile.replace(/^(\d{4})(\d{3})(\d{4})/, '$1***$3')) }}</span>
        </p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <form @submit.prevent="handleVerify" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3 text-center">کد تایید</label>
            <div class="flex justify-center gap-2" dir="ltr">
              <input
                v-for="i in 5" :key="i"
                :ref="el => { if (el) otpInputs[i-1] = el as HTMLInputElement }"
                :value="otpArray[i-1] || ''"
                type="text"
                maxlength="1"
                class="w-11 h-12 text-center text-lg font-bold border rounded-xl transition"
                :class="otpArray[i-1] ? 'border-primary bg-teal-50' : 'border-gray-200 bg-gray-50'"
                @input="handleOtpDigit(i-1, $event)"
                @keydown="handleOtpKeydown(i-1, $event)"
                autocomplete="one-time-code"
                inputmode="numeric"
              >
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || otp.length < 5"
            class="w-full py-3 rounded-xl font-medium text-sm transition"
            :class="loading || otp.length < 5
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-teal-600 active:bg-teal-700'"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>در حال تایید...</span>
            </span>
            <span v-else>تایید و ورود</span>
          </button>
        </form>
      </div>

      <!-- Resend + Back -->
      <div class="text-center mt-6 space-y-3">
        <button
          @click="resendOTP"
          :disabled="resendDisabled"
          class="text-sm text-primary font-medium hover:text-teal-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          {{ resendDisabled ? `${resendCountdown} ثانیه` : 'ارسال مجدد کد' }}
        </button>
        <div>
          <NuxtLink to="/auth/login" class="text-sm text-gray-400 hover:text-gray-600">تغییر شماره موبایل</NuxtLink>
        </div>
      </div>
    </div>

    <Toast :show="toast.show" :type="toast.type" :message="toast.message" @hide="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/api/useAuth'
import { useToast } from '~/composables/useToast'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import Toast from '~/components/ui/Toast.vue'

const { verifyOTP } = useAuth()
const { toast, showToast } = useToast()
const { toPersianDigits, toLatinDigits } = usePersianNumber()
const route = useRoute()

const mobile = ref('')
const otp = ref('')
const otpArray = ref<string[]>(['', '', '', '', ''])
const otpInputs = ref<HTMLInputElement[]>([])
const loading = ref(false)
const resendDisabled = ref(false)
const resendCountdown = ref(60)

onMounted(() => {
  const saved = localStorage.getItem('rn-verify-mobile')
  if (saved) {
    mobile.value = saved
    setTimeout(() => otpInputs.value?.[0]?.focus(), 200)
  } else {
    navigateTo('/auth/login')
  }
})

const handleOtpDigit = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  let v = input.value.slice(-1)
  const m: Record<string, string> = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' }
  const d = m[v] || v
  if (d.length === 1 && '۰۱۲۳۴۵۶۷۸۹'.includes(d)) {
    otpArray.value[index] = d
    otp.value = toLatinDigits(otpArray.value.join(''))
    if (index < 4) setTimeout(() => otpInputs.value[index + 1]?.focus(), 50)
  } else {
    input.value = ''
  }
}

const handleOtpKeydown = (index: number, ev: KeyboardEvent) => {
  if (ev.key === 'Backspace' && !otpArray.value[index] && index > 0) {
    otpArray.value[index - 1] = ''
    otp.value = toLatinDigits(otpArray.value.join(''))
    setTimeout(() => otpInputs.value[index - 1]?.focus(), 50)
  }
}

const handleVerify = async () => {
  loading.value = true
  try {
    const res = await verifyOTP(mobile.value, otp.value)
    // Try common API response formats for the token
    const apiKey = res?.data?.tokens?.accessToken || res?.apiKey || res?.api_key || res?.token || res?.data?.apiKey || res?.data?.api_key || res?.data?.token || ''
    if (apiKey) {
      localStorage.setItem('rn-api-key', apiKey)
      localStorage.removeItem('rn-verify-mobile')
      localStorage.setItem('rn-logged-in', 'true')
      // Save profile info (name, tier, id)
      if (res?.client) {
        localStorage.setItem('rn-profile', JSON.stringify(res.client))
      } else if (res?.data?.client) {
        localStorage.setItem('rn-profile', JSON.stringify(res.data.client))
      }
    }
    showToast('success', 'با موفقیت وارد شدید')
    // Navigate to redirect target or default
    const redirect = route.query.redirect as string || ''
    navigateTo(redirect || '/profile/orders')
  } catch (err: any) {
    showToast('error', err?.data?.message || 'کد نامعتبر است')
    otpArray.value = ['', '', '', '', '']
    otp.value = ''
    setTimeout(() => otpInputs.value?.[0]?.focus(), 100)
  } finally {
    loading.value = false
  }
}

const resendOTP = async () => {
  try {
    const { login } = useAuth()
    await login(mobile.value)
    showToast('info', 'کد جدید ارسال شد')
    resendDisabled.value = true
    resendCountdown.value = 60
    const t = setInterval(() => {
      resendCountdown.value--
      if (resendCountdown.value <= 0) { clearInterval(t); resendDisabled.value = false }
    }, 1000)
  } catch {
    showToast('error', 'خطا در ارسال مجدد')
  }
}
</script>
