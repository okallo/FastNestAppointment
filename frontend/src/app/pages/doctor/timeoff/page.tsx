import DoctorTimeOffForm from '@/app/components/DoctorTimeOffForm'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface TimeOffEntry {
  id: string
  start_time: string
  end_time: string
  reason?: string
}

export default function DoctorTimeOffPage() {
  const router = useRouter()
  const [timeOffList, setTimeOffList] = useState<TimeOffEntry[]>([])

  const fetchTimeOff = async () => {
    try {
      const res = await axios.get('/api/doctor/timeoff')
      setTimeOffList(res.data)
    } catch (err) {
      console.error('Failed to fetch time off entries:', err)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      await axios.post('/api/doctor/timeoff', formData)
      alert('Time off submitted')
      fetchTimeOff()
    } catch (err) {
      console.error(err)
      alert('Submission failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this time-off entry?')) return
    try {
      await axios.delete(`/api/doctor/timeoff/${id}`)
      fetchTimeOff()
    } catch (err) {
      console.error(err)
      alert('Deletion failed')
    }
  }

  useEffect(() => {
    fetchTimeOff()
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Doctor Time Off</h1>

        <DoctorTimeOffForm onSubmit={handleSubmit} />

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-3">Existing Time Off</h2>

        {timeOffList.length === 0 ? (
          <p className="text-gray-500">No entries yet.</p>
        ) : (
          <ul className="space-y-3">
            {timeOffList.map(entry => (
              <li
                key={entry.id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {new Date(entry.start_time).toLocaleString()} -{' '}
                    {new Date(entry.end_time).toLocaleString()}
                  </p>
                  {entry.reason && (
                    <p className="text-sm text-gray-600">Reason: {entry.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
