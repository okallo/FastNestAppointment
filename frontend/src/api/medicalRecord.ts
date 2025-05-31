import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { MedicalRecordBase, MedicalRecordOut } from '@/stores/types'

const API_URL = import.meta.env.VITE_API_URL

export default {
  createMedicalRecord(data: MedicalRecordBase): Promise<AxiosResponse<MedicalRecordOut>> {
    return axios.post(`${API_URL}/medical-records`, data)
  },

  getMyRecords(): Promise<AxiosResponse<MedicalRecordOut[]>> {
    return axios.get(`${API_URL}/medical-records/mine`)
  },

  getPatientRecords(patientId: string): Promise<AxiosResponse<MedicalRecordOut[]>> {
    return axios.get(`${API_URL}/medical-records/patient/${patientId}`)
  },

  updateRecord(
    id: string,
    data: Partial<MedicalRecordBase>,
  ): Promise<AxiosResponse<MedicalRecordOut>> {
    return axios.patch(`${API_URL}/medical-records/${id}`, data)
  },

  deleteRecord(id: string): Promise<AxiosResponse<void>> {
    return axios.delete(`${API_URL}/medical-records/${id}`)
  },
}
