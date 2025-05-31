<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSession } from '@/api/auth'

const router = useRouter()

onMounted(async () => {
  const session = await getSession()
  if (!session) {
    router.push('/login')
  } else {
    switch (session.role) {
      case 'admin':
        router.push('/admin/dashboard')
        break
      case 'doctor':
        router.push('/doctor/dashboard')
        break
      case 'patient':
        router.push('/patient/dashboard')
        break
    }
  }
})
</script>
