<template>
  <div class="passengers-page min-h-screen py-8 px-4 pb-32">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
          اطلاعات مسافران
        </h1>
        <NuxtLink 
          to="/train-results" 
          class="flex items-center gap-2 text-primary hover:text-teal-600 transition"
        >
          <ArrowRightIcon class="w-5 h-5" />
          بازگشت
        </NuxtLink>
      </div>

      <!-- Selected Trains Summary -->
      <div v-if="selectedTrains.length > 0" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 mb-6 overflow-hidden">
        <div class="p-4 md:p-6">
          <div class="flex items-center justify-between cursor-pointer select-none" @click="showAllTrains = !showAllTrains">
            <h2 class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
              </svg>
              قطارهای انتخاب شده
              <span class="text-sm font-normal text-gray-400">({{ toPersianDigits(String(selectedTrains.length)) }})</span>
            </h2>
            <button class="text-xs text-primary font-bold md:hidden">
              {{ showAllTrains ? 'بستن ▲' : 'نمایش ▼' }}
            </button>
          </div>
          <div :class="showAllTrains ? 'block' : 'hidden md:block'">
            <div class="divide-y divide-gray-100 dark:divide-gray-700 mt-3">
              <div 
                v-for="(train, idx) in selectedTrains" 
                :key="train.id"
                class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span class="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0">{{ toPersianDigits(String(idx + 1)) }}</span>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="font-bold text-sm text-gray-800 dark:text-gray-100 truncate">
                      {{ train.name }}
                    </h3>
                    <span class="text-xs text-gray-400 whitespace-nowrap">{{ train.type || '' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <span>{{ toPersianDigits(train.departureTime || '--:--') }}</span>
                    <span class="text-gray-300">→</span>
                    <span>{{ toPersianDigits(train.arrivalTime || '--:--') }}</span>
                    <span v-if="train.duration" class="text-gray-400">({{ toPersianDigits(train.duration) }})</span>
                  </div>
                </div>
                <div class="text-left shrink-0">
                  <div class="text-sm font-bold text-primary">
                    {{ formatPrice(train.cost || train.price || 0) }}
                  </div>
                  <div class="text-[10px] text-gray-400">تومان</div>
                </div>
              </div>
            </div>
            <div v-if="showAllTrains && selectedTrains.length > 3" class="text-center pt-2">
              <button @click="showAllTrains = false" class="text-xs text-primary font-bold">بستن ▲</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-5 mb-6 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
            ⚡
          </div>
          <div>
            <h3 class="font-bold text-amber-900 dark:text-amber-200 text-sm sm:text-base mb-1">
              ثبت درخواست خرید خودکار در پسزمینه (زمان بکآپ یا عدم وجود قطار لحظهای)
            </h3>
            <p class="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              قطار مشخصی انتخاب نشده است. پس از تکمیل اطلاعات مسافران و ثبت درخواست، ربات ریلنگار در پسزمینه به صورت ۲۴ ساعته ظرفیت قطارهای این مسیر را پایش کرده و به محض باز شدن صندلی، رزرو را برای شما انجام میدهد.
            </p>
          </div>
        </div>
      </div>

      <!-- Service Charges -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          هزینه خدمات
        </h3>
        
        <!-- Loading state -->
        <div v-if="pricingLoading" class="text-center py-4 text-gray-500">
          در حال محاسبه هزینه...
        </div>
        
        <!-- Error state -->
        <div v-else-if="pricingError" class="text-center py-4 text-red-500">
          {{ pricingError }}
        </div>
        
        <!-- Pricing items from API -->
        <div v-else-if="pricingResult" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-300">تعداد مسافران:</span>
            <span class="text-gray-800 dark:text-gray-100 font-medium">{{ toPersianDigits(totalPassengers.toString()) }} نفر</span>
          </div>

          <!-- v2.5.0: split ticket vs service totals -->
          <div v-if="pricingResult.ticketTotal" class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-300">قیمت بلیط قطار:</span>
            <span class="text-gray-800 dark:text-gray-100 font-medium">{{ formatPrice(pricingResult.ticketTotal) }} تومان</span>
          </div>
          <div v-if="pricingResult.serviceTotal !== undefined" class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-300">هزینه خدمات ریل‌نگار:</span>
            <span class="text-gray-800 dark:text-gray-100 font-medium">{{ formatPrice(pricingResult.serviceTotal) }} تومان</span>
          </div>

          <div 
            v-for="(item, idx) in pricingResult.items" 
            :key="idx"
            class="flex justify-between text-sm"
          >
            <span class="text-gray-600 dark:text-gray-300">{{ toPersianDigits(item.label) }}</span>
            <span class="text-gray-800 dark:text-gray-100 font-medium ltr text-left">{{ formatPrice(item.amount) }}</span>
          </div>
          <div class="text-xs text-gray-400 text-left">(تومان)</div>
          <div class="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
            <div class="flex justify-between">
              <span class="text-lg font-bold text-gray-800 dark:text-gray-100">
                مجموع:
              </span>
              <span class="text-lg font-bold text-primary">
                {{ formatPrice(pricingResult.total) }} تومان
              </span>
            </div>
          </div>
        </div>
        
        <!-- Fallback if no pricing data -->
        <div v-else class="text-center py-4 text-gray-400">
          اطلاعات هزینه خدمات در دسترس نیست
        </div>
      </div>

      <!-- Passenger Information Forms -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
            اطلاعات مسافران
          </h3>
          <button
            type="button"
            @click="openSelectModal(0)"
            class="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-primary border border-teal-200 dark:border-teal-700 hover:bg-teal-100 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM15 7a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span>انتخاب سریع از مسافران سابق</span>
          </button>
        </div>
        <div v-if="totalPassengers === 0" class="text-center py-8 text-gray-500">
          لطفاً تعداد مسافران را مشخص کنید
        </div>

        <div v-else class="space-y-6">
          <div 
            v-for="(passenger, pIndex) in passengerForms" 
            :key="pIndex"
            class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">{{ toPersianDigits(String(pIndex + 1)) }}</span>
                <h5 class="text-sm font-bold text-gray-700 dark:text-gray-300">
                  مسافر {{ toPersianDigits(String(pIndex + 1)) }}
                  <span class="text-xs text-gray-400 font-normal">({{ getPassengerLabel(passenger.gender) }})</span>
                </h5>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="openSelectModal(pIndex)"
                  class="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/40 text-primary border border-teal-200 dark:border-teal-700 hover:bg-teal-100 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM15 7a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <span class="hidden sm:inline">انتخاب از مسافران سابق</span>
                  <span class="inline sm:hidden">مسافران سابق</span>
                </button>
                <label class="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    v-model="passenger.isForeign"
                    class="w-3.5 h-3.5 text-primary rounded border-gray-300 focus:ring-primary"
                  >
                  <span :class="passenger.isForeign ? 'text-amber-600 font-bold' : 'text-gray-400'">اتباع</span>
                </label>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  نام
                </label>
                <input 
                  v-model="passenger.firstName"
                  type="text"
                  required
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="نام"
                >
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  نام خانوادگی
                </label>
                <input 
                  v-model="passenger.lastName"
                  type="text"
                  required
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="نام خانوادگی"
                >
              </div>
              <!-- Iranian: national code -->
              <div v-if="!passenger.isForeign">
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  کد ملی
                </label>
                <input 
                  v-model="passenger.nationalCode"
                  type="text"
                  required
                  maxlength="10"
                  class="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right font-sans font-bold"
                  :class="passenger.nationalCode && !isValidNationalCode(passenger.nationalCode) ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'"
                  placeholder="۱۰ رقم"
                  dir="rtl"
                >
                <p v-if="passenger.nationalCode && !isValidNationalCode(passenger.nationalCode)" class="text-xs text-red-500 mt-1">
                  کد ملی نامعتبر
                </p>
              </div>
              <!-- Foreign: passport number -->
              <div v-else>
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  شماره پاسپورت
                </label>
                <input 
                  v-model="passenger.passportNumber"
                  type="text"
                  required
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono font-bold text-left placeholder:font-mono"
                  placeholder="Passport No. (e.g. A1234567)"
                  dir="ltr"
                >
              </div>
              <!-- Birth Date Input (Child / Infant ONLY — 3 Select Boxes) -->
              <div v-if="isChildGender(passenger.gender)" class="md:col-span-2 bg-teal-50/60 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-3.5 mt-1">
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-xs sm:text-sm font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                    <span>🎂 تاریخ تولد {{ getPassengerLabel(passenger.gender) }} *</span>
                  </label>
                  <span
                    v-if="getFormAgeCategory(passenger.birthDate, passenger.isForeign)"
                    :class="[
                      'text-xs font-bold px-2.5 py-0.5 rounded-full border',
                      getFormAgeCategory(passenger.birthDate, passenger.isForeign)?.label === 'کودک'
                        ? 'bg-sky-100 text-sky-800 border-sky-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    ]"
                  >
                    {{ getFormAgeCategory(passenger.birthDate, passenger.isForeign)?.label }}
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-2">
                  <!-- Day -->
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">روز</label>
                    <select
                      v-model="passenger.birthDay"
                      @change="updateChildBirthDate(passenger)"
                      class="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                    >
                      <option :value="undefined" disabled>روز...</option>
                      <option v-for="d in 31" :key="d" :value="d">
                        {{ toPersianDigits(d) }}
                      </option>
                    </select>
                  </div>

                  <!-- Month -->
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">ماه</label>
                    <select
                      v-model="passenger.birthMonth"
                      @change="updateChildBirthDate(passenger)"
                      class="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                    >
                      <option :value="undefined" disabled>ماه...</option>
                      <option v-for="m in (passenger.isForeign ? miladiMonths : shamsiMonths)" :key="m.value" :value="m.value">
                        {{ m.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Year -->
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">سال</label>
                    <select
                      v-model="passenger.birthYear"
                      @change="updateChildBirthDate(passenger)"
                      class="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                    >
                      <option :value="undefined" disabled>سال...</option>
                      <option v-for="y in getChildYearOptions(passenger.isForeign)" :key="y" :value="y">
                        {{ passenger.isForeign ? y : toPersianDigits(y) }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- v2.6.0: Scattered booking + allowPartial options -->
    <div class="max-w-4xl mx-auto px-4 mb-4">
      <div class="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm space-y-3">
        <label class="flex items-start gap-3 cursor-pointer select-none group">
          <input
            type="checkbox"
            v-model="scatteredBooking"
            class="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer flex-shrink-0 mt-0.5"
          >
          <span class="text-sm font-bold text-gray-800">
            رزرو پراکنده
            <span class="block text-xs font-normal text-gray-500 mt-0.5 leading-relaxed">
              در صورت نبود ظرفیت یکپارچه در یک کوپه، صندلی‌ها در کوپه‌های مجزا رزرو می‌شوند.
            </span>
          </span>
        </label>

        <label class="flex items-start gap-3 cursor-pointer select-none group">
          <input
            type="checkbox"
            v-model="allowPartial"
            class="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer flex-shrink-0 mt-0.5"
          >
          <span class="text-sm font-bold text-gray-800">
            در صورت عدم امکان رزرو کامل، تعداد صندلی‌های ممکن رزرو شود
            <span class="block text-xs font-normal text-gray-500 mt-0.5 leading-relaxed">
              در غیر این صورت اگر همه صندلی‌ها تأمین نشود، کل رزرو لغو و مبلغ آزاد می‌شود.
            </span>
          </span>
        </label>
      </div>
    </div>

    <!-- Mandatory Terms Agreement Checkbox -->
    <div class="max-w-4xl mx-auto px-4 mb-24">
      <div class="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:border-primary/50 transition">
        <label class="flex items-center gap-3 cursor-pointer select-none w-full">
          <input
            type="checkbox"
            v-model="termsAccepted"
            class="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer flex-shrink-0"
          >
          <span class="text-sm sm:text-base font-bold text-gray-800 leading-relaxed">
            <button type="button" @click.prevent="openTermsModal" class="text-primary underline hover:text-teal-700 font-extrabold mx-1">
              قوانین و مقررات
            </button>
            خرید خودکار و استرداد بلیط قطار را مطالعه کرده و میپذیرم.
          </span>
        </label>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-50">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>بلیط: {{ formatPrice(totalTicketPrice) }} تومان</span>
              <span v-if="hasForeignPassengers" class="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 font-bold">
                شامل نرخ اتباع
              </span>
              <span v-if="isPrivateCoupe && compCapacity > 0" class="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5" :title="exclusivePricingDesc">
                کوپه دربست {{ exclusivePricingDesc ? '' : '(' + toPersianDigits(String(compCapacity)) + ' صندلی)' }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>خدمات: {{ formatPrice(totalServiceCharge) }} تومان</span>
              <span v-if="pricingResult?.exclusiveCompartmentFee" class="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                شامل هزینه دربست کوپه
              </span>
            </div>
            <div class="flex items-center gap-2 text-lg font-bold text-primary">
              <span>قابل پرداخت: {{ formatPrice(finalTotal) }} تومان</span>
            </div>
          </div>
          <button 
            @click="handleBook"
            :disabled="!termsAccepted || bookingLoading"
            class="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <svg v-if="bookingLoading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <span>{{ bookingLoading ? 'در حال ثبت...' : 'ادامه' }}</span>
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    <!-- Full-Screen Terms & Regulations Modal -->
    <Transition name="modal-fade">
      <div v-if="termsModalOpen" class="fixed inset-0 z-[60] bg-white flex flex-col" dir="rtl">
        <!-- Header -->
        <div class="p-4 sm:px-8 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm flex-shrink-0">
          <h2 class="font-heading font-black text-lg sm:text-2xl text-gray-900">
            قوانین و مقررات رزرو و استرداد بلیط قطار (ریل‌نگار)
          </h2>
          <button @click="termsModalOpen = false" class="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-4xl mx-auto text-gray-800 text-sm sm:text-base leading-relaxed">
          <div class="space-y-2">
            <h3 class="font-bold text-base sm:text-lg text-primary">۱. قوانین عمومی و هویت مسافران</h3>
            <p>
              ثبت اطلاعات هویتی مسافران (نام، نام خانوادگی، کد ملی و تاریخ تولد) باید کاملاً منطبق با کارت ملی یا شناسنامه باشد. در صورت وجود هرگونه مغایرت، از ورود مسافر به قطار ممانعت به عمل آمده و مسئولیت آن بر عهده خریدار است.
            </p>
          </div>

          <div class="space-y-2">
            <h3 class="font-bold text-base sm:text-lg text-primary">۲. قوانین ویژه خرید خودکار (پیشفروش بلیط قطار)</h3>
            <p>
              ربات ریل‌نگار به محض باز شدن ظرفیت فروش بلیط قطار توسط راهآهن و شرکتهای ریلی، درخواست شما را به صورت خودکار پردازش میکند:
            </p>
            <ul class="list-disc list-inside space-y-1 pr-4 text-gray-700">
              <li>در صورتی که در بازه ساعتی انتخابی شما توسط شرکت ریلی قطاری تعریف نشده باشد، ربات جهت نسوختن درخواست شما، هر ساعتی از آن روز را که ظرفیت داشته باشد رزرو خواهد کرد.</li>
              <li>چنانچه تا روز سفر هیچ ظرفیتی باز نشده و بلیطی برای درخواست شما صادر نگردد، تمامی وجه پرداختی مسافر بدون هیچگونه کسری قابل استرداد و عودت خواهد بود.</li>
            </ul>
          </div>

          <div class="space-y-2">
            <h3 class="font-bold text-base sm:text-lg text-primary">۳. قوانین استرداد و کنسلی بلیط قطار</h3>
            <p>
              استرداد بلیط قطار طبق قوانین رسمی راهآهن جمهوری اسلامی ایران و بر اساس جدول زیر محاسبه میشود:
            </p>
            <ul class="list-disc list-inside space-y-1 pr-4 text-gray-700">
              <li><strong>تا ساعت ۱۲ روز قبل از حرکت قطار:</strong> ۹۰ درصد بهای بلیط به مسافر مسترد میشود (۱۰ درصد جریمه).</li>
              <li><strong>از ساعت ۱۲ روز قبل تا ۳ ساعت مانده به حرکت:</strong> ۷۰ درصد بهای بلیط مسترد میشود (۳۰ درصد جریمه).</li>
              <li><strong>از ۳ ساعت مانده به حرکت تا زمان حرکت قطار:</strong> ۵۰ درصد بهای بلیط مسترد میشود (۵۰ درصد جریمه).</li>
              <li><strong>پس از حرکت قطار:</strong> بلیط سوخت شده تلقی گردیده و هیچگونه وجهی مسترد نمیگردد.</li>
            </ul>
          </div>

          <div class="space-y-2">
            <h3 class="font-bold text-base sm:text-lg text-primary">۴. قوانین کوپه دربست و سهمیهها</h3>
            <p>
              در هنگام خرید کوپه دربست، قوانین مربوط به تعداد مسافران و بهای صندلیهای خالی تابع مقررات راهآهن است. برای مسافران اتباع خارجی، ارائه شماره پاسپورت معتبر الزامی است.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-8 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <button
            @click="termsModalOpen = false"
            class="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold transition text-sm sm:text-base"
          >
            بستن
          </button>
          <button
            @click="acceptTerms"
            class="px-8 py-3 rounded-xl bg-primary text-white hover:bg-teal-600 font-bold transition text-sm sm:text-base shadow-lg"
          >
            مطالعه کردم و تمامی قوانین را میپذیرم ✓
          </button>
        </div>
      </div>
    </Transition>

    <PassengerSelectModal
      :is-open="selectModalOpen"
      :target-index="activeTargetIndex"
      :already-selected-national-ids="alreadySelectedNationalIds"
      @close="selectModalOpen = false"
      @select="onPassengerSelected"
    />

    <Toast :show="toast.show" :type="toast.type" :message="toast.message" @hide="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import {
  getPassengerAgeCategory,
  maskShamsiDate,
  maskMiladiDate,
  shamsiToGregorian,
  gregorianToShamsi
} from '~/composables/utils/usePassengerAge'
import { useSearch, type PricingResult, type PricingItem } from '~/stores/search'
import { useProfile } from '~/composables/api/useProfile'
import { useWallet } from '~/composables/api/useWallet'
import { useOrders } from '~/composables/api/useOrders'
import { useToast } from '~/composables/useToast'
import Toast from '~/components/ui/Toast.vue'
import PassengerSelectModal from '~/components/ui/PassengerSelectModal.vue'

const { formatPrice, toPersianDigits } = usePersianNumber()
const route = useRoute()
const searchStore = useSearch()
const { getProfile, isAgencyTier } = useProfile()
const { getBalance } = useWallet()
const { createBookingRequest } = useOrders()
const { getSession, touchSession, deleteSession } = useBookingSession()
const { toast, showToast } = useToast()

const bookingLoading = ref(false)

// v2.3.1: SPECIAL/ROYAL tier = agency → send isAgency:true to pricing API for agency discount
const isAgencyUser = computed(() => {
  return isAgencyTier(getProfile()?.tier || 'BASIC')
})

const termsAccepted = ref(false)
const termsModalOpen = ref(false)

// v2.6.0: scattered booking + allow partial options
const scatteredBooking = ref(false)
const allowPartial = ref(false)

// Modal for selecting saved passengers
const selectModalOpen = ref(false)
const activeTargetIndex = ref(0)

const openSelectModal = (index: number) => {
  activeTargetIndex.value = index
  selectModalOpen.value = true
}

const alreadySelectedNationalIds = computed(() => {
  return passengerForms.value
    .map(p => p.isForeign ? p.passportNumber : p.nationalCode)
    .filter(Boolean)
})

const getFormAgeCategory = (birthDateStr: string, isForeign = false) => {
  return getPassengerAgeCategory(birthDateStr, isForeign)
}

const onFormBirthDateInput = (e: Event, passenger: PassengerForm) => {
  const input = e.target as HTMLInputElement
  if (passenger.isForeign) {
    passenger.birthDate = maskMiladiDate(input.value)
  } else {
    passenger.birthDate = maskShamsiDate(input.value)
  }
}

const onPassengerSelected = (p: any) => {
  const form = passengerForms.value[activeTargetIndex.value]
  if (!form) return
  form.firstName = p.firstName || ''
  form.lastName = p.lastName || ''
  form.isForeign = !!p.isForeign
  if (p.isForeign) {
    form.passportNumber = p.nationalId || ''
    form.nationalCode = ''
  } else {
    form.nationalCode = p.nationalId || ''
    form.passportNumber = ''
  }

  if (p.gender === 'FEMALE') {
    if (['adult_male', 'adult_female'].includes(form.gender)) form.gender = 'adult_female'
    else if (['boy', 'girl'].includes(form.gender)) form.gender = 'girl'
  } else if (p.gender === 'MALE') {
    if (['adult_male', 'adult_female'].includes(form.gender)) form.gender = 'adult_male'
    else if (['boy', 'girl'].includes(form.gender)) form.gender = 'boy'
  }

  if (isChildGender(form.gender)) {
    if (p.birthDate) {
      let bStr = p.birthDate
      if (!p.isForeign && bStr.includes('-')) {
        bStr = gregorianToShamsi(bStr)
      } else if (p.isForeign && bStr.includes('-')) {
        bStr = bStr.slice(0, 10).replace(/-/g, '/')
      }
      const digits = usePersianNumber().toLatinDigits(bStr).replace(/[^\d]/g, '')
      if (digits.length >= 8) {
        form.birthYear = parseInt(digits.slice(0, 4), 10)
        form.birthMonth = parseInt(digits.slice(4, 6), 10)
        form.birthDay = parseInt(digits.slice(6, 8), 10)
        updateChildBirthDate(form)
      }
    }
  } else {
    form.birthDate = defaultBirthDate()
  }

  showToast('success', `اطلاعات ${p.firstName} ${p.lastName} جایگذاری شد`)
}

// v2.6.0: compute coupe gender rules from passenger composition
const coupeRules = computed(() => {
  const g = passengerForms.value.map(p => p.gender)
  const adultMales = g.filter(x => x === 'adult_male').length
  const adultFemales = g.filter(x => x === 'adult_female').length
  const boys = g.filter(x => x === 'boy').length
  const girls = g.filter(x => x === 'girl').length
  const total = g.length

  if (total === 0) {
    return { coupeMenAllowed: true, coupeWomenAllowed: true, coupeMixedAllowed: true }
  }

  // All male (men/boys) with no female at all → brothers coupe + mixed
  const allMale = adultFemales === 0 && girls === 0
  // All female (women/girls) with no male at all → sisters coupe + mixed
  const allFemale = adultMales === 0 && boys === 0

  return {
    coupeMenAllowed: allMale,
    coupeWomenAllowed: allFemale,
    // mixed (regular/family) is always allowed — covers mixed & parent-opposite-child combos
    coupeMixedAllowed: true
  }
})

const acceptTerms = () => {
  termsAccepted.value = true
  termsModalOpen.value = false
}

const openTermsModal = () => {
  termsModalOpen.value = true
}

// Read selected trains from store
const selectedTrains = ref<any[]>([])
const sessionSubRequests = ref<{ fromStationId: number; toStationId: number; travelDate: string }[]>([])

// Read passenger count from search params
const totalPassengers = ref(0)

// Pricing data from API
const pricingResult = ref<PricingResult | null>(null)
const pricingLoading = ref(false)
const pricingError = ref('')
const showAllTrains = ref(false)
const ticketPrices = ref<{ adult: number; child: number; infant: number } | null>(null)
const ticketFareLoading = ref(false)

// Passenger forms
interface PassengerForm {
  firstName: string
  lastName: string
  nationalCode: string
  passportNumber: string
  isForeign: boolean
  birthDate: string
  gender: 'adult_male' | 'adult_female' | 'boy' | 'girl' | 'infant'
  birthDay?: number
  birthMonth?: number
  birthYear?: number
}
const passengerForms = ref<PassengerForm[]>([])

const isChildGender = (gender: string): boolean => {
  return ['boy', 'girl', 'infant'].includes(gender)
}

const shamsiMonths = [
  { value: 1, label: 'فروردین' },
  { value: 2, label: 'اردیبهشت' },
  { value: 3, label: 'خرداد' },
  { value: 4, label: 'تیر' },
  { value: 5, label: 'مرداد' },
  { value: 6, label: 'شهریور' },
  { value: 7, label: 'مهر' },
  { value: 8, label: 'آبان' },
  { value: 9, label: 'آذر' },
  { value: 10, label: 'دی' },
  { value: 11, label: 'بهمن' },
  { value: 12, label: 'اسفند' }
]

const miladiMonths = [
  { value: 1, label: 'Jan - ژانویه' },
  { value: 2, label: 'Feb - فوریه' },
  { value: 3, label: 'Mar - مارس' },
  { value: 4, label: 'Apr - آوریل' },
  { value: 5, label: 'May - مه' },
  { value: 6, label: 'Jun - ژوئن' },
  { value: 7, label: 'Jul - ژوئیه' },
  { value: 8, label: 'Aug - اوت' },
  { value: 9, label: 'Sep - سپتامبر' },
  { value: 10, label: 'Oct - اکتبر' },
  { value: 11, label: 'Nov - نوامبر' },
  { value: 12, label: 'Dec - دسامبر' }
]

const getChildYearOptions = (isForeign: boolean) => {
  if (isForeign) {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let y = currentYear - 12; y <= currentYear; y++) {
      years.push(y)
    }
    return years.reverse()
  } else {
    const currentShamsi = 1405
    const years = []
    for (let y = currentShamsi - 12; y <= currentShamsi; y++) {
      years.push(y)
    }
    return years.reverse()
  }
}

const updateChildBirthDate = (passenger: PassengerForm) => {
  if (passenger.birthDay && passenger.birthMonth && passenger.birthYear) {
    const dStr = String(passenger.birthDay).padStart(2, '0')
    const mStr = String(passenger.birthMonth).padStart(2, '0')
    const yStr = String(passenger.birthYear)
    passenger.birthDate = `${yStr}/${mStr}/${dStr}`
  }
}

const getPassengerLabel = (gender: string): string => {
  const labels: Record<string, string> = {
    adult_male: 'مرد',
    adult_female: 'زن',
    boy: 'کودک پسر',
    girl: 'کودک دختر',
    infant: 'نوزاد'
  }
  return labels[gender] || ''
}

// Iranian National Code validation
const isValidNationalCode = (code: string): boolean => {
  if (!/^\d{10}$/.test(code)) return false
  // Check all digits are not the same
  if (/^(\d)\1{9}$/.test(code)) return false
  const digits = code.split('').map(Number)
  const check = digits.pop()!
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i)
  }
  const remainder = sum % 11
  const expected = remainder < 2 ? 0 : 11 - remainder
  return expected === check
}

// Default adult birthDate = 30 years ago
const defaultBirthDate = (): string => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 30)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d)
}

onMounted(async () => {
  const sessionUuid = route.params.uuid as string | undefined

  // v2.6.0: this page requires a booking session uuid — no uuid → 404
  const session = sessionUuid ? getSession(sessionUuid) : null
  if (!sessionUuid || !session) {
    showError({ statusCode: 404, statusMessage: 'جلسه رزرو یافت نشد یا منقضی شده است' })
    return
  }
  // Sliding expiry: keep alive while user is on this page
  touchSession(sessionUuid)

  // Load selected train data from session
  if (session.selectedTrains?.length) {
    selectedTrains.value = session.selectedTrains
  } else {
    // Fallback: read from store (legacy direct navigation)
    const storeData = searchStore.selectedTrain.value
    if (storeData && Array.isArray(storeData)) {
      selectedTrains.value = storeData
    } else {
      // Fallback: read from localStorage (after login redirect)
      const savedTrains = localStorage.getItem('rn-pending-trains')
      if (savedTrains) {
        try {
          selectedTrains.value = JSON.parse(savedTrains)
          localStorage.removeItem('rn-pending-trains')
        } catch {}
      }
    }
  }

  // Load passenger count from session
  const p = session.passengers
  if (typeof p === 'object' && p !== null) {
    const pd = p as { men: number; women: number; boys: number; girls: number; infants: number }
    totalPassengers.value = pd.men + pd.women + pd.boys + pd.girls + pd.infants
    
    // Generate passenger forms based on type breakdown
    const forms: PassengerForm[] = []
    const defBirth = defaultBirthDate()
    for (let i = 0; i < pd.men; i++) forms.push({ firstName: '', lastName: '', nationalCode: '', passportNumber: '', isForeign: false, birthDate: defBirth, gender: 'adult_male' })
    for (let i = 0; i < pd.women; i++) forms.push({ firstName: '', lastName: '', nationalCode: '', passportNumber: '', isForeign: false, birthDate: defBirth, gender: 'adult_female' })
    for (let i = 0; i < pd.boys; i++) forms.push({ firstName: '', lastName: '', nationalCode: '', passportNumber: '', isForeign: false, birthDate: '1400/01/01', birthYear: 1400, birthMonth: 1, birthDay: 1, gender: 'boy' })
    for (let i = 0; i < pd.girls; i++) forms.push({ firstName: '', lastName: '', nationalCode: '', passportNumber: '', isForeign: false, birthDate: '1400/01/01', birthYear: 1400, birthMonth: 1, birthDay: 1, gender: 'girl' })
    for (let i = 0; i < pd.infants; i++) forms.push({ firstName: '', lastName: '', nationalCode: '', passportNumber: '', isForeign: false, birthDate: '1404/01/01', birthYear: 1404, birthMonth: 1, birthDay: 1, gender: 'infant' })
    passengerForms.value = forms
  } else if (typeof p === 'number') {
    totalPassengers.value = p || 1
    const defBirth = defaultBirthDate()
    for (let i = 0; i < totalPassengers.value; i++) {
      passengerForms.value.push({ firstName: '', lastName: '', nationalCode: '', passportNumber: '', isForeign: false, birthDate: defBirth, gender: 'adult_male' })
    }
  } else {
    // Fallback: read from localStorage (after login redirect)
    const savedPassengers = localStorage.getItem('rn-pending-passengers')
    if (savedPassengers) {
      totalPassengers.value = Number(savedPassengers) || 1
      localStorage.removeItem('rn-pending-passengers')
      const defBirth = defaultBirthDate()
      for (let i = 0; i < totalPassengers.value; i++) {
        passengerForms.value.push({ firstName: '', lastName: '', nationalCode: '', passportNumber: '', isForeign: false, birthDate: defBirth, gender: 'adult_male' })
      }
    }
  }

  // Restore compartment type from session
  if (session.compartmentType) {
    searchStore.searchParams.value.compartmentType = session.compartmentType as any
  }
  // v2.6.0: restore scattered booking flag
  if (session.scattered !== undefined) {
    scatteredBooking.value = session.scattered
  }

  // Build sub-requests from selected trains (deduped by from+to+date)
  let subRequests: { fromStationId: number; toStationId: number; travelDate: string }[] = []
  
  // Try from trains data first
  if (selectedTrains.value.length > 0) {
    subRequests = selectedTrains.value.map((t: any) => ({
      fromStationId: t.fromStationId,
      toStationId: t.toStationId,
      travelDate: t.travelDate || t.shamsiDate || ''
    })).filter((sr: any, i: number, arr: any[]) => 
      sr.fromStationId && sr.toStationId && sr.travelDate &&
      arr.findIndex((s: any) => s.fromStationId === sr.fromStationId && s.toStationId === sr.toStationId && s.travelDate === sr.travelDate) === i
    )
  }
  
  // Fallback: try from session or localStorage sub-requests
  if (subRequests.length === 0 && session.subRequests?.length) {
    subRequests = session.subRequests
  }
  if (subRequests.length === 0) {
    const saved = localStorage.getItem('rn-pending-subrequests')
    if (saved) {
      try {
        subRequests = JSON.parse(saved)
        localStorage.removeItem('rn-pending-subrequests')
      } catch {}
    }
  }
  if (subRequests.length === 0) {
    const storeParams = searchStore.searchParams.value || {}
    const routes = storeParams.routes || []
    const dates = storeParams.dates || (storeParams.date ? [storeParams.date] : [])
    routes.forEach((r: any) => {
      dates.forEach((d: string) => {
        if (r.from && r.to && d) {
          subRequests.push({
            fromStationId: Number(r.from),
            toStationId: Number(r.to),
            travelDate: d
          })
        }
      })
    })
  }

  sessionSubRequests.value = subRequests

  // Calculate pricing from API
  if (subRequests.length > 0 && totalPassengers.value > 0) {
    pricingLoading.value = true
    try {
      // Check if any selected train has exclusive compartment
      const hasExclusive = selectedTrains.value.some((t: any) => t.isCompartment === 1 || t.isCompartment === '1')
      const compCapacity = Math.max(...selectedTrains.value.map((t: any) => Number(t.compartmentCapacity || 0)))
      // Align with booking: exclusiveCompartment only when user chose دربست (private)
      const userWantsPrivate = searchStore.searchParams.value.compartmentType === 'private'
      // v2.5.0: per-seat train price (Toman) so backend can compute ticketTotal for exclusive coupe
      const seatCostToman = Math.max(...selectedTrains.value.map((t: any) => Number(t.cost || t.price || 0)))

      let result: any = null

      if (searchStore.searchParams.value.isPresale) {
        const activePresale = searchStore.activePresale.value
        const presaleEst = await searchStore.estimatePresalePrice({
          presaleId: activePresale?.id,
          fromStationId: subRequests[0]?.fromStationId,
          toStationId: subRequests[0]?.toStationId,
          passengersCount: totalPassengers.value
        })
        if (presaleEst?.recommendedEstimate) {
          const rec = presaleEst.recommendedEstimate
          const ticketToman = Math.round(Number(rec.ticketTotalRial || 0) / 10)
          const serviceToman = Math.round(Number(rec.serviceTotalRial || 0) / 10)
          const totalToman = Math.round(Number(rec.estimatedTotalRial || 0) / 10)
          result = {
            total: totalToman,
            ticketTotal: ticketToman,
            serviceTotal: serviceToman,
            items: [
              { label: `برآورد قیمت بلیط قطار پیشفروش (${totalPassengers.value} صندلی)`, amount: ticketToman },
              { label: `کارمزد خدمات رزرو خودکار پیشفروش`, amount: serviceToman }
            ]
          }
        }
      }

      if (!result) {
        result = await searchStore.calculatePricing({
          // v2.3.1: SPECIAL/ROYAL tiers = agency → agency fee discount applies
          isAgency: isAgencyUser.value,
          passengerCount: totalPassengers.value,
          subRequests,
          exclusiveCompartment: userWantsPrivate && hasExclusive && compCapacity > 0,
          compartmentCapacity: compCapacity > 0 ? compCapacity : undefined,
          ticketCostPerSeat: seatCostToman > 0 ? seatCostToman : undefined
        })
      }
      if (result) {
        // v2.6.1: backend multiplies ticketTotal by subRoutesCount (sum of routes),
        // but only ONE train (the priciest) is actually booked → recompute correctly here.
        const maxSeatCost = Math.max(...selectedTrains.value.map((t: any) => Number(t.cost || t.price || 0)))
        const count = totalPassengers.value
        if (maxSeatCost > 0) {
          const isExclusive = !!(userWantsPrivate && hasExclusive && compCapacity > 0)
          let correctTicketTotal: number
          if (isExclusive && count < compCapacity) {
            const emptySeats = compCapacity - count
            const emptyCost = Math.round(maxSeatCost * 0.85)
            correctTicketTotal = Math.round((maxSeatCost * count) + (emptyCost * emptySeats))
          } else {
            correctTicketTotal = Math.round(maxSeatCost * count)
          }
          result.ticketTotal = correctTicketTotal
          // Rebuild items: keep service items, drop backend's per-route ticket items,
          // and append ONE correct ticket line.
          result.items = [
            {
              label: `قیمت بلیط قطار (${count} صندلی × ${maxSeatCost.toLocaleString('fa-IR')} تومان)`,
              amount: correctTicketTotal
            },
            ...result.items.filter((it: any) => !it.label.includes('قیمت بلیط'))
          ]
          // total = serviceTotal + corrected ticketTotal
          result.total = (result.serviceTotal ?? 0) + correctTicketTotal
        }
        pricingResult.value = result
      } else {
        pricingError.value = 'خطا در محاسبه هزینه خدمات'
      }
    } catch {
      pricingError.value = 'خطا در دریافت هزینه خدمات'
    } finally {
      pricingLoading.value = false
    }
  }

  const fetchLiveTicketFare = async () => {
    if (selectedTrains.value.length === 0) return
    ticketFareLoading.value = true
    try {
      const bestTrain = selectedTrains.value.reduce((best: any, t: any) => 
        (t.cost || t.price || 0) > (best.cost || best.price || 0) ? t : best
      , selectedTrains.value[0])
      
      const adultCount = passengerForms.value.filter(p => p.gender === 'adult_male' || p.gender === 'adult_female').length
      const childCount = passengerForms.value.filter(p => p.gender === 'boy' || p.gender === 'girl').length
      const infantCount = passengerForms.value.filter(p => p.gender === 'infant').length
      
      const baseFareReq = {
        CircularNumberSerial: Number(bestTrain.circularNumberSerial) || 0,
        MoveDate: bestTrain.moveDate || '',
        PathCode: Number(bestTrain.pathCode) || 0,
        RateCode: Number(bestTrain.rateCode) || 0,
        Ration: Number(bestTrain.ration) || 0,
        trainNumber: Number(bestTrain.trainNumber || bestTrain.id || 0),
        wagonType: Number(bestTrain.wagonType || 0),
        ToStation: String(bestTrain.toStationId || ''),
        FromStation: String(bestTrain.fromStationId || '')
      }
      
      if (baseFareReq.CircularNumberSerial && baseFareReq.MoveDate) {
        const anyForeign = passengerForms.value.some(p => p.isForeign)
        
        const [adultFare, childFare, infantFare] = await Promise.all([
          searchStore.ticketFare({ ...baseFareReq, TarrifCode: 0, isForeign: anyForeign }),
          childCount > 0 ? searchStore.ticketFare({ ...baseFareReq, TarrifCode: 1, isForeign: anyForeign }) : Promise.resolve(null),
          infantCount > 0 ? searchStore.ticketFare({ ...baseFareReq, TarrifCode: 5, isForeign: anyForeign }) : Promise.resolve(null)
        ])
        
        const adultAmount = adultFare?.amountToman
        const childAmount = childFare?.amountToman
        const infantAmount = infantFare?.amountToman
        
        if (adultAmount || childAmount || infantAmount) {
          ticketPrices.value = {
            adult: adultAmount || 0,
            child: childAmount || 0,
            infant: infantAmount || 0
          }
        }
      }
    } catch {
      console.warn('ticket-fare API not available, using fallback pricing')
    } finally {
      ticketFareLoading.value = false
    }
  }

  await fetchLiveTicketFare()

  watch(passengerForms, () => {
    fetchLiveTicketFare()
  }, { deep: true })
})

// Watch for isForeign changes and re-fetch ticket-fare
watch(() => passengerForms.value.map(p => p.isForeign), async () => {
  if (selectedTrains.value.length === 0 || !totalPassengers.value || passengerForms.value.length === 0) return
  const bestTrain = selectedTrains.value.reduce((best: any, t: any) => 
    (t.cost || t.price || 0) > (best.cost || best.price || 0) ? t : best
  , selectedTrains.value[0])
  
  const baseFareReq = {
    CircularNumberSerial: Number(bestTrain.circularNumberSerial) || 0,
    MoveDate: bestTrain.moveDate || '',
    PathCode: Number(bestTrain.pathCode) || 0,
    RateCode: Number(bestTrain.rateCode) || 0,
    Ration: Number(bestTrain.ration) || 0,
    trainNumber: Number(bestTrain.trainNumber || bestTrain.id || 0),
    wagonType: Number(bestTrain.wagonType || 0),
    ToStation: String(bestTrain.toStationId || ''),
    FromStation: String(bestTrain.fromStationId || '')
  }
  if (!baseFareReq.CircularNumberSerial || !baseFareReq.MoveDate) return
  
  ticketFareLoading.value = true
  try {
    const adultCount = passengerForms.value.filter(p => p.gender === 'adult_male' || p.gender === 'adult_female').length
    const childCount = passengerForms.value.filter(p => p.gender === 'boy' || p.gender === 'girl').length
    const infantCount = passengerForms.value.filter(p => p.gender === 'infant').length
    const anyForeign = passengerForms.value.some(p => p.isForeign)
    
    const [adultFare, childFare, infantFare] = await Promise.all([
      searchStore.ticketFare({ ...baseFareReq, TarrifCode: 0, isForeign: anyForeign }),
      childCount > 0 ? searchStore.ticketFare({ ...baseFareReq, TarrifCode: 1, isForeign: anyForeign }) : Promise.resolve(null),
      infantCount > 0 ? searchStore.ticketFare({ ...baseFareReq, TarrifCode: 5, isForeign: anyForeign }) : Promise.resolve(null)
    ])
    
    const adultAmount = adultFare?.amountToman
    const childAmount = childFare?.amountToman
    const infantAmount = infantFare?.amountToman
    
    if (adultAmount || childAmount || infantAmount) {
      ticketPrices.value = {
        adult: adultAmount || 0,
        child: childAmount || 0,
        infant: infantAmount || 0
      }
    }
  } catch {
    console.warn('ticket-fare unavailable for re-fetch')
  } finally {
    ticketFareLoading.value = false
  }
}, { deep: true })

const totalTicketPrice = computed(() => {
  // v2.5.0: backend returns ticketTotal (full seats + discounted empty seats) for exclusive coupe
  if (pricingResult.value?.ticketTotal) {
    return Number(pricingResult.value.ticketTotal)
  }
  // Exclusive (دربست) coupe: backend provides exact pricing:
  // (seatCost × passengers) + (emptySeatCost × empty seats, 15% discount) — values in Rial
  const isPrivate = searchStore.searchParams.value.compartmentType === 'private'
  const hasExclusive = selectedTrains.value.some((t: any) => t.isCompartment === 1 || t.isCompartment === '1')
  const compCapacity = Math.max(...selectedTrains.value.map((t: any) => Number(t.compartmentCapacity || 0)))

  if (isPrivate && hasExclusive && compCapacity > 0) {
    // Prefer backend exclusivePricing (exact formula with discounted empty seats)
    const ex = selectedTrains.value.find((t: any) => t.exclusivePricing)
    if (ex?.exclusivePricing?.exclusiveTicketCost) {
      return Math.round(Number(ex.exclusivePricing.exclusiveTicketCost) / 10) // Rial → Toman
    }
    // Fallback: whole coupe at full per-seat price
    const maxPrice = Math.max(...selectedTrains.value.map((t: any) => Number(t.cost || t.price || 0)))
    if (maxPrice > 0) return Math.round(maxPrice * compCapacity)
    // Last resort: per-passenger API pricing
    if (ticketPrices.value && (ticketPrices.value.adult || ticketPrices.value.child || ticketPrices.value.infant)) {
      const adultCount = passengerForms.value.filter(p => p.gender === 'adult_male' || p.gender === 'adult_female').length
      const childCount = passengerForms.value.filter(p => p.gender === 'boy' || p.gender === 'girl').length
      const infantCount = passengerForms.value.filter(p => p.gender === 'infant').length
      return (adultCount * ticketPrices.value.adult) + (childCount * ticketPrices.value.child) + (infantCount * ticketPrices.value.infant)
    }
    return 0
  }

  const hasForeign = passengerForms.value.some(p => p.isForeign)
  const maxSeatPrice = Math.max(...selectedTrains.value.map((t: any) => Number(t.cost || t.price || 0)), 0)

  // Calculate passenger by passenger considering foreign status
  let total = 0
  passengerForms.value.forEach(p => {
    if (p.isForeign) {
      // Foreign passenger (اتباع): Full adult ticket fare applies (no child/infant tariff discount)
      const foreignAdultFare = ticketPrices.value?.adult || maxSeatPrice
      total += foreignAdultFare
    } else {
      if (p.gender === 'adult_male' || p.gender === 'adult_female') {
        total += (ticketPrices.value?.adult || maxSeatPrice)
      } else if (p.gender === 'boy' || p.gender === 'girl') {
        total += (ticketPrices.value?.child || Math.round(maxSeatPrice * 0.5))
      } else if (p.gender === 'infant') {
        total += (ticketPrices.value?.infant || Math.round(maxSeatPrice * 0.1))
      } else {
        total += (ticketPrices.value?.adult || maxSeatPrice)
      }
    }
  })

  if (total > 0) return total

  if (selectedTrains.value.length === 0 || !totalPassengers.value) return 0
  return maxSeatPrice * totalPassengers.value
})

const hasForeignPassengers = computed(() => {
  return passengerForms.value.some(p => p.isForeign)
})

const totalServiceCharge = computed(() => {
  // v2.5.0: backend returns serviceTotal (base service + exclusive coupe fee)
  if (pricingResult.value?.serviceTotal !== undefined) {
    return Number(pricingResult.value.serviceTotal)
  }
  return (pricingResult.value?.total || 0)
})

// v2.4.0: exclusive (دربست) coupe state — whole coupe is priced, not per-passenger
const isPrivateCoupe = computed(() => {
  return searchStore.searchParams.value.compartmentType === 'private'
})

const compCapacity = computed(() => {
  return Math.max(...selectedTrains.value.map((t: any) => Number(t.compartmentCapacity || 0)))
})

// v2.4.0: human-readable breakdown of backend exclusivePricing (Rial values → Toman)
const exclusivePricingDesc = computed(() => {
  const ex = selectedTrains.value.find((t: any) => t.exclusivePricing)
  const ep = ex?.exclusivePricing
  if (!ep) return ''
  const seatCost = Math.round(Number(ep.seatCost || 0) / 10)
  const emptyCost = Math.round(Number(ep.emptySeatCost || 0) / 10)
  const cap = Number(ex.compartmentCapacity || 0)
  const pax = totalPassengers.value
  const empty = Math.max(0, cap - pax)
  return `${toPersianDigits(String(pax))} صندلی پر (${formatPrice(seatCost)} تومان) + ${toPersianDigits(String(empty))} صندلی خالی با ۱۵٪ تخفیف (${formatPrice(emptyCost)} تومان)`
})

const finalTotal = computed(() => {
  return totalTicketPrice.value + totalServiceCharge.value
})

const handleBook = async () => {
  // Guard: must be logged in
  const apiKey = localStorage.getItem('rn-api-key')
  if (!apiKey) {
    localStorage.setItem('rn-pending-trains', JSON.stringify(selectedTrains.value))
    navigateTo('/auth/login?redirect=/train-passengers')
    return
  }

  // Guard: terms must be accepted (button is disabled, but double-check)
  if (!termsAccepted.value) {
    openTermsModal()
    return
  }

  // Guard: passengers must be valid
  const invalid = passengerForms.value.some(p =>
    !p.firstName || !p.lastName || (!p.isForeign && !isValidNationalCode(p.nationalCode))
  )
  if (invalid) {
    showToast('error', 'لطفاً اطلاعات همه مسافران را کامل وارد کنید')
    return
  }

  bookingLoading.value = true
  try {
    // 1) Check FREE wallet balance (availableRial, NOT locked)
    const balRes = await getBalance() as any
    const balData = balRes?.data || balRes || {}
    const availableRial = Number(balData.availableRial || 0)
    const requiredRial = Math.round(finalTotal.value * 10) // Toman → Rial

    // 2) Not enough free credit → redirect to wallet top-up
    if (availableRial < requiredRial) {
      const deficitToman = Math.round((requiredRial - availableRial) / 10)
      showToast('warning', `اعتبار کافی نیست؛ ${formatPrice(deficitToman)} تومان کم دارید`)
      // Keep selection so user can come back after topping up
      localStorage.setItem('rn-pending-trains', JSON.stringify(selectedTrains.value))
      // v2.6.0: redirect back to this session after wallet top-up
      const sessionUuid = route.params.uuid as string
      setTimeout(() => navigateTo(`/profile/wallet?return=${encodeURIComponent(`/train-passengers/${sessionUuid}`)}`), 1200)
      return
    }

    // 3) v2.8.0: passengers are upserted automatically by the backend via newPassengers
    //    (insert-or-update by nationalId, isolated per user's api-key)
    const newPassengers = passengerForms.value.map((p, idx) => {
      let finalBirthDate: string
      if (isChildGender(p.gender)) {
        const y = p.birthYear || (p.isForeign ? 2021 : 1400)
        const m = p.birthMonth || 1
        const d = p.birthDay || 1
        const bStr = `${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`
        finalBirthDate = p.isForeign ? bStr.replace(/\//g, '-') : shamsiToGregorian(bStr)
      } else {
        finalBirthDate = defaultBirthDate()
      }
      return {
        position: idx + 1,
        firstName: p.firstName,
        lastName: p.lastName,
        nationalId: p.isForeign ? p.passportNumber || p.nationalCode : p.nationalCode,
        gender: (p.gender === 'adult_male' || p.gender === 'boy') ? 'MALE' : 'FEMALE',
        birthDate: finalBirthDate,
        isForeign: p.isForeign
      }
    })

    // 4) Build booking request (v2.6.0/v2.8.0 structure)
    const firstTrain = selectedTrains.value[0]
    const adultCount = passengerForms.value.filter(p => ['adult_male', 'adult_female'].includes(p.gender)).length
    const childCount = passengerForms.value.filter(p => ['boy', 'girl'].includes(p.gender)).length

    // Sub-requests from selected trains (deduped by from+to+date)
    let subRequests = selectedTrains.value.map((t: any) => ({
      fromStationId: Number(t.fromStationId),
      toStationId: Number(t.toStationId),
      travelDate: t.travelDate || t.shamsiDate || ''
    })).filter((sr: any, i: number, arr: any[]) =>
      sr.fromStationId && sr.toStationId && sr.travelDate &&
      arr.findIndex((s: any) => s.fromStationId === sr.fromStationId && s.toStationId === sr.toStationId && s.travelDate === sr.travelDate) === i
    )

    if (subRequests.length === 0 && sessionSubRequests.value.length > 0) {
      subRequests = sessionSubRequests.value
    }
    if (subRequests.length === 0) {
      const storeParams = searchStore.searchParams.value || {}
      const routes = storeParams.routes || []
      const dates = storeParams.dates || (storeParams.date ? [storeParams.date] : [])
      routes.forEach((r: any) => {
        dates.forEach((d: string) => {
          if (r.from && r.to && d) {
            subRequests.push({
              fromStationId: Number(r.from),
              toStationId: Number(r.to),
              travelDate: d
            })
          }
        })
      })
    }

    const maxSeatCostToman = Math.max(...selectedTrains.value.map((t: any) => Number(t.cost || t.price || 0)), 0)
    const bookingPayload = {
      priority: 5,
      isPresale: searchStore.searchParams.value.isPresale || false,
      allowPartial: allowPartial.value,
      // v2.6.0: gender-based coupe access rules
      coupeWomenAllowed: coupeRules.value.coupeWomenAllowed,
      coupeMenAllowed: coupeRules.value.coupeMenAllowed,
      coupeMixedAllowed: coupeRules.value.coupeMixedAllowed,
      exclusiveCoupe: searchStore.searchParams.value.compartmentType === 'private',
      notes: scatteredBooking.value ? 'درخواست رزرو پراکنده' : undefined,
      adultsCount: adultCount || newPassengers.length,
      childrenCount: childCount,
      // v2.8.0: backend upserts these automatically (insert-or-update by nationalId)
      newPassengers,
      subRequests,
      metadata: {
        presaleId: searchStore.activePresale.value?.id || undefined,
        filters: {
          departureTimeStart: searchStore.searchParams.value.presaleFilters?.departureTimeStart,
          departureTimeEnd: searchStore.searchParams.value.presaleFilters?.departureTimeEnd,
          coachTypes: searchStore.searchParams.value.presaleFilters?.coachTypes,
          scattered: scatteredBooking.value,
          maxPrice: maxSeatCostToman > 0 ? maxSeatCostToman * 10 : (searchStore.searchParams.value.presaleFilters?.maxPrice || undefined)
        },
        pricing: {
          estimatedTotalRial: Math.round(finalTotal.value * 10),
          ticketTotalRial: Math.round(totalTicketPrice.value * 10),
          serviceTotalRial: Math.round(totalServiceCharge.value * 10)
        }
      }
    }

    const res = await createBookingRequest(bookingPayload) as any
    const data = res?.data || res || {}
    const uuid = data.uuid || data.id

    if (uuid) {
      // v2.6.0: booking succeeded → purge the one-hour session
      const sessionUuid = route.params.uuid as string
      if (sessionUuid) deleteSession(sessionUuid)
      showToast('success', 'درخواست رزرو ثبت شد و مبلغ از کیف پول کسر گردید')
      setTimeout(() => navigateTo('/profile/orders'), 1200)
    } else {
      showToast('error', 'خطا در ثبت درخواست')
    }
  } catch (e: any) {
    console.error('Booking failed:', e)
    showToast('error', e?.data?.message || 'خطا در ثبت درخواست رزرو')
  } finally {
    bookingLoading.value = false
  }
}
</script>