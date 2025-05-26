import { useEffect, useState } from "react"
import axios from "axios"

interface TimeOffEntry {
  id: string
  start_time: string
  end_time: string
  reason?: string
}

interface Props {
  doctorId: string
}

export default function TimeOffManager({ doctorId }: Props) {
  const [timeOffList, setTimeOffList] = useState<TimeOffEntry[]>([])
  const [form, setForm] = useState({ start_time: "", end_time: "", reason: "" })
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchTimeOff = async () => {
    try {
      const res = await axios.get(`/api/doctors/${doctorId}/time_off`)
      setTimeOffList(res.data)
    } catch (error) {
      alert("Failed to load time off entries")
    }
  }

  useEffect(() => {
    fetchTimeOff()
  }, [doctorId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm({ start_time: "", end_time: "", reason: "" })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        // Update
        await axios.patch(`/api/time_off/${editingId}`, form)
      } else {
        // Create
        await axios.post(`/api/doctors/${doctorId}/time_off`, form)
      }
      resetForm()
      fetchTimeOff()
    } catch (error) {
      alert("Failed to save time off entry")
    }
  }

  const handleEdit = (entry: TimeOffEntry) => {
    setEditingId(entry.id)
    setForm({
      start_time: entry.start_time.slice(0, 16),
      end_time: entry.end_time.slice(0, 16),
      reason: entry.reason || "",
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this time off entry?")) return
    try {
      await axios.delete(`/api/time_off/${id}`)
      fetchTimeOff()
    } catch {
      alert("Failed to delete time off entry")
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Time-Off</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Time</label>
          <input
            type="datetime-local"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Reason (Optional)</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Time-Off" : "Add Time-Off"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-4 px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </form>

      <h3 className="text-lg font-semibold mb-3">Existing Time-Off Entries</h3>
      {timeOffList.length === 0 && <p>No time off entries.</p>}

      <ul className="space-y-2">
        {timeOffList.map(({ id, start_time, end_time, reason }) => (
          <li
            key={id}
            className="flex justify-between items-center p-3 border rounded"
          >
            <div>
              <p>
                <strong>{new Date(start_time).toLocaleString()}</strong> –{" "}
                <strong>{new Date(end_time).toLocaleString()}</strong>
              </p>
              {reason && <p className="text-sm text-gray-600">{reason}</p>}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit({ id, start_time, end_time, reason })}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
