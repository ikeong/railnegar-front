import { useApiFetch } from './useApiFetch'

export const useTrain = () => {
  // Public search - Synchronous
  const searchTrains = async (params: { from: string, to: string, date: string }) => {
    return await useApiFetch<any>('/api/v1/public/search', {
      method: 'GET',
      params // uses from, to, date
    })
  }
  
  // Protected - Smart Booking Request
  const bookTrain = async (data: {
    from: string | number,
    to: string | number,
    date: string,
    passengers: any[]
  }) => {
    return await useApiFetch('/api/v1/booking-requests', {
      method: 'POST',
      body: data
    })
  }
  
  return { searchTrains, bookTrain }
}
