import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { PatientCreate, PatientOut } from '@/stores/types'

const API_URL = import.meta.env.VITE_API_URL

export default {
  registerPatient(data: PatientCreate): Promise<AxiosResponse<PatientOut>> {
    return axios.post(`${API_URL}/patients`, data)
  },

  getAllPatients(): Promise<AxiosResponse<PatientOut[]>> {
    return axios.get(`${API_URL}/patients/all`)
  },

  getPatient(patientId: string): Promise<AxiosResponse<PatientOut>> {
    return axios.get(`${API_URL}/patients/${patientId}`)
  },

  updatePatient(
    patientId: string,
    data: Partial<PatientCreate>,
  ): Promise<AxiosResponse<PatientOut>> {
    return axios.patch(`${API_URL}/patients/${patientId}`, data)
  },

  deletePatient(patientId: string): Promise<AxiosResponse<void>> {
    return axios.delete(`${API_URL}/patients/${patientId}`)
  },
}
