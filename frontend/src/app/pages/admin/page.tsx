'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table';
import EditModal from '@/app/components/EditModal';

import {
  getDoctors,
  getAppointments,
  getRecords,
  deleteDoctor,
  deleteAppointment,
  deleteRecord,
} from '@/app/lib/api';

type EditType = 'doctor' | 'appointment' | 'record';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editData, setEditData] = useState<any | null>(null);
  const [editType, setEditType] = useState<EditType | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [doctorsRes, appointmentsRes, recordsRes] = await Promise.all([
        getDoctors(),
        getAppointments(),
        getRecords(),
      ]);
      setDoctors(doctorsRes.data);
      setAppointments(appointmentsRes.data);
      setRecords(recordsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error('Failed to delete doctor:', err);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (err) {
      console.error('Failed to delete appointment:', err);
    }
  };

  const handleDeleteRecord = async (id: number) => {
    try {
      await deleteRecord(id);
      setRecords((prev) => prev.filter((rec) => rec.id !== id));
    } catch (err) {
      console.error('Failed to delete record:', err);
    }
  };

  const openEditModal = (type: EditType, data: any) => {
    setEditType(type);
    setEditData(data);
    setShowModal(true);
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 space-y-8">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <>
          
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-sm text-gray-600">Total Doctors</h3>
                  <p className="text-2xl font-bold">{doctors.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-sm text-gray-600">Appointments</h3>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-sm text-gray-600">Records</h3>
                  <p className="text-2xl font-bold">{records.length}</p>
                </CardContent>
              </Card>
            </div>

            <section className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Doctors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="flex flex-col justify-between">
                    <CardContent className="p-4">
                      <div>
                        <p className="font-medium text-lg">{doctor.name}</p>
                        <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                      </div>
                      <div className="space-x-2">
                        <Button variant="secondary" className="bg-yellow-500 text-white" onClick={() => openEditModal('doctor', doctor)}>Edit</Button>
                        <Button variant="destructive" onClick={() => handleDeleteDoctor(doctor.id)}>Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

           
            <section className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Appointments</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appt) => (
                      <TableRow key={appt.id} className={appt.status === 'cancelled' ? 'bg-red-100' : ''}>
                        <TableCell>{appt.doctor_name}</TableCell>
                        <TableCell>{appt.patient_name}</TableCell>
                        <TableCell>{new Date(appt.start_time).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            appt.status === 'completed'
                              ? 'default'
                              : appt.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                          }>
                            {appt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-x-2">
                            <Button variant="secondary" className="bg-yellow-500 text-white" onClick={() => openEditModal('appointment', appt)}>Edit</Button>
                            <Button variant="destructive" onClick={() => handleDeleteAppointment(appt.id)}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>

         
            <section className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {records.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <p className="font-medium text-lg">{record.patient_name}</p>
                      <p className="text-sm text-gray-600">Diagnosis: {record.diagnosis}</p>
                      <p className="text-sm text-gray-600">Notes: {record.notes}</p>
                      <div className="mt-2">
                        <Button variant="secondary" className="bg-yellow-500 text-white" onClick={() => openEditModal('record', record)}>Edit</Button>
                        <Button variant="destructive" className="ml-2" onClick={() => handleDeleteRecord(record.id)}>Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>


      {showModal && editData && editType && (
        <EditModal
          open={showModal}
          type={editType}
          data={editData}
          onClose={() => setShowModal(false)}
          onSave={fetchAllData}
        />
      )}

    </DashboardLayout>
  );
}
