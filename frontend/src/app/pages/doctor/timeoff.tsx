import DoctorTimeOffForm from '@/components/DoctorTimeOffForm'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function DoctorTimeOffPage() {
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    try {
      await axios.post('/api/doctor/timeoff', formData)
      alert('Time off submitted')
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Submission failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <DoctorTimeOffForm onSubmit={handleSubmit} />
    </div>
  )
}
