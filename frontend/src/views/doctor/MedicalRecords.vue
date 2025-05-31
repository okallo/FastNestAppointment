<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Medical Records</h1>

    <div class="mb-6">
      <div class="relative">
        <input v-model="searchQuery" type="text" placeholder="Search by patient name..."
          class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

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
      <div v-if="filteredRecords.length === 0" class="bg-white rounded-xl shadow p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
          </path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No medical records</h3>
        <p class="mt-1 text-sm text-gray-500">Create medical records after completing appointments.</p>
      </div>

      <div v-else class="space-y-6">
        <div v-for="record in filteredRecords" :key="record.id" class="bg-white rounded-xl shadow overflow-hidden">
          <div class="p-5 border-b border-gray-200">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ record.appointment.patient.user.username }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ formatDate(record.created_at) }}
                </p>
              </div>
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                Dr. {{ record.appointment.doctor.user.username }}
              </span>
            </div>
          </div>

          <div class="p-5">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Appointment Details</h4>
            <p class="text-gray-600">
              {{ formatDate(record.appointment.start_time) }} at {{ formatTime(record.appointment.start_time) }}
            </p>

            <h4 class="text-sm font-medium text-gray-700 mt-4 mb-2">Medical Notes</h4>
            <p class="text-gray-800 whitespace-pre-line">{{ record.notes }}</p>

            <div class="mt-4 flex justify-end">
              <button @click="editRecord(record)" class="text-blue-600 hover:text-blue-900 mr-4">
                Edit
              </button>
              <button @click="deleteRecord(record.id)" class="text-red-600 hover:text-red-900">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingRecord" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">Edit Medical Record</h2>
            <button @click="editingRecord = null">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="updateRecord">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Medical Notes
              </label>
              <textarea v-model="editingRecord.notes" rows="8" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter medical notes and observations..."></textarea>
            </div>

            <div class="flex justify-end">
              <button type="button" @click="editingRecord = null"
                class="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center">
                Update Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue'
//import { useStore } from 'vuex'
import medicalRecordAPI from '../../api/medicalRecord'
import type { MedicalRecordOut } from '@/stores/types'


export default {
  setup() {
    //const store = useStore()
    const medicalRecords = ref<MedicalRecordOut[]>([])
    const loading = ref(true)
    const searchQuery = ref('')
    const editingRecord = ref<MedicalRecordOut | null>(null)

    const loadRecords = async () => {
      loading.value = true
      try {
        const response = await medicalRecordAPI.getMyRecords()
        medicalRecords.value = response.data
      } catch (error) {
        console.error('Failed to fetch medical records:', error)
      } finally {
        loading.value = false
      }
    }

    const deleteRecord = async (id: string) => {
      if (!confirm('Are you sure you want to delete this medical record?')) return

      try {
        await medicalRecordAPI.deleteRecord(id)
        await loadRecords()
      } catch (error) {
        console.error('Failed to delete medical record:', error)
      }
    }

    const updateRecord = async () => {
      try {
        await medicalRecordAPI.updateRecord(
          editingRecord.value!.id,
          { notes: editingRecord.value!.notes }
        )
        editingRecord.value = null
        await loadRecords()
      } catch (error) {
        console.error('Failed to update medical record:', error)
      }
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatTime = (dateString: string) => {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const filteredRecords = computed(() => {
      if (!searchQuery.value) return medicalRecords.value
      const query = searchQuery.value.toLowerCase()
      return medicalRecords.value.filter(record =>
        record.appointment.patient.user.username.toLowerCase().includes(query)
      )
    })

    onMounted(loadRecords)

    return {
      medicalRecords,
      loading,
      searchQuery,
      editingRecord,
      filteredRecords,
      deleteRecord,
      updateRecord,
      formatDate,
      formatTime,
      editRecord: (record: MedicalRecordOut) => editingRecord.value = { ...record }
    }
  }
}
</script>
