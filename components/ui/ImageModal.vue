<template>
  <Transition name="modal">
    <div 
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="close"
    >
      <div 
        class="relative bg-white rounded-xl shadow-2xl p-4 max-w-4xl max-h-[90vh] overflow-auto"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="close"
          class="absolute top-2 left-2 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <!-- Image -->
        <img
          :src="imageSrc"
          :alt="alt"
          class="w-full h-auto object-contain"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  imageSrc: string
  alt: string
}>()

const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}

// Close on Escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.show) {
      close()
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
