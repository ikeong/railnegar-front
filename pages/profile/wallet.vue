<template>
  <div class="wallet-page min-h-screen py-8 px-4 bg-gray-50" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <NuxtLink to="/profile" class="text-gray-400 hover:text-gray-600 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900">کیف پول</h1>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <svg class="animate-spin h-8 w-8 mx-auto text-primary" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="text-gray-400 text-sm mt-3">در حال بارگذاری...</p>
      </div>

      <template v-else>
        <!-- Error -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p class="text-red-500 text-sm">{{ error }}</p>
          <button @click="fetchAll" class="mt-3 text-primary text-sm font-medium hover:underline">تلاش مجدد</button>
        </div>

        <template v-else>
          <!-- Balance Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-4 shadow-sm">
              <div class="text-xs opacity-80 mb-1">موجودی قابل استفاده</div>
              <div class="text-xl sm:text-2xl font-bold">{{ formatPrice(balance.available) }}</div>
              <div class="text-xs opacity-70 mt-1">تومان</div>
            </div>
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div class="text-xs text-amber-700 mb-1">مسدود شده</div>
              <div class="text-lg font-bold text-amber-700">{{ formatPrice(balance.locked) }}</div>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div class="text-xs text-blue-700 mb-1">مجموع هزینه</div>
              <div class="text-lg font-bold text-blue-700">{{ formatPrice(balance.spent) }}</div>
            </div>
            <div class="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <div class="text-xs text-purple-700 mb-1">مجموع شارژ</div>
              <div class="text-lg font-bold text-purple-700">{{ formatPrice(balance.topup) }}</div>
            </div>
          </div>

          <!-- Tier & Topup Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- Tier Card -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                سطح کاربری
              </h3>
              <div class="flex items-center justify-between mb-3">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold border', getTierColor(tier.tier)]">
                  {{ getTierLabel(tier.tier) }}
                </span>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between text-gray-600">
                  <span>هزینه پایه هر صندلی</span>
                  <span class="font-bold text-gray-900">{{ formatPrice(tier.baseFeePerSeat) }} تومان</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>هزینه زیرمسیر هر صندلی</span>
                  <span class="font-bold text-gray-900">{{ formatPrice(tier.subFeePerSeat) }} تومان</span>
                </div>
                <div v-if="tier.commissionDiscount > 0" class="flex justify-between text-green-600">
                  <span>تخفیف کارمزد</span>
                  <span class="font-bold">{{ toPersianDigits(tier.commissionDiscount) }}%</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>درخواست‌های همزمان</span>
                  <span class="font-bold text-gray-900">{{ toPersianDigits(tier.maxConcurrent) }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>سقف روزانه</span>
                  <span class="font-bold text-gray-900">{{ toPersianDigits(tier.maxPerDay) }}</span>
                </div>
              </div>
            </div>

            <!-- Topup Card -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 class="font-bold text-gray-900 mb-3">افزایش موجودی</h3>

              <!-- Tab buttons -->
              <div class="flex bg-gray-100 rounded-xl p-1 mb-4">
                <button
                  @click="topupTab = 'zarinpal'"
                  :class="['flex-1 py-2 text-sm font-bold rounded-lg transition', topupTab === 'zarinpal' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
                >
                  زرین‌پال
                </button>
                <button
                  @click="topupTab = 'receipt'"
                  :class="['flex-1 py-2 text-sm font-bold rounded-lg transition', topupTab === 'receipt' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
                >
                  فیش بانکی
                </button>
              </div>

              <!-- ZarinPal Form -->
              <form v-if="topupTab === 'zarinpal'" @submit.prevent="handleZarinpalTopup" class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">مبلغ (تومان)</label>
                  <div class="relative">
                    <input
                      :value="topupAmountDisplay"
                      @input="handleAmountInput($event, topupAmountDisplay, topupAmountRaw)"
                      type="text"
                      inputmode="numeric"
                      autocomplete="off"
                      placeholder="مثال: ۵۰۰٬۰۰۰"
                      class="w-full p-3 pl-12 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                      dir="rtl"
                    >
                    <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 2a2 2 0 100 4 2 2 0 000-4zm-8.5 2.5h.01M4 12h.01M20 12h.01M12 20v.01M12 4v.01M4.5 16.5l.01-.01M19.5 7.5l.01-.01" /></svg>
                  </div>
                </div>
                <p class="text-xs text-gray-400">حداقل ۱۰ هزار و حداکثر ۵۰ میلیون تومان</p>
                <button
                  type="submit"
                  :disabled="topupLoading || !topupAmountRaw || topupAmountRaw < 10000"
                  class="w-full py-3 rounded-xl font-medium text-sm transition"
                  :class="topupLoading || !topupAmountRaw || topupAmountRaw < 10000 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-teal-600'"
                >
                  <span v-if="topupLoading" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    در حال اتصال به درگاه...
                  </span>
                  <span v-else>پرداخت با زرین‌پال</span>
                </button>
              </form>

              <!-- Receipt Upload Form -->
              <form v-if="topupTab === 'receipt'" @submit.prevent="handleReceiptUpload" class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">مبلغ واریزی (تومان)</label>
                  <input
                    :value="receiptAmountDisplay"
                    @input="handleAmountInput($event, receiptAmountDisplay, receiptAmountRaw)"
                    type="text"
                    inputmode="numeric"
                    autocomplete="off"
                    placeholder="مثال: ۵۰۰٬۰۰۰"
                    class="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                    dir="rtl"
                  >
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">شماره مرجع بانکی (اختیاری)</label>
                  <input
                    v-model="receiptRef"
                    type="text"
                    placeholder="شماره پیگیری تراکنش"
                    class="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm"
                  >
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">تصویر فیش</label>
                  <input
                    ref="receiptFileInput"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    @change="handleReceiptFile"
                    class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/5 file:text-primary hover:file:bg-primary/10"
                  >
                </div>
                <button
                  type="submit"
                  :disabled="receiptLoading || !receiptAmount || !receiptFile"
                  class="w-full py-3 rounded-xl font-medium text-sm transition"
                  :class="receiptLoading || !receiptAmount || !receiptFile ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-teal-600'"
                >
                  <span v-if="receiptLoading" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    در حال آپلود...
                  </span>
                  <span v-else>ارسال فیش</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Transaction History -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-gray-900">تاریخچه تراکنش‌ها</h3>
              <select
                v-model="ledgerFilter"
                @change="fetchLedger"
                class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">همه</option>
                <option value="topup_zarinpal">شارژ زرین‌پال</option>
                <option value="topup_receipt">شارژ با فیش</option>
                <option value="topup_admin">شارژ ادمین</option>
                <option value="lock">مسدود شده</option>
                <option value="unlock">آزاد شده</option>
                <option value="charge">هزینه بلیط</option>
                <option value="refund">استرداد</option>
                <option value="commission_charge">کارمزد</option>
              </select>
            </div>

            <div v-if="ledgerLoading" class="text-center py-8">
              <svg class="animate-spin h-6 w-6 mx-auto text-primary" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            </div>

            <div v-else-if="ledgerItems.length === 0" class="text-center py-8 text-gray-400 text-sm">
              هیچ تراکنشی یافت نشد
            </div>

            <div v-else class="space-y-1">
              <div
                v-for="tx in ledgerItems"
                :key="tx.id"
                class="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :class="getTxIconBg(tx.kind)">
                    <span class="text-xs">{{ getTxIcon(tx.kind) }}</span>
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ getTxLabel(tx.kind) }}</div>
                    <div v-if="tx.reason" class="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{{ tx.reason }}</div>
                    <div class="text-xs text-gray-400 mt-0.5">{{ formatDate(tx.createdAt) }}</div>
                  </div>
                </div>
                <div class="text-left shrink-0 mr-3">
                  <div class="text-sm font-bold" :class="tx.amountRial > 0 ? 'text-emerald-600' : 'text-red-500'">
                    {{ tx.amountRial > 0 ? '+' : '' }}{{ formatPrice(Math.abs(Number(tx.amountRial || 0)) / 10) }}
                  </div>
                  <div class="text-xs text-gray-400">تومان</div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="ledgerTotal > take" class="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                @click="ledgerSkip = Math.max(0, ledgerSkip - take); fetchLedger()"
                :disabled="ledgerSkip === 0"
                class="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                قبلی
              </button>
              <span class="px-3 py-2 text-sm text-gray-500">
                {{ toPersianDigits(Math.floor(ledgerSkip / take) + 1) }}
              </span>
              <button
                @click="ledgerSkip += take; fetchLedger()"
                :disabled="ledgerSkip + take >= ledgerTotal"
                class="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                بعدی
              </button>
            </div>
          </div>

          <!-- v2.4.0: Bank Receipts (secure public image) -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-gray-900">فیش‌های واریزی</h3>
              <span class="text-xs text-gray-400">{{ toPersianDigits(String(receipts.length)) }} فیش</span>
            </div>

            <div v-if="receiptsLoading" class="text-center py-6">
              <svg class="animate-spin h-6 w-6 mx-auto text-primary" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            </div>

            <div v-else-if="receipts.length === 0" class="text-center py-6 text-gray-400 text-sm">
              فیشی ثبت نشده است
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="r in receipts"
                :key="r.id"
                class="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
              >
                <img
                  v-if="r.uuid && getReceiptImageUrl(r.uuid)"
                  :src="getReceiptImageUrl(r.uuid)"
                  alt="فیش واریزی"
                  class="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-gray-100 shrink-0 cursor-pointer"
                  @click="openReceiptImage(r.uuid)"
                >
                <div v-else class="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl shrink-0">📄</div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatPrice(Number(r.amountRial || 0) / 10) }} تومان
                  </div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ formatDate(r.createdAt) }}</div>
                  <div v-if="r.bankRef" class="text-xs text-gray-400 mt-0.5 font-mono" dir="ltr">{{ toPersianDigits(r.bankRef) }}</div>
                </div>
                <span :class="['px-3 py-1 rounded-full text-xs font-bold border shrink-0', getReceiptStatusStyle(r.status)]">
                  {{ getReceiptStatusLabel(r.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Receipt image lightbox -->
          <div v-if="receiptImageOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" @click="receiptImageOpen = null">
            <div class="relative max-w-2xl w-full">
              <button @click="receiptImageOpen = null" class="absolute -top-3 -left-3 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-gray-900">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <img :src="getReceiptImageUrl(receiptImageOpen)" alt="فیش واریزی" class="w-full rounded-2xl bg-white" />
            </div>
          </div>
        </template>
      </template>
    </div>

    <!-- Toast -->
    <Toast :show="toast.show" :type="toast.type" :message="toast.message" @hide="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
import { useWallet } from '~/composables/api/useWallet'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import { useProfile } from '~/composables/api/useProfile'
import Toast from '~/components/ui/Toast.vue'

const { formatPrice, toPersianDigits, toLatinDigits } = usePersianNumber()
const { getBalance, getLedger, getTier, initTopup, uploadReceipt, getReceipts, getReceiptImageUrl } = useWallet()
const { getTierLabel, getTierColor } = useProfile()

const balance = reactive({ available: 0, locked: 0, spent: 0, topup: 0 })
const tier = reactive({ tier: 'BASIC', baseFeePerSeat: 0, subFeePerSeat: 0, commissionDiscount: 0, maxConcurrent: 0, maxPerDay: 0 })
const ledgerItems = ref<any[]>([])
const ledgerTotal = ref(0)
const ledgerSkip = ref(0)
const take = ref(20)
const ledgerFilter = ref('')
const loading = ref(true)
const error = ref('')
const topupTab = ref('zarinpal')
const topupAmountRaw = ref<number | null>(null)   // numeric value (Toman) for logic/API
const topupAmountDisplay = ref('')                // masked Persian display: "۵۰۰٬۰۰۰ تومان"
const topupLoading = ref(false)
const receiptAmountRaw = ref<number | null>(null) // numeric value (Toman)
const receiptAmountDisplay = ref('')              // masked Persian display
const receiptRef = ref('')
const receiptFile = ref<File | null>(null)
const receiptFileInput = ref<HTMLInputElement | null>(null)
const receiptLoading = ref(false)
const receipts = ref<any[]>([])
const receiptsLoading = ref(false)
const receiptImageOpen = ref<string | null>(null)
const ledgerLoading = ref(false)

const getReceiptStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    PENDING: 'در انتظار تایید',
    APPROVED: 'تایید شده',
    REJECTED: 'رد شده'
  }
  return labels[status] || status
}

const getReceiptStatusStyle = (status: string): string => {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-red-50 text-red-600 border-red-200'
  }
  return styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'
}

const openReceiptImage = (uuid: string) => {
  receiptImageOpen.value = uuid
}

const fetchReceipts = async () => {
  receiptsLoading.value = true
  try {
    const res = await getReceipts({ take: 50 }) as any
    const data = res?.data || res || {}
    receipts.value = data.items || data.receipts || data.data || []
  } catch (e) {
    console.error('Failed to fetch receipts:', e)
    receipts.value = []
  } finally {
    receiptsLoading.value = false
  }
}

/** Mask a raw input into "۱٬۲۳۴٬۵۶۷ تومان" Persian currency format. */
const maskTomanInput = (raw: string): string => {
  // Keep only digits (latin or persian), strip everything else
  const digits = String(raw).replace(/[^\d۰-۹]/g, '')
  if (!digits) return ''
  const num = Number(toLatinDigits(digits))
  if (isNaN(num) || num <= 0) return ''
  return `${new Intl.NumberFormat('fa-IR').format(num)} تومان`
}

/** Shared input handler: masks value live + keeps raw number in sync. */
const handleAmountInput = (
  e: Event,
  display: Ref<string>,
  raw: Ref<number | null>
) => {
  const input = e.target as HTMLInputElement
  const masked = maskTomanInput(input.value)
  display.value = masked
  raw.value = masked ? Number(toLatinDigits(masked).replace(/\D/g, '')) : null
  // Re-write masked value and keep cursor at the end
  input.value = masked
  const len = masked.length
  requestAnimationFrame(() => input.setSelectionRange(len, len))
}

/** Programmatic set (e.g. clearing after submit). */
const setAmount = (
  display: Ref<string>,
  raw: Ref<number | null>,
  value: number | null
) => {
  raw.value = value
  display.value = value ? maskTomanInput(String(value)) : ''
}

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

const fetchAll = async () => {
  loading.value = true
  error.value = ''
  try {
    const [balRes, tierRes] = await Promise.all([
      getBalance() as any,
      getTier() as any
    ])
    const balData = balRes?.data || balRes || {}
    balance.available = Number(balData.availableRial || 0) / 10
    balance.locked = Number(balData.lockedRial || 0) / 10
    balance.spent = Number(balData.totalSpentRial || 0) / 10
    balance.topup = Number(balData.totalRial || 0) / 10

    const tierData = tierRes?.data || tierRes || {}
    tier.tier = tierData.tier || 'BASIC'
    tier.baseFeePerSeat = Number(tierData.baseFeePerSeatRial || 190000) / 10
    tier.subFeePerSeat = Number(tierData.subFeePerSeatRial || 60000) / 10
    tier.commissionDiscount = Number(tierData.commissionDiscountPercent || 0)
    tier.maxConcurrent = Number(tierData.maxConcurrent || 0)
    tier.maxPerDay = Number(tierData.maxPerDay || 0)

    await fetchLedger()
  } catch (e: any) {
    error.value = 'خطا در دریافت اطلاعات کیف پول'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchLedger = async () => {
  ledgerLoading.value = true
  try {
    const res = await getLedger({
      skip: ledgerSkip.value,
      take: take.value,
      kind: ledgerFilter.value || undefined
    }) as any
    const data = res?.data || res || {}
    ledgerItems.value = (data.items || []).map((item: any) => ({
      ...item,
      amountRial: Number(item.amountRial || 0)
    }))
    ledgerTotal.value = Number(data.total || 0)
  } catch (e) {
    console.error('Failed to fetch ledger:', e)
    ledgerItems.value = []
  } finally {
    ledgerLoading.value = false
  }
}

const handleZarinpalTopup = async () => {
  const amount = topupAmountRaw.value || 0
  if (!amount || amount < 10000) {
    showToast('error', 'حداقل مبلغ ۱۰ هزار تومان است')
    return
  }
  if (amount > 50000000) {
    showToast('error', 'حداکثر مبلغ ۵۰ میلیون تومان است')
    return
  }
  topupLoading.value = true
  try {
    const res = await initTopup(amount * 10) as any
    const data = res?.data || res || {}
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl
    } else if (data.url) {
      window.location.href = data.url
    } else {
      showToast('success', 'درخواست شارژ ثبت شد')
      setAmount(topupAmountDisplay, topupAmountRaw, null)
    }
  } catch (e: any) {
    showToast('error', e?.data?.message || 'خطا در اتصال به درگاه پرداخت')
  } finally {
    topupLoading.value = false
  }
}

const handleReceiptFile = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    receiptFile.value = input.files[0]
  }
}

// v2.6.0: return to the booking session after top-up (e.g. /train-passengers/:uuid)
const returnAfterTopup = (delayMs = 800) => {
  const route = useRoute()
  const ret = route.query.return as string | undefined
  if (ret && ret.startsWith('/')) {
    setTimeout(() => navigateTo(ret), delayMs)
    return true
  }
  return false
}

const handleReceiptUpload = async () => {
  if (!receiptFile.value || !receiptAmountRaw.value) return
  receiptLoading.value = true
  try {
    const amount = receiptAmountRaw.value * 10 // convert to Rial
    await uploadReceipt(receiptFile.value, amount, receiptRef.value || undefined)
    showToast('success', 'فیش با موفقیت ارسال شد. پس از تایید ادمین، موجودی شما شارژ میشود.')
    setAmount(receiptAmountDisplay, receiptAmountRaw, null)
    receiptRef.value = ''
    receiptFile.value = null
    if (receiptFileInput.value) receiptFileInput.value.value = ''
    // v2.6.0: return to booking session if came from train-passengers
    returnAfterTopup()
  } catch (e: any) {
    showToast('error', e?.data?.message || 'خطا در آپلود فیش')
  } finally {
    receiptLoading.value = false
  }
}

const getTxIcon = (kind: string): string => {
  const icons: Record<string, string> = {
    topup_zarinpal: '💳',
    topup_receipt: '📄',
    topup_admin: '⚡',
    lock: '🔒',
    unlock: '🔓',
    charge: '🎫',
    refund: '↩️',
    commission_charge: '💸',
    adjustment: '⚙️',
    promo_discount: '🎁'
  }
  return icons[kind] || '💳'
}

const getTxIconBg = (kind: string): string => {
  const bg: Record<string, string> = {
    topup_zarinpal: 'bg-green-50',
    topup_receipt: 'bg-amber-50',
    topup_admin: 'bg-blue-50',
    unlock: 'bg-teal-50',
    charge: 'bg-red-50',
    refund: 'bg-purple-50',
    commission_charge: 'bg-gray-50'
  }
  return bg[kind] || 'bg-gray-50'
}

const getTxLabel = (kind: string): string => {
  const labels: Record<string, string> = {
    topup_zarinpal: 'شارژ از زرین‌پال',
    topup_receipt: 'شارژ با فیش بانکی',
    topup_admin: 'شارژ توسط ادمین',
    lock: 'مسدود شده',
    unlock: 'آزاد شده',
    charge: 'خرید بلیط',
    refund: 'استرداد',
    commission_charge: 'کارمزد',
    adjustment: 'تعدیل حساب',
    promo_discount: 'تخفیف'
  }
  return labels[kind] || kind
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return toPersianDigits(`${y}/${m}/${day} ${h}:${min}`)
  } catch {
    return dateStr
  }
}

onMounted(() => {
  fetchAll()
  fetchReceipts()
})
</script>
