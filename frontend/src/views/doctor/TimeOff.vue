<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Manage Time Off</h1>
      <button @click="showForm = !showForm"
        class="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Request Time Off
      </button>
    </div>

    <div v-if="showForm" class="bg-white rounded-xl shadow p-6 mb-8">
      <h2 class="text-xl font-medium text-gray-800 mb-4">Request Time Off</h2>
      <form @submit.prevent="submitTimeOff" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
          <input type="datetime-local" v-model="newTimeOff.start_time" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
          <input type="datetime-local" v-model="newTimeOff.end_time" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
          <textarea v-model="newTimeOff.reason" rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter reason for time off request..."></textarea>
        </div>

        <div class="md:col-span-2 flex justify-end space-x-3 mt-2">
          <button type="button" @click="showForm = false"
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
            Submit Request
          </button>
        </div>
      </form>
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
      <div v-if="timeOffRequests.length === 0" class="bg-white rounded-xl shadow p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
          </path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No time off requests</h3>
        <p class="mt-1 text-sm text-gray-500">Submit your first time off request using the button above.</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="request in timeOffRequests" :key="request.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(request.start_time) }}</div>
                <div class="text-sm text-gray-500">to {{ formatDate(request.end_time) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ calculateDuration(request.start_time, request.end_time) }} hours
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                  'bg-yellow-100 text-yellow-800': request.status === 'pending',
                  'bg-green-100 text-green-800': request.status === 'approved',
                  'bg-red-100 text-red-800': request.status === 'rejected'
                }">
                  {{ request.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button v-if="request.status === 'pending'" @click="cancelTimeOff(request.id)"
                  class="text-red-600 hover:text-red-900">
                  Cancel
                </button>
                <span v-else class="text-gray-400">No actions</span>
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
import { useStore } from 'vuex'
import timeOffAPI from '../../api/timeOff'
import { type TimeOffOut, type TimeOffCreate, TimeOffStatusEnum } from '@/stores/types'


export default {
  setup() {
    const store = useStore()
    const timeOffRequests = ref<TimeOffOut[]>([])
    const loading = ref(true)
    const showForm = ref(false)
    const newTimeOff = ref<TimeOffCreate>({
      doctor_id: store.getters.currentUser.id,
      start_time: '',
      end_time: '',
      reason: '',
      status: TimeOffStatusEnum.Pending
    })

    const loadTimeOffRequests = async () => {
      loading.value = true
      try {
        const doctorId = store.getters.currentUser.id
        const response = await timeOffAPI.getDoctorTimeOff(doctorId)
        timeOffRequests.value = response.data
      } catch (error) {
        console.error('Failed to fetch time off requests:', error)
      } finally {
        loading.value = false
      }
    }

    const submitTimeOff = async () => {
      try {
        await timeOffAPI.createTimeOff(newTimeOff.value)
        showForm.value = false
        await loadTimeOffRequests()
      } catch (error) {
        console.error('Failed to submit time off:', error)
      }
    }

    const cancelTimeOff = async (id: string) => {
      if (!confirm('Are you sure you want to cancel this time off request?')) return

      try {
        await timeOffAPI.deleteTimeOff(id)
        await loadTimeOffRequests()
      } catch (error) {
        console.error('Failed to cancel time off:', error)
      }
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }

    const calculateDuration = (start: string, end: string): number => {
      const startTime = new Date(start);
      const endTime = new Date(end);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new Error("Invalid datetime string(s)");
      }

      const diffMs = endTime.getTime() - startTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      return Math.round(diffHours * 10) / 10;
    };


    onMounted(loadTimeOffRequests)

    return {
      timeOffRequests,
      loading,
      showForm,
      newTimeOff,
      submitTimeOff,
      cancelTimeOff,
      formatDate,
      calculateDuration
    }
  }
}
</script>
