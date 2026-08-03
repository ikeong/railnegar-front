<template>
  <div class="train-results-page min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header & Date Navigation -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
            نتایج جستجو
          </h1>
          <!-- Toggle All Button (multi-date only) -->
          <button
            v-if="searchParams.dates && searchParams.dates.length > 1"
            @click="toggleAllDates"
            class="p-2 text-gray-400 hover:text-primary transition hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-1"
            :title="areAllClosed ? 'باز کردن همه' : 'بستن همه'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <!-- Left arrow when all closed (expand all), Up arrow when any open (collapse all) -->
              <path v-if="areAllClosed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5l-7 7 7 7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <!-- Date Navigation for Single Date Mode -->
        <div v-if="searchParams.dates && searchParams.dates.length === 1" class="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
          <button @click="changeDate(-1)" class="p-2 text-gray-600 hover:text-primary transition hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-1" title="روز قبل">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            <span class="text-xs font-bold md:hidden">روز قبل</span>
          </button>
          
          <div class="px-4 py-1.5 flex flex-col items-center justify-center min-w-[140px]">
            <span class="font-bold text-sm text-primary">{{ getSinglePersianDateDisplay().persianDate }}</span>
            <span class="text-[10px] text-gray-500">{{ getSinglePersianDateDisplay().dayOfWeek }}</span>
          </div>

          <button @click="changeDate(1)" class="p-2 text-gray-600 hover:text-primary transition hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-1" title="روز بعد">
            <span class="text-xs font-bold md:hidden">روز بعد</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
        </div>

        <NuxtLink 
          to="/train" 
          class="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition"
        >
          <ArrowRightIcon class="w-5 h-5" />
          تغییر جستجو
        </NuxtLink>
      </div>

      <!-- Passenger-count / coach-capacity warning banner -->
      <div v-if="coachCapacityBanner && coachCapacityBanner.length > 0" class="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
        <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <div class="text-xs sm:text-sm text-red-700 leading-relaxed">
          <span class="font-bold block mb-1">⚠️ توجه: برای {{ toPersianDigits(String(passengerCount)) }} مسافر</span>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(w, wi) in coachCapacityBanner" :key="wi">{{ w }}</li>
          </ul>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-600 mb-2">در حال جستجوی قطارها...</p>
        <p class="text-sm text-gray-500">{{ progressText }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 font-bold mb-2">خطا</p>
        <p class="text-gray-600">{{ error }}</p>
        <button @click="fetchAllResults" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-teal-600 transition">
          تلاش مجدد
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="groupedResults.length === 0" class="text-center py-12">
        <p class="text-gray-600">هیچ قطاری برای این مسیرها یافت نشد</p>
      </div>

      <!-- Grouped Results -->
      <div v-else class="space-y-8">
        <div v-for="(dateGroup, idx) in groupedResults" :key="idx" class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm">
          <!-- Date Header -->
          <div 
            class="bg-primary text-white px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-teal-600 transition"
            @click="dateGroup.expanded = !dateGroup.expanded"
          >
            <div class="flex items-center gap-3">
              <svg 
                class="w-5 h-5 transition-transform duration-200" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <!-- Left arrow in RTL when closed, rotate-90 for down arrow when expanded -->
                <path v-if="dateGroup.expanded" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 9l7 7 7-7" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5l-7 7 7 7" />
              </svg>
              <div>
                <span class="font-bold text-lg">{{ dateGroup.persianDate }}</span>
                <span class="text-sm opacity-80 mr-2">{{ dateGroup.dayOfWeek }}</span>
              </div>
            </div>
            <div class="text-sm opacity-90">
              {{ toPersianDigits(dateGroup.totalTrains.toString()) }} قطار در
              {{ toPersianDigits(dateGroup.routes.length.toString()) }} مسیر
            </div>
          </div>

          <!-- Date Body -->
          <div v-show="dateGroup.expanded" class="divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="(routeGroup, ridx) in dateGroup.routes" :key="ridx" class="p-4 sm:p-6">
              <!-- Route Header -->
              <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div class="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
                  <span class="text-primary">{{ routeGroup.route.fromName }}</span>
                  <svg class="w-5 h-5 text-gray-400 transform scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  <span class="text-primary">{{ routeGroup.route.toName }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    ({{ toPersianDigits(String(getFilteredCount(routeGroup))) }} قطار)
                  </span>
                </div>
                <!-- Toggle Filters Button -->
                <button
                  @click.stop="toggleFilters(routeGroup._key)"
                  class="text-xs text-gray-500 hover:text-primary transition flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>{{ filterState[routeGroup._key]?.showFilters ? 'بستن فیلتر' : 'فیلتر و مرتب‌سازی' }}</span>
                </button>
              </div>

              <!-- Filter / Sort Bar -->
              <div v-if="filterState[routeGroup._key]?.showFilters" class="bg-white dark:bg-gray-700/50 rounded-xl p-4 mb-4 space-y-5 border border-gray-100 dark:border-gray-600">

                <!-- Departure Time Slider -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-gray-600 dark:text-gray-300">زمان حرکت</span>
                    <span class="text-xs text-primary font-bold">
                      {{ toPersianDigits(hourToDisplay(filterState[routeGroup._key].depFrom)) }} تا {{ toPersianDigits(hourToDisplay(filterState[routeGroup._key].depTo)) }}
                    </span>
                  </div>
                  <div class="dual-range-slider relative h-8">
                    <input type="range" min="0" max="23" step="1"
                      v-model.number="filterState[routeGroup._key].depFrom"
                      class="absolute w-full h-2 top-3 appearance-none bg-transparent pointer-events-none z-10"
                      :class="['range-thumb']">
                    <input type="range" min="0" max="23" step="1"
                      v-model.number="filterState[routeGroup._key].depTo"
                      class="absolute w-full h-2 top-3 appearance-none bg-transparent pointer-events-none z-20"
                      :class="['range-thumb']">
                    <div class="absolute top-3 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    <div class="absolute top-3 h-2 bg-primary rounded-full"
                      :style="{ right: (filterState[routeGroup._key].depFrom / 23 * 100) + '%', left: (100 - filterState[routeGroup._key].depTo / 23 * 100) + '%' }">
                    </div>
                  </div>
                  <div class="flex justify-between mt-1 px-0.5">
                    <span v-for="h in [0,6,12,18,23]" :key="h" class="text-[10px] text-gray-400">
                      {{ toPersianDigits(hourToDisplay(h)) }}
                    </span>
                  </div>
                </div>

                <!-- Arrival Time Slider -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-gray-600 dark:text-gray-300">زمان رسیدن</span>
                    <span class="text-xs text-primary font-bold">
                      {{ toPersianDigits(hourToDisplay(filterState[routeGroup._key].arrFrom)) }} تا {{ toPersianDigits(hourToDisplay(filterState[routeGroup._key].arrTo)) }}
                    </span>
                  </div>
                  <div class="dual-range-slider relative h-8">
                    <input type="range" min="0" max="23" step="1"
                      v-model.number="filterState[routeGroup._key].arrFrom"
                      class="absolute w-full h-2 top-3 appearance-none bg-transparent pointer-events-none z-10 range-thumb">
                    <input type="range" min="0" max="23" step="1"
                      v-model.number="filterState[routeGroup._key].arrTo"
                      class="absolute w-full h-2 top-3 appearance-none bg-transparent pointer-events-none z-20 range-thumb">
                    <div class="absolute top-3 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    <div class="absolute top-3 h-2 bg-primary rounded-full"
                      :style="{ right: (filterState[routeGroup._key].arrFrom / 23 * 100) + '%', left: (100 - filterState[routeGroup._key].arrTo / 23 * 100) + '%' }">
                    </div>
                  </div>
                  <div class="flex justify-between mt-1 px-0.5">
                    <span v-for="h in [0,6,12,18,23]" :key="h" class="text-[10px] text-gray-400">
                      {{ toPersianDigits(hourToDisplay(h)) }}
                    </span>
                  </div>
                </div>

                <!-- Price Slider -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-gray-600 dark:text-gray-300">قیمت (تومان)</span>
                    <span class="text-xs text-primary font-bold">
                      {{ formatPrice(filterState[routeGroup._key].priceMin) }} تا {{ formatPrice(filterState[routeGroup._key].priceMax) }}
                    </span>
                  </div>
                  <div class="dual-range-slider relative h-10">
                    <input type="range" :min="0" :max="filterState[routeGroup._key].priceAbsMax" :step="filterState[routeGroup._key].priceStep"
                      v-model.number="filterState[routeGroup._key].priceMin"
                      class="absolute w-full h-2 top-4 appearance-none bg-transparent pointer-events-none z-10 range-thumb">
                    <input type="range" :min="0" :max="filterState[routeGroup._key].priceAbsMax" :step="filterState[routeGroup._key].priceStep"
                      v-model.number="filterState[routeGroup._key].priceMax"
                      class="absolute w-full h-2 top-4 appearance-none bg-transparent pointer-events-none z-20 range-thumb">
                    <div class="absolute top-4 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    <div class="absolute top-4 h-2 bg-primary rounded-full"
                      :style="{ right: (filterState[routeGroup._key].priceMin / (filterState[routeGroup._key].priceAbsMax || 1) * 100) + '%', left: (100 - filterState[routeGroup._key].priceMax / (filterState[routeGroup._key].priceAbsMax || 1) * 100) + '%' }">
                    </div>
                    <!-- Price labels: 6 segments (7 points) in thousand format -->
                    <div class="flex justify-between mt-2 px-0.5">
                      <span v-for="(p, idx) in priceLabels(filterState[routeGroup._key].priceAbsMax || 5000000)" :key="idx"
                        class="text-[11px] text-gray-500 font-semibold">
                        {{ p }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Sort -->
                <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span class="text-xs text-gray-500">مرتب‌سازی:</span>
                  <button v-for="opt in sortOptions" :key="opt.value"
                    @click="setSort(routeGroup._key, opt.value)"
                    class="px-3 py-1.5 text-xs rounded-lg border transition flex items-center gap-1"
                    :class="filterState[routeGroup._key].sortBy === opt.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary'"
                  >
                    {{ opt.label }}
                    <span v-if="filterState[routeGroup._key].sortBy === opt.value">
                      {{ filterState[routeGroup._key].sortDir === 'asc' ? '↑' : '↓' }}
                    </span>
                  </button>
                  <button @click="resetFilters(routeGroup._key)"
                    class="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                  >
                    حذف فیلترها
                  </button>
                </div>
              </div>

              <!-- Select All / Deselect All for this route -->
              <div class="flex items-center justify-between mb-3 mt-1">
                <label class="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition select-none">
                  <input
                    type="checkbox"
                    :checked="isRouteGroupAllSelected(routeGroup)"
                    @change="toggleSelectAllTrains(routeGroup)"
                    class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/20"
                  >
                  <span>انتخاب همه قطارهای این مسیر</span>
                </label>
                <span class="text-xs text-gray-400">
                  {{ selectedCountInGroup(routeGroup) }} از {{ getFilteredTrains(routeGroup).length }} انتخاب
                </span>
              </div>

              <!-- Trains Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="train in getFilteredTrains(routeGroup)"
                  :key="train.selectKey"
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md hover:border-primary/50 transition cursor-pointer relative"
                  :class="train.isDisabled
                    ? 'opacity-50 grayscale pointer-events-none'
                    : selectedTrainIds.includes(train.selectKey) ? 'border-primary bg-teal-50 dark:bg-teal-900/20' : ''"
                  @click="toggleTrain(train.selectKey)"
                >
                  <!-- v2.4.0: disabled badge with reason -->
                  <span
                    v-if="train.isDisabled && train.disabledReason"
                    class="absolute top-3 right-3 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full border border-red-200 flex items-center gap-1 max-w-[70%]"
                  >
                    <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                    {{ train.disabledReason }}
                  </span>
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <!-- Owner Logo -->
                      <div v-if="getOwnerLogo(train.ownerId)" class="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 flex-shrink-0">
                        <img :src="getOwnerLogo(train.ownerId)!" :alt="'logo'"
                          class="w-full h-full object-contain"
                          @error="(e: any) => e.target.style.display='none'">
                      </div>
                      <div v-else class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v1H4a2 2 0 00-2 2v2a2 2 0 002 2h5v2H4a2 2 0 00-2 2v2a2 2 0 002 2h5v2a1 1 0 001 1h4a1 1 0 001-1v-2h5a2 2 0 002-2v-2a2 2 0 00-2-2h-5v-2h5a2 2 0 002-2V6a2 2 0 00-2-2h-5V3a1 1 0 00-1-1h-4a1 1 0 00-1 1z" />
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-bold text-gray-800 dark:text-gray-100">{{ train.name }}</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ train.type || 'قطار' }}</p>
                      </div>
                    </div>
                    <div class="text-left">
                      <!-- v2.5.0: when exclusive coupe selected, show exclusivePricing estimate -->
                      <template v-if="isPrivateMode && train.exclusivePricing?.totalEstimated">
                        <div class="text-lg font-bold text-primary-600" :title="train.exclusivePricing.description || ''">{{ formatPrice(train.exclusivePricing.totalEstimated / 10) }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">برآورد کوپه دربست (تومان)</div>
                      </template>
                      <template v-else>
                        <div class="text-lg font-bold text-primary-600">{{ formatPrice(train.cost || train.price || 0) }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">تومان</div>
                      </template>
                    </div>
                  </div>

                  <!-- Time -->
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">{{ toPersianDigits(train.departureTime || '--:--') }}</span>
                    <span class="text-gray-400">→</span>
                    <span class="text-gray-700 dark:text-gray-300">{{ toPersianDigits(train.arrivalTime || '--:--') }}</span>
                    <span v-if="train.duration" class="text-xs text-gray-500 dark:text-gray-400 mr-1">({{ toPersianDigits(train.duration) }} ساعت)</span>
                  </div>

                  <!-- Checkbox -->
                  <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600" @click.stop>
                    <input
                      type="checkbox"
                      :id="`train-${train.selectKey}`"
                      :value="train.selectKey"
                      v-model="selectedTrainIds"
                      class="w-4 h-4 text-primary-600 rounded"
                      :disabled="train.isDisabled"
                    >
                    <label :for="`train-${train.selectKey}`" class="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                      {{ train.isDisabled ? 'غیرقابل رزرو' : 'انتخاب این قطار' }}
                    </label>
                  </div>
                </div>
              </div>
              <p v-if="getFilteredCount(routeGroup) === 0" class="text-center text-sm text-gray-500 py-4">
                هیچ قطاری با فیلترهای انتخاب شده یافت نشد
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div v-if="selectedTrainIds.length > 0" class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-50">
        <div class="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">
              {{ toPersianDigits(selectedTrainIds.length.toString()) }} قطار انتخاب شده
            </div>
            <div class="text-2xl font-bold text-primary-600">
              {{ formatPrice(calculateTotalPrice()) }} تومان
            </div>
            <div v-if="hasPassengerData" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              ماکزیمم قیمت × {{ toPersianDigits(String(passengerCount)) }} مسافر
            </div>
          </div>
          <button 
            @click="handleNext"
            class="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-teal-600 transition flex items-center gap-2"
          >
            <span>{{ isLoggedIn ? 'ادامه' : 'ورود و ادامه' }}</span>
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import { useApiFetch } from '~/composables/api/useApiFetch'
import { useToast } from '~/composables/useToast'
import { useSearch, type SearchRoute } from '~/stores/search'

const { formatPrice, toPersianDigits, toLatinDigits } = usePersianNumber()
const { showToast } = useToast()

// Owner logo mapping — files are named {ownerId}.png in /public
const ownerLogos: Record<number, string> = {
  1: '/1.png',
  2: '/2.png',
  8: '/8.png',
  15: '/15.png',
  17: '/17.png',
  25: '/25.png',
  31: '/31.png',
}
const getOwnerLogo = (ownerId?: number): string | null => {
  return ownerId ? ownerLogos[ownerId] || null : null
}

const loading = ref(true)
const error = ref('')
const progressText = ref('')
const selectedTrainIds = ref<string[]>([])

// Passenger count from search store
const passengerCount = ref(1)

// Warning banner for coach capacity vs passenger count (results page, simple UX)
const coachCapacityBanner = computed<string[]>(() => {
  const total = Number(passengerCount.value) || 1
  const warnings: string[] = []
  if (total > 4) {
    warnings.push('کوپه ۴ نفره قابل رزرو نیست؛ برای درخواست کوپه ۴ نفره دو بار درخواست ثبت شود.')
  }
  if (total > 6) {
    warnings.push('کوپه ۶ نفره قابل رزرو نیست؛ برای درخواست کوپه ۶ نفره دو بار درخواست ثبت شود.')
  }
  return warnings
})
const passengerDetailsObj = ref<{ men: number; women: number; boys: number; girls: number; infants: number } | null>(null)
const hasPassengerData = ref(false)

// Check if user is logged in (using ref to avoid SSR hydration mismatch)
const isLoggedIn = ref(false)
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('rn-api-key')
})

interface TrainResult {
  id: string | number
  name: string
  type?: string
  cost?: number
  price?: number
  departureTime?: string
  arrivalTime?: string
  duration?: string
  available_seats?: number
  capacity?: number
  [key: string]: any
}

interface RouteGroup {
  route: SearchRoute
  trains: TrainResult[]
  _key: string // unique key for filter state
}

interface DateGroup {
  persianDate: string
  dayOfWeek: string
  routes: RouteGroup[]
  totalTrains: number
  expanded: boolean
}

interface RouteFilterState {
  showFilters: boolean
  depFrom: number  // 0-23 (hour)
  depTo: number    // 0-23 (hour)
  arrFrom: number
  arrTo: number
  priceMin: number
  priceMax: number
  priceAbsMax: number  // max price from actual data (fixed)
  priceStep: number  // computed: maxPrice / 10
  sortBy: 'price' | 'departure' | 'arrival'
  sortDir: 'asc' | 'desc'
}

const groupedResults = ref<DateGroup[]>([])
const filterState = reactive<Record<string, RouteFilterState>>({})

const sortOptions = [
  { value: 'price', label: 'قیمت' },
  { value: 'departure', label: 'زمان حرکت' },
  { value: 'arrival', label: 'زمان رسیدن' },
] as const

// Persian day names
const persianDays = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'
]

// Convert hour number (0-23) to Persian display string like "۰۰:۰۰"
const hourToDisplay = (h: number): string => {
  return String(h).padStart(2, '0') + ':00'
}

// Generate 7 compact price labels in thousand format (e.g. "۱,۵۶۰" = 1,560,000 تومان)
const priceLabels = (absMax: number): string[] => {
  const labels: string[] = []
  for (let i = 0; i < 7; i++) {
    const price = Math.round(i * absMax / 6 / 10000) * 10000
    labels.push(formatPrice(Math.round(price / 1000)))
  }
  return labels
}

// Load search params and fetch
const route = useRoute()
const searchParams = ref<any>({})

// v2.5.0: exclusive-coupe mode from URL ct=private
const isPrivateMode = computed(() => {
  return searchParams.value?.compartmentType === 'private' || route.query.ct === 'private'
})

const getCityName = (id: number | string): string => {
  if (!id) return ''
  const searchStore = useSearch()
  const city = searchStore.cities.find((c: any) => c.id === Number(id))
  return city ? city.name : ''
}

onMounted(async () => {
  const searchStore = useSearch()
  await searchStore.fetchStations()
  const storeParams = searchStore.searchParams.value
  searchParams.value = storeParams

  let dates: string[] = []
  let routes: SearchRoute[] = []
  let loadedFromQuery = false

  // Priority 1: Read from URL query params (refreshable)
  if (route.query.dates) {
    loadedFromQuery = true
    dates = (route.query.dates as string).split(',').filter(Boolean)
    const origins = (route.query.origins as string || '').split(',').map(Number).filter(n => n > 0)
    const destinations = (route.query.destinations as string || '').split(',').map(Number).filter(n => n > 0)

    // Build all route combinations (cartesian product)
    origins.forEach(fromId => {
      destinations.forEach(toId => {
        routes.push({
          from: fromId,
          to: toId,
          fromName: getCityName(fromId),
          toName: getCityName(toId)
        })
      })
    })

    // Read passengers from query (format: men-women-boys-girls-infants or simple number)
    if (route.query.p) {
      const pStr = route.query.p as string
      if (pStr.includes('-')) {
        const parts = pStr.split('-').map(Number)
        passengerCount.value = (parts[0] || 1) + (parts[1] || 0) + (parts[2] || 0) + (parts[3] || 0) + (parts[4] || 0)
        hasPassengerData.value = true
        passengerDetailsObj.value = {
          men: parts[0] || 1,
          women: parts[1] || 0,
          boys: parts[2] || 0,
          girls: parts[3] || 0,
          infants: parts[4] || 0
        }
      } else {
        passengerCount.value = Number(pStr) || 1
        hasPassengerData.value = true
      }
    }

    // Save to store for downstream use (changeDate etc.)
    searchStore.setParams({
      origins,
      destination: destinations[0] || 0,
      destinations,
      date: dates[0] || '',
      dates,
      routes,
      passengers: passengerDetailsObj.value || passengerCount.value,
      selectedTrainIds: [],
      compartmentType: (route.query.ct as string) || 'regular'
    } as any)
    searchParams.value = searchStore.searchParams.value
  }

  // Priority 2: Read from store (legacy direct navigation)
  if (!loadedFromQuery && storeParams.routes && storeParams.routes.length > 0 && storeParams.dates && storeParams.dates.length > 0) {
    dates = storeParams.dates
    routes = storeParams.routes
  } else if (!loadedFromQuery && storeParams.origins.length > 0) {
    dates = [storeParams.date]
    routes = [{
      from: storeParams.origins[0],
      to: storeParams.destination as number || storeParams.destinations[0] || 0,
      fromName: getCityName(storeParams.origins[0]),
      toName: getCityName(storeParams.destination as number || storeParams.destinations[0] || 0)
    }]
  }

  // Read passenger count from store (if not from query)
  if (!loadedFromQuery) {
    const p = storeParams.passengers
    if (typeof p === 'object' && p !== null) {
      const pd = p as { men: number; women: number; boys: number; girls: number; infants: number }
      passengerCount.value = pd.men + pd.women + pd.boys + pd.girls + pd.infants
      hasPassengerData.value = true
    } else if (typeof p === 'number') {
      passengerCount.value = p
      hasPassengerData.value = true
    }
  }

  if (dates.length > 0 && routes.length > 0) {
    await fetchAllResults(dates, routes)
  } else {
    error.value = 'مشخصات جستجو یافت نشد'
    loading.value = false
  }
})

const getStationCode = (name: string): number => {
  const stationMap: Record<string, number> = {
    'تهران': 1, 'مشهد': 191, 'اصفهان': 5, 'قم': 9, 'تبریز': 8,
    'کرمان': 17, 'یزد': 14, 'بندر عباس': 27, 'اهواز': 13, 'شیراز': 15,
    'رشت': 11, 'ساری': 21, 'همدان': 28, 'اراک': 23, 'ارومیه': 10,
    'قزوین': 6, 'ملایر': 16
  }
  return stationMap[name] || 1
}

const convertToShamsi = (gregorianDate: string): string => {
  if (!gregorianDate) return ''
  const latinDate = toLatinDigits(gregorianDate)
  if (/^14\d{6}$/.test(latinDate)) return latinDate
  
  try {
    const date = new Date(gregorianDate)
    if (isNaN(date.getTime())) return gregorianDate
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    })
    const parts = formatter.format(date).split('/')
    return parts.map(p => toLatinDigits(p)).join('')
  } catch {
    return gregorianDate
  }
}

const getPersianDateDisplay = (gregorianDate: string): { persianDate: string; dayOfWeek: string } => {
  try {
    const date = new Date(gregorianDate)
    if (isNaN(date.getTime())) return { persianDate: gregorianDate, dayOfWeek: '' }
    
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
    const persianDate = formatter.format(date)
    
    const gregorianDay = date.getDay()
    const dayIndex = (gregorianDay + 1) % 7
    const dayOfWeek = persianDays[dayIndex] || ''
    
    return { persianDate, dayOfWeek }
  } catch {
    return { persianDate: gregorianDate, dayOfWeek: '' }
  }
}

const getSinglePersianDateDisplay = () => {
  if (searchParams.value.dates && searchParams.value.dates.length > 0) {
    return getPersianDateDisplay(searchParams.value.dates[0])
  }
  return { persianDate: '', dayOfWeek: '' }
}

// Check if all date groups are closed
const areAllClosed = computed(() => {
  return groupedResults.value.length > 0 && groupedResults.value.every(dg => !dg.expanded)
})

// Toggle all date accordions (open if all closed, close if any open)
const toggleAllDates = () => {
  const allClosed = groupedResults.value.every(dg => !dg.expanded)
  groupedResults.value.forEach(dg => {
    dg.expanded = allClosed
  })
}

const changeDate = async (daysDelta: number) => {
  if (searchParams.value.dates && searchParams.value.dates.length === 1) {
    const d = new Date(searchParams.value.dates[0])
    d.setDate(d.getDate() + daysDelta)
    
    // Check if past (not allowed)
    const today = new Date()
    today.setHours(0,0,0,0)
    if (d < today) return
    
    const newDateStr = d.toISOString().split('T')[0]
    searchParams.value.dates[0] = newDateStr
    
    // Update store
    const store = useSearch()
    store.searchParams.value.dates = [newDateStr]
    store.searchParams.value.date = newDateStr
    
    // Re-fetch
    selectedTrainIds.value = []
    if (searchParams.value.routes) {
      await fetchAllResults(searchParams.value.dates, searchParams.value.routes)
    }
    
    // Update URL query for refreshable link
    const currentQuery = { ...route.query }
    currentQuery.dates = newDateStr
    navigateTo({ path: '/train-results', query: currentQuery, replace: true })
  }
}

const initFilterState = (key: string, maxPrice: number = 5000000) => {
  if (!filterState[key]) {
    const step = Math.round(maxPrice / 10 / 10000) * 10000 || 100000
    filterState[key] = {
      showFilters: false,
      depFrom: 0,
      depTo: 23,
      arrFrom: 0,
      arrTo: 23,
      priceMin: 0,
      priceMax: maxPrice,
      priceAbsMax: maxPrice,
      priceStep: step,
      sortBy: 'price',
      sortDir: 'asc'
    }
  }
}

const toggleFilters = (key: string) => {
  initFilterState(key)
  filterState[key].showFilters = !filterState[key].showFilters
}

const setSort = (key: string, sortBy: 'price' | 'departure' | 'arrival') => {
  initFilterState(key)
  const state = filterState[key]
  if (state.sortBy === sortBy) {
    state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc'
  } else {
    state.sortBy = sortBy
    state.sortDir = 'asc'
  }
}

const resetFilters = (key: string) => {
  const st = filterState[key]
  const absMax = st?.priceAbsMax || 5000000
  const step = Math.round(absMax / 10 / 10000) * 10000 || 100000
  filterState[key] = {
    showFilters: true,
    depFrom: 0,
    depTo: 23,
    arrFrom: 0,
    arrTo: 23,
    priceMin: 0,
    priceMax: absMax,
    priceAbsMax: absMax,
    priceStep: step,
    sortBy: 'price',
    sortDir: 'asc'
  }
}

const getFilteredTrains = (routeGroup: RouteGroup): TrainResult[] => {
  const key = routeGroup._key
  const state = filterState[key]
  if (!state) return routeGroup.trains

  let result = [...routeGroup.trains]

  // Helper: convert hour number (0-23) to "HH:00" string
  const hourToStr = (h: number) => String(h).padStart(2, '0') + ':00'

  // Filter by departure time (slider returns hour number)
  result = result.filter(t => {
    const dep = t.departureTime || ''
    return dep >= hourToStr(state.depFrom) && dep <= hourToStr(state.depTo + 1)
  })

  // Filter by arrival time
  result = result.filter(t => {
    const arr = t.arrivalTime || ''
    return arr >= hourToStr(state.arrFrom) && arr <= hourToStr(state.arrTo + 1)
  })

  // Filter by price
  const priceMin = state.priceMin || 0
  const priceMax = state.priceMax || 0
  if (priceMin > 0) {
    result = result.filter(t => (t.cost || t.price || 0) >= priceMin)
  }
  if (priceMax > 0) {
    result = result.filter(t => (t.cost || t.price || 0) <= priceMax)
  }

  // Sort
  if (state.sortBy === 'price') {
    result.sort((a, b) => state.sortDir === 'asc'
      ? (a.cost || a.price || 0) - (b.cost || b.price || 0)
      : (b.cost || b.price || 0) - (a.cost || a.price || 0))
  } else if (state.sortBy === 'departure') {
    result.sort((a, b) => {
      const cmp = (a.departureTime || '').localeCompare(b.departureTime || '')
      return state.sortDir === 'asc' ? cmp : -cmp
    })
  } else if (state.sortBy === 'arrival') {
    result.sort((a, b) => {
      const cmp = (a.arrivalTime || '').localeCompare(b.arrivalTime || '')
      return state.sortDir === 'asc' ? cmp : -cmp
    })
  }

  return result
}

const getFilteredCount = (routeGroup: RouteGroup): number => {
  return getFilteredTrains(routeGroup).length
}

// Select All / Deselect All for a route group
const toggleSelectAllTrains = (routeGroup: RouteGroup) => {
  const filtered = getFilteredTrains(routeGroup)
  const allSelected = filtered.every(t => selectedTrainIds.value.includes(t.selectKey))
  if (allSelected) {
    // Deselect all filtered trains
    const filteredIds = new Set(filtered.map(t => t.selectKey))
    selectedTrainIds.value = selectedTrainIds.value.filter(key => !filteredIds.has(key))
  } else {
    // Select all filtered trains (add missing ones)
    const currentSet = new Set(selectedTrainIds.value)
    filtered.forEach(t => {
      if (!currentSet.has(t.selectKey)) {
        selectedTrainIds.value.push(t.selectKey)
        currentSet.add(t.selectKey)
      }
    })
  }
}

const isRouteGroupAllSelected = (routeGroup: RouteGroup): boolean => {
  const filtered = getFilteredTrains(routeGroup)
  if (filtered.length === 0) return false
  return filtered.every(t => selectedTrainIds.value.includes(t.selectKey))
}

const selectedCountInGroup = (routeGroup: RouteGroup): number => {
  const filtered = getFilteredTrains(routeGroup)
  return filtered.filter(t => selectedTrainIds.value.includes(t.selectKey)).length
}

const fetchAllResults = async (dates: string[], routes: SearchRoute[]) => {
  loading.value = true
  error.value = ''
  groupedResults.value = []

  const combinations: { route: SearchRoute; date: string }[] = []
  for (const route of routes) {
    for (const date of dates) {
      combinations.push({ route, date })
    }
  }

  const total = combinations.length
  let completed = 0
  const resultsMap = new Map<string, Map<string, TrainResult[]>>()

  // Process in batches of 5 (parallel with concurrency limit)
  const batchSize = 5
  for (let i = 0; i < combinations.length; i += batchSize) {
    const batch = combinations.slice(i, i + batchSize)
    
    progressText.value = `در حال جستجو... ${toPersianDigits(String(completed + 1))} از ${toPersianDigits(String(total))}`
    
    const batchResults = await Promise.all(
      batch.map(async (combo) => {
        try {
          const shamsiDate = convertToShamsi(combo.date)
          const result = await useApiFetch<any>('/api/v1/public/search', {
            method: 'GET',
            params: {
              from: combo.route.from,
              to: combo.route.to,
              date: shamsiDate,
              searchType: route.query.sm || undefined,
              // v2.4.0: pass passenger count so backend flags non-bookable trains
              passengers: passengerCount.value > 1 ? passengerCount.value : undefined
            }
          })
          
          let rawTrains: any[] = []
          if (result && result.data) {
            rawTrains = Array.isArray(result.data) ? result.data : [result.data]
          } else if (Array.isArray(result)) {
            rawTrains = result
          } else if (result && result.trains) {
            rawTrains = result.trains
          }
          
          const trains: TrainResult[] = rawTrains.map((t: any) => ({
            ...t,
            id: t.trainNumber || t.id || t.train_id || '',
            // Unique selection key per route+date+train — same train number on
            // different dates/routes must NOT share selection state.
            selectKey: `${combo.route.from}-${combo.route.to}-${shamsiDate}-${t.trainNumber || t.id || ''}`,
            name: toPersianDigits(t.trainName || t.name || t.train_name || 'قطار'),
            type: t.wagonType ? `کوپه ${toPersianDigits(String(t.wagonType))}` : (t.type ? toPersianDigits(String(t.type)) : ''),
            departureTime: t.departureTime || t.departure_time || '',
            arrivalTime: t.arrivalTime || t.arrival_time || '',
            duration: t.duration || t.travelTime || t.travel_time || '',
            available_seats: t.available_seats || t.capacity || t.seats || 10,
            capacity: t.capacity || t.available_seats || t.seats || 10,
            shamsiDate: t.shamsiDate || shamsiDate,
            dayName: t.dayName || '',
            degree: t.degree || 1,
            fullPrice: t.fullPrice || t.cost || t.price || 0,
            compartmentCapacity: t.compartmentCapacity || 0,
            isCompartment: t.isCompartment || 0,
            wagonInfo: t.wagonInfo || '',
            // Raja-specific fare inquiry fields
            circularNumberSerial: t.circularNumberSerial || 0,
            moveDate: t.moveDate || '',
            pathCode: t.pathCode || 0,
            rateCode: t.rateCode || 0,
            ration: t.ration || 0,
            // Store route/date info for pricing calculation downstream
            fromStationId: combo.route.from,
            toStationId: combo.route.to,
            travelDate: shamsiDate,
            // v2.4.0: backend may flag trains incompatible with passenger count
            isDisabled: t.isDisabled === true || t.isDisabled === 'true' || false,
            disabledReason: t.disabledReason || null,
            // v2.4.0: backend exclusive-coupe pricing (seatCost × passengers + emptySeatCost × empty)
            exclusivePricing: t.exclusivePricing || null,
            // Override cost/price with Toman (API returns Rial, /10 = Toman)
            cost: Math.round((t.cost || t.price || 0) / 10),
            price: Math.round((t.cost || t.price || 0) / 10),
          }))
          
          return { combo, trains }
        } catch (err: any) {
          console.error(`Search failed for ${combo.route.fromName}->${combo.route.toName} on ${combo.date}:`, err)
          return { combo, trains: [] }
        }
      })
    )

    for (const { combo, trains } of batchResults) {
      const dateKey = combo.date
      const routeKey = `${combo.route.from}-${combo.route.to}`
      
      if (!resultsMap.has(dateKey)) {
        resultsMap.set(dateKey, new Map())
      }
      const dateMap = resultsMap.get(dateKey)!
      
      if (!dateMap.has(routeKey)) {
        dateMap.set(routeKey, [])
      }
      // Deduplicate trains by id before adding
      const existing = dateMap.get(routeKey)!
      const existingIds = new Set(existing.map(t => String(t.id)))
      for (const train of trains) {
        const id = String(train.id || '')
        if (!id) {
          // No id — add anyway (shouldn't happen, but be safe)
          existing.push(train)
        } else if (!existingIds.has(id)) {
          existing.push(train)
          existingIds.add(id)
        }
      }
    }

    completed += batch.length
  }

  // Convert results map to grouped structure
  const orderedDates = dates.filter(d => resultsMap.has(d))
  for (const dateKey of orderedDates) {
    const routeMap = resultsMap.get(dateKey)!
    const { persianDate, dayOfWeek } = getPersianDateDisplay(dateKey)
    
    const routeGroups: RouteGroup[] = []
    let totalTrains = 0
    
    for (const route of routes) {
      const routeKey = `${route.from}-${route.to}`
      const trains = routeMap.get(routeKey) || []
      if (trains.length > 0) {
        const groupKey = `${dateKey}-${routeKey}`
        routeGroups.push({ route, trains, _key: groupKey })
        totalTrains += trains.length
        // Init filter for this group with max price
        const maxPrice = trains.reduce((mx, t) => Math.max(mx, t.cost || t.price || 0), 0)
        initFilterState(groupKey, maxPrice)
      }
    }

    if (routeGroups.length > 0) {
      groupedResults.value.push({
        persianDate,
        dayOfWeek,
        routes: routeGroups,
        totalTrains,
        expanded: true
      })
    }
  }

  progressText.value = ''
  loading.value = false
}

const toggleTrain = (trainId: string) => {
  const idx = selectedTrainIds.value.indexOf(trainId)
  if (idx >= 0) {
    selectedTrainIds.value.splice(idx, 1)
  } else {
    selectedTrainIds.value.push(trainId)
  }
}

const calculateTotalPrice = () => {
  // Find max price among selected trains
  let maxPrice = 0
  const allTrains = groupedResults.value.flatMap(dg => 
    dg.routes.flatMap(rg => rg.trains)
  )
  selectedTrainIds.value.forEach(selectKey => {
    const train = allTrains.find((t: any) => t.selectKey === selectKey)
    if (train) {
      const price = train.cost || train.price || 0
      if (price > maxPrice) maxPrice = price
    }
  })
  // Max price × total passengers (since only one train will be booked)
  return maxPrice * passengerCount.value
}

const handleNext = () => {
  const searchStore = useSearch()
  const { createSession } = useBookingSession()
  
  // Find all trains and selected ones (matched by unique selectKey)
  const allTrains = groupedResults.value.flatMap(dg => 
    dg.routes.flatMap(rg => rg.trains)
  )
  const selectedData = allTrains.filter(t => selectedTrainIds.value.includes(t.selectKey) && !t.isDisabled)
  
  // Build sub-requests from selected trains (deduped by from+to+date)
  const subRequests = selectedData.map(t => ({
    fromStationId: t.fromStationId,
    toStationId: t.toStationId,
    travelDate: t.travelDate || t.shamsiDate || ''
  })).filter((sr, i, arr) => 
    arr.findIndex(s => s.fromStationId === sr.fromStationId && s.toStationId === sr.toStationId && s.travelDate === sr.travelDate) === i
  )

  // v2.6.0: create a 1-hour booking session with a uuid — page loads via /train-passengers/:uuid
  const sessionUuid = createSession({
    selectedTrains: selectedData,
    passengers: passengerDetailsObj.value || passengerCount.value,
    compartmentType: searchStore.searchParams.value.compartmentType,
    searchMode: (route.query.sm as string) || 'normal',
    subRequests,
    scattered: searchStore.searchParams.value.compartmentType === 'scattered'
  })
  searchStore.searchParams.value.selectedTrainIds = selectedTrainIds.value
  searchStore.setSelectedTrain(selectedData)
  
  if (isLoggedIn.value) {
    navigateTo(`/train-passengers/${sessionUuid}`)
  } else {
    // Save data to localStorage before login redirect
    localStorage.setItem('rn-pending-trains', JSON.stringify(selectedData))
    localStorage.setItem('rn-pending-passengers', String(passengerCount.value))
    localStorage.setItem('rn-pending-subrequests', JSON.stringify(subRequests))
    localStorage.setItem('rn-pending-session', sessionUuid)
    
    navigateTo(`/auth/login?redirect=/train-passengers/${sessionUuid}`)
  }
}
</script>

<style scoped>
/* Dual Range Slider Thumbs */
.range-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0d9488;
  border: 3px solid white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  z-index: 30;
}
.range-thumb::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0d9488;
  border: 3px solid white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  cursor: pointer;
  pointer-events: auto;
  border: none;
}
.range-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}
</style>
