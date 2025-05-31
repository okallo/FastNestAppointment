import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { UserCreate, UserOut } from '@/stores/types'

const API_URL = import.meta.env.VITE_API_URL as string

export default {
  createUser(data: UserCreate): Promise<AxiosResponse<UserOut>> {
    return axios.post(`${API_URL}/users`, data)
  },

  getAllUsers(): Promise<AxiosResponse<UserOut[]>> {
    return axios.get(`${API_URL}/users`)
  },

  getUser(userId: string): Promise<AxiosResponse<UserOut>> {
    return axios.get(`${API_URL}/users/${userId}`)
  },

  updateUser(userId: string, data: UserOut): Promise<AxiosResponse<UserOut>> {
    return axios.patch(`${API_URL}/users/${userId}`, data)
  },

  deleteUser(userId: string): Promise<AxiosResponse<void>> {
    return axios.delete(`${API_URL}/users/${userId}`)
  },
}
