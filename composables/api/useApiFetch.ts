import { useRuntimeConfig } from '#app'

export const useApiFetch = async <T>(request: string, opts?: any) => {
  const config = useRuntimeConfig()
  
  // Create base headers and auto-inject API Key if we have it
  const headers: Record<string, string> = { ...opts?.headers }
  
  // Permanent API Key Architecture (as per docs)
  const isClient = typeof window !== 'undefined'
  if (isClient) {
    const apiKey = localStorage.getItem('rn-api-key')
    // don't inject for public endpoints
    if (apiKey && !request.includes('/public/')) {
      headers['x-api-key'] = apiKey
    }
  }

  try {
    const response = await $fetch<T>(request, {
      baseURL: config.public.apiBase,
      ...opts,
      headers
    })
    return response
  } catch (error: any) {
    // If not authenticated
    if (error.response?.status === 401) {
      if (isClient) {
        localStorage.removeItem('rn-api-key')
        window.location.href = '/auth/login'
      }
    }
    
    // Pass standard API errors
    throw error
  }
}
