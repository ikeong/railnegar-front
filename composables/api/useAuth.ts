import { useApiFetch } from './useApiFetch'

export const useAuth = () => {
  // Step 1: Send OTP
  const login = async (mobile: string) => {
    return await useApiFetch('/api/v1/public/auth/send-otp', {
      method: 'POST',
      body: { phone: mobile }
    })
  }
  
  // Registration is unified in send-otp in the real API, 
  // but if front-end still forces a register form, it might be unused or combined.
  const register = async (data: { name: string, mobile: string, email: string }) => {
    // In our backend doc, register and login are unified.
    return await useApiFetch('/api/v1/public/auth/send-otp', {
      method: 'POST',
      body: { phone: data.mobile }
    })
  }
  
  // Step 2: Verify OTP
  const verifyOTP = async (mobile: string, otp: string) => {
    return await useApiFetch<any>('/api/v1/public/auth/verify-otp', {
      method: 'POST',
      body: { phone: mobile, code: otp }
    })
  }
  
  return { login, register, verifyOTP }
}
