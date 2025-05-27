import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type EditModalProps = {
  open: boolean;
  type: 'doctor' | 'appointment' | 'record';
  data: any;
  onClose: () => void;
  onSave: (updatedData: any) => void;
};

const fieldConfig: {
  [key: string]: { label: string; key: string; type: 'text' | 'datetime-local' | 'textarea' }[];
} = {
  doctor: [
    { label: 'Name', key: 'name', type: 'text' },
    { label: 'Specialty', key: 'specialty', type: 'text' },
  ],
  appointment: [
    { label: 'Doctor', key: 'doctor_name', type: 'text' },
    { label: 'Patient', key: 'patient_name', type: 'text' },
    { label: 'Start Time', key: 'start_time', type: 'datetime-local' },
    { label: 'Status', key: 'status', type: 'text' },
  ],
  record: [
    { label: 'Patient Name', key: 'patient_name', type: 'text' },
    { label: 'Diagnosis', key: 'diagnosis', type: 'text' },
    { label: 'Notes', key: 'notes', type: 'textarea' },
  ],
};

export default function EditModal({ open, type, data, onClose, onSave }: EditModalProps) {
  const [formState, setFormState] = useState(data || {});

  useEffect(() => {
    if (data) setFormState(data);
  }, [data]);

  const handleChange = (field: string, value: string) => {
    setFormState((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const requiredFields = fieldConfig[type]?.map(f => f.key) || [];
    const hasEmptyFields = requiredFields.some(field => !formState[field]?.toString().trim());

    if (hasEmptyFields) {
      alert('Please fill out all required fields.');
      return;
    }

    onSave(formState);
    onClose();
  };

  const renderFields = () => {
    return fieldConfig[type]?.map(({ label, key, type }) => (
      <div key={key} className="space-y-1">
        <Label>{label}</Label>
        {type === 'textarea' ? (
          <Textarea value={formState[key] || ''} onChange={e => handleChange(key, e.target.value)} />
        ) : (
          <Input
            type={type}
            value={formState[key] || ''}
            onChange={e => handleChange(key, e.target.value)}
          />
        )}
      </div>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">{renderFields()}</div>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-yellow-500 text-white">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
