import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import {actions} from '../stores/index'

const routes: Array<RouteRecordRaw> = [
  // Admin Routes
  {
    path: '/admin',
    meta: { requiresAuth: true, roles: ['admin'] },
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('../views/admin/DashBoard.vue') },
      { path: 'doctors', name: 'AdminDoctors', component: () => import('../views/admin/DoctorManagement.vue') },
      { path: 'patients', name: 'AdminPatients', component: () => import('../views/admin/PatientsAdmin.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('../views/admin/UserManagement.vue') },
      //{ path: 'appointments', name: 'AdminAppointments', component: () => import('../views/admin/Appointments.vue') }
    ]
  },

  // Doctor Routes
  {
    path: '/doctor',
    meta: { requiresAuth: true, roles: ['doctor'] },
    component: () => import('../layouts/DoctorLayout.vue'),
    children: [
     { path: 'dashboard', name: 'DoctorDashboard', component: () => import('../views/doctor/DoctorDashboard.vue') },
      { path: 'availability', name: 'DoctorAvailability', component: () => import('../views/doctor/Availability.vue') },
      { path: 'appointments', name: 'DoctorAppointments', component: () => import('../views/doctor/DoctorAppointments.vue') },
      { path: 'time-off', name: 'DoctorTimeOff', component: () => import('../views/doctor/TimeOff.vue') },
      { path: 'records', name: 'MedicalRecords', component: () => import('../views/doctor/MedicalRecords.vue') }
    ]
  },
  // Patients Routes
  {
    path: '/patient',
    meta: { requiresAuth: true, roles: ['doctor'] },
    component: () => import('../layouts/PatientLayout.vue'),
    children: [
      { path: 'dashboard', name: 'PatientDashboard', component: () => import('../views/patient/PatientDashboard.vue') },
      { path: 'appointments', name: 'Appointments', component: () => import('../views/patient/PatientAppointments.vue') },
      { path: 'medical-records', name: 'PatientMedicalRecords', component: () => import('../views/patient/PatientMedicalRecords.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Define a meta type to support roles
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
  }
}

router.beforeEach((to, from, next) => {
  const isAuthenticated: boolean = store.getters.isAuthenticated
  const userRole: string = store.getters.userRole

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next(`/${userRole}/dashboard`)
  } else {
    next()
  }
})

export default router
