// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', 'nuxt-auth-utils'],
  typescript: {
    tsConfig: {
      compilerOptions: {
        useUnknownInCatchVariables: false
      }
    }
  },
  eslint: {
    config: {
      standalone: false
    }
  },
  nitro: {
    imports: {
      dirs: ['./server/services']
    }
  }
})