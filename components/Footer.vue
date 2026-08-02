<template>
  <footer class="bg-dark text-white pt-12 pb-8 px-4" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
        <!-- Logo & Description -->
        <div class="lg:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-2 mb-4 hover:opacity-80 transition">
            <img src="/logo.svg" alt="RailNegar" class="h-10 w-auto" />
            <span class="text-white font-bold text-2xl font-heading mt-1.5">ریل‌نگار</span>
          </NuxtLink>
          <p class="text-gray-400 text-sm leading-relaxed mb-4">
            ربات هوشمند رزرو خودکار بلیط قطار. با ریل‌نگار، بلیط قطار مورد نظر خود را به راحتی و بدون دردسر رزرو کنید.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" class="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </a>
            <a href="#" class="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-bold text-lg mb-4 text-white">دسترسی سریع</h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="text-gray-400 hover:text-primary transition text-sm">
                {{ $t('home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/train" class="text-gray-400 hover:text-primary transition text-sm">
                {{ $t('ticket') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/profile/orders" class="text-gray-400 hover:text-primary transition text-sm">
                {{ $t('orders') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/profile/tickets" class="text-gray-400 hover:text-primary transition text-sm">
                {{ $t('tickets') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support Links -->
        <div>
          <h4 class="font-bold text-lg mb-4 text-white">پشتیبانی</h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/about" class="text-gray-400 hover:text-primary transition text-sm">
                {{ $t('about') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/terms" class="text-gray-400 hover:text-primary transition text-sm">
                {{ $t('terms') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/licences" class="text-gray-400 hover:text-primary transition text-sm">
                مجوزها و نماد اعتماد
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="font-bold text-lg mb-4 text-white">تماس با ما</h4>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div class="flex items-center gap-2">
                <a href="tel:02128421206" class="text-xl font-bold text-white hover:text-primary transition" dir="ltr">{{ toPersianDigits('021-28421206') }}</a>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-xl font-bold text-white text-right" dir="ltr">{{ toPersianDigits('7 / 24') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Enamad -->
        <div>
          <h4 class="font-bold text-lg mb-4 text-white">نماد اعتماد</h4>
          <NuxtLink
            to="/licences"
            class="hover:opacity-80 transition cursor-pointer inline-block"
            title="برای مشاهده مجوزها کلیک کنید"
          >
            <div class="bg-white rounded-xl p-2 shadow-lg">
              <img
                src="/img.png"
                alt="نماد اعتماد الکترونیکی"
                class="h-32 w-auto"
              >
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-700 pt-8">
        <div class="text-right">
          <p class="text-gray-300 text-sm">
            تمامی حقوق این سایت برای ریل نگار محفوظ است. {{ toPersianDigits(persianYear.toString()) }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { usePersianNumber } from '~/composables/utils/usePersianNumber'

const { toPersianDigits } = usePersianNumber()

const persianYear = 1404
</script>
