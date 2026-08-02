<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 transform translate-y-4"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-4"
  >
    <div 
      v-if="show"
      :class="[
        'fixed top-4 right-4 z-50',
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-primary-500',
        'text-white p-4 rounded-lg shadow-lg',
        'flex items-center gap-3'
      ]"
    >
      <div v-if="type === 'success'" class="text-xl">✓</div>
      <div v-if="type === 'error'" class="text-xl">✕</div>
      <div v-if="type === 'warning'" class="text-xl">⚠</div>
      <div v-if="type === 'info'" class="text-xl">ℹ</div>
      <p class="flex-1">{{ message }}</p>
      <button 
        @click="hide"
        class="text-white opacity-80 hover:opacity-100 ml-4"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}>()

const emit = defineEmits<{
  hide: []
}>()

const hide = () => {
  emit('hide')
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      hide()
    }, 3000)
  }
})
</script>
