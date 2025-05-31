import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type {
  TimeOffCreate,
  TimeOffUpdateExtended,
  TimeOffOutExtended,
  TimeOffOut,
} from '@/stores/types'

const API_URL = import.meta.env.VITE_API_URL

export default {
  getDoctorTimeOff(doctorId: string): Promise<AxiosResponse<TimeOffOut[]>> {
    return axios.get(`${API_URL}/doctors/${doctorId}/time_off`)
  },

  createTimeOff(data: TimeOffCreate): Promise<AxiosResponse<TimeOffOutExtended>> {
    return axios.post(`${API_URL}/time-off`, data)
  },

  updateTimeOff(
    id: string,
    data: TimeOffUpdateExtended,
  ): Promise<AxiosResponse<TimeOffOutExtended>> {
    return axios.patch(`${API_URL}/time-off/${id}`, data)
  },

  deleteTimeOff(id: string): Promise<AxiosResponse<void>> {
    return axios.delete(`${API_URL}/time-off/${id}`)
  },
}
