<template>
  <div class="orders-page min-h-screen py-8 px-4 bg-gray-50" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <NuxtLink to="/profile" class="text-gray-400 hover:text-gray-600 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isTicketMode ? 'بلیطهای من' : 'درخواستهای رزرو' }}
          </h1>
        </div>
        <NuxtLink
          to="/profile/support"
          class="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-primary text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <svg class="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 022-2h3v5z"/></svg>
          <span>تیکتهای پشتیبانی</span>
        </NuxtLink>
      </div>

      <!-- Status Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          v-for="tab in (isTicketMode ? ticketStatusTabs : orderStatusTabs)"
          :key="tab.value"
          @click="activeTab = tab.value; fetchOrders()"
          :class="['px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition border', activeTab === tab.value
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300']"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="mr-1 opacity-70">({{ toPersianDigits(tab.count) }})</span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <svg class="animate-spin h-8 w-8 mx-auto text-primary" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="text-gray-400 text-sm mt-3">در حال بارگذاری...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p class="text-red-500 text-sm">{{ error }}</p>
        <button @click="fetchOrders" class="mt-3 text-primary text-sm font-medium hover:underline">تلاش مجدد</button>
      </div>

      <!-- Empty -->
      <div v-else-if="orders.length === 0" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <div class="text-4xl mb-3">{{ isTicketMode ? '🎫' : '📋' }}</div>
        <p class="text-gray-500 text-sm">{{ isTicketMode ? 'هنوز بلیطی خریداری نکرده‌اید' : 'هیچ درخواست رزروی وجود ندارد' }}</p>
        <NuxtLink to="/train" class="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-teal-600 transition">
          ثبت درخواست جدید
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-3">
        <div
          v-for="order in orders"
          :key="order.uuid || order.id"
          class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <!-- Order Header -->
          <div class="p-4 sm:p-5">
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-bold text-gray-900 text-sm">{{ getOrderFromName(order) }}</h3>
                  <svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                  <h3 class="font-bold text-gray-900 text-sm">{{ getOrderToName(order) }}</h3>
                </div>
                <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span v-if="getOrderDate(order)">{{ toPersianDigits(getOrderDate(order)) }}</span>
                  <span v-if="order.passengers?.length">{{ toPersianDigits(order.passengers.length) }} مسافر</span>
                  <span v-else-if="order.subRequests?.[0]?.totalSeatsNeeded">{{ toPersianDigits(order.subRequests[0].totalSeatsNeeded) }} مسافر</span>
                </div>
              </div>
              <span :class="['px-3 py-1 rounded-full text-xs font-bold border shrink-0', getStatusStyle(order.status)]">
                {{ getStatusLabel(order.status) }}
              </span>
            </div>

            <!-- Sub-requests / Details -->
            <div v-if="order.subRequests?.length" class="space-y-2 mb-3">
              <div
                v-for="sub in order.subRequests"
                :key="sub.uuid || sub.id"
                class="bg-gray-50 rounded-xl p-3 text-xs"
              >
                <div class="flex items-center gap-2 text-gray-600 flex-wrap">
                  <span>{{ getStationName(sub.fromStationId) }}</span>
                  <svg class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                  <span>{{ getStationName(sub.toStationId) }}</span>
                  <span class="text-gray-300 mx-1">|</span>
                  <span>{{ toShamsiDate(sub.travelDate) }}</span>
                  <span v-if="sub.matchedPriceRial" class="font-bold text-primary mr-auto">
                    {{ formatPrice(Math.round(Number(sub.matchedPriceRial) / 10)) }} تومان
                  </span>
                  <span :class="[sub.matchedPriceRial ? '' : 'mr-auto', getStatusStyle(sub.status)]">{{ getStatusLabel(sub.status) }}</span>
                </div>
              </div>
            </div>

            <!-- Price + Actions -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div class="flex flex-wrap items-center gap-2">
                <!-- Blocked in Wallet (for ALL requests) -->
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200" title="مبلغ بلوکهشده در کیف پول">
                  <svg class="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  <span>بلوکه در کیف پول: {{ formatPrice(getLockedAmount(order)) }} تومان</span>
                </div>

                <!-- Deducted from Wallet (for Successful requests) -->
                <div v-if="isSuccessful(order.status)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200" title="مبلغ برداشتشده از کیف پول">
                  <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  <span>برداشتشده: {{ formatPrice(getDeductedAmount(order)) }} تومان</span>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-wrap sm:justify-end">
                <button
                  @click="openTicketModalForOrder(order)"
                  class="text-xs text-primary hover:text-teal-700 font-bold transition px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 flex items-center gap-1"
                  title="ثبت تیکت پشتیبانی متصل به این درخواست"
                >
                  <svg class="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 022-2h3v5z"/></svg>
                  <span>پشتیبانی این درخواست</span>
                </button>
                <button
                  @click="toggleDetail(order)"
                  class="text-xs text-gray-500 hover:text-primary font-medium transition px-3 py-1.5 rounded-lg hover:bg-primary/5"
                >
                  {{ expandedOrder === (order.uuid || order.id) ? 'بستن ▲' : 'جزئیات ▼' }}
                </button>
                <button
                  v-if="canCancel(order.status)"
                  @click="confirmCancel(order)"
                  class="text-xs text-red-500 hover:text-red-600 font-medium transition px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  لغو
                </button>
              </div>
            </div>
          </div>

          <!-- Expanded Detail -->
          <div v-if="expandedOrder === (order.uuid || order.id)" class="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-5">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div class="text-xs text-gray-500 mb-0.5">کد درخواست</div>
                <div class="font-medium text-gray-800 font-mono text-xs truncate" dir="ltr">{{ order.uuid || order.id }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-0.5">تاریخ ثبت</div>
                <div class="font-medium text-gray-800">{{ formatDate(order.createdAt) }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-0.5">تعداد مسافران</div>
                <div class="font-medium text-gray-800">{{ toPersianDigits(order.passengers?.length || order.subRequests?.[0]?.totalSeatsNeeded || order.adultsCount || 0) }} نفر</div>
              </div>
              <div v-if="order.priority">
                <div class="text-xs text-gray-500 mb-0.5">اولویت</div>
                <div class="font-medium text-gray-800">{{ toPersianDigits(order.priority) }}</div>
              </div>
              <div v-if="order.isPresale">
                <div class="text-xs text-gray-500 mb-0.5">نوع</div>
                <div class="font-medium text-amber-600">پیش‌فروش</div>
              </div>
              <div v-if="order.exclusiveCoupe">
                <div class="text-xs text-gray-500 mb-0.5">کوپه</div>
                <div class="font-medium text-gray-800">دربست</div>
              </div>
            </div>

            <!-- Passengers List -->
            <div v-if="order.passengers?.length" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2 mb-2.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM15 7a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                <span class="text-xs font-bold text-gray-700">لیست مسافران ({{ toPersianDigits(order.passengers.length) }})</span>
              </div>
              <div class="space-y-2">
                <div
                  v-for="rp in order.passengers"
                  :key="rp.id"
                  class="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0">{{ toPersianDigits(rp.position || 1) }}</span>
                    <span class="font-medium text-gray-900 truncate">{{ getPassengerName(rp) }}</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <span v-if="rp.passenger?.nationalId" class="text-xs text-gray-500 font-bold" :class="rp.passenger?.isForeign ? 'font-mono' : 'font-sans'" :dir="rp.passenger?.isForeign ? 'ltr' : 'rtl'">{{ rp.passenger?.isForeign ? rp.passenger.nationalId : toPersianDigits(rp.passenger.nationalId) }}</span>
                    <span v-if="rp.passenger?.isForeign" class="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">اتباع</span>
                    <span v-if="rp.ageGroup" class="text-[10px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">{{ getAgeGroupLabel(rp.ageGroup) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Financial Breakdown & Wallet Details -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2.5 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                <span>جزئیات مالی و وضعیت کیف پول</span>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 space-y-2.5 text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">قیمت بلیط قطار:</span>
                  <span class="font-bold text-gray-900 dark:text-gray-100">
                    {{ getTicketTotal(order) > 0 ? `${formatPrice(getTicketTotal(order))} تومان` : 'پس از پیدا شدن قطار' }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">هزینه خدمات ریلنگار:</span>
                  <span class="font-bold text-gray-900 dark:text-gray-100">
                    {{ formatPrice(getServiceFee(order)) }} تومان
                  </span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700 font-bold text-sm">
                  <span class="text-gray-700 dark:text-gray-300">مجموع کل برآورد:</span>
                  <span class="text-primary">
                    {{ getOrderTotalAmount(order) > 0 ? `${formatPrice(getOrderTotalAmount(order))} تومان` : `${formatPrice(getServiceFee(order))} تومان + قیمت بلیط` }}
                  </span>
                </div>

                <!-- Blocked amount for all requests -->
                <div class="flex justify-between items-center p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-900 font-bold">
                  <span class="flex items-center gap-1.5 text-blue-700">
                    <svg class="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    <span>مبلغ بلوکهشده در کیف پول:</span>
                  </span>
                  <span class="text-blue-800">{{ formatPrice(getLockedAmount(order)) }} تومان</span>
                </div>

                <!-- Deducted amount for successful requests -->
                <div v-if="isSuccessful(order.status)" class="flex justify-between items-center p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-900 font-bold">
                  <span class="flex items-center gap-1.5 text-emerald-700">
                    <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    <span>مبلغ برداشتشده نهایی از کیف پول:</span>
                  </span>
                  <span class="text-emerald-800">{{ formatPrice(getDeductedAmount(order)) }} تومان</span>
                </div>

                <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between flex-wrap gap-2">
                  <span class="text-gray-500">وضعیت در کیف پول:</span>
                  <span :class="['px-2.5 py-0.5 rounded-full text-[11px] font-bold border', getWalletLockBadge(order.status).style]">
                    {{ getWalletLockBadge(order.status).text }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="total > take" class="flex justify-center gap-2 mt-4">
          <button
            @click="skip = Math.max(0, skip - take); fetchOrders()"
            :disabled="skip === 0"
            class="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            قبلی
          </button>
          <span class="px-3 py-2 text-sm text-gray-500">
            {{ toPersianDigits(Math.floor(skip / take) + 1) }}
          </span>
          <button
            @click="skip += take; fetchOrders()"
            :disabled="skip + take >= total"
            class="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div v-if="cancelTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="cancelTarget = null">
      <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <h3 class="font-bold text-gray-900 mb-3">لغو درخواست</h3>

        <!-- Cancellation fee warning -->
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
          <div class="flex items-start gap-2.5">
            <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <p class="text-xs text-amber-800 leading-relaxed">
              <span class="font-bold block mb-1">⚠️ توجه:</span>
              لغو بدون جریمه صرفاً زمانی امکان‌پذیر است که بیش از ۳ ساعت تا حرکت قطار مانده باشد و هنوز قطاری پیدا (Match) یا قفل (Lock) نشده باشد.
              در غیر این صورت کارمزد خدمات (هزینه زیرساخت جستجو) کسر شده و تنها اصل مبلغ بلیط به کیف پول بازگردانده می‌شود.
            </p>
          </div>
        </div>

        <p class="text-sm text-gray-600 mb-4">آیا از لغو این درخواست اطمینان دارید؟</p>
        <div class="mb-4">
          <label class="block text-xs text-gray-600 mb-1">دلیل لغو (اختیاری)</label>
          <input
            v-model="cancelReason"
            type="text"
            placeholder="تغییر برنامه سفر"
            class="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
        </div>
        <div class="flex gap-3">
          <button
            @click="cancelTarget = null"
            class="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
          >
            انصراف
          </button>
          <button
            @click="handleCancel"
            :disabled="cancelLoading"
            class="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
          >
            <span v-if="cancelLoading">در حال لغو...</span>
            <span v-else>تایید لغو</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Support Ticket Modal (Locked to requestId) ===== -->
    <div v-if="ticketModalOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" @click.self="ticketModalOpen = false">
      <div class="bg-white dark:bg-gray-800 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 022-2h3v5z"/>
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-gray-100 text-lg">ثبت تیکت پشتیبانی درخواست</h3>
          </div>
          <button @click="ticketModalOpen = false" class="p-2 text-gray-400 hover:text-gray-700 rounded-full transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Locked Request ID Banner -->
        <div v-if="selectedOrderForTicket" class="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-center justify-between">
          <div class="text-xs text-blue-900">
            <span class="font-bold block text-sm">شماره درخواست متصل:</span>
            <span class="font-mono font-bold" dir="ltr">#{{ selectedOrderForTicket.id }} ({{ selectedOrderForTicket.uuid?.slice(0, 8) || '' }})</span> — {{ getOrderFromName(selectedOrderForTicket) }} به {{ getOrderToName(selectedOrderForTicket) }}
          </div>
          <span class="text-[10px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
            <svg class="w-3 h-3 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            <span>ثابت و قفلشده</span>
          </span>
        </div>

        <form @submit.prevent="submitTicket" class="space-y-4">
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1.5">موضوع تیکت *</label>
            <select
              v-model="ticketForm.topicId"
              required
              class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option :value="null" disabled>انتخاب موضوع پشتیبانی...</option>
              <option v-for="tp in ticketTopics" :key="tp.id" :value="tp.id">{{ tp.title }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1.5">عنوان تیکت *</label>
            <input
              v-model="ticketForm.subject"
              type="text"
              required
              placeholder="خلاصه درخواست خود را بنویسید"
              class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
          </div>

          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1.5">شرح درخواست *</label>
            <textarea
              v-model="ticketForm.description"
              required
              rows="4"
              placeholder="توضیحات کامل درخواست پشتیبانی..."
              class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="ticketModalOpen = false" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
              انصراف
            </button>
            <button type="submit" :disabled="ticketLoading" class="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-teal-600 transition disabled:opacity-50">
              <span v-if="ticketLoading">در حال ثبت...</span>
              <span v-else>ثبت تیکت</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <Toast :show="toast.show" :type="toast.type" :message="toast.message" @hide="toast.show = false" />
</template>

<script setup lang="ts">
import { useOrders } from '~/composables/api/useOrders'
import { useSupportTickets, type TicketTopic } from '~/composables/api/useSupportTickets'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import { useSearch } from '~/stores/search'
import Toast from '~/components/ui/Toast.vue'

const { formatPrice, toPersianDigits } = usePersianNumber()
const { getOrders, cancelOrder } = useOrders()
const { getTopics, createTicket } = useSupportTickets()
const searchStore = useSearch()

const route = useRoute()

// Support Ticket Modal state
const ticketModalOpen = ref(false)
const ticketLoading = ref(false)
const selectedOrderForTicket = ref<any>(null)
const ticketTopics = ref<TicketTopic[]>([])
const ticketForm = reactive<{ topicId: number | null; subject: string; description: string }>({
  topicId: null,
  subject: '',
  description: ''
})

const fetchTicketTopics = async () => {
  try {
    const res = await getTopics() as any
    const data = res?.data || res || []
    ticketTopics.value = Array.isArray(data) ? data : data.items || []
  } catch (err) {
    console.error('Failed to load ticket topics:', err)
  }
}

const openTicketModalForOrder = (order: any) => {
  selectedOrderForTicket.value = order
  ticketForm.topicId = null
  ticketForm.subject = ''
  ticketForm.description = ''
  ticketModalOpen.value = true
  if (ticketTopics.value.length === 0) {
    fetchTicketTopics()
  }
}

const submitTicket = async () => {
  if (!selectedOrderForTicket.value || !ticketForm.topicId || !ticketForm.subject || !ticketForm.description) return
  ticketLoading.value = true
  try {
    await createTicket({
      topicId: ticketForm.topicId,
      requestId: Number(selectedOrderForTicket.value.id),
      subject: ticketForm.subject,
      description: ticketForm.description
    })
    ticketModalOpen.value = false
    showToast('success', 'تیکت پشتیبانی برای این درخواست با موفقیت ثبت شد')
    setTimeout(() => navigateTo('/profile/support'), 1200)
  } catch (e: any) {
    showToast('error', e?.data?.message || 'خطا در ثبت تیکت')
  } finally {
    ticketLoading.value = false
  }
}

// Station name lookup (loaded from /public/stations)
const stationMap = ref<Record<number, string>>({})

const getStationName = (id: number | string | null | undefined): string => {
  if (!id) return '—'
  const name = stationMap.value[Number(id)]
  return name || `ایستگاه ${toPersianDigits(String(id))}`
}

/** Convert ISO/Gregorian date string → Persian (Shamsi) date string. */
const toShamsiDate = (value: string | null | undefined): string => {
  if (!value) return ''
  try {
    const d = new Date(value)
    if (isNaN(d.getTime())) return value
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(d)
  } catch {
    return value
  }
}

const loadStations = async () => {
  try {
    await searchStore.fetchStations()
    searchStore.cities.forEach((c: any) => {
      stationMap.value[c.id] = c.name
    })
  } catch (e) {
    console.error('Failed to load stations:', e)
  }
}

/** Order-level origin name — falls back to first sub-request. */
const getOrderFromName = (order: any): string => {
  const sub = order.subRequests?.[0]
  if (order.fromStation?.name) return order.fromStation.name
  if (order.fromName) return order.fromName
  if (sub) return getStationName(sub.fromStationId)
  return 'مبدا'
}

/** Order-level destination name — falls back to first sub-request. */
const getOrderToName = (order: any): string => {
  const sub = order.subRequests?.[0]
  if (order.toStation?.name) return order.toStation.name
  if (order.toName) return order.toName
  if (sub) return getStationName(sub.toStationId)
  return 'مقصد'
}

/** Order-level travel date (Shamsi) — falls back to first sub-request. */
const getOrderDate = (order: any): string => {
  if (order.shamsiDate) return order.shamsiDate
  if (order.travelDate && !order.travelDate.includes('T')) return order.travelDate
  const sub = order.subRequests?.[0]
  if (sub) return toShamsiDate(sub.travelDate)
  return toShamsiDate(order.travelDate)
}

/** Passenger display name + national code from included passenger. */
const getPassengerName = (rp: any): string => {
  const p = rp.passenger || rp
  return `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'مسافر'
}

const isTicketMode = computed(() => {
  return route.query.status === 'COMPLETED'
})

const orders = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const skip = ref(0)
const take = ref(20)
const total = ref(0)
const activeTab = ref(isTicketMode.value ? 'COMPLETED' : '')
const expandedOrder = ref<string | null>(null)
const cancelTarget = ref<any>(null)
const cancelReason = ref('')
const cancelLoading = ref(false)

const { toast: toastState, showToast } = useToast()

const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
  message: ''
})

watch(toastState, (v) => {
  toast.show = v.show
  toast.type = v.type
  toast.message = v.message
}, { deep: true })

const orderStatusTabs = [
  { value: '', label: 'همه' },
  { value: 'PENDING', label: 'در انتظار' },
  { value: 'SEARCHING', label: 'در حال جستجو' },
  { value: 'TRAIN_LOCKED', label: 'قطار پیدا شد' },
  { value: 'PAYMENT_PENDING', label: 'در انتظار پرداخت' },
  { value: 'COMPLETED', label: 'تکمیل شده' },
  { value: 'CANCELLED', label: 'لغو شده' },
]

const ticketStatusTabs = [
  { value: 'COMPLETED', label: 'همه' },
]

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    PENDING: 'در انتظار',
    SCHEDULED: 'زمانبندی شده',
    SEARCHING: 'در حال جستجو',
    PAUSED: 'متوقف',
    MATCHED: 'بلیط یافت شد',
    MATCHING: 'در حال انطباق',
    LOCKING: 'در حال قفل صندلی',
    LOCKED: 'صندلی قفل شد',
    TRAIN_LOCKED: 'قطار پیدا شد',
    RESERVING: 'در حال رزرو',
    RESERVED: 'رزرو شده',
    PARTIALLY_BOOKED: 'رزرو ناقص',
    BOOKED: 'رزرو شده',
    PAYMENT_PENDING: 'در انتظار پرداخت',
    PAID: 'پرداخت شده',
    TICKETED: 'بلیط صادر شد',
    COMPLETED: 'تکمیل شده',
    CANCELLED: 'لغو شده',
    EXPIRED: 'منقضی شده',
    FAILED: 'ناموفق'
  }
  return labels[status] || status
}

const getStatusStyle = (status: string): string => {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    SCHEDULED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    SEARCHING: 'bg-blue-50 text-blue-700 border-blue-200',
    PAUSED: 'bg-gray-50 text-gray-600 border-gray-200',
    MATCHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MATCHING: 'bg-blue-50 text-blue-700 border-blue-200',
    LOCKING: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    LOCKED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    TRAIN_LOCKED: 'bg-green-50 text-green-700 border-green-200',
    RESERVING: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    RESERVED: 'bg-green-50 text-green-700 border-green-200',
    PARTIALLY_BOOKED: 'bg-amber-50 text-amber-700 border-amber-200',
    BOOKED: 'bg-green-50 text-green-700 border-green-200',
    PAYMENT_PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    TICKETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-gray-50 text-gray-500 border-gray-200',
    EXPIRED: 'bg-gray-50 text-gray-500 border-gray-200',
    FAILED: 'bg-red-50 text-red-600 border-red-200'
  }
  return styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'
}

const canCancel = (status: string): boolean => {
  return ['PENDING', 'SCHEDULED', 'SEARCHING', 'PAUSED', 'TRAIN_LOCKED'].includes(status)
}

const fetchOrders = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getOrders({
      status: activeTab.value || undefined,
      skip: skip.value,
      take: take.value + 1,
      sort: 'newest'
    }) as any
    const data = res?.data || res || {}
    const items = data.items || data.bookingRequests || data.requests || data.data || data.orders || []
    orders.value = Array.isArray(items) ? items.slice(0, take.value) : []
    total.value = Number(data.total || items.length || 0)
  } catch (e: any) {
    error.value = 'خطا در دریافت درخواست‌ها'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const toggleDetail = (order: any) => {
  const id = order.uuid || order.id
  expandedOrder.value = expandedOrder.value === id ? null : id
}

const confirmCancel = (order: any) => {
  cancelTarget.value = order
  cancelReason.value = ''
}

const handleCancel = async () => {
  if (!cancelTarget.value) return
  cancelLoading.value = true
  try {
    const id = cancelTarget.value.uuid || cancelTarget.value.id
    const res = await cancelOrder(id, cancelReason.value || undefined) as any
    const data = res?.data || res || {}
    const policy = data.cancelPolicy

    // v2.4.0: show the backend's cancellation-policy message (free vs fee)
    if (policy?.message) {
      if (policy.free === false) {
        showToast('warning', policy.message)
      } else {
        showToast('success', policy.message || 'درخواست با موفقیت لغو شد')
      }
    } else {
      showToast('success', 'درخواست با موفقیت لغو شد')
    }
    cancelTarget.value = null
    await fetchOrders()
  } catch (e: any) {
    showToast('error', e?.data?.message || 'خطا در لغو درخواست')
  } finally {
    cancelLoading.value = false
  }
}

const getServiceFee = (order: any): number => {
  if (!order) return 0
  const direct = order.serviceTotal || order.serviceFee || order.totalServiceFee
  if (direct && Number(direct) > 0) return Number(direct)

  const pax = order.passengers?.length || order.adultsCount || 1
  const originCount = order.origins?.length || order.subRequests?.length || 1
  const baseFee = 19000
  const extraRouteFee = originCount > 1 ? (originCount - 1) * 6000 : 0
  return (baseFee + extraRouteFee) * pax
}

const getTicketTotal = (order: any): number => {
  if (!order) return 0
  const direct = order.ticketTotal || order.ticketPrice || order.totalTicketPrice
  if (direct && Number(direct) > 0) return Number(direct)

  if (Array.isArray(order.subRequests) && order.subRequests.length > 0) {
    const matchedSumRial = order.subRequests.reduce((acc: number, sub: any) => {
      const rial = sub.matchedPriceRial || sub.matchedTrainData?.Cost || sub.matchedTrainData?.FullPrice || sub.priceRial || sub.costRial || 0
      return acc + Number(rial)
    }, 0)
    if (matchedSumRial > 0) {
      return Math.round(matchedSumRial / 10)
    }
  }
  return 0
}

const isSuccessful = (status: string): boolean => {
  return ['COMPLETED', 'TICKETED', 'PAID', 'BOOKED'].includes(status)
}

const getLockedAmount = (order: any): number => {
  if (!order) return 0
  if (order.lockedAmountRial) return Math.round(Number(order.lockedAmountRial) / 10)
  if (order.lockedRial) return Math.round(Number(order.lockedRial) / 10)
  if (order.blockedRial) return Math.round(Number(order.blockedRial) / 10)
  if (order.lockedAmount) return Number(order.lockedAmount) > 1000000 ? Math.round(Number(order.lockedAmount) / 10) : Number(order.lockedAmount)
  if (order.blockedAmount) return Number(order.blockedAmount) > 1000000 ? Math.round(Number(order.blockedAmount) / 10) : Number(order.blockedAmount)

  const ticket = getTicketTotal(order)
  const service = getServiceFee(order)
  return ticket > 0 ? (ticket + service) : service
}

const getDeductedAmount = (order: any): number => {
  if (!order) return 0
  if (order.deductedAmountRial) return Math.round(Number(order.deductedAmountRial) / 10)
  if (order.spentRial) return Math.round(Number(order.spentRial) / 10)
  if (order.paidAmountRial) return Math.round(Number(order.paidAmountRial) / 10)
  if (order.deductedAmount) return Number(order.deductedAmount) > 1000000 ? Math.round(Number(order.deductedAmount) / 10) : Number(order.deductedAmount)
  if (order.paidAmount) return Number(order.paidAmount) > 1000000 ? Math.round(Number(order.paidAmount) / 10) : Number(order.paidAmount)

  return getOrderTotalAmount(order)
}

const getWalletLockBadge = (status: string) => {
  if (['COMPLETED', 'TICKETED', 'PAID'].includes(status)) {
    return {
      text: '✓ بلیط صادر شد — مبلغ از کیف پول برداشت شد',
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  }
  if (['CANCELLED', 'EXPIRED', 'FAILED'].includes(status)) {
    return {
      text: '🔓 مبلغ بلوکهشده آزاد و به کیف پول عودت داده شد',
      style: 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }
  return {
    text: '🔒 مبلغ در کیف پول بلوکه است (تا زمان صدور یا لغو)',
    style: 'bg-blue-50 text-blue-700 border-blue-200'
  }
}

const getOrderTotalAmount = (order: any): number => {
  if (!order) return 0
  const direct = order.totalPrice || order.totalAmount || order.totalCost || order.price || order.cost
  if (direct && Number(direct) > 0) return Number(direct)

  const ticket = getTicketTotal(order)
  const service = getServiceFee(order)
  if (ticket > 0) return ticket + service

  if (order.metadata?.pricing?.total) return Number(order.metadata.pricing.total)
  if (order.metadata?.total) return Number(order.metadata.total)
  if (order.pricing?.total) return Number(order.pricing.total)

  return service
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const h = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    const shamsi = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(d)
    return toPersianDigits(`${shamsi} ${h}:${min}`)
  } catch {
    return dateStr
  }
}

/** Age group badge label (matches backend AgeGroup enum). */
const getAgeGroupLabel = (ageGroup: string): string => {
  const labels: Record<string, string> = {
    INFANT: 'نوزاد',
    CHILD: 'کودک',
    ADULT: 'بزرگسال',
    SENIOR: 'سالمند'
  }
  return labels[ageGroup] || ageGroup
}

onMounted(() => {
  loadStations()
  fetchOrders()
})
</script>
