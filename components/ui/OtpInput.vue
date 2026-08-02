<template>
  <div class="otp-input">
    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      کد تایید
    </label>
    <div class="relative">
      <input 
        v-model="otp"
        type="text"
        :maxlength="6"
        placeholder="کد تایید را وارد کنید"
        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 text-center text-2xl tracking-widest"
        required
      >
      <div v-if="countdown > 0 && countdown < 60" class="absolute left-1/2 top-1/2 text-sm text-gray-800">
        {{ toPersianDigits(String(countdown)) }}
      </div>
    </div>
    
    <button 
      v-if="!canResend"
      disabled
      class="w-full mt-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
    >
      ارسال مجدد
      ({{ toPersianDigits('60') }} ثانیه)
    </button>
    
    <button 
      v-else
      @click="handleResend"
      class="w-full mt-3 p-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 disabled:disabled:cursor-not-allowed"
    >
      ارسال مجدد
    </button>
  </div>
</template>

<script setup lang="ts">
import { useOTP } from '~/composables/useOTP'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'

const props = defineProps<{
  mobile: string
}>()

const { countdown, canResend, sendOTP } = useOTP()
const { toPersianDigits } = usePersianNumber()

const otp = ref('')

const handleResend = async () => {
  await sendOTP(props.mobile)
}
</script>
