import { useApiFetch } from './useApiFetch'

export interface PassengerInput {
  firstName: string
  lastName: string
  gender?: 'MALE' | 'FEMALE'
  birthDate?: string
  nationalId: string
  isForeign?: boolean
  phone?: string
  resolution?: 'reject' | 'replace' | 'merge'
}

export interface NewPassengerInput extends PassengerInput {
  position?: number
}

export const usePassengers = () => {
  /** Quick search / autocomplete — q: name/lastName/nationalId (empty → recent) */
  const searchPassengers = async (q?: string, limit = 20) => {
    const query = new URLSearchParams()
    if (q) query.set('q', q)
    query.set('limit', String(limit))
    return await useApiFetch<any>(`/api/v1/passengers/search?${query.toString()}`, {
      method: 'GET'
    })
  }

  /** Full list of my passengers (paginated) */
  const listPassengers = async (params?: { skip?: number; take?: number; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.skip) query.set('skip', String(params.skip))
    if (params?.take) query.set('take', String(params.take))
    if (params?.search) query.set('search', params.search)
    const qs = query.toString()
    return await useApiFetch<any>(`/api/v1/passengers${qs ? `?${qs}` : ''}`, {
      method: 'GET'
    })
  }

  /** Create or update (upsert by nationalId — resolution: replace/merge/reject) */
  const savePassenger = async (input: PassengerInput) => {
    return await useApiFetch<any>('/api/v1/passengers', {
      method: 'POST',
      body: input
    })
  }

  /** Update a specific passenger by id */
  const updatePassenger = async (id: number | string, input: Partial<PassengerInput>) => {
    return await useApiFetch<any>(`/api/v1/passengers/${id}`, {
      method: 'PUT',
      body: input
    })
  }

  /** Delete (archives if used in past requests) */
  const deletePassenger = async (id: number | string) => {
    return await useApiFetch<any>(`/api/v1/passengers/${id}`, {
      method: 'DELETE'
    })
  }

  return { searchPassengers, listPassengers, savePassenger, updatePassenger, deletePassenger }
}
