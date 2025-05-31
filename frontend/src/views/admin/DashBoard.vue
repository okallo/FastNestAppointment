<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      <div class="flex items-center space-x-4">
        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Admin
        </span>
        <button @click="logout" class="flex items-center text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
        <h3 class="text-lg font-medium text-gray-700 mb-2">Doctors</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats.doctors }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
        <h3 class="text-lg font-medium text-gray-700 mb-2">Patients</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats.patients }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
        <h3 class="text-lg font-medium text-gray-700 mb-2">Appointments</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats.appointments }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <ul class="space-y-4">
          <li v-for="(log, index) in auditLogs" :key="index" class="border-b pb-3 last:border-0 last:pb-0">
            <div class="flex justify-between">
              <span class="font-medium">{{ log.action }}</span>
              <span class="text-sm text-gray-500">{{ formatTime(log.timestamp) }}</span>
            </div>
            <p class="text-gray-600 text-sm mt-1">{{ log.details }}</p>
            <p class="text-xs text-gray-400 mt-1">By: {{ log.actor_email }}</p>
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-4">
          <router-link to="/admin/doctors"
            class="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition duration-200">
            <div class="mx-auto w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <span class="font-medium text-gray-700">Manage Doctors</span>
          </router-link>

          <router-link to="/admin/patients"
            class="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition duration-200">
            <div class="mx-auto w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                </path>
              </svg>
            </div>
            <span class="font-medium text-gray-700">Manage Patients</span>
          </router-link>

          <router-link to="/admin/appointments"
            class="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition duration-200">
            <div class="mx-auto w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span class="font-medium text-gray-700">View Appointments</span>
          </router-link>

          <router-link to="/admin/audit"
            class="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition duration-200">
            <div class="mx-auto w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
              </svg>
            </div>
            <span class="font-medium text-gray-700">Audit Logs</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
interface AuditLog {
  id?: number
  action: string
  details: string
  actor_email: string
  timestamp: string | Date
}

import auditData from '@/assets/data/auditLogs.json'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const stats = ref({
      doctors: 12,
      patients: 85,
      appointments: 42
    })
    const auditLogs = ref<AuditLog[]>([])

    const logout = () => {
      store.dispatch('logout')
      router.push('/login')
    }

    const formatTime = (timestamp: string | number | Date): string => {
      return new Date(timestamp).toLocaleString()
    }

    onMounted(() => {
      auditLogs.value = (auditData as AuditLog[]).slice(0, 5)
    })

    return { stats, auditLogs, logout, formatTime }
  }
}
</script>
