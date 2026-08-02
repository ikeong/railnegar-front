import { useApiFetch } from './useApiFetch'

export const useTickets = () => {
  const getTickets = async () => {
    return await useApiFetch<any>('/api/passengers', {
      method: 'GET'
    })
  }
  
  return { getTickets }
}
