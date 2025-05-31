<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Select a Doctor</h2>

          <div class="space-y-4">
            <div v-for="doctor in doctors" :key="doctor.id" @click="selectDoctor(doctor)"
              class="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition duration-200"
              :class="{ 'border-blue-500 bg-blue-50': selectedDoctor?.id === doctor.id }">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {{ doctorInitials(doctor.user.username) }}
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">
                    Dr. {{ doctor.user.username }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ doctor.specialization }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div v-if="!selectedDoctor" class="bg-white rounded-xl shadow p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
            </path>
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">Select a doctor</h3>
          <p class="mt-1 text-sm text-gray-500">Choose a doctor from the list to see their available time slots.</p>
        </div>

        <div v-else>
          <div class="bg-white rounded-xl shadow p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-800">
                Available Time Slots for Dr. {{ selectedDoctor.user.username }}
              </h2>
              <button @click="selectedDoctor = null" class="text-blue-600 hover:text-blue-800 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Change Doctor
              </button>
            </div>

            <div v-if="loadingSlots" class="flex justify-center py-8">
              <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </div>

            <div v-else>
              <div v-if="availableSlots.length === 0" class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="mt-2 text-lg font-medium text-gray-900">No available slots</h3>
                <p class="mt-1 text-sm text-gray-500">This doctor has no available time slots in the next 7 days.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button v-for="slot in availableSlots" :key="slot.id" @click="bookAppointment(slot)"
                  class="border border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition duration-200">
                  <p class="text-lg font-medium text-gray-900">
                    {{ formatDate(slot.start_time) }}
                  </p>
                  <p class="text-gray-600">
                    {{ formatTime(slot.start_time) }} - {{ formatTime(slot.end_time) }}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import doctorAPI from '@/api/doctor'
import availabilityAPI from '@/api/availability'
import appointmentAPI from '@/api/appointment'

export default {
  setup() {
    const store = useStore()
    const doctors = ref([])
    const selectedDoctor = ref(null)
    const availableSlots = ref([])
    const loadingDoctors = ref(true)
    const loadingSlots = ref(false)

    const loadDoctors = async () => {
      loadingDoctors.value = true
      try {
        const response = await doctorAPI.listDoctors()
        doctors.value = response.data
      } catch (error) {
        console.error('Failed to fetch doctors:', error)
      } finally {
        loadingDoctors.value = false
      }
    }

    const loadAvailableSlots = async (doctorId) => {
      loadingSlots.value = true
      try {
        const response = await availabilityAPI.getDoctorAvailability(doctorId)
        availableSlots.value = response.data.filter(slot => !slot.is_booked)
      } catch (error) {
        console.error('Failed to fetch availability:', error)
      } finally {
        loadingSlots.value = false
      }
    }

    const selectDoctor = (doctor) => {
      selectedDoctor.value = doctor
      loadAvailableSlots(doctor.id)
    }

    const doctorInitials = (name) => {
      if (!name) return 'D'
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const bookAppointment = async (slot) => {
      if (!confirm(`Confirm appointment on ${formatDate(slot.start_time)} at ${formatTime(slot.start_time)}?`)) return

      try {
        await appointmentAPI.createAppointment({
          patient_id: store.getters.currentUser.id,
          doctor_id: selectedDoctor.value.id,
          start_time: slot.start_time,
          end_time: slot.end_time
        })
        alert('Appointment booked successfully!')
        // Reset selection
        selectedDoctor.value = null
        availableSlots.value = []
      } catch (error) {
        console.error('Failed to book appointment:', error)
        alert('Failed to book appointment. Please try again.')
      }
    }

    onMounted(loadDoctors)

    return {
      doctors,
      selectedDoctor,
      availableSlots,
      loadingDoctors,
      loadingSlots,
      selectDoctor,
      doctorInitials,
      formatDate,
      formatTime,
      bookAppointment
    }
  }
}
</script>
