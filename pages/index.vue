<template>
  <div class="home-page" dir="rtl">
    <!-- Hero Section -->
    <section class="relative bg-white pt-8 pb-12 md:py-20 px-4 sm:px-6 border-b border-gray-100">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-6 md:mb-10">
          <!-- Main Heading -->
          <h1 class="font-heading text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4 leading-snug">
            خرید بلیط قطار رو به <span class="text-primary">ریل‌نگار</span> بسپار!
          </h1>

          <!-- Subtitle -->
          <p class="text-sm sm:text-lg text-gray-600 mb-6 md:mb-8 max-w-xl mx-auto leading-relaxed">
            به کارهای مهمتر برسید؛ رزرو خودکار بلیط قطار به محض باز شدن ظرفیت با ریل‌نگار.
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm sm:max-w-none mx-auto">
            <NuxtLink
              to="/train"
              class="bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-base hover:bg-teal-600 transition flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <TicketIcon class="w-5 h-5" />
              <span>درخواست بلیط قطار</span>
            </NuxtLink>

            <NuxtLink
              to="/terms"
              class="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-gray-200 transition flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <DocumentTextIcon class="w-5 h-5" />
              <span>راهنما و قوانین</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Quick Route Bar (Mobile & Desktop UX booster) -->
        <div class="bg-gray-50 border border-gray-200 rounded-2xl p-3 sm:p-4 mt-6 max-w-2xl mx-auto shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs sm:text-sm font-bold text-gray-700">جستجوی سریع مسیرهای پرتردد:</span>
            <NuxtLink to="/train" class="text-xs font-bold text-primary hover:underline">مشاهده همه ←</NuxtLink>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <NuxtLink
              v-for="route in quickRoutes"
              :key="route.slug"
              :to="`/train?from=${route.from}&to=${route.to}`"
              class="bg-white border border-gray-200 hover:border-primary rounded-xl py-2 px-3 text-center text-xs sm:text-sm font-bold text-gray-800 hover:text-primary hover:bg-teal-50/50 transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{{ route.from }}</span>
              <span class="text-primary text-xs">←</span>
              <span>{{ route.to }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section (2x2 Compact Grid on Mobile) -->
    <section class="py-10 md:py-16 px-4 sm:px-6 bg-gray-50">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="font-heading text-xl sm:text-3xl font-black text-gray-900 mb-2">
            چرا <span class="text-primary">ریل‌نگار</span>؟
          </h2>
          <p class="text-gray-600 text-xs sm:text-base">
            جستجوگر و رزروکننده خودکار بلیط قطار با بالاترین شانس موفقیت
          </p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div class="bg-white rounded-2xl p-4 sm:p-6 text-center shadow-sm border border-gray-200/80 hover:border-primary/40 transition">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MagnifyingGlassIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 class="font-bold text-sm sm:text-lg mb-1 sm:mb-2 text-gray-900">جستجوی هوشمند</h3>
            <p class="text-gray-600 text-xs sm:text-sm leading-relaxed">
              بررسی لحظهای تمام ظرفیتها و قطارها
            </p>
          </div>

          <div class="bg-white rounded-2xl p-4 sm:p-6 text-center shadow-sm border border-gray-200/80 hover:border-primary/40 transition">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <SparklesIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 class="font-bold text-sm sm:text-lg mb-1 sm:mb-2 text-gray-900">رزرو خودکار</h3>
            <p class="text-gray-600 text-xs sm:text-sm leading-relaxed">
              خرید فوری در اولین ثانیه باز شدن ظرفیت
            </p>
          </div>

          <div class="bg-white rounded-2xl p-4 sm:p-6 text-center shadow-sm border border-gray-200/80 hover:border-primary/40 transition">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <DevicePhoneMobileIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 class="font-bold text-sm sm:text-lg mb-1 sm:mb-2 text-gray-900">اطلاعرسانی سریع</h3>
            <p class="text-gray-600 text-xs sm:text-sm leading-relaxed">
              ارسال پیامک فوری بلافاصله پس از صدور بلیط
            </p>
          </div>

          <div class="bg-white rounded-2xl p-4 sm:p-6 text-center shadow-sm border border-gray-200/80 hover:border-primary/40 transition">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CurrencyDollarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 class="font-bold text-sm sm:text-lg mb-1 sm:mb-2 text-gray-900">ضمانت بازگشت</h3>
            <p class="text-gray-600 text-xs sm:text-sm leading-relaxed">
              عودت کامل وجه در صورت عدم یافتن بلیط
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-10 md:py-16 px-4 sm:px-6 bg-gray-50 border-t border-gray-100">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-6 sm:mb-8">
          <h2 class="font-heading text-xl sm:text-3xl font-black text-gray-900 mb-1 sm:mb-2">
            سوالات <span class="text-primary">متداول</span>
          </h2>
          <p class="text-gray-600 text-xs sm:text-sm">
            پاسخ به سوالات رایج شما درباره خدمات ریل‌نگار
          </p>
        </div>

        <div class="space-y-2 sm:space-y-3">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-primary/40 transition shadow-sm"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full p-3.5 sm:p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors text-right"
            >
              <h3 class="font-bold text-gray-800 text-xs sm:text-sm leading-snug">{{ faq.question }}</h3>
              <ChevronDownIcon
                class="w-4 h-4 text-primary flex-shrink-0 transition-transform duration-200 mr-2"
                :class="expandedFaq === index ? 'rotate-180' : ''"
              />
            </button>
            <div
              v-show="expandedFaq === index"
              class="px-3.5 sm:px-4 pb-3.5 sm:pb-4 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 pt-2.5 sm:pt-3"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-10 md:py-16 px-4 sm:px-6 bg-primary text-white text-center">
      <div class="max-w-3xl mx-auto">
        <h2 class="font-heading text-xl sm:text-3xl font-black mb-2">
          آماده رزرو بلیط هستید؟
        </h2>
        <p class="text-xs sm:text-base mb-6 text-white/90">
          همین حالا درخواست خود را ثبت کنید و خرید بلیط را به ربات ریل‌نگار بسپارید!
        </p>
        <NuxtLink
          to="/train"
          class="inline-block bg-white text-primary px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-gray-50 transition shadow-lg hover:shadow-xl"
        >
          ثبت درخواست بلیط قطار
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  TicketIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/solid'

const quickRoutes = ref([
  { from: 'مشهد', to: 'تهران', slug: 'mashhad-tehran' },
  { from: 'تهران', to: 'مشهد', slug: 'tehran-mashhad' },
  { from: 'تهران', to: 'اهواز', slug: 'tehran-ahvaz' },
  { from: 'تهران', to: 'تبریز', slug: 'tehran-tabriz' }
])

const popularRoutes = ref([
  { from: 'مشهد', to: 'تهران', slug: 'mashhad-tehran' },
  { from: 'تهران', to: 'مشهد', slug: 'tehran-mashhad' },
  { from: 'مشهد', to: 'اهواز', slug: 'mashhad-ahvaz' },
  { from: 'اهواز', to: 'مشهد', slug: 'ahvaz-mashhad' },
  { from: 'مشهد', to: 'اصفهان', slug: 'mashhad-isfahan' },
  { from: 'اصفهان', to: 'مشهد', slug: 'isfahan-mashhad' },
  { from: 'تهران', to: 'اهواز', slug: 'tehran-ahvaz' },
  { from: 'اهواز', to: 'تهران', slug: 'ahvaz-tehran' },
  { from: 'تهران', to: 'تبریز', slug: 'tehran-tabriz' },
  { from: 'تبریز', to: 'تهران', slug: 'tabriz-tehran' }
])

const faqs = ref([
  {
    question: 'چرا از ریل‌نگار استفاده کنیم؟',
    answer: 'با توجه به تقاضای بالای بلیط قطار، پیدا کردن بلیط مناسب میتواند چالشبرانگیز باشد. ریل‌نگار این مشکل را با جستجوی مداوم و رزرو خودکار در اولین ثانیه باز شدن ظرفیت حل میکند.'
  },
  {
    question: 'ریل‌نگار چگونه کار میکند؟',
    answer: 'ریل‌نگار بهطور مداوم سایتهای فروش بلیط قطار را بررسی کرده و به محض خالی شدن اولین صندلی یا کوپه، آن را برای شما رزرو کرده و از طریق پیامک به شما اطلاع میدهد.'
  },
  {
    question: 'چگونه درخواست بلیط خود را ثبت کنیم؟',
    answer: 'کافیست مبدا، مقصد و تاریخ سفر خود را انتخاب کرده و درخواست خرید خودکار را ثبت کنید. ربات بقیه مراحل را بهطور خودکار انجام میدهد.'
  },
  {
    question: 'چه زمانی باید مبلغ بلیط را پرداخت کنم؟',
    answer: 'بعد از پذیرش درخواست توسط سایت، مبلغ بلیط به همراه کارمزد را پرداخت میکنید و این مبلغ به اعتبار کیف پول شما برای خرید خودکار اضافه میشود.'
  },
  {
    question: 'آیا در صورت پیدا نشدن بلیط مبلغ بازگردانده میشود؟',
    answer: 'بله، در صورتی که تا زمان حرکت قطار بلیطی یافت نشد، تمام مبلغ پرداختی شما قابل برداشت و عودت خواهد بود.'
  }
])

const expandedFaq = ref<number | null>(0)

const toggleFaq = (index: number) => {
  expandedFaq.value = expandedFaq.value === index ? null : index
}

useHead({
  title: 'ریل‌نگار | ربات هوشمند رزرو خودکار بلیط قطار'
})
</script>