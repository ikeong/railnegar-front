<template>
  <div class="support-page min-h-screen py-8 px-4 bg-gray-50" dir="rtl">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">پشتیبانی</h1>
        <button
          @click="openCreateModal"
          class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-teal-600 transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          تیکت جدید
        </button>
      </div>

      <!-- Guidance Banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 text-blue-900 mb-6 shadow-sm">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h3 class="font-bold text-sm sm:text-base text-blue-900 mb-1">راهنمای ثبت تیکت پشتیبانی:</h3>
            <p class="text-xs sm:text-sm text-blue-800 leading-relaxed">
              تمامی تیکتهای پشتیبانی باید حتماً متصل به یک شماره درخواست رزرو باشند. شما میتوانید تیکت جدید را مستقیماً از صفحه
              <NuxtLink to="/profile/orders" class="font-bold text-primary underline mx-1 hover:text-teal-700">درخواستهای رزرو</NuxtLink>
              با کلیک روی دکمه <strong>«پشتیبانی این درخواست»</strong> ثبت کنید.
            </p>
          </div>
        </div>
      </div>

      <!-- Status Tabs -->
      <div class="flex bg-white border border-gray-200 rounded-xl p-1 mb-5 gap-1 overflow-x-auto">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="activeStatus = tab.value; fetchTickets()"
          :class="['px-4 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap', activeStatus === tab.value ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50']"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-600">در حال دریافت تیکت‌ها...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 mb-3">{{ error }}</p>
        <button @click="fetchTickets" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">
          تلاش مجدد
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="tickets.length === 0" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
        <div class="text-4xl mb-3">🎫</div>
        <p class="text-gray-500 mb-4">تیکتی ثبت نکرده‌اید</p>
        <button @click="openCreateModal" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-teal-600 transition">
          ثبت اولین تیکت
        </button>
      </div>

      <!-- Ticket List -->
      <div v-else class="space-y-3">
        <div
          v-for="t in tickets"
          :key="t.id"
          @click="openTicket(t.id)"
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition cursor-pointer"
        >
          <div class="flex items-start justify-between gap-3 mb-2">
            <div class="flex-1 min-w-0">
              <div class="font-bold text-gray-900 mb-1">{{ t.subject }}</div>
              <div class="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                <span v-if="t.topic?.title" class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{{ t.topic.title }}</span>
                <span v-if="t.requestId" class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">درخواست #{{ toPersianDigits(String(t.requestId)) }}</span>
              </div>
            </div>
            <span :class="['px-3 py-1 rounded-full text-xs font-bold border shrink-0', getTicketStatusStyle(t.status)]">
              {{ getTicketStatusLabel(t.status) }}
            </span>
          </div>
          <div class="flex items-center justify-between text-xs text-gray-400 mt-3">
            <span>{{ formatDate(t.createdAt) }}</span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              {{ toPersianDigits(String(t.messages?.length || 0)) }} پیام
            </span>
          </div>
        </div>
      </div>

      <!-- ===== Ticket Detail View ===== -->
      <div v-if="detail" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" @click.self="detail = null">
        <div class="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
          <!-- Detail header -->
          <div class="p-4 sm:p-5 border-b border-gray-200 flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 mb-1">{{ detail.subject }}</h3>
              <div class="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                <span v-if="detail.topic?.title" class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{{ detail.topic.title }}</span>
                <span v-if="detail.requestId" class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">درخواست #{{ toPersianDigits(String(detail.requestId)) }}</span>
                <span :class="['px-2 py-0.5 rounded-full text-xs font-bold border', getTicketStatusStyle(detail.status)]">
                  {{ getTicketStatusLabel(detail.status) }}
                </span>
              </div>
            </div>
            <button @click="detail = null" class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gray-50/50">
            <div
              v-for="m in detail.messages"
              :key="m.id"
              :class="['max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed', m.senderType === 'client' ? 'bg-primary text-white mr-auto' : 'bg-white border border-gray-200 text-gray-800 ml-auto']"
            >
              <div :class="['text-[10px] mb-1.5 font-bold', m.senderType === 'client' ? 'text-white/70' : 'text-gray-400']">
                {{ m.senderType === 'client' ? 'شما' : 'پشتیبانی' }} • {{ formatDate(m.createdAt) }}
              </div>
              {{ m.message }}
            </div>
            <div v-if="!detail.messages?.length" class="text-center text-sm text-gray-400 py-6">پیامی وجود ندارد</div>
          </div>

          <!-- Reply box -->
          <div class="p-4 sm:p-5 border-t border-gray-200 bg-white">
            <div class="flex gap-2">
              <input
                v-model="replyText"
                type="text"
                placeholder="پیام خود را بنویسید..."
                class="flex-1 p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                @keyup.enter="sendReply"
              >
              <button
                @click="sendReply"
                :disabled="replyLoading || !replyText.trim()"
                class="px-5 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="replyLoading">در حال ارسال...</span>
                <span v-else>ارسال</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Create Ticket Modal ===== -->
      <div v-if="createOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" @click.self="createOpen = false">
        <div class="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-gray-900 text-lg">ثبت تیکت جدید</h3>
            <button @click="createOpen = false" class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <form @submit.prevent="submitCreate" class="space-y-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1.5">موضوع تیکت *</label>
              <select
                v-model="createForm.topicId"
                required
                class="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              >
                <option :value="null" disabled>انتخاب موضوع...</option>
                <option v-for="tp in topics" :key="tp.id" :value="tp.id">{{ tp.title }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs text-gray-600 mb-1.5">انتخاب شماره درخواست متصل (ثابت پس از ثبت) *</label>
              <select
                v-model="createForm.requestId"
                required
                class="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              >
                <option :value="null" disabled>انتخاب درخواست مربوطه...</option>
                <option v-for="o in myOrders" :key="o.uuid || o.id" :value="Number(o.id)">درخواست #{{ o.id }} — {{ getOrderSummary(o) }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs text-gray-600 mb-1.5">عنوان تیکت *</label>
              <input
                v-model="createForm.subject"
                type="text"
                required
                placeholder="خلاصه درخواست خود را بنویسید"
                class="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
            </div>

            <div>
              <label class="block text-xs text-gray-600 mb-1.5">شرح درخواست *</label>
              <textarea
                v-model="createForm.description"
                required
                rows="4"
                placeholder="توضیحات کامل..."
                class="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              ></textarea>
            </div>

            <div class="flex gap-3 pt-1">
              <button type="button" @click="createOpen = false" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                انصراف
              </button>
              <button type="submit" :disabled="createLoading" class="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-teal-600 transition disabled:opacity-50">
                <span v-if="createLoading">در حال ثبت...</span>
                <span v-else>ثبت تیکت</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toast :show="toast.show" :type="toast.type" :message="toast.message" @hide="toast.show = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupportTickets, type TicketTopic } from '~/composables/api/useSupportTickets'
import { useOrders } from '~/composables/api/useOrders'
import { usePersianNumber } from '~/composables/utils/usePersianNumber'
import { useToast } from '~/composables/useToast'
import Toast from '~/components/ui/Toast.vue'

const { formatPrice, toPersianDigits } = usePersianNumber()
const { getTopics, createTicket, getMyTickets, getTicketDetail, replyTicket } = useSupportTickets()
const { getOrders } = useOrders()
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

const statusTabs = [
  { value: '', label: 'همه' },
  { value: 'OPEN', label: 'باز' },
  { value: 'IN_PROGRESS', label: 'در حال بررسی' },
  { value: 'CLOSED', label: 'بسته شده' }
]

const activeStatus = ref('')
const tickets = ref<any[]>([])
const topics = ref<TicketTopic[]>([])
const myOrders = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const detail = ref<any>(null)
const replyText = ref('')
const replyLoading = ref(false)
const createOpen = ref(false)
const createLoading = ref(false)
const createForm = reactive<{ topicId: number | null; requestId: number | null; subject: string; description: string }>({
  topicId: null,
  requestId: null,
  subject: '',
  description: ''
})

const getTicketStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    OPEN: 'باز',
    IN_PROGRESS: 'در حال بررسی',
    CLOSED: 'بسته شده'
  }
  return labels[status] || status
}

const getTicketStatusStyle = (status: string): string => {
  const styles: Record<string, string> = {
    OPEN: 'bg-green-50 text-green-700 border-green-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
    CLOSED: 'bg-gray-50 text-gray-500 border-gray-200'
  }
  return styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'
}

const getOrderSummary = (o: any): string => {
  const from = o.subRequests?.[0]?.fromStation?.name || o.fromName || ''
  const to = o.subRequests?.[0]?.toStation?.name || o.toName || ''
  return `${from} → ${to}`.replace(' → ', ' به ') || 'درخواست رزرو'
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return toPersianDigits(
      `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    )
  } catch {
    return dateStr
  }
}

const fetchTickets = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getMyTickets({ status: activeStatus.value || undefined, take: 50 }) as any
    const data = res?.data || res || {}
    tickets.value = data.items || data.tickets || data.data || []
  } catch (e: any) {
    error.value = e?.data?.message || 'خطا در دریافت تیکت‌ها'
  } finally {
    loading.value = false
  }
}

const loadMeta = async () => {
  try {
    const [topicsRes, ordersRes] = await Promise.all([
      getTopics() as any,
      getOrders({ take: 20 }) as any
    ])
    const tData = topicsRes?.data || topicsRes || []
    topics.value = Array.isArray(tData) ? tData : tData.items || []
    const oData = ordersRes?.data || ordersRes || {}
    myOrders.value = oData.items || []
  } catch (e) {
    console.error('Failed to load ticket meta:', e)
  }
}

const openTicket = async (id: number) => {
  try {
    const res = await getTicketDetail(id) as any
    const data = res?.data || res || {}
    detail.value = data.ticket || data
  } catch (e: any) {
    showToast('error', e?.data?.message || 'خطا در دریافت جزئیات تیکت')
  }
}

const sendReply = async () => {
  if (!detail.value || !replyText.value.trim()) return
  replyLoading.value = true
  try {
    const res = await replyTicket(detail.value.id, replyText.value.trim()) as any
    const data = res?.data || res || {}
    const updated = data.ticket || data
    if (updated?.messages) detail.value = updated
    else await openTicket(detail.value.id)
    replyText.value = ''
    showToast('success', 'پیام شما ارسال شد')
  } catch (e: any) {
    showToast('error', e?.data?.message || 'خطا در ارسال پیام')
  } finally {
    replyLoading.value = false
  }
}

const openCreateModal = () => {
  createForm.topicId = null
  createForm.requestId = null
  createForm.subject = ''
  createForm.description = ''
  createOpen.value = true
}

const submitCreate = async () => {
  if (!createForm.topicId || !createForm.requestId || !createForm.subject || !createForm.description) {
    showToast('warning', 'لطفاً تمامی فیلدها از جمله شماره درخواست متصل را انتخاب کنید')
    return
  }
  createLoading.value = true
  try {
    await createTicket({
      topicId: createForm.topicId,
      requestId: createForm.requestId,
      subject: createForm.subject,
      description: createForm.description
    })
    createOpen.value = false
    showToast('success', 'تیکت شما با موفقیت ثبت شد')
    await fetchTickets()
  } catch (e: any) {
    showToast('error', e?.data?.message || 'خطا در ثبت تیکت')
  } finally {
    createLoading.value = false
  }
}

onMounted(() => {
  fetchTickets()
  loadMeta()
})
</script>
