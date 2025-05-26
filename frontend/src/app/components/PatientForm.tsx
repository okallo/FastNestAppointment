import { useState } from 'react'

interface Props {
  onSubmit: (data: any) => void
}

export default function PatientForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    full_name: '',
    gender: '',
    dob: '',
    phone: '',
    address: '',
    emergency_contact: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-semibold">Complete Patient Profile</h2>

      <input name="full_name" placeholder="Full Name" onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="dob" type="date" onChange={handleChange} className="w-full border p-2 rounded" required />

      <select name="gender" onChange={handleChange} className="w-full border p-2 rounded" required>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="address" placeholder="Address" onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="emergency_contact" placeholder="Emergency Contact" onChange={handleChange} className="w-full border p-2 rounded" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  )
}
