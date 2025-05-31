<template>
  <div class="overflow-x-auto">
    <table class="table-auto w-full">
      <thead>
        <tr>
          <th>Date</th>
          <th>Patient</th>
          <th>Doctor</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appt in appointments" :key="appt.id">
          <td>{{ appt.start_time }}</td>
          <td>{{ appt.patient.user.username }}</td>
          <td>{{ appt.doctor.user.username }}</td>
          <td>{{ appt.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getAllAppointments } from '@/api/appointment'
import type { AppointmentOut } from '@/stores/types'

const appointments = ref<AppointmentOut[]>([])

onMounted(async () => {
  appointments.value = await getAllAppointments()
})
</script>
