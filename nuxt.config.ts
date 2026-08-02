export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiBase: 'https://railapi.happyupload.com'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode'
  ],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  i18n: {
    defaultLocale: 'fa',
    locales: [
      { code: 'fa', iso: 'fa-IR', file: 'fa.json', name: 'فارسی' }
    ],
    langDir: 'locales',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts'
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'ریل‌نگار - ربات هوشمند رزرو خودکار بلیط قطار' }
      ],
      title: 'ریل‌نگار | ربات هوشمند رزرو خودکار بلیط قطار',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },

  ssr: true
})
