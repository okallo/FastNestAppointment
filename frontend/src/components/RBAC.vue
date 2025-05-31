<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <div class="h-8 w-8 bg-blue-600 rounded-full"></div>
            <span class="ml-2 text-xl font-bold text-gray-900 hidden sm:block">MedAppoint</span>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link v-for="(link, index) in filteredLinks" :key="index" :to="link.to"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" :class="{
                'border-blue-500 text-gray-900': $route.path.startsWith(link.to),
                'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': !$route.path.startsWith(link.to)
              }">
              {{ link.name }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {{ userRole }}
            </span>
          </div>
          <div class="ml-3 relative">
            <div class="flex items-center">
              <button class="bg-white rounded-full flex text-sm focus:outline-none">
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {{ userInitials }}
                </div>
              </button>
            </div>

            <div
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden">
              <div class="py-1">
                <button @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

type Role = 'admin' | 'doctor' | 'patient'

export default {
  props: {
    allowedRoles: {
      type: Array as () => Role[],
      required: true
    }
  },
  setup(props) {
    console.log(props)
    const store = useStore()
    const router = useRouter()

    const userRole = computed(() => store.getters.userRole as Role | undefined)
    const userName = computed(() => store.getters.currentUser?.username || '')

    const userInitials = computed(() => {
      if (!userName.value) return 'U'
      return userName.value
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    })

    const navigationLinks: Record<Role, { name: string; to: string }[]> = {
      admin: [
        { name: 'Dashboard', to: '/admin/dashboard' },
        { name: 'Doctors', to: '/admin/doctors' },
        { name: 'Patients', to: '/admin/patients' },
        { name: 'Appointments', to: '/admin/appointments' }
      ],
      doctor: [
        { name: 'Dashboard', to: '/doctor/dashboard' },
        { name: 'Availability', to: '/doctor/availability' },
        { name: 'Appointments', to: '/doctor/appointments' },
        { name: 'Medical Records', to: '/doctor/records' }
      ],
      patient: [
        { name: 'Dashboard', to: '/patient/dashboard' },
        { name: 'Appointments', to: '/patient/appointments' },
        { name: 'Book Appointment', to: '/patient/book' }
      ]
    }

    const filteredLinks = computed(() => {
      return userRole.value ? navigationLinks[userRole.value] : []
    })

    const logout = () => {
      store.dispatch('logout')
      router.push('/login')
    }

    return { userRole, userInitials, filteredLinks, logout }
  }
}
</script>
