export const useOTP = () => {
  const countdown = ref(60)
  const canResend = ref(false)
  const isSending = ref(false)
  
  const sendOTP = async (mobile: string) => {
    isSending.value = true
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      })
      
      countdown.value = 60
      canResend.value = false
      
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
          canResend.value = true
        }
      }, 1000)
      
      return { success: true }
    } catch (error) {
      isSending.value = false
      return { success: false, error }
    }
  }
  
  const verifyOTP = async (mobile: string, code: string) => {
    isSending.value = true
    try {
      await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: code })
      })
      
      return { success: true }
    } catch (error) {
      isSending.value = false
      return { success: false, error }
    }
  }
  
  return {
    countdown,
    canResend,
    isSending,
    sendOTP,
    verifyOTP
  }
}
