<template>
  <div>
    <table class="table-auto w-full">
      <thead>
        <tr>
          <th>Date</th>
          <th>Patient</th>
          <th>Status</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appt in appointments" :key="appt.id">
          <td>{{ appt.start_time }}</td>
          <td>{{ appt.patient }}</td>
          <td>{{ appt.status }}</td>
          <td>
            <input v-model="appt.id" class="border p-1" />
            <button @click="saveNotes(appt)" class="ml-2 text-sm bg-blue-500 text-white px-2 rounded">Save</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { getDoctorAppointments } from '@/api/appointment'
import { getMyMedicalRecords, createMedicalRecords } from '@/api/medicalRecord'
import type { MedicalRecordOut, AppointmentOut } from '@/stores/types'

const appointments = ref<AppointmentOut[]>([])
const medicalRecords = ref<MedicalRecordOut[]>([])

const store = useStore()

onMounted(async () => {
  const doctorId = store.getters.currentUser.id
  appointments.value = await getDoctorAppointments(doctorId)
  medicalRecords.value = await getMyMedicalRecords()
})

async function saveNotes(appt: any) {
  await createMedicalRecords(appt)
}
</script>
