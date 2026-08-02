<template>
  <div class="about-page min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
        درباره ریل‌نگار
      </h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 space-y-8">
        <section class="text-center">
          <h2 class="text-3xl font-bold mb-4 text-primary-600">ربات هوشمند رزرو بلیط قطار</h2>
          <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            ریل‌نگار با هدف تسهیل خرید بلیط قطار و حذف نگرانی از کمبود بلیط، راه‌حلی هوشمند و نوآورانه ارائه می‌دهد.
          </p>
        </section>
        
        <section>
          <h2 class="text-2xl font-bold mb-6 text-primary-600 text-center">ویژگی‌های ریل‌نگار</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
              <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">جستجوگر هوشمند</h3>
              <p class="text-gray-700 dark:text-gray-300">ریل‌نگار به‌طور لحظه‌ای سایت‌های فروش بلیط را بررسی می‌کند.</p>
            </div>
            
            <div class="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
              <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">رزرو خودکار</h3>
              <p class="text-gray-700 dark:text-gray-300">با خالی شدن اولین صندلی یا کوپه، ریل‌نگار بلیط شما را رزرو می‌کند.</p>
            </div>
            
            <div class="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-lg">
              <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">اطلاع‌رسانی سریع</h3>
              <p class="text-gray-700 dark:text-gray-300">پس از رزرو بلیط، از طریق پیامک یا تماس تلفنی به شما اطلاع داده می‌شود.</p>
            </div>
            
            <div class="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-lg">
              <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">ضمانت بازگشت وجه</h3>
              <p class="text-gray-700 dark:text-gray-300">در صورت نیافتن بلیط، مبلغ پرداختی عودت می‌شود.</p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 class="text-2xl font-bold mb-6 text-primary-600 text-center">چرا ریل‌نگار؟</h2>
          <div class="space-y-4">
            <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
               <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                 {{ toPersianDigits('1') }}
               </div>
              <div>
                <h3 class="font-bold mb-1 text-gray-800 dark:text-gray-100">صرفه‌جویی در زمان</h3>
                <p class="text-gray-700 dark:text-gray-300">دیگر نیازی به جستجوی مداوم در سایت‌های مختلف ندارید.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
               <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                 {{ toPersianDigits('2') }}
               </div>
              <div>
                <h3 class="font-bold mb-1 text-gray-800 dark:text-gray-100">دسترسی به تمام سایت‌ها</h3>
                <p class="text-gray-700 dark:text-gray-300">ریل‌نگار به صورت همزمان تمام سایت‌های معتبر فروش بلیط را بررسی می‌کند.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
               <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                 {{ toPersianDigits('3') }}
               </div>
              <div>
                <h3 class="font-bold mb-1 text-gray-800 dark:text-gray-100">سرعت و دقت بالا</h3>
                <p class="text-gray-700 dark:text-gray-300">ربات ما با سرعت بسیار بالا بلیط‌ها را جستجو و رزرو می‌کند.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
               <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                 {{ toPersianDigits('4') }}
               </div>
              <div>
                <h3 class="font-bold mb-1 text-gray-800 dark:text-gray-100">پشتیبانی ۲۴ ساعته</h3>
                <p class="text-gray-700 dark:text-gray-300">تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <h2 class="text-2xl font-bold mb-6 text-primary-600 text-center">ارتباط با ما</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg text-center">
              <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">تلفن پشتیبانی</h3>
               <p class="text-2xl font-bold text-primary-600">{{ toPersianDigits('021-28421206') }}</p>
               <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">ساعات پاسخگویی: {{ toPersianDigits('8') }} تا {{ toPersianDigits('22') }}</p>
            </div>
            
            <div class="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg text-center">
              <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">ایمیل</h3>
              <p class="text-2xl font-bold text-primary-600">support@railnegar.com</p>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">پاسخگویی در ۲۴ ساعت</p>
            </div>
          </div>
        </section>
        
        <section class="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-gray-700 dark:text-gray-300 text-lg">
            ما در ریل‌نگار متعهد به ارائه بهترین خدمات به شما هستیم.
          </p>
          <NuxtLink 
            to="/train" 
            class="inline-block mt-6 bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition"
          >
            شروع کنید
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePersianNumber } from '~/composables/utils/usePersianNumber'

const { toPersianDigits } = usePersianNumber()

useHead({
  title: 'درباره ما | ریل‌نگار'
})</script>
