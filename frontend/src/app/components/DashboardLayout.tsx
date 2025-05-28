import Link from 'next/link'

interface Props {
  children: React.ReactNode
  role: 'admin' | 'doctor' | 'patient'
}

const navLinks = {
  admin: [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Doctors', href: '/admin/doctors' },
    { name: 'Appointments', href: '/admin/appointments' },
  ],
  doctor: [
    { name: 'Dashboard', href: '/doctor' },
    { name: 'My Appointments', href: '/doctor/appointments' },
    { name: 'Time Off', href: '/doctor/timeoff' },
    { name: 'Medical Records', href: '/doctor/records' },
  ],
  patient: [
    { name: 'Dashboard', href: '/patient' },
    { name: 'Book Appointment', href: '/patient/appointments/new' },
    { name: 'My Appointments', href: '/patient/appointments' },
    { name: 'My Records', href: '/patient/records' },
  ]
}

export default function DashboardLayout({ children, role }: Props) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-blue-900 text-white p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">{role.charAt(0).toUpperCase() + role.slice(1)} Panel</h2>
        <nav className="space-y-2">
          {navLinks[role].map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="block p-2 rounded hover:bg-blue-700">{link.name}</div>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  )
}
