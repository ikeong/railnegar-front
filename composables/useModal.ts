export const useModal = () => {
  const modal = ref({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })
  
  const showModal = (title: string, message: string, onConfirm: () => void) => {
    modal.value = {
      show: true,
      title,
      message,
      onConfirm
    }
  }
  
  const closeModal = () => {
    modal.value.show = false
  }
  
  const confirm = () => {
    modal.value.onConfirm()
    closeModal()
  }
  
  return {
    modal,
    showModal,
    closeModal,
    confirm
  }
}
