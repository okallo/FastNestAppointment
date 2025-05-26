import { useState } from 'react'

interface Props {
  onSubmit: (data: any) => void
}

export default function DoctorTimeOffForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    start_time: '',
    end_time: '',
    reason: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Request Time Off</h2>

      <label className="block">
        <span className="text-gray-700">Start Time</span>
        <input type="datetime-local" name="start_time" required onChange={handleChange} className="w-full p-2 border rounded mt-1" />
      </label>

      <label className="block">
        <span className="text-gray-700">End Time</span>
        <input type="datetime-local" name="end_time" required onChange={handleChange} className="w-full p-2 border rounded mt-1" />
      </label>

      <label className="block">
        <span className="text-gray-700">Reason (optional)</span>
        <textarea name="reason" onChange={handleChange} className="w-full p-2 border rounded mt-1" />
      </label>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  )
}
