import AppointmentBookingForm from '@/app/components/AppointmentBookingForm'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function BookAppointmentPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      const [start, end] = data.slot.split(' to ')
      await axios.post('/api/appointments', {
        doctor_id: data.doctor_id,
        start_time: start,
        end_time: end,
        reason: data.reason,
      })
      alert('Appointment booked!')
      router.push('/appointments')
    } catch (err) {
      console.error(err)
      alert('Booking failed.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <AppointmentBookingForm onSubmit={handleSubmit} />
    </div>
  )
}
