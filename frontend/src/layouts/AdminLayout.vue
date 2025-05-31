<template>
  <div class="min-h-screen bg-admin-bg">
    <RBAC :allowed-roles="['admin']" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="md:flex">
        <!-- Sidebar -->
        <div class="md:w-64 mb-6 md:mb-0 md:mr-6">
          <div class="bg-white rounded-xl shadow p-4">
            <div class="flex items-center mb-6">
              <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                {{ userInitials }}
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ currentUser.username }}</p>
                <p class="text-sm text-gray-500">Administrator</p>
              </div>
            </div>

            <nav class="space-y-1">
              <router-link v-for="(link, index) in navigation" :key="index" :to="link.to"
                class="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 group"
                :class="{ 'bg-blue-50 text-blue-700': $route.path.startsWith(link.to) }">
                <component :is="link.icon" class="w-5 h-5 mr-3" :class="{
                  'text-blue-600': $route.path.startsWith(link.to),
                  'text-gray-500 group-hover:text-gray-700': !$route.path.startsWith(link.to)
                }" />
                <span class="text-sm font-medium">{{ link.name }}</span>
              </router-link>
            </nav>
          </div>
        </div>

        <!-- Main content -->
        <div class="flex-1">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import RBAC from '@/components/RBAC.vue'
import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'


export default {
  components: { RBAC },
  setup() {
    const store = useStore()
    const currentUser = computed(() => store.getters.currentUser)

    const userInitials = computed(() => {
      if (!currentUser.value?.username) return 'A'
      return currentUser.value.username
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    })

    const navigation = [
      { name: 'Dashboard', to: '/admin/dashboard', icon: HomeIcon },
      { name: 'Doctors', to: '/admin/doctors', icon: UserGroupIcon },
      { name: 'Patients', to: '/admin/patients', icon: UserIcon },
      { name: 'Appointments', to: '/admin/appointments', icon: CalendarIcon },
      { name: 'Audit Logs', to: '/admin/audit', icon: DocumentTextIcon }
    ]

    return { currentUser, userInitials, navigation }
  }
}
</script>
