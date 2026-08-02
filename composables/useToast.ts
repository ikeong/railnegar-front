export const useToast = () => {
  const toast = ref({
    show: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    message: ''
  })
  
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string, duration = 3000) => {
    toast.value = {
      show: true,
      type,
      message
    }
    
    setTimeout(() => {
      toast.value.show = false
    }, duration)
  }
  
  return {
    toast,
    showToast
  }
}
