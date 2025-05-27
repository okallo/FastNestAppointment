import { useRouter } from 'next/router'
import axios from 'axios'
import PatientForm from '@/app/components/PatientForm'

export default function PatientRegistrationPage() {
  const router = useRouter()

  const handlePatientSubmit = async (formData: any) => {
    try {
      await axios.post('/api/patients', formData)
      router.push('/dashboard')
    } catch (err) {
      console.error('Patient profile error:', err)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <PatientForm onSubmit={handlePatientSubmit} />
    </div>
  )
}
