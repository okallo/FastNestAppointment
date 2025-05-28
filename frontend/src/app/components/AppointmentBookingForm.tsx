import { useEffect, useState } from 'react'

interface Doctor {
  id: string
  full_name: string
}

interface Props {
  onSubmit: (data: any) => void
}

export default function AppointmentBookingForm({ onSubmit }: Props) {
  const [form, setForm] = useState({ doctor_id: '', date: '', slot: '', reason: '' })
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [slots, setSlots] = useState<string[]>([])

  useEffect(() => {
    // Fetch doctors
    fetch('/api/doctors')
      .then(res => res.json())
      .then(setDoctors)
  }, [])

  useEffect(() => {
    if (form.doctor_id && form.date) {
      fetch(`/api/doctors/${form.doctor_id}/available_slots?date=${form.date}`)
        .then(res => res.json())
        .then(setSlots)
    }
  }, [form.doctor_id, form.date])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

      <label className="block mb-3">
        <span className="text-gray-700">Doctor</span>
        <select name="doctor_id" required onChange={handleChange} className="w-full mt-1 p-2 border rounded">
          <option value="">Select a doctor</option>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>{doc.full_name}</option>
          ))}
        </select>
      </label>

      <label className="block mb-3">
        <span className="text-gray-700">Date</span>
        <input type="date" name="date" required onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
      </label>

      <label className="block mb-3">
        <span className="text-gray-700">Time Slot</span>
        <select name="slot" required onChange={handleChange} className="w-full mt-1 p-2 border rounded">
          <option value="">Select time slot</option>
          {slots.map((slot, idx) => (
            <option key={idx} value={slot}>{slot}</option>
          ))}
        </select>
      </label>

      <label className="block mb-4">
        <span className="text-gray-700">Reason (optional)</span>
        <textarea name="reason" onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
      </label>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Book Appointment
      </button>
    </form>
  )
}
