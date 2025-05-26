from fastapi import APIRouter
from app.api.api_v1.endpoints import patient, doctor, appointment, auth,medical_records, availability

api_router = APIRouter()
api_router.include_router(patient.router, prefix="/patients", tags=["Patients"])
api_router.include_router(doctor.router, prefix="/doctors", tags=["Doctors"])
api_router.include_router(appointment.router, prefix="/appointments", tags=["Appointments"])
api_router.include_router(auth.router, prefix="/users", tags=["Users"])
api_router.include_router(medical_records.router, prefix="/medical_records", tags=["MedicalRecords"])
api_router.include_router(availability.router, prefix="/availability", tags=["Availability"])