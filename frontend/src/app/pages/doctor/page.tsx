'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import {
  Card, CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableHead, TableHeader, TableRow, TableBody, TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  getDoctorAppointments,
  getDoctorRecords,
  submitTimeOffRequest,
} from '@/app/lib/api'; 

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [notesDrafts, setNotesDrafts] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [apptRes, recordsRes] = await Promise.all([
          getDoctorAppointments(),
          getDoctorRecords(),
        ]);
        setAppointments(apptRes.data);
        setRecords(recordsRes.data);
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleTimeOffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus(null);
    if (!startDate || !endDate || !reason) {
      setRequestStatus('Please fill all fields.');
      return;
    }

    try {
      await submitTimeOffRequest({ startDate, endDate, reason });
      setRequestStatus('Time off request submitted successfully!');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (err) {
      setRequestStatus('Failed to submit time off request.');
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <DashboardLayout role="doctor">
      <div className="p-6 space-y-10 max-w-6xl mx-auto">
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Appointments</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                )}
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

      
        <section>
          <h2 className="text-2xl font-semibold mb-4">Medical Records</h2>
          {records.length === 0 ? (
            <p>No medical records available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((rec) => (
                <Card key={rec.id}>
                  <CardContent>
                    <p className="font-semibold">{rec.patient_name}</p>
                    <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>
                    <p><strong>Notes:</strong> {rec.notes}</p>
                    <p><strong>Date:</strong> {new Date(rec.date).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

       
        <section>
          <h2 className="text-2xl font-semibold mb-4">Request Time Off</h2>
          <form onSubmit={handleTimeOffSubmit} className="max-w-md space-y-4">
            <div>
              <label htmlFor="startDate" className="block mb-1 font-medium">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block mb-1 font-medium">End Date</label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="reason" className="block mb-1 font-medium">Reason</label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required
              />
            </div>
            <Button type="submit">Submit Request</Button>
            {requestStatus && <p className="mt-2 text-sm text-gray-700">{requestStatus}</p>}
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
