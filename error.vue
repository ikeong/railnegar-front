<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
    <div class="max-w-md w-full text-center">
      <!-- Animated train illustration -->
      <div class="relative mx-auto w-48 h-32 mb-8">
        <div class="absolute inset-x-0 bottom-0 h-1 bg-gray-300 rounded-full"></div>
        <!-- Rails -->
        <div class="absolute inset-x-0 bottom-0.5 h-0.5 bg-gray-400"></div>
        <!-- Train body -->
        <div class="absolute bottom-3 right-0 left-0 flex items-end justify-center gap-1 animate-pulse">
          <div class="w-14 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-t-2xl rounded-b-md relative">
            <div class="absolute top-2 left-2 w-3 h-3 bg-white/80 rounded-full"></div>
            <div class="absolute top-2 right-2 w-3 h-3 bg-white/80 rounded-full"></div>
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/60 rounded-full"></div>
            <div class="absolute -bottom-2 right-2 w-3 h-2 bg-gray-800 rounded-sm"></div>
            <div class="absolute -bottom-2 left-2 w-3 h-2 bg-gray-800 rounded-sm"></div>
          </div>
          <div class="w-10 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-t-xl rounded-b-md relative">
            <div class="absolute top-2 left-1.5 w-2.5 h-2.5 bg-white/80 rounded-full"></div>
            <div class="absolute top-2 right-1.5 w-2.5 h-2.5 bg-white/80 rounded-full"></div>
            <div class="absolute -bottom-2 right-1.5 w-3 h-2 bg-gray-800 rounded-sm"></div>
            <div class="absolute -bottom-2 left-1.5 w-3 h-2 bg-gray-800 rounded-sm"></div>
          </div>
          <!-- Smoke -->
          <div class="absolute -top-3 right-3 flex gap-1">
            <span class="w-2 h-2 bg-gray-400/50 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2.5 h-2.5 bg-gray-400/40 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-3 h-3 bg-gray-400/30 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
        <!-- Question mark -->
        <div class="absolute -top-2 right-8 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-amber-500 font-black text-lg border-2 border-amber-200">؟</div>
      </div>

      <!-- Error code -->
      <h1 class="text-7xl font-black text-gray-900 leading-none mb-3" dir="ltr">404</h1>
      <div class="text-5xl font-black text-teal-500 mb-4 leading-none">قطار پیدا نشد! 🚂</div>

      <!-- Message -->
      <p class="text-gray-500 text-sm leading-relaxed mb-8">
        صفحه یا جلسه رزرو مورد نظر شما پیدا نشد یا منقضی شده است.<br>
        شاید قطار از ایستگاه رد شده باشه! برای شروع دوباره، به صفحه جستجو برگردید.
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink
          to="/train"
          class="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-teal-600 transition shadow-sm flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          جستجوی بلیط قطار
        </NuxtLink>
        <NuxtLink
          to="/"
          class="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          صفحه اصلی
        </NuxtLink>
      </div>

      <!-- Hint -->
      <div class="mt-8 text-[11px] text-gray-400">
        اگر به دنبال جلسه رزرو خود هستید، لطفاً جستجو را از ابتدا انجام دهید — جلسات رزرو ۱ ساعت اعتبار دارند.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: any }>()

useHead({
  title: '۴۰۴ | صفحه یافت نشد'
})
</script>
