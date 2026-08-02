export const useRoutes = () => {
  const getStations = async () => {
    return await useApiFetch<any>('/api/v1/public/stations', {
      method: 'GET'
    })
  }
  
  return { getStations }
}
