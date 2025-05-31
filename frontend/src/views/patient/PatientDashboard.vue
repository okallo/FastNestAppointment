<template>
  <div>
    <Calendar :appointments="appointments" />
    <Notification v-if="updatedMedicalRecords" message="Your medical records have been updated" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Calendar from '@/components/Calendar.vue'
import Notification from '@/components/Notification.vue'
import { getPatientAppointments, checkMedicalRecordUpdate } from '@/api/patient'

const appointments = ref([])
const updatedMedicalRecords = ref(false)

onMounted(async () => {
  appointments.value = await getPatientAppointments()
  updatedMedicalRecords.value = await checkMedicalRecordUpdate()
})
</script>
