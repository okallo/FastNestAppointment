export enum AppointmentStatus {
  Scheduled = 'scheduled',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum TimeOffStatusEnum {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum Role {
  Admin = 'admin',
  Doctor = 'doctor',
  Patient = 'patient',
}

export interface DoctorOut {
  id: string
  user_id: string
  specialization: string
  user: UserOut
  license_number: string
}

export interface PatientOut {
  id: string
  insurance_number: string
  user: UserOut
}

export interface UserOut {
  id: string
  email: string
  username: string
  role: Role
}

export interface AppointmentBase {
  patient_id: string
  doctor_id: string
  start_time: string
  end_time: string
}

export interface AppointmentOut extends AppointmentBase {
  id: string
  status: AppointmentStatus
  patient: PatientOut
  doctor: DoctorOut
}

export interface AuditLogCreate {
  actor_email: string
  action: string
  details?: string | null
}

export interface AuditLogOut {
  id: string
  actor_email: string
  action: string
  details?: string | null
  timestamp: string
}

export interface AvailabilityBase {
  doctor_id: string
  start_time: string
  end_time: string
  day_of_week: number
}

export interface AvailabilityOut extends AvailabilityBase {
  id: string
  is_booked: boolean
  day_of_week: number
  doctor: DoctorOut
}

export interface AvailabilityCreate extends AvailabilityBase {
  day_of_week: number
}

export interface DoctorBase {
  email: string
  username: string
  password: string
  specialization: string
  license_number: string
}

export interface TimeOffBase {
  start_time: string
  end_time: string
  reason?: string | null
  status: TimeOffStatusEnum
}

export interface TimeOffCreate extends TimeOffBase {
  doctor_id: string
}

export interface TimeOffUpdate extends TimeOffBase {
  approved?: boolean | null
}

export interface TimeOffOut extends TimeOffBase {
  doctor_id: string
  id: string
}

export interface DoctorWithTimeOff extends DoctorOut {
  time_off: TimeOffOut[]
}

export interface MedicalRecordBase {
  appointment_id: string
  notes: string
}

export interface MedicalRecordOut {
  id: string
  notes: string
  created_at: string
  appointment: AppointmentOut
}

export interface PatientCreate {
  email: string
  username: string
  password: string
  insurance_number: string
}

export interface PatientOut {
  id: string
  insurance_number: string
  user: UserOut
}

export interface TimeOffBaseExtended {
  doctor_id: string
  start_time: string
  end_time: string
  reason?: string | null
  status: TimeOffStatusEnum
}

export interface TimeOff {
  id: string
}

export interface TimeOffUpdateExtended {
  start_time?: string | null
  end_time?: string | null
  reason?: string | null
  status?: TimeOffStatusEnum | null
}

export interface TimeOffOutExtended {
  id: string
  reason: string
  status: TimeOffStatusEnum
  start_date: string
  end_date: string
  doctor: DoctorOut
}

export interface UserCreate {
  email: string
  username: string
  password: string
  role: Role
}

export interface UserOut {
  id: string
  email: string
  username: string
  role: Role
}

export interface UserLogin {
  email: string
  password: string
}
