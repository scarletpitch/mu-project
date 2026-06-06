export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  experimental: {
    appManifest: false
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  app: {
    head: {
      title: 'Madame Mu',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#5B2E7A' }
      ]
    }
  }
})
