<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Manage Availability</h1>
      <button @click="showAddForm = !showAddForm"
        class="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Time Slot
      </button>
    </div>

    <div v-if="showAddForm" class="bg-white rounded-xl shadow p-6 mb-8">
      <h2 class="text-xl font-medium text-gray-800 mb-4">Add New Availability Slot</h2>
      <form @submit.prevent="addSlot" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input type="datetime-local" v-model="newSlot.start_time" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input type="datetime-local" v-model="newSlot.end_time" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div class="md:col-span-2 flex justify-end space-x-3 mt-2">
          <button type="button" @click="showAddForm = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center">
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Add Slot
          </button>
        </div>
      </form>
    </div>

    <div v-if="loadingSlots" class="flex justify-center py-12">
      <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>

    <div v-else>
      <div v-if="availability.length === 0" class="bg-white rounded-xl shadow p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
          </path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No availability slots</h3>
        <p class="mt-1 text-sm text-gray-500">Add your first availability slot to start receiving appointments.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="slot in availability" :key="slot.id" class="bg-white rounded-xl shadow overflow-hidden border-l-4"
          :class="{
            'border-green-500': !slot.is_booked,
            'border-red-500': slot.is_booked
          }">
          <div class="p-5">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-800">
                  {{ formatDate(slot.start_time) }}
                </h3>
                <p class="text-gray-600 mt-1">
                  {{ formatTime(slot.start_time) }} - {{ formatTime(slot.end_time) }}
                </p>
              </div>
              <span class="px-2 py-1 rounded-full text-xs font-medium" :class="{
                'bg-green-100 text-green-800': !slot.is_booked,
                'bg-red-100 text-red-800': slot.is_booked
              }">
                {{ slot.is_booked ? 'Booked' : 'Available' }}
              </span>
            </div>

            <div class="mt-4 flex justify-between">
              <button @click="deleteSlot(slot.id)" :disabled="slot.is_booked"
                class="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                  </path>
                </svg>
                Delete
              </button>

              <button v-if="!slot.is_booked" class="text-blue-600 hover:text-blue-800 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import availabilityAPI from '@/api/availability'
import type { AvailabilityOut } from '@/stores/types'
export default {
  setup() {
    const store = useStore()
    const availability = ref<AvailabilityOut[]>([])
    const loadingSlots = ref(true)
    const showAddForm = ref(false)
    const loading = ref(false)

    const newSlot = ref({
      start_time: '',
      end_time: '',
      day_of_week: new Date().getDay()
    })

    const loadAvailability = async () => {
      loadingSlots.value = true
      try {
        const doctorId = store.getters.currentUser.id
        const response = await availabilityAPI.getDoctorAvailability(doctorId)
        availability.value = response.data
      } catch (error) {
        console.error('Failed to fetch availability:', error)
      } finally {
        loadingSlots.value = false
      }
    }

    const addSlot = async () => {
      loading.value = true
      try {
        await availabilityAPI.createAvailability({
          doctor_id: store.getters.currentUser.id,
          ...newSlot.value
        })
        showAddForm.value = false
        newSlot.value = { start_time: '', end_time: '', day_of_week: new Date().getDay() }
        await loadAvailability()
      } catch (error) {
        console.error('Failed to add availability:', error)
      } finally {
        loading.value = false
      }
    }

    const deleteSlot = async (id:string) => {
      if (!confirm('Are you sure you want to delete this availability slot?')) return

      try {
        await availabilityAPI.deleteAvailability(id)
        await loadAvailability()
      } catch (error) {
        console.error('Failed to delete availability:', error)
      }
    }

    const formatDate = (dateString:string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatTime = (dateString:string) => {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(loadAvailability)

    return {
      availability,
      loadingSlots,
      showAddForm,
      newSlot,
      loading,
      addSlot,
      deleteSlot,
      formatDate,
      formatTime
    }
  }
}
</script>
