import { useApiFetch } from './useApiFetch'

export interface TicketTopic {
  id: number
  title: string
  isActive?: boolean
}

export interface CreateTicketInput {
  topicId: number
  requestId: number
  subject: string
  description: string
}

export const useSupportTickets = () => {
  /** List ticket topics/categories */
  const getTopics = async () => {
    return await useApiFetch<any>('/api/v1/support-tickets/topics', {
      method: 'GET'
    })
  }

  /** Create a new support ticket (optionally linked to a booking request) */
  const createTicket = async (input: CreateTicketInput) => {
    return await useApiFetch<any>('/api/v1/support-tickets', {
      method: 'POST',
      body: input
    })
  }

  /** List my tickets (optional status filter) */
  const getMyTickets = async (params?: {
    status?: string
    skip?: number
    take?: number
  }) => {
    const query = new URLSearchParams()
    if (params?.status) query.set('status', params.status)
    if (params?.skip) query.set('skip', String(params.skip))
    if (params?.take) query.set('take', String(params.take))
    const qs = query.toString()
    return await useApiFetch<any>(`/api/v1/support-tickets${qs ? `?${qs}` : ''}`, {
      method: 'GET'
    })
  }

  /** Get ticket detail + messages */
  const getTicketDetail = async (id: number | string) => {
    return await useApiFetch<any>(`/api/v1/support-tickets/${id}`, {
      method: 'GET'
    })
  }

  /** Reply to a ticket */
  const replyTicket = async (id: number | string, message: string) => {
    return await useApiFetch<any>(`/api/v1/support-tickets/${id}/reply`, {
      method: 'POST',
      body: { message }
    })
  }

  return { getTopics, createTicket, getMyTickets, getTicketDetail, replyTicket }
}
