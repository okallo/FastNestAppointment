import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/register', form)
      router.push('/auth/login')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Registration failed');
        } else {
            setError('An unexpected error occurred');
        }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Create an Account</h2>

        <label className="block mb-2">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          required
        />

        <label className="block mb-2">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          required
        />

        <label className="block mb-2">Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          required
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  )
}
