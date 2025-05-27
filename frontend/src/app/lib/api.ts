import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const getDoctors = async () => axios.get(`${API_BASE_URL}/doctors`);
export const getDoctorById = async (id: number) => axios.get(`${API_BASE_URL}/doctors/${id}`);
export const createDoctor = async (data: any) => axios.post(`${API_BASE_URL}/doctors`, data);
export const updateDoctor = async (id: number, data: any) => axios.put(`${API_BASE_URL}/doctors/${id}`, data);
export const deleteDoctor = async (id: number) => axios.delete(`${API_BASE_URL}/doctors/${id}`);

export const getAppointments = async () => axios.get(`${API_BASE_URL}/appointments`);
export const getAppointmentById = async (id: number) => axios.get(`${API_BASE_URL}/appointments/${id}`);
export const createAppointment = async (data: any) => axios.post(`${API_BASE_URL}/appointments`, data);
export const updateAppointment = async (id: number, data: any) => axios.put(`${API_BASE_URL}/appointments/${id}`, data);
export const deleteAppointment = async (id: number) => axios.delete(`${API_BASE_URL}/appointments/${id}`);

export const getRecords = async () => axios.get(`${API_BASE_URL}/records`);
export const getRecordById = async (id: number) => axios.get(`${API_BASE_URL}/records/${id}`);
export const createRecord = async (data: any) => axios.post(`${API_BASE_URL}/records`, data);
export const updateRecord = async (id: number, data: any) => axios.put(`${API_BASE_URL}/records/${id}`, data);
export const deleteRecord = async (id: number) => axios.delete(`${API_BASE_URL}/records/${id}`);

export const getDoctorAppointments = async () => axios.get(`${API_BASE_URL}/doctor/appointments`);
export const getDoctorRecords = async () => axios.get(`${API_BASE_URL}/doctor/records`);
export const submitTimeOffRequest = async (data: { startDate: string; endDate: string; reason: string }) => axios.post(`${API_BASE_URL}/doctor/timeoff`, data);

export const getPatientAppointments = async () => axios.get(`${API_BASE_URL}/patient/appointments`);
export const cancelAppointment = async (id: number) => axios.delete(`${API_BASE_URL}/appointments/${id}`);
export const getAvailableSlots = async () => axios.get(`${API_BASE_URL}/appointments/available-slots`);
export const createPatientAppointment = async (data: any) => axios.post(`${API_BASE_URL}/appointments`, data);
export const getPatientRecords = async () => axios.get(`${API_BASE_URL}/patient/records`);
