import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { AvailabilityOut, AvailabilityCreate } from '@/stores/types'

const API_URL = import.meta.env.VITE_API_URL as string

export default {
  getDoctorAvailability(doctorId: string): Promise<AxiosResponse<AvailabilityOut[]>> {
    return axios.get(`${API_URL}/availability/doctor/${doctorId}`)
  },

  createAvailability(data: AvailabilityCreate): Promise<AxiosResponse<AvailabilityOut>> {
    return axios.post(`${API_URL}/availability`, data)
  },

  updateAvailability(id: string, data: AvailabilityOut): Promise<AxiosResponse<AvailabilityOut>> {
    return axios.patch(`${API_URL}/availability/${id}`, data)
  },

  deleteAvailability(id: string): Promise<AxiosResponse<void>> {
    return axios.delete(`${API_URL}/availability/${id}`)
  },
}
