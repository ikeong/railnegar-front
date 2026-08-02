<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 border-b border-gray-100 transition-all duration-300"
    :class="isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'"
    dir="rtl"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo - Right Side -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition">
            <img src="/logo.svg" alt="RailNegar" class="h-10 w-auto" />
            <span class="text-gray-900 font-bold text-2xl font-heading mt-1.5">ریل‌نگار</span>
          </NuxtLink>
        </div>

        <!-- Navigation Links - Centered -->
        <div class="hidden md:flex items-center gap-6">
          <NuxtLink
            to="/train"
            :class="isActive('/train') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
            class="transition font-medium"
          >
            {{ $t('ticket') }}
          </NuxtLink>
          <NuxtLink
            to="/profile/orders"
            :class="isActive('/profile/orders') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
            class="transition font-medium"
          >
            {{ $t('orders') }}
          </NuxtLink>
          <NuxtLink
            to="/profile/wallet"
            :class="isActive('/profile/wallet') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
            class="transition font-medium"
          >
            {{ $t('wallet') }}
          </NuxtLink>
          <NuxtLink
            to="/profile/support"
            :class="isActive('/profile/support') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
            class="transition font-medium"
          >
            پشتیبانی
          </NuxtLink>
          <NuxtLink
            to="/profile/passengers"
            :class="isActive('/profile/passengers') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
            class="transition font-medium"
          >
            مسافران
          </NuxtLink>
          <NuxtLink
            to="/agencies"
            :class="isActive('/agencies') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
            class="transition font-medium"
          >
            آژانس ها و شرکت ها
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button, Phone & Login - Left Side -->
        <div class="flex items-center gap-4">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 rounded-lg text-gray-800 hover:text-gray-700 hover:bg-gray-100 transition relative z-[60]"
            :class="isMobileMenuOpen ? 'bg-gray-100' : ''"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>

          <a
            href="tel:021-12345678"
            class="hidden md:flex items-center gap-2 text-gray-700 hover:text-primary transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span class="font-medium">۰۲۱-۱۲۳۴۵۶۷۸</span>
          </a>

          <template v-if="isLoggedIn">
            <NuxtLink
              to="/profile"
              class="hidden sm:block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition"
            >
              پروفایل
            </NuxtLink>
            <button
              @click="handleLogout"
              class="hidden sm:block px-3 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition text-sm"
              title="خروج"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </template>
          <NuxtLink
            v-else
            to="/auth/login"
            class="hidden sm:block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition"
          >
            {{ $t('login') }}
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>

  <!-- Spacer to prevent content from hiding behind fixed header -->
  <div class="h-16"></div>

  <!-- Mobile Menu Overlay - Outside header to avoid z-index conflicts -->
  <Transition name="fade">
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden fixed inset-0 bg-black/50 z-[55]"
      @click="isMobileMenuOpen = false"
    ></div>
  </Transition>

  <!-- Mobile Menu Drawer - Outside header to avoid z-index conflicts -->
  <Transition name="slide">
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden fixed top-0 left-0 h-full w-72 bg-white z-[60] shadow-2xl overflow-y-auto"
      dir="rtl"
    >
          <div class="p-6 flex flex-col gap-4">
            <div class="flex justify-between items-center mb-4">
              <span class="text-gray-900 font-bold text-xl font-heading">منو</span>
              <button
                @click="isMobileMenuOpen = false"
                class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <NuxtLink
              to="/train"
              :class="isActive('/train') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
              class="transition py-3 px-4 rounded-lg hover:bg-gray-50"
              @click="isMobileMenuOpen = false"
            >
              {{ $t('ticket') }}
            </NuxtLink>
            <NuxtLink
              to="/profile/orders"
              :class="isActive('/profile/orders') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
              class="transition py-3 px-4 rounded-lg hover:bg-gray-50"
              @click="isMobileMenuOpen = false"
            >
              {{ $t('orders') }}
            </NuxtLink>
            <NuxtLink
              to="/profile/wallet"
              :class="isActive('/profile/wallet') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
              class="transition py-3 px-4 rounded-lg hover:bg-gray-50"
              @click="isMobileMenuOpen = false"
            >
              {{ $t('wallet') }}
            </NuxtLink>
            <NuxtLink
              to="/profile/support"
              :class="isActive('/profile/support') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
              class="transition py-3 px-4 rounded-lg hover:bg-gray-50"
              @click="isMobileMenuOpen = false"
            >
              پشتیبانی
            </NuxtLink>
            <NuxtLink
              to="/profile/passengers"
              :class="isActive('/profile/passengers') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
              class="transition py-3 px-4 rounded-lg hover:bg-gray-50"
              @click="isMobileMenuOpen = false"
            >
              مسافران
            </NuxtLink>
            <NuxtLink
              to="/agencies"
              :class="isActive('/agencies') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'"
              class="transition py-3 px-4 rounded-lg hover:bg-gray-50"
              @click="isMobileMenuOpen = false"
            >
              آژانس ها و شرکت ها
            </NuxtLink>
            <a
              href="tel:021-12345678"
              class="flex items-center gap-2 text-gray-700 hover:text-primary transition py-3 px-4 rounded-lg hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="font-medium">۰۲۱-۱۲۳۴۵۶۷۸</span>
            </a>
            <template v-if="isLoggedIn">
              <NuxtLink
                to="/profile"
                class="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition text-center mt-4"
                @click="isMobileMenuOpen = false"
              >
                پروفایل
              </NuxtLink>
              <button
                @click="handleLogout; isMobileMenuOpen = false"
                class="text-red-500 hover:text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition text-center text-sm"
              >
                خروج از حساب
              </button>
            </template>
            <NuxtLink
              v-else
              to="/auth/login"
              class="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition text-center mt-4"
              @click="isMobileMenuOpen = false"
            >
              {{ $t('login') }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
</template>

<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/solid'
import { useActiveRoute } from '~/composables/useActiveRoute'

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const { isActive } = useActiveRoute()

const isLoggedIn = ref(false)
const isClient = ref(false)

const handleLogout = () => {
  localStorage.removeItem('rn-api-key')
  localStorage.removeItem('rn-logged-in')
  window.location.href = '/'
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

onMounted(() => {
  isClient.value = true
  isLoggedIn.value = !!localStorage.getItem('rn-api-key')
  // Listen for login/logout in other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'rn-api-key') {
      isLoggedIn.value = !!e.newValue
    }
  })
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Slide transition for mobile menu drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
