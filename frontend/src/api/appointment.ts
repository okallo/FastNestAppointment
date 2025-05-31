import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { AppointmentOut, AppointmentBase, AppointmentStatus } from '@/stores/types'

const API_URL = import.meta.env.VITE_API_URL

export default {
  getPatientAppointments(
    patientId: string,
    status: AppointmentStatus | '' = '',
  ): Promise<AxiosResponse<AppointmentOut[]>> {
    return axios.get(`${API_URL}/appointments/patient/${patientId}`, {
      params: { status },
    })
  },

  getDoctorAppointments(doctorId: string): Promise<AxiosResponse<AppointmentOut[]>> {
    return axios.get(`${API_URL}/appointments/doctor/${doctorId}`)
  },

  getAllAppointments():Promise<AxiosResponse<AppointmentOut[]>> {
    return axios.get(`${API_URL}/appointments/all`)
  },


  createAppointment(data: AppointmentBase): Promise<AxiosResponse<AppointmentOut>> {
    return axios.post(`${API_URL}/appointments`, data)
  },

  cancelAppointment(appointmentId: string): Promise<AxiosResponse<AppointmentOut>> {
    return axios.patch(`${API_URL}/appointments/${appointmentId}/cancel`)
  },

  startAppointment(appointmentId: string): Promise<AxiosResponse<AppointmentOut>> {
    return axios.patch(`${API_URL}/appointments/${appointmentId}/start`)
  },

  completeAppointment(appointmentId: string): Promise<AxiosResponse<AppointmentOut>> {
    return axios.patch(`${API_URL}/appointments/${appointmentId}/complete`)
  },
}
