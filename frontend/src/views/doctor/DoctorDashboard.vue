<template>
  <div>
    <Calendar @appointment-clicked="openAppointment" :appointments="appointments" />
    <Modal v-if="selectedAppointment" @close="selectedAppointment = null">
      <h3 class="text-lg font-bold">Attend Appointment</h3>
      <textarea v-model="selectedAppointment.notes" class="w-full p-2 border" />
      <button class="mt-2 bg-blue-600 text-white p-2 rounded" @click="saveNotes">Save Notes</button>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Calendar from '@/components/Calendar.vue'
import Modal from '@/components/Modal.vue'
import { getDoctorAppointments } from '@/api/doctor'
import { getMyMedicalRecords, createMedicalRecords } from '@/api/medicalRecord'

import type { MedicalRecordOut, AppointmentOut } from '@/stores/types'


const appointments = ref<AppointmentOut[]>([])
const selectedAppointment = ref(null)
const medicalRecords = ref<MedicalRecordOut[]>([])

const store = useStore()
onMounted(async () => {
  const doctorId = store.getters.currentUser.id
  appointments.value = await getDoctorAppointments(doctorId)
  medicalRecords.value = await getMyMedicalRecords()
})

function openAppointment(appointment: any) {
  selectedAppointment.value = appointment
}

async function saveNotes() {
  await createMedicalRecords(selectedAppointment.value)
  selectedAppointment.value = null
  appointments.value = await getDoctorAppointments()
}
</script>
