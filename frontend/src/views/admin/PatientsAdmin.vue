<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Manage Patients</h1>
      <router-link to="/admin/patients/create"
        class="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Patient
      </router-link>
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <div v-if="loading" class="flex justify-center py-12">
        <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      </div>

      <div v-else>
        <div v-if="patients.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
            </path>
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No patients</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by adding a new patient.</p>
          <div class="mt-6">
            <router-link to="/admin/patients/create"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                </path>
              </svg>
              Add Patient
            </router-link>
          </div>
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Insurance
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appointments
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="patient in patients" :key="patient.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {{ patientInitials(patient.user.username) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ patient.user.username }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ patient.user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ patient.insurance_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ patientAppointmentsCount[patient.id] ?? 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <router-link :to="`/admin/patients/${patient.id}`" class="text-blue-600 hover:text-blue-900 mr-4">
                  View
                </router-link>
                <button @click="deletePatient(patient.id)" class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import patientAPI from '../../api/patient'
import appointmentApi from '../../api/appointment'
import type { PatientOut } from '@/stores/types'



export default {
  setup() {
    const patients = ref < PatientOut[] > ([])
    const loading = ref(true)
    const patientAppointmentsCount = ref < Record < string, number>> ({})

    const loadPatients = async () => {
      loading.value = true
      try {
        const response = await patientAPI.getAllPatients()
        patients.value = response.data

        // Fetch appointment counts for each patient
        for (const patient of patients.value) {
          try {
            const res = await appointmentApi.getPatientAppointments(patient.id)
            patientAppointmentsCount.value[patient.id] = res.data.length
          } catch (error) {
            console.error(`Failed to fetch appointments for patient ${patient.id}:`, error)
            patientAppointmentsCount.value[patient.id] = 0
          }
        }

      } catch (error) {
        console.error('Failed to fetch patients:', error)
      } finally {
        loading.value = false
      }
    }


    const patientInitials = (name: string) => {
      if (!name) return 'P'
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }

    const deletePatient = async (patientId: string) => {
      if (!confirm('Are you sure you want to delete this patient? This action cannot be undone.')) return

      try {
        await patientAPI.deletePatient(patientId)
        await loadPatients()
      } catch (error) {
        console.error('Failed to delete patient:', error)
        alert('Failed to delete patient. Please try again.')
      }
    }

    onMounted(loadPatients)

    return {
      patients,
      loading,
      patientInitials,
      deletePatient,
      patientAppointmentsCount
    }
  }
}
</script>
