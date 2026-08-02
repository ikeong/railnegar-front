<template>
  <div class="profile-page min-h-screen py-8 px-4 bg-gray-50" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">پروفایل کاربری</h1>
      </div>

      <!-- User Profile Card -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div class="flex items-center gap-5">
          <!-- Avatar -->
          <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold shrink-0">
            {{ getInitials(profile.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl font-bold text-gray-900 truncate">{{ profile.name || 'کاربر' }}</h2>
            <p class="text-sm text-gray-500 mt-0.5" v-if="profile.phone" dir="ltr">{{ toPersianDigits(profile.phone) }}</p>
            <span :class="['inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border', getTierColor(profile.tier)]">
              {{ getTierLabel(profile.tier) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <NuxtLink to="/profile/wallet" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition group">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <div>
              <div class="font-bold text-gray-900">کیف پول</div>
              <div class="text-xs text-gray-500">مدیریت موجودی و تراکنش‌ها</div>
            </div>
          </div>
          <div v-if="walletBalance !== null" class="text-sm">
            <span class="text-gray-500">موجودی: </span>
            <span class="font-bold text-emerald-600">{{ formatPrice(walletBalance) }} تومان</span>
          </div>
        </NuxtLink>

        <NuxtLink to="/profile/orders" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition group">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            </div>
            <div>
              <div class="font-bold text-gray-900">درخواست‌های من</div>
              <div class="text-xs text-gray-500">مشاهده و پیگیری درخواست‌ها</div>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/profile/orders?status=COMPLETED" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition group">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
            </div>
            <div>
              <div class="font-bold text-gray-900">بلیط‌های من</div>
              <div class="text-xs text-gray-500">بلیط‌های خریداری شده</div>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/profile/support" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition group">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <div>
              <div class="font-bold text-gray-900">پشتیبانی</div>
              <div class="text-xs text-gray-500">تیکت‌ها و پیگیری مشکلات</div>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/profile/passengers" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition group">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM6 5h4M8 3v4"/></svg>
            </div>
            <div>
              <div class="font-bold text-gray-900">مسافران من</div>
              <div class="text-xs text-gray-500">مدیریت مسافران و اطلاعات</div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <h3 class="font-bold text-gray-900 mb-4">خلاصه حساب</h3>
        <div v-if="loading" class="text-center py-8 text-gray-400 text-sm">در حال بارگذاری...</div>
        <div v-else-if="error" class="text-center py-8 text-red-400 text-sm">{{ error }}</div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-emerald-50 rounded-xl">
            <div class="text-2xl font-bold text-emerald-600">{{ formatPrice(stats.available) }}</div>
            <div class="text-xs text-gray-500 mt-1">موجودی قابل استفاده</div>
          </div>
          <div class="text-center p-4 bg-amber-50 rounded-xl">
            <div class="text-2xl font-bold text-amber-600">{{ formatPrice(stats.locked) }}</div>
            <div class="text-xs text-gray-500 mt-1">مسدود شده</div>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-xl">
            <div class="text-2xl font-bold text-blue-600">{{ formatPrice(stats.spent) }}</div>
            <div class="text-xs text-gray-500 mt-1">مجموع هزینه</div>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-xl">
            <div class="text-2xl font-bold text-purple-600">{{ formatPrice(stats.topup) }}</div>
            <div class="text-xs text-gray-500 mt-1">مجموع شارژ</div>
          </div>
        </div>
      </div>

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="w-full py-3 rounded-xl border border-red-200 text-red-500 font-medium text-sm hover:bg-red-50 transition"
      >
        خروج از حساب کاربری
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import { useWallet } from '~/composables/api/useWallet'
import { useProfile } from '~/composables/api/useProfile'

const { formatPrice, toPersianDigits } = usePersianNumber()
const { getBalance } = useWallet()
const { getProfile, getTierLabel, getTierColor } = useProfile()

const profile = ref({ name: 'کاربر', tier: 'REGULAR', phone: '' })
const walletBalance = ref<number | null>(null)
const loading = ref(true)
const error = ref('')
const stats = reactive({ available: 0, locked: 0, spent: 0, topup: 0 })

const getInitials = (name: string) => {
  if (!name || name === 'کاربر') return '👤'
  return name.slice(0, 1)
}

const handleLogout = () => {
  localStorage.removeItem('rn-api-key')
  localStorage.removeItem('rn-logged-in')
  localStorage.removeItem('rn-profile')
  window.location.href = '/'
}

onMounted(async () => {
  // Load profile
  const saved = getProfile()
  if (saved) {
    profile.value = { ...profile.value, ...saved }
  }

  // Load wallet balance
  try {
    const res = await getBalance() as any
    const data = res?.data || res || {}
    stats.available = Number(data.availableRial || 0) / 10
    stats.locked = Number(data.lockedRial || 0) / 10
    stats.spent = Number(data.totalSpentRial || 0) / 10
    stats.topup = Number(data.totalRial || 0) / 10
    walletBalance.value = stats.available
    // Also try to get phone from verify-mobile key
    const savedPhone = localStorage.getItem('rn-verify-mobile')
    if (savedPhone && !profile.value.phone) {
      profile.value.phone = savedPhone
    }
  } catch (e: any) {
    error.value = 'خطا در دریافت اطلاعات حساب'
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
