<template>
  <Transition name="modal">
    <div 
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="close"
    >
      <div 
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <div class="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
          {{ title }}
        </div>
        
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ message }}
        </p>
        
        <div class="flex gap-3 justify-end">
          <button 
            @click="close"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            انصراف
          </button>
          <button 
            @click="confirm"
            class="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium"
          >
            تأیید
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  title: string
  message: string
  onConfirm: () => void
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const close = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm')
  props.onConfirm()
  close()
}
</script>
