from app.db.session import SessionLocal
from app.models.user import User
from app.models.enums import Role
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment, AppointmentStatus
from app.models.medical_record import MedicalRecord
from app.models.timeoff import DoctorTimeOff
from app.models.availability import Availability
from app.db.session import engine
from app.db.base_class import Base
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import uuid
from sqlalchemy import text
from datetime import datetime, timezone

now = datetime.now(timezone.utc)
# Create all tables
Base.metadata.create_all(bind=engine)

def seed_users(db):
    admin_user = User(
        id=uuid.uuid4(),
        email="admin@example.com",
        username="admin",
        role=Role.admin,
        hashed_password=get_password_hash("admin123")
    )

    doctor_user = User(
        id=uuid.uuid4(),
        email="doctor@example.com",
        username="doctor",
        role=Role.doctor,
        hashed_password=get_password_hash("doctor123")
    )

    patient_user = User(
        id=uuid.uuid4(),
        email="patient@example.com",
        username="patient",
        role=Role.patient,
        hashed_password=get_password_hash("patient123")
    )

    db.add_all([admin_user, doctor_user, patient_user])
    db.commit()
    print(" Seeded users")
    return doctor_user, patient_user

def seed_doctors_patients(db, doctor_user, patient_user):
    doctor = Doctor(
        id=uuid.uuid4(),
        user_id=doctor_user.id,
        license_number="DOC-456789",
        specialization="Cardiology"
    )

    patient = Patient(
        id=uuid.uuid4(),
        user_id=patient_user.id,
        name="John Doe",
        insurance_number="INS-123456"
    )

    db.add_all([doctor, patient])
    db.commit()
    print("Seeded doctor and patient")
    return doctor, patient

def seed_availability(db, doctor_id):
    #now = datetime.utcnow()
    availability_slots = [
        Availability(
            doctor_id=doctor_id,
            start_time=now + timedelta(days=2, hours=9),
            end_time=now + timedelta(days=2, hours=10),
            is_booked=False
        ),
        Availability(
            doctor_id=doctor_id,
            start_time=now + timedelta(days=2, hours=10),
            end_time=now + timedelta(days=2, hours=11),
            is_booked=False
        )
    ]
    db.add_all(availability_slots)
    db.commit()
    print(" Seeded availability slots")

def seed_timeoff(db, doctor_id):
    time_off = DoctorTimeOff(
        id=uuid.uuid4(),
        doctor_id=doctor_id,
        start_time=datetime.utcnow() + timedelta(days=1, hours=1),
        end_time=datetime.utcnow() + timedelta(days=1, hours=3),
        reason="Personal leave",   
        status="pending",          
    )
    db.add(time_off)
    db.commit()
    print(" Seeded doctor's time off")

def seed_appointments(db, doctor_id, patient_id):
    start = datetime.utcnow() + timedelta(days=2, hours=9)
    appointment = Appointment(
        id=uuid.uuid4(),
        doctor_id=doctor_id,
        patient_id=patient_id,
        start_time=start,
        end_time=start + timedelta(minutes=20),
        status=AppointmentStatus.scheduled
    )
    db.add(appointment)
    db.commit()
    print(" Seeded appointment")
    return appointment

def seed_records(db, appointment_id):
    record = MedicalRecord(
        id=uuid.uuid4(),
        appointment_id=str(appointment_id),
        notes="Recommend exercise",
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    print(" Seeded medical record")
def truncate_tables(db):
    # List all your tables here exactly as they appear in the DB
    tables = [
        "medical_records",
        "appointments",
        "doctor_time_off",
        "availability",
        "patients",
        "doctors",
        '"users"'
    ]
    # Create a comma-separated string of tables
    tables_str = ", ".join(tables)

    # Execute TRUNCATE with restart identity and cascade
    db.execute(text(f"TRUNCATE TABLE {tables_str} RESTART IDENTITY CASCADE;"))
    db.commit()
    print(" Truncated all tables")

def run_seed():
    try:
        with SessionLocal() as db:
            truncate_tables(db)
            doctor_user, patient_user = seed_users(db)
            doctor, patient = seed_doctors_patients(db, doctor_user, patient_user)
            seed_availability(db, doctor.id)
            seed_timeoff(db, doctor.id)
            appointment = seed_appointments(db, doctor.id, patient.id)
            seed_records(db, appointment.id)
            print(" Seeding complete.")
    except Exception as e:
        print(f" Seeding failed: {e}")

if __name__ == "__main__":
    run_seed()
