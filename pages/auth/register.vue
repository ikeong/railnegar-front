<template>
  <div class="auth-page min-h-screen flex flex-col justify-start md:justify-center pt-16 md:pt-12 px-4 items-center">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div class="text-center mb-6 md:mb-8">
          <NuxtLink to="/" class="text-3xl font-bold text-primary-600">
            ریل‌نگار
          </NuxtLink>
          <h1 class="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100">
            {{ $t('register') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">
            حساب کاربری جدید بسازید
          </p>
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              نام و نام خانوادگی
            </label>
            <input 
              v-model="name" 
              type="text"
              placeholder="علی محمدی"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              شماره موبایل
            </label>
             <input
               v-model="mobile"
               type="tel"
               placeholder="۰۹۱۲۳۴۵۶۷۸۹"
               maxlength="11"
               class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
               @input="handleMobileInput"
               required
             >
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              ایمیل (اختیاری)
            </label>
            <input 
              v-model="email" 
              type="email"
              placeholder="example@mail.com"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
            >
          </div>
          
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {{ loading ? 'در حال ثبت...' : 'ثبت نام' }}
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-gray-600 dark:text-gray-300">
            قبلاً ثبت نام کرده‌اید؟
            <NuxtLink to="/auth/login" class="text-primary-600 font-medium hover:underline">
              {{ $t('login') }}
            </NuxtLink>
          </p>
        </div>
        
        <div class="mt-6 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
          <div class="text-sm text-primary-800 dark:text-primary-200">
            <p class="font-bold mb-2">راهنمای تست:</p>
            <p>شماره موبایل: هر شماره 11 رقمی</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Toast :show="toast.show" :type="toast.type" :message="toast.message" @hide="toast.show = false" />
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/api/useAuth'
import { useToast } from '~/composables/useToast'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import Toast from '~/components/ui/Toast.vue'

const { register } = useAuth()
const { toast, showToast } = useToast()
const { toPersianDigits } = usePersianNumber()

const name = ref('')
const mobile = ref('')
const email = ref('')
const loading = ref(false)

const handleMobileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  // Convert English digits to Persian digits
  const persianDigits: { [key: string]: string } = {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹'
  }

  let convertedValue = ''
  for (let i = 0; i < value.length; i++) {
    const char = value[i]!
    convertedValue += persianDigits[char] ?? char
  }

  // Limit to 11 characters
  if (convertedValue.length > 11) {
    convertedValue = convertedValue.slice(0, 11)
  }

  mobile.value = convertedValue
  target.value = convertedValue
}

const handleRegister = async () => {
  loading.value = true
  try {
    await register({
      name: name.value,
      mobile: mobile.value,
      email: email.value
    })
    showToast('success', 'ثبت نام با موفقیت انجام شد')
    navigateTo('/auth/verify')
  } catch (error) {
    console.error('Error registering:', error)
    showToast('error', 'خطا در ثبت نام')
  } finally {
    loading.value = false
  }
}
</script>
