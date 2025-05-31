<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
            </path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">Appointment System</h2>
        <p class="text-gray-600 mt-1">Sign in to your account</p>
      </div>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input v-model="credentials.email" type="email" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="credentials.password" type="password" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••">
        </div>

        <button type="submit"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
          :disabled="loading">
          <span v-if="!loading">Sign In</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </button>

        <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {{ error }}
        </div>
      </form>

      <div class="text-center text-sm text-gray-600 mt-4">
        <p>Admin: admin@example.com / admin123</p>
        <p>Doctor: doctor@example.com / doctor123</p>
        <p>Patient: patient@example.com / patient123</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { UserLogin } from '@/stores/types'
import { AxiosError } from 'axios'

export default {
  setup() {
    const credentials = ref<UserLogin>({
      email: '',
      password: ''
    })
    const loading = ref(false)
    const error = ref<string | null>(null)
    const store = useStore()
    const router = useRouter()

    const login = async () => {
      loading.value = true
      error.value = null

      try {
        await store.dispatch('login', credentials.value)
        const role = store.getters.userRole
        router.push(`/${role}/dashboard`)
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>
        if (axiosError.response && axiosError.response.data?.message) {
          error.value = axiosError.response.data.message
        } else {
          error.value = 'Invalid email or password. Please try again.'
        }
      } finally {
        loading.value = false
      }
    }

    return { credentials, loading, error, login }
  }
}
</script>
