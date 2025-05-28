'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import {
  getPatientAppointments,
  cancelAppointment,
  getAvailableSlots,
  createAppointment,
  getPatientRecords,
} from '@/app/lib/api';
import { Button } from '@/components/ui/button';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptsRes, recordsRes, slotsRes] = await Promise.all([
        getPatientAppointments(),
        getPatientRecords(),
        getAvailableSlots(),
      ]);
      setAppointments(apptsRes.data);
      setRecords(recordsRes.data);
      setSlots(slotsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      setAppointments(prev => prev.filter(appt => appt.id !== id));
      alert('Appointment canceled');
    } catch (err) {
      console.error(err);
      alert('Failed to cancel appointment');
    }
  };

  const handleCreateAppointment = async () => {
    if (!selectedSlot) {
      alert('Please select an appointment slot');
      return;
    }
    setCreating(true);
    try {
      // Assuming doctorId can be fixed or selected in UI, here using a placeholder
      const doctorId = 1; 
      await createAppointment({ slot: selectedSlot, doctorId });
      alert('Appointment created');
      // Refresh data
      fetchData();
      setSelectedSlot('');
    } catch (err) {
      console.error(err);
      alert('Failed to create appointment');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div>Loading patient data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <DashboardLayout role="patient">
      <div className="p-6 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
          {appointments.length === 0 && <p>No appointments yet.</p>}
          <ul className="space-y-4">
            {appointments.map(appt => (
              <li
                key={appt.id}
                className="border rounded p-4 shadow-sm bg-white flex justify-between items-center"
              >
                <div>
                  <p><strong>Date & Time:</strong> {new Date(appt.start_time).toLocaleString()}</p>
                  <p><strong>Status:</strong> {appt.status}</p>
                  <p><strong>Doctor:</strong> {appt.doctor_name}</p>
                </div>
                {appt.status === 'pending' && (
                  <Button
                    onClick={() => handleCancel(appt.id)}
                    className="bg-red-600 text-white"
                  >
                    Cancel
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Book a New Appointment</h2>
          <select
            className="border p-2 rounded w-full max-w-xs"
            value={selectedSlot}
            onChange={e => setSelectedSlot(e.target.value)}
          >
            <option value="">Select a slot</option>
            {slots.map(slot => (
              <option key={slot} value={slot}>
                {new Date(slot).toLocaleString()}
              </option>
            ))}
          </select>
          <Button
            onClick={handleCreateAppointment}
            className="mt-2 bg-green-600 text-white"
            disabled={creating}
          >
            {creating ? 'Booking...' : 'Book Appointment'}
          </Button>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Your Medical Records</h2>
          {records.length === 0 && <p>No medical records found.</p>}
          <div className="space-y-4">
            {records.map(record => (
              <div
                key={record.id}
                className="border rounded p-4 bg-white"
              >
                <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                <p><strong>Notes:</strong> {record.notes}</p>
                <p><strong>Date:</strong> {new Date(record.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
