<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Medical Records</h2>
    <ul>
      <li v-for="record in records" :key="record.id">
        {{ record.date }} - {{ record.description }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getMedicalRecords } from '@/api/patient'

const records = ref([])

onMounted(async () => {
  records.value = await getMedicalRecords()
})
</script>
