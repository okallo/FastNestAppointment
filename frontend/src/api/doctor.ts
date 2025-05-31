import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { DoctorOut, TimeOffCreate, TimeOffOut, DoctorBase } from '@/stores/types'

const API_URL = import.meta.env.VITE_API_URL as string

export default {
  listDoctors(): Promise<AxiosResponse<DoctorOut[]>> {
    return axios.get(`${API_URL}/doctors`)
  },

  createDoctor(data: DoctorBase): Promise<AxiosResponse<DoctorOut>> {
    return axios.post(`${API_URL}/doctors`, data)
  },

  getDoctor(doctorId: string): Promise<AxiosResponse<DoctorOut>> {
    return axios.get(`${API_URL}/doctors/${doctorId}`)
  },

  updateDoctor(doctorId: string, data: DoctorBase): Promise<AxiosResponse<DoctorOut>> {
    return axios.patch(`${API_URL}/doctors/${doctorId}`, data)
  },

  deleteDoctor(doctorId: string): Promise<AxiosResponse<void>> {
    return axios.delete(`${API_URL}/doctors/${doctorId}`)
  },

  setTimeOff(doctorId: string, data: TimeOffCreate): Promise<AxiosResponse<TimeOffOut>> {
    return axios.post(`${API_URL}/doctors/${doctorId}/time_off`, data)
  },

  getDoctorTimeOff(doctorId: string): Promise<AxiosResponse<TimeOffOut[]>> {
    return axios.get(`${API_URL}/doctors/${doctorId}/time_off`)
  },
}
