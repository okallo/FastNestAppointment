<template>
  <div>
    <ul>
      <li v-for="appt in appointments" :key="appt.id">
        {{ appt.date }} with Dr. {{ appt.doctor }} - {{ appt.status }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getPatientAppointments } from '@/api/patient'

const appointments = ref([])

onMounted(async () => {
  appointments.value = await getPatientAppointments()
})
</script>
