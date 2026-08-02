<template>
    <div class="train-page min-h-screen py-6 px-4 bg-gray-50" dir="rtl">
      <div class="max-w-4xl mx-auto">
        <h1 class="font-heading text-xl sm:text-2xl font-black text-center mb-6 text-gray-900">
          {{ $t('ticket') }}
        </h1>

        <!-- Search Mode Tabs -->
        <div class="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <button
            type="button"
            @click="searchMode = 'normal'"
            :class="['flex-1 py-3 text-sm sm:text-base font-bold transition-colors', searchMode === 'normal' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50']"
          >
            جستجو عادی
          </button>
          <button
            type="button"
            @click="searchMode = 'presale'"
            :class="['flex-1 py-3 text-sm sm:text-base font-bold transition-colors', searchMode === 'presale' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50']"
          >
            پیش فروش
          </button>
        </div>

        <div v-if="searchMode === 'presale'" class="mb-6 space-y-3">
          <div class="bg-[#fff3eb] border-2 border-[#ffbe99] rounded-2xl p-4 sm:p-5 text-[#c84814] shadow-sm">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="font-bold text-base sm:text-lg text-right">
                  {{ searchStore.activePresale.value?.title || 'رزرو پیشفروش خودکار بلیط قطار' }}
                </h2>
                <p v-if="searchStore.activePresale.value?.targetDates?.label" class="text-xs sm:text-sm text-[#d9531e] mt-1 font-bold">
                  بازه سفر: {{ toPersianDigits(searchStore.activePresale.value.targetDates.label) }}
                </p>
                <p v-if="searchStore.activePresale.value?.executionTime?.label" class="text-xs sm:text-sm text-[#d9531e] mt-0.5">
                  زمان شروع خرید در رجا: {{ toPersianDigits(searchStore.activePresale.value.executionTime.label) }}
                </p>
                <p v-if="!searchStore.activePresale.value" class="text-xs sm:text-sm text-[#d9531e] mt-1">
                  در حال حاضر پیشفروش رسمی اعلام نشده است؛ اما میتوانید برای ۳۰ روز آینده درخواست خرید خودکار ثبت کنید.
                </p>
              </div>
              <svg class="w-8 h-8 text-[#c84814] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>

            <!-- Live Countdown Timer -->
            <div v-if="countdownText" class="mt-3 bg-white/90 border border-[#ffbe99] rounded-xl p-2.5 text-center font-bold text-sm sm:text-base text-[#c84814] flex items-center justify-center gap-2 shadow-inner">
              <span>⏳ مانده تا شروع پیشفروش:</span>
              <span class="font-heading" dir="ltr">{{ countdownText }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
          <form @submit.prevent="handleSearch" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <!-- مبدأ Section -->
            <div class="md:col-span-2">
              <div class="bg-primary text-white rounded-xl p-1 mb-2 shadow-sm">
                <div class="px-3 py-2">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <MapPinIcon class="w-5 h-5" />
                      <span class="hidden sm:inline font-bold">مبدا را انتخاب کنید</span>
                      <span class="sm:hidden font-bold">مبدا</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click="searchParams.originsMode = 'single'"
                        :class="[
                          'px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm',
                          searchParams.originsMode === 'single'
                            ? 'bg-white text-primary'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        ]"
                      >
                        <span class="hidden sm:inline">یک مبدا</span>
                        <span class="sm:hidden">یک</span>
                      </button>
                      <button
                        type="button"
                        @click="searchParams.originsMode = 'multiple'"
                        :class="[
                          'px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm',
                          searchParams.originsMode === 'multiple'
                            ? 'bg-white text-primary'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        ]"
                      >
                        <span class="hidden sm:inline">چند مبدا</span>
                        <span class="sm:hidden">چند</span>
                      </button>
                    </div>
                  </div>
                  <div v-if="searchParams.origins.length > 0" class="text-right text-sm font-bold opacity-90">
                    مبداها : {{ searchParams.origins.map(id => getCityName(id)).join(' – ') }}
                  </div>
                </div>
              </div>

              <div class="bg-white border-2 border-gray-200 rounded-xl p-3">
                <div class="relative">
                  <div
                    @click="openOriginModal"
                    class="w-full p-3 border-2 border-gray-200 rounded-xl bg-white flex justify-between items-center cursor-pointer hover:border-primary/50 transition shadow-sm"
                  >
                    <span :class="searchParams.origins.length > 0 ? 'text-gray-900 font-bold' : 'text-gray-400'">
                      {{ searchParams.origins.length > 0 ? searchParams.origins.map(id => getCityName(id)).join('، ') : 'انتخاب مبدا (مثلاً تهران)' }}
                    </span>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
             </div>

            <!-- مقصد Section -->
            <div class="md:col-span-2">
              <div class="bg-primary text-white rounded-xl p-1 mb-2 shadow-sm">
                <div class="px-3 py-2">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <MapPinIcon class="w-5 h-5" />
                      <span class="hidden sm:inline font-bold">مقصد را انتخاب کنید</span>
                      <span class="sm:hidden font-bold">مقصد</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click="searchParams.destinationMode = 'single'"
                        :class="[
                          'px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm',
                          searchParams.destinationMode === 'single'
                            ? 'bg-white text-primary'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        ]"
                      >
                        <span class="hidden sm:inline">یک مقصد</span>
                        <span class="sm:hidden">یک</span>
                      </button>
                      <button
                        type="button"
                        @click="searchParams.destinationMode = 'multiple'"
                        :class="[
                          'px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm',
                          searchParams.destinationMode === 'multiple'
                            ? 'bg-white text-primary'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        ]"
                      >
                        <span class="hidden sm:inline">چند مقصد</span>
                        <span class="sm:hidden">چند</span>
                      </button>
                    </div>
                  </div>
                  <div v-if="searchParams.destinationMode === 'single' && searchParams.destination" class="text-right text-sm font-bold opacity-90">
                    مقصد : {{ getCityName(searchParams.destination) }}
                  </div>
                  <div v-else-if="searchParams.destinationMode === 'multiple' && searchParams.destinations.length > 0" class="text-right text-sm font-bold opacity-90">
                    مقصدها : {{ searchParams.destinations.map(id => getCityName(id)).join(' – ') }}
                  </div>
                </div>
              </div>

              <div class="bg-white border-2 border-gray-200 rounded-xl p-3">
                <div class="relative">
                  <div
                    @click="openDestModal"
                    class="w-full p-3 border-2 border-gray-200 rounded-xl bg-white flex justify-between items-center cursor-pointer hover:border-primary/50 transition shadow-sm"
                  >
                    <span :class="(searchParams.destinationMode === 'single' ? searchParams.destination : searchParams.destinations.length > 0) ? 'text-gray-900 font-bold' : 'text-gray-400'">
                      {{ searchParams.destinationMode === 'single' ? (searchParams.destination ? getCityName(searchParams.destination) : 'انتخاب مقصد (مثلاً مشهد)') : (searchParams.destinations.length > 0 ? searchParams.destinations.map(id => getCityName(id)).join('، ') : 'انتخاب مقصد (مثلاً مشهد)') }}
                    </span>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- تاریخ Section -->
            <div class="md:col-span-2">
              <CustomDatePicker
                v-model="searchParams.date as string"
                date-picker-name="travel-date"
                :mode="searchMode"
                :active-presale="searchStore.activePresale.value"
              />
            </div>

            <!-- Warning Banner for Multi-Origin -->
            <div v-if="searchParams.originsMode === 'multiple' && searchParams.origins.length > 1" class="md:col-span-2">
              <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
                <div class="flex items-start gap-3">
                  <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 class="font-bold text-yellow-800 mb-1 text-sm">
                      هشدار: چند مبدا انتخاب شده
                    </h3>
                    <p class="text-sm text-yellow-700">
                      هزینه خدمات برای هر مبدا اضافی {{ formatPrice(pricingInfo?.extraRouteFeeRegular || 6000) }} تومان افزایش می‌یابد.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- تعداد مسافر Section -->
            <div>
              <div class="bg-primary text-white rounded-xl p-1 mb-2 shadow-sm">
                <div class="px-3 py-2">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM15 7a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span class="font-bold">تعداد مسافر</span>
                  </div>
                  <div class="text-right text-sm font-bold opacity-90">
                    <span>{{ toPersianDigits(getTotalPassengers().toString()) }} مسافر</span>
                  </div>
                </div>
              </div>

              <div class="bg-white border-2 border-gray-200 rounded-xl p-3 space-y-2">
                <div class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl bg-white hover:border-primary/50 transition">
                  <span class="text-gray-900 text-sm font-bold">مرد</span>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="adjustPassengerCount('men', -1)"
                      class="w-8 h-8 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center justify-center font-bold"
                      :disabled="searchParams.passengers.men === 0"
                      :class="searchParams.passengers.men === 0 ? 'opacity-50 cursor-not-allowed' : ''"
                    >
                      −
                    </button>
                    <span class="w-8 text-center font-bold text-gray-900">
                      {{ toPersianDigits(searchParams.passengers.men.toString()) }}
                    </span>
                    <button
                      type="button"
                      @click="adjustPassengerCount('men', 1)"
                      class="w-8 h-8 rounded-md bg-primary text-white hover:bg-teal-600 transition flex items-center justify-center font-bold shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl bg-white hover:border-primary/50 transition">
                  <span class="text-gray-900 text-sm font-bold">زن</span>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="adjustPassengerCount('women', -1)"
                      class="w-8 h-8 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center justify-center font-bold"
                      :disabled="searchParams.passengers.women === 0"
                      :class="searchParams.passengers.women === 0 ? 'opacity-50 cursor-not-allowed' : ''"
                    >
                      −
                    </button>
                    <span class="w-8 text-center font-bold text-gray-900">
                      {{ toPersianDigits(searchParams.passengers.women.toString()) }}
                    </span>
                    <button
                      type="button"
                      @click="adjustPassengerCount('women', 1)"
                      class="w-8 h-8 rounded-md bg-primary text-white hover:bg-teal-600 transition flex items-center justify-center font-bold shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl bg-white hover:border-primary/50 transition">
                  <span class="hidden sm:inline text-gray-900 text-sm font-bold">کودک پسر زیر ۱۲ سال</span>
                  <span class="sm:hidden text-gray-900 text-sm font-bold">پسر تا ۱۲ سال</span>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="adjustPassengerCount('boys', -1)"
                      class="w-8 h-8 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center justify-center font-bold"
                      :disabled="searchParams.passengers.boys === 0"
                      :class="searchParams.passengers.boys === 0 ? 'opacity-50 cursor-not-allowed' : ''"
                    >
                      −
                    </button>
                    <span class="w-8 text-center font-bold text-gray-900">
                      {{ toPersianDigits(searchParams.passengers.boys.toString()) }}
                    </span>
                    <button
                      type="button"
                      @click="adjustPassengerCount('boys', 1)"
                      class="w-8 h-8 rounded-md bg-primary text-white hover:bg-teal-600 transition flex items-center justify-center font-bold shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl bg-white hover:border-primary/50 transition">
                  <span class="hidden sm:inline text-gray-900 text-sm font-bold">کودک دختر زیر ۱۲ سال</span>
                  <span class="sm:hidden text-gray-900 text-sm font-bold">دختر تا ۱۲ سال</span>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="adjustPassengerCount('girls', -1)"
                      class="w-8 h-8 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center justify-center font-bold"
                      :disabled="searchParams.passengers.girls === 0"
                      :class="searchParams.passengers.girls === 0 ? 'opacity-50 cursor-not-allowed' : ''"
                    >
                      −
                    </button>
                    <span class="w-8 text-center font-bold text-gray-900">
                      {{ toPersianDigits(searchParams.passengers.girls.toString()) }}
                    </span>
                    <button
                      type="button"
                      @click="adjustPassengerCount('girls', 1)"
                      class="w-8 h-8 rounded-md bg-primary text-white hover:bg-teal-600 transition flex items-center justify-center font-bold shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl bg-white hover:border-primary/50 transition">
                  <span class="text-gray-900 text-sm font-bold">نوزاد</span>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="adjustPassengerCount('infants', -1)"
                      class="w-8 h-8 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center justify-center font-bold"
                      :disabled="searchParams.passengers.infants === 0"
                      :class="searchParams.passengers.infants === 0 ? 'opacity-50 cursor-not-allowed' : ''"
                    >
                      −
                    </button>
                    <span class="w-8 text-center font-bold text-gray-900">
                      {{ toPersianDigits(searchParams.passengers.infants.toString()) }}
                    </span>
                    <button
                      type="button"
                      @click="adjustPassengerCount('infants', 1)"
                      class="w-8 h-8 rounded-md bg-primary text-white hover:bg-teal-600 transition flex items-center justify-center font-bold shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Coach capacity warning (normal mode — visible for all search modes) -->
            <div v-if="coachWarningText.length > 0" class="mt-3 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <div class="text-xs text-red-700 leading-relaxed">
                <span class="font-bold block mb-1">⚠️ توجه:</span>
                <ul class="list-disc list-inside space-y-1">
                  <li v-for="(w, wi) in coachWarningText" :key="wi">{{ w }}</li>
                </ul>
              </div>
            </div>

            <!-- تنظیمات هوشمند پیشفروش (فقط در حالت پیشفروش) -->
            <div v-if="searchMode === 'presale'" class="space-y-4">
              <div class="bg-[#fff3eb] border-2 border-[#ffbe99] rounded-2xl p-4">
                <h3 class="font-bold text-[#c84814] text-base mb-3">۱. انتخاب نوع واگن مورد نظر :</h3>
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <label
                    v-for="coach in coachTypeOptions"
                    :key="coach.id"
                    class="relative flex items-center gap-2 p-2.5 border-2 rounded-xl cursor-pointer transition font-bold text-xs sm:text-sm"
                    :class="isCoachDisabled(coach.id)
                      ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-100'
                      : presaleCoachTypes.includes(coach.id) ? 'bg-teal-50 border-primary text-primary shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:border-primary/40'"
                    :title="isCoachDisabled(coach.id) ? 'ظرفیت این کوپه کمتر از تعداد مسافران شماست' : ''"
                  >
                    <input
                      type="checkbox"
                      :value="coach.id"
                      v-model="presaleCoachTypes"
                      class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2 cursor-pointer transition-colors shadow-[0_0_0_2px_rgba(255,255,255,1)]"
                      :disabled="isCoachDisabled(coach.id)"
                    >
                    <span>{{ coach.label }}</span>
                    <span
                      v-if="isCoachDisabled(coach.id)"
                      class="absolute -top-2 -left-2 bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-red-200"
                      title="ظرفیت کوپه کم: حداکثر {{ coach.capacity === Infinity ? 'نامحدود' : toPersianDigits(String(coach.capacity)) }} نفر — برای درخواست این کوپه، دو بار درخواست ثبت شود"
                    >
                      ظرفیت کوپه کم
                    </span>
                  </label>
                </div>

                <!-- Coach capacity warning -->
                <div v-if="coachWarningText.length > 0" class="mt-3 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2.5">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  <div class="text-xs text-red-700 leading-relaxed">
                    <span class="font-bold block mb-1">⚠️ توجه:</span>
                    <ul class="list-disc list-inside space-y-1">
                      <li v-for="(w, wi) in coachWarningText" :key="wi">{{ w }}</li>
                    </ul>
                  </div>
                </div>

                <h3 class="font-bold text-[#c84814] text-base mt-5 mb-3">۲. انتخاب بازه زمانی حرکت قطار:</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    v-for="tr in timeRangeOptions"
                    :key="tr.value"
                    @click="presaleTimeRange = tr.value"
                    class="p-2 sm:p-2.5 rounded-xl border-2 transition flex flex-col text-right justify-center"
                    :class="presaleTimeRange === tr.value ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:border-primary/40'"
                  >
                    <span class="font-bold text-sm leading-none">{{ tr.labelTitle }}</span>
                    <span class="font-medium text-[10px] sm:text-xs opacity-80 mt-1.5 leading-none" dir="ltr">{{ toPersianDigits(tr.labelDesc) }}</span>
                  </button>
                </div>

                <div class="mt-4 bg-white/80 border border-[#ffbe99] rounded-xl p-3 text-xs sm:text-sm text-[#c84814] leading-relaxed">
                  💡 <strong>توجه مهم:</strong> در صورتی که توسط شرکت ریلی در بازه ساعتی انتخابی شما قطاری تعریف نشده باشد، ربات جهت نسوختن درخواست شما، هر ساعتی که در آن روز موجود باشد را خریداری میکند.
                </div>
              </div>
            </div>

            <!-- تنظیمات جستجو Section -->
            <div v-if="searchMode !== 'presale'">
              <div class="bg-primary text-white rounded-xl p-1 mb-2 shadow-sm">
                <div class="px-3 py-2">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="font-bold">تنظیمات جستجو</span>
                  </div>
                </div>
              </div>

              <div class="bg-white border-2 border-gray-200 rounded-xl p-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
                <label
                  class="flex flex-col items-center justify-center p-2 border-2 rounded-xl cursor-pointer transition h-[60px]"
                  :class="searchParams.compartmentType === 'regular' ? 'border-primary bg-teal-50 shadow-sm' : 'border-gray-100 hover:border-primary/50 bg-gray-50'"
                >
                  <input type="radio" v-model="searchParams.compartmentType" value="regular" class="hidden">
                  <span class="text-sm font-bold text-center leading-tight mt-1" :class="searchParams.compartmentType === 'regular' ? 'text-primary' : 'text-gray-700'">عادی</span>
                </label>

                <label
                  class="flex flex-col items-center justify-center p-2 border-2 rounded-xl cursor-pointer transition h-[60px]"
                  :class="searchParams.compartmentType === 'private' ? 'border-primary bg-teal-50 shadow-sm' : 'border-gray-100 hover:border-primary/50 bg-gray-50'"
                >
                  <input type="radio" v-model="searchParams.compartmentType" value="private" class="hidden">
                  <span class="text-sm font-bold text-center leading-tight mt-1" :class="searchParams.compartmentType === 'private' ? 'text-primary' : 'text-gray-700'">دربست</span>
                </label>

                <label
                  class="flex flex-col items-center justify-center p-2 border-2 rounded-xl cursor-pointer transition h-[60px]"
                  :class="[(searchParams.passengers.men > 0 || searchParams.passengers.boys > 0) ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-100' : searchParams.compartmentType === 'sisters' ? 'border-primary bg-teal-50 shadow-sm' : 'border-gray-100 hover:border-primary/50 bg-gray-50']"
                  @click="onCoupeClick('sisters')"
                >
                  <input type="radio" v-model="searchParams.compartmentType" value="sisters" class="hidden" :disabled="searchParams.passengers.men > 0 || searchParams.passengers.boys > 0">
                  <span class="text-sm font-bold text-center leading-tight mt-1" :class="searchParams.compartmentType === 'sisters' ? 'text-primary' : 'text-gray-700'">خواهران</span>
                </label>

                <label
                  class="flex flex-col items-center justify-center p-2 border-2 rounded-xl cursor-pointer transition h-[60px]"
                  :class="[(searchParams.passengers.women > 0 || searchParams.passengers.girls > 0) ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-100' : searchParams.compartmentType === 'brothers' ? 'border-primary bg-teal-50 shadow-sm' : 'border-gray-100 hover:border-primary/50 bg-gray-50']"
                  @click="onCoupeClick('brothers')"
                >
                  <input type="radio" v-model="searchParams.compartmentType" value="brothers" class="hidden" :disabled="searchParams.passengers.women > 0 || searchParams.passengers.girls > 0">
                  <span class="text-sm font-bold text-center leading-tight mt-1" :class="searchParams.compartmentType === 'brothers' ? 'text-primary' : 'text-gray-700'">برادران</span>
                </label>

                <label
                  class="flex flex-col items-center justify-center p-2 border-2 rounded-xl cursor-pointer transition h-[60px]"
                  :class="searchParams.compartmentType === 'scattered' ? 'border-primary bg-teal-50 shadow-sm' : 'border-gray-100 hover:border-primary/50 bg-gray-50'"
                >
                  <input type="radio" v-model="searchParams.compartmentType" value="scattered" class="hidden">
                  <span class="text-sm font-bold text-center leading-tight mt-1" :class="searchParams.compartmentType === 'scattered' ? 'text-primary' : 'text-gray-700'">پراکنده</span>
                </label>
              </div>

              <!-- Compartment gender-mismatch warning -->
              <div v-if="coupeGenderWarning" class="mt-3 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <p class="text-xs text-red-700 leading-relaxed flex-1">
                  <span class="font-bold block mb-1">⚠️ {{ coupeGenderWarning.title }}:</span>
                  {{ coupeGenderWarning.message }}
                </p>
                <button
                  @click="coupeWarningShown = null"
                  class="p-1 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-100 transition flex-shrink-0"
                  aria-label="بستن هشدار"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- Infant free-ticket notice -->
              <div v-if="searchParams.passengers.infants > 0" class="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-xs text-blue-700 leading-relaxed">
                  <span class="font-bold block mb-1">👶 نکته نوزاد:</span>
                  نوزاد زیر دو سال نیاز به تهیه بلیط ندارد و بدون صندلی همراه شما سفر میکند.
                </p>
              </div>
            </div>
          </div>

          <!-- Multi-origin warning -->
          <div 
            v-if="searchParams.originsMode === 'multiple' && searchParams.origins.length > 1"
            class="bg-amber-50 border border-amber-200 rounded-xl p-4"
          >
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <div>
                <p class="font-bold text-amber-800">هشدار: چند مبدأ انتخاب شده</p>
                <p class="text-amber-700 mt-1 text-sm">
                  هزینه خدمات برای هر مبدأ اضافی 
                  <span class="font-bold">{{ formatPrice(pricingInfo?.extraRouteFeeRegular || 6000) }}</span>
                  تومان به ازای هر مسافر افزایش می‌یابد.
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-2">
            <button
              type="submit"
              :disabled="searchParams.origins.length === 0 || (searchParams.destinationMode === 'single' ? !searchParams.destination : searchParams.destinations.length === 0) || getTotalPassengers() === 0"
              class="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              جستجوی قطار
            </button>
          </div>
        </form>
      </div>

    </div>

    <!-- Origin Modal -->
    <Transition name="modal-slide">
      <div v-if="originModalOpen" class="fixed inset-0 z-50 flex items-end md:items-center justify-center transition-opacity" @click.self="originModalOpen = false">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="originModalOpen = false"></div>
        <div class="bg-white w-full md:w-[480px] rounded-t-3xl md:rounded-2xl h-[85vh] md:h-auto md:max-h-[80vh] flex flex-col z-10 shadow-2xl relative">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-3xl md:rounded-t-2xl shrink-0">
            <h3 class="font-bold text-lg text-gray-800">انتخاب مبدا</h3>
            <button @click="originModalOpen = false" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Search Bar -->
          <div class="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <div class="relative">
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref="originInputRef"
                type="text"
                v-model="originSearchTerm"
                placeholder="جستجوی نام شهر یا ایستگاه..."
                class="w-full pr-10 pl-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-gray-900"
              >
            </div>
          </div>
          
          <!-- List -->
          <div class="overflow-y-auto flex-1 p-2 bg-white">
            <ul class="space-y-1 pb-safe">
              <li
                v-for="city in filteredOrigins"
                :key="city.id"
                @click="selectOrigin(city.id)"
                class="px-4 py-3 hover:bg-teal-50 cursor-pointer rounded-xl flex items-center justify-between transition-colors m-1"
                :class="searchParams.origins.includes(city.id) ? 'bg-teal-50 border border-teal-100' : 'border border-transparent'"
              >
                <div class="flex items-center gap-3">
                   <svg v-if="searchParams.origins.includes(city.id)" class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                   <MapPinIcon v-else-if="!city.isHub" class="w-5 h-5 text-gray-400" />
                   <svg v-else class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.88 16.19 7 11.88 7 9z" />
                      <circle cx="12" cy="9" r="2.5" />
                   </svg>
                   <span class="font-bold text-gray-700" :class="searchParams.origins.includes(city.id) ? 'text-primary' : ''">{{ city.name }}</span>
                </div>
                <span v-if="city.isHub" class="text-[10px] bg-primary/10 text-primary font-bold px-2 py-1 rounded-md">پرتردد</span>
              </li>
              <li v-if="filteredOrigins.length === 0" class="px-4 py-8 text-center text-gray-500 flex flex-col items-center">
                <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                شهری با این نام یافت نشد
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Destination Modal -->
    <Transition name="modal-slide">
      <div v-if="destModalOpen" class="fixed inset-0 z-50 flex items-end md:items-center justify-center transition-opacity" @click.self="destModalOpen = false">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="destModalOpen = false"></div>
        <div class="bg-white w-full md:w-[480px] rounded-t-3xl md:rounded-2xl h-[85vh] md:h-auto md:max-h-[80vh] flex flex-col z-10 shadow-2xl relative">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-3xl md:rounded-t-2xl shrink-0">
            <h3 class="font-bold text-lg text-gray-800">انتخاب مقصد</h3>
            <button @click="destModalOpen = false" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Search Bar -->
          <div class="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <div class="relative">
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref="destInputRef"
                type="text"
                v-model="destSearchTerm"
                placeholder="جستجوی نام شهر یا ایستگاه..."
                class="w-full pr-10 pl-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-gray-900"
              >
            </div>
          </div>
          
          <!-- List -->
          <div class="overflow-y-auto flex-1 p-2 bg-white">
            <ul class="space-y-1 pb-safe">
              <li
                v-for="city in filteredDests"
                :key="city.id"
                @click="selectDest(city.id)"
                class="px-4 py-3 hover:bg-teal-50 cursor-pointer rounded-xl flex items-center justify-between transition-colors m-1"
                :class="(searchParams.destinationMode === 'single' ? searchParams.destination === city.id : searchParams.destinations.includes(city.id)) ? 'bg-teal-50 border border-teal-100' : 'border border-transparent'"
              >
                <div class="flex items-center gap-3">
                   <svg v-if="searchParams.destinationMode === 'single' ? searchParams.destination === city.id : searchParams.destinations.includes(city.id)" class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                   <MapPinIcon v-else-if="!city.isHub" class="w-5 h-5 text-gray-400" />
                   <svg v-else class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.88 16.19 7 11.88 7 9z" />
                      <circle cx="12" cy="9" r="2.5" />
                   </svg>
                   <span class="font-bold text-gray-700" :class="(searchParams.destinationMode === 'single' ? searchParams.destination === city.id : searchParams.destinations.includes(city.id)) ? 'text-primary' : ''">{{ city.name }}</span>
                </div>
                <span v-if="city.isHub" class="text-[10px] bg-primary/10 text-primary font-bold px-2 py-1 rounded-md">پرتردد</span>
              </li>
              <li v-if="filteredDests.length === 0" class="px-4 py-8 text-center text-gray-500 flex flex-col items-center">
                <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                شهری با این نام یافت نشد
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon, MapPinIcon } from '@heroicons/vue/24/solid'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import CustomDatePicker from '~/components/ui/CustomDatePicker.vue'
import { useSearch, cities, type City } from '~/stores/search'

const { formatPrice, toPersianDigits } = usePersianNumber()
const searchStore = useSearch()

const searchMode = ref<'normal'|'presale'>('normal')

const searchParams = ref({
  origins: [1] as number[],
  destination: 191 as number | string,
  destinations: [] as number[],
  originsMode: 'single' as 'single' | 'multiple',
  destinationMode: 'single' as 'single' | 'multiple',
  date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  passengers: {
    men: 0,
    women: 0,
    boys: 0,
    girls: 0,
    infants: 0
  },
  compartmentType: 'scattered' as 'regular' | 'private' | 'scattered' | 'sisters' | 'brothers'
})

const singleOrigin = ref<number | ''>(searchParams.value.originsMode === 'single' && searchParams.value.origins.length > 0 ? (searchParams.value.origins[0] ?? '') : '')

const coachTypeOptions = [
  { id: 1, label: "۴ تخته معمولی", capacity: 4 },
  { id: 2, label: "۶ تخته", capacity: 6 },
  { id: 3, label: "اتوبوسی", capacity: Infinity },
  { id: 4, label: "پردیس (سریع)", capacity: Infinity },
  { id: 5, label: "۵ ستاره", capacity: 4 }
]

// Total passengers (excluding infants — they don't need a seat)
const totalSittingPassengers = computed(() => {
  const p = searchParams.value.passengers
  return (p.men || 0) + (p.women || 0) + (p.boys || 0) + (p.girls || 0)
})

// Coach types whose capacity is smaller than the passenger count → disabled
const lowCapacityCoachIds = computed<Set<number>>(() => {
  const total = totalSittingPassengers.value
  if (total <= 4) return new Set()
  const limited = coachTypeOptions
    .filter(c => c.capacity < total)
    .map(c => c.id)
  return new Set(limited)
})

const isCoachDisabled = (coachId: number): boolean => {
  return lowCapacityCoachIds.value.has(coachId)
}

const coachWarningText = computed(() => {
  const total = totalSittingPassengers.value
  const warnings: string[] = []
  if (total > 4) {
    warnings.push('کوپه ۴ نفره قابل رزرو نیست؛ برای درخواست کوپه ۴ نفره دو بار درخواست ثبت شود.')
  }
  if (total > 6) {
    warnings.push('کوپه ۶ نفره قابل رزرو نیست؛ برای درخواست کوپه ۶ نفره دو بار درخواست ثبت شود.')
  }
  return warnings
})

const timeRangeOptions = [
  { value: "00:00-24:00", labelTitle: "تمام ساعات", labelDesc: "شبانهروز" },
  { value: "06:00-12:00", labelTitle: "صبح", labelDesc: "۰۶:۰۰ تا ۱۲:۰۰" },
  { value: "12:00-18:00", labelTitle: "بعدازظهر", labelDesc: "۱۲:۰۰ تا ۱۸:۰۰" },
  { value: "18:00-24:00", labelTitle: "شب", labelDesc: "۱۸:۰۰ تا ۲۴:۰۰" }
]

const presaleCoachTypes = ref([1, 2, 3, 4, 5])
const presaleTimeRange = ref("00:00-24:00")
const countdownText = ref("")
let timerInterval: any = null

const updateCountdown = () => {
  const active = searchStore.activePresale.value
  if (!active || !active.executionTime?.startMs) {
    countdownText.value = ""
    return
  }
  const diff = active.executionTime.startMs - Date.now()
  if (diff <= 0) {
    countdownText.value = "پیشفروش آغاز شده است"
    return
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  let txt = hours.toString() + " ساعت و " + minutes.toString() + " دقیقه و " + seconds.toString() + " ثانیه"
  if (days > 0) {
    txt = days.toString() + " روز و " + txt
  }
  countdownText.value = toPersianDigits(txt)
}

onMounted(async () => {
  await searchStore.fetchStations()
  await searchStore.fetchPricing()
  await searchStore.fetchActivePresale()
  updateCountdown()
  timerInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const pricingInfo = computed(() => {
  return searchStore.pricingData.value?.serviceFee || null
})

const getCityName = (id: number | string) => {
  if (!id) return ''
  const city = cities.find(c => c.id === Number(id))
  return city ? city.name : ''
}

// Autocomplete state for Origins
const originSearchTerm = ref('')
const originModalOpen = ref(false)
const originInputRef = ref<HTMLInputElement | null>(null)

const openOriginModal = () => {
  originSearchTerm.value = '' // clear search on open
  originModalOpen.value = true
}

const filteredOrigins = computed(() => {
  let list = cities
  if (originSearchTerm.value) {
    list = list.filter(c => c.name.includes(originSearchTerm.value))
  }
  // Sort by isHub (true first)
  return list.sort((a, b) => (b.isHub === a.isHub) ? 0 : b.isHub ? 1 : -1)
})

const selectOrigin = (id: number) => {
  if (searchParams.value.originsMode === 'single') {
    singleOrigin.value = id
    searchParams.value.origins = [id]
    originSearchTerm.value = getCityName(id)
    originModalOpen.value = false
  } else {
    if (searchParams.value.origins.includes(id)) {
      searchParams.value.origins = searchParams.value.origins.filter(x => x !== id)
    } else {
      searchParams.value.origins.push(id)
    }
  }
}

// Initialize searchTerm if value already exists
watch(() => singleOrigin.value, (newVal) => {
  if (newVal) originSearchTerm.value = getCityName(newVal)
}, { immediate: true })

// Autocomplete state for Destinations  
const destSearchTerm = ref('')
const destModalOpen = ref(false)
const destInputRef = ref<HTMLInputElement | null>(null)

const openDestModal = () => {
  destSearchTerm.value = '' // clear search on open
  destModalOpen.value = true
}

const filteredDests = computed(() => {
  let list = availableDestinations.value
  if (destSearchTerm.value) {
    list = list.filter(c => c.name.includes(destSearchTerm.value))
  }
  return list.sort((a, b) => (b.isHub === a.isHub) ? 0 : b.isHub ? 1 : -1)
})

const selectDest = (id: number) => {
  if (searchParams.value.destinationMode === 'single') {
    searchParams.value.destination = id
    destSearchTerm.value = getCityName(id)
    destModalOpen.value = false
  } else {
    if (searchParams.value.destinations.includes(id)) {
      searchParams.value.destinations = searchParams.value.destinations.filter(x => x !== id)
    } else {
      searchParams.value.destinations.push(id)
    }
  }
}

watch(() => searchParams.value.destination, (newVal) => {
  if (newVal) destSearchTerm.value = getCityName(newVal)
}, { immediate: true })

const availableDestinations = computed(() => {
  return cities.filter(city => !searchParams.value.origins.includes(city.id))
})

const handleSingleOriginChange = () => {
  if (singleOrigin.value) {
    searchParams.value.origins = [Number(singleOrigin.value)]
  } else {
    searchParams.value.origins = []
  }
}

const adjustPassengerCount = (type: 'men' | 'women' | 'boys' | 'girls' | 'infants', delta: number) => {
  const currentValue = searchParams.value.passengers[type]
  const newValue = currentValue + delta

  if (newValue >= 0 && newValue <= 9) {
    searchParams.value.passengers[type] = newValue
  }
}

const getTotalPassengers = () => {
  const p = searchParams.value.passengers
  return p.men + p.women + p.boys + p.girls + p.infants
}

watch(() => searchParams.value.origins, (newOrigins) => {
  if (searchParams.value.originsMode === 'single' && newOrigins.length > 0) {
    singleOrigin.value = newOrigins[0] ?? ''
  }
  if (searchParams.value.destination && newOrigins.includes(Number(searchParams.value.destination))) {
    searchParams.value.destination = ''
  }
}, { deep: true })

watch(() => searchParams.value.originsMode, (newMode) => {
  if (newMode === 'single' && searchParams.value.origins.length > 1) {
    const firstOrigin = searchParams.value.origins[0]
    if (firstOrigin !== undefined) {
      searchParams.value.origins = [firstOrigin]
      singleOrigin.value = firstOrigin
    }
  } else if (newMode === 'multiple' && singleOrigin.value) {
    singleOrigin.value = ''
  }
})

watch(() => searchParams.value.destinationMode, (newMode) => {
  if (newMode === 'single' && searchParams.value.destinations.length > 0) {
    const firstDestination = searchParams.value.destinations[0]
    if (firstDestination !== undefined) {
      searchParams.value.destination = firstDestination
      searchParams.value.destinations = []
    }
  } else if (newMode === 'multiple' && searchParams.value.destination) {
    searchParams.value.destinations = [Number(searchParams.value.destination)]
    searchParams.value.destination = ''
  }
})

watch(() => searchParams.value.destination, (newDestination) => {
  if (newDestination && searchParams.value.origins.includes(Number(newDestination))) {
    searchParams.value.origins = searchParams.value.origins.filter(id => id !== Number(newDestination))
  }
})

watch(() => searchParams.value.destinations, (newDestinations) => {
  // Remove any destinations that are also selected as origins
  const conflictingDestinations = newDestinations.filter(id => searchParams.value.origins.includes(id))
  if (conflictingDestinations.length > 0) {
    searchParams.value.origins = searchParams.value.origins.filter(id => !conflictingDestinations.includes(id))
  }
}, { deep: true })

watch(() => searchParams.value.passengers, (newP) => {
  const hasMale = newP.men > 0 || newP.boys > 0;
  const hasFemale = newP.women > 0 || newP.girls > 0;
  if (hasMale && searchParams.value.compartmentType === 'sisters') {
    searchParams.value.compartmentType = 'regular';
  }
  if (hasFemale && searchParams.value.compartmentType === 'brothers') {
    searchParams.value.compartmentType = 'regular';
  }
}, { deep: true })

// Gender-mismatch warning card for compartment selection
const coupeWarningShown = ref<'sisters' | 'brothers' | null>(null)

const onCoupeClick = (coupe: 'sisters' | 'brothers') => {
  const p = searchParams.value.passengers
  const hasMale = (p.men || 0) > 0 || (p.boys || 0) > 0
  const hasFemale = (p.women || 0) > 0 || (p.girls || 0) > 0

  // Block invalid selection and show warning card
  if (coupe === 'sisters' && hasMale) {
    coupeWarningShown.value = 'sisters'
    return
  }
  if (coupe === 'brothers' && hasFemale) {
    coupeWarningShown.value = 'brothers'
    return
  }
  // Valid — proceed with the radio v-model (and clear any warning)
  coupeWarningShown.value = null
}

const coupeGenderWarning = computed(() => {
  if (coupeWarningShown.value === 'sisters') {
    return {
      title: 'انتخاب نامعتبر',
      message: 'کوپه خواهران مخصوص خانم یا کودک دختر است. شما مسافر مرد یا کودک پسر دارید — لطفاً کوپه عادی، برادران یا دربست را انتخاب کنید.'
    }
  }
  if (coupeWarningShown.value === 'brothers') {
    return {
      title: 'انتخاب نامعتبر',
      message: 'کوپه برادران مخصوص آقایان یا کودک پسر است. شما مسافر خانم یا کودک دختر دارید — لطفاً کوپه عادی، خواهران یا دربست را انتخاب کنید.'
    }
  }
  return null
})

// Clear the coupe warning when passenger composition changes (e.g. male removed)
watch(() => searchParams.value.passengers, () => {
  const p = searchParams.value.passengers
  const hasMale = (p.men || 0) > 0 || (p.boys || 0) > 0
  const hasFemale = (p.women || 0) > 0 || (p.girls || 0) > 0
  if ((!hasMale && coupeWarningShown.value === 'sisters') || (!hasFemale && coupeWarningShown.value === 'brothers')) {
    coupeWarningShown.value = null
  }
}, { deep: true })

const handleSearch = () => {
  const searchStore = useSearch()

  // Parse multiple dates (comma-separated from DatePicker)
  const dates = (searchParams.value.date || '')
    .split(',')
    .map(d => d.trim())
    .filter(d => d.length > 0)
  
  // Compute all route combinations
  let routeDestinations: number[] = []
  if (searchParams.value.destinationMode === 'single' && searchParams.value.destination) {
    routeDestinations = [Number(searchParams.value.destination)]
  } else if (searchParams.value.destinationMode === 'multiple') {
    routeDestinations = searchParams.value.destinations
  }
  
  const routes = searchParams.value.origins.flatMap(fromId =>
    routeDestinations.map(toId => ({
      from: fromId,
      to: toId,
      fromName: getCityName(fromId),
      toName: getCityName(toId)
    }))
  )

  const paramsToSave = {
    origins: searchParams.value.origins,
    destination: searchParams.value.destination ? Number(searchParams.value.destination) : 0,
    destinations: searchParams.value.destinations,
    originsMode: searchParams.value.originsMode,
    destinationMode: searchParams.value.destinationMode,
    date: searchParams.value.date as string,
    dates,
    routes,
    passengers: searchParams.value.passengers as { men: number; women: number; boys: number; girls: number; infants: number },
    selectedTrainIds: [] as string[],
    compartmentType: searchParams.value.compartmentType,
    isPresale: searchMode.value === 'presale',
    exclusiveCoupe: searchParams.value.compartmentType === 'private',
    presaleFilters: searchMode.value === 'presale' ? {
      coachTypes: presaleCoachTypes.value,
      departureTimeStart: presaleTimeRange.value.split('-')[0],
      departureTimeEnd: presaleTimeRange.value.split('-')[1]
    } : undefined
  }
  searchStore.setParams(paramsToSave)

  // Build query params for refreshable URL
  const query: Record<string, string> = {
    origins: searchParams.value.origins.join(','),
    destinations: (searchParams.value.destinationMode === 'single'
      ? [searchParams.value.destination || 0]
      : searchParams.value.destinations).join(','),
    dates: dates.join(','),
    sm: searchMode.value,
    p: `${searchParams.value.passengers.men}-${searchParams.value.passengers.women}-${searchParams.value.passengers.boys}-${searchParams.value.passengers.girls}-${searchParams.value.passengers.infants}`,
    om: searchParams.value.originsMode,
    dm: searchParams.value.destinationMode,
    ct: searchParams.value.compartmentType
  }
  navigateTo({ path: '/train-results', query })
}
</script>

<style scoped>
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
@media (min-width: 768px) {
  .modal-slide-enter-from,
  .modal-slide-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
}
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
