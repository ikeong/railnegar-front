import { useApiFetch } from './useApiFetch'

export const useWallet = () => {
  const getBalance = async () => {
    return await useApiFetch<any>('/api/v1/wallet/balance', {
      method: 'GET'
    })
  }

  const getLedger = async (params?: {
    skip?: number
    take?: number
    kind?: string
    refType?: string
    since?: string
    until?: string
  }) => {
    const query = new URLSearchParams()
    if (params?.skip) query.set('skip', String(params.skip))
    if (params?.take) query.set('take', String(params.take))
    if (params?.kind) query.set('kind', params.kind)
    if (params?.refType) query.set('refType', params.refType)
    if (params?.since) query.set('since', params.since)
    if (params?.until) query.set('until', params.until)
    const qs = query.toString()
    return await useApiFetch<any>(`/api/v1/wallet/ledger${qs ? `?${qs}` : ''}`, {
      method: 'GET'
    })
  }

  const getTier = async () => {
    return await useApiFetch<any>('/api/v1/wallet/tier', {
      method: 'GET'
    })
  }

  const initTopup = async (amountRial: number, mobile?: string, description?: string) => {
    return await useApiFetch<any>('/api/v1/topup/zarinpal/init', {
      method: 'POST',
      body: {
        amountRial,
        mobile,
        description: description || 'شارژ کیف پول'
      }
    })
  }

  const uploadReceipt = async (file: File, amountRial: number, bankRef?: string, note?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('amountRial', String(amountRial))
    if (bankRef) formData.append('bankRef', bankRef)
    if (note) formData.append('note', note)
    return await useApiFetch<any>('/api/v1/topup/receipt/upload', {
      method: 'POST',
      body: formData,
      headers: {} // let fetch set content-type for multipart
    })
  }

  const getReceipts = async (params?: { status?: string; skip?: number; take?: number }) => {
    const query = new URLSearchParams()
    if (params?.status) query.set('status', params.status)
    if (params?.skip) query.set('skip', String(params.skip))
    if (params?.take) query.set('take', String(params.take))
    const qs = query.toString()
    return await useApiFetch<any>(`/api/v1/topup/receipt${qs ? `?${qs}` : ''}`, {
      method: 'GET'
    })
  }

  /**
   * v2.4.0: build secure public receipt image URL from the receipt UUID
   * (no admin key in URL — backend serves via /api/v1/public/topup/receipt/image/:uuid)
   */
  const getReceiptImageUrl = (uuid: string | null | undefined): string => {
    if (!uuid) return ''
    return `/api/v1/public/topup/receipt/image/${uuid}`
  }

  return { getBalance, getLedger, getTier, initTopup, uploadReceipt, getReceipts, getReceiptImageUrl }
}
