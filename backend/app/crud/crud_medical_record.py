from sqlalchemy.orm import Session
from app.models.medical_record import MedicalRecord
from app.schemas.medical_record import MedicalRecordCreate

def create_medical_record(db: Session, record: MedicalRecordCreate, doctor_id: int):
    db_record = MedicalRecord(**record.dict(), doctor_id=doctor_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def get_patient_records(db: Session, patient_id: int):
    return db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).all()

def get_appointment_record(db: Session, appointment_id: int):
    return db.query(MedicalRecord).filter(MedicalRecord.appointment_id == appointment_id).first()
