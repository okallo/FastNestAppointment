from fastapi import APIRouter
from app.api.api_v1.endpoints import patient, doctor

api_router = APIRouter()
api_router.include_router(patient.router, prefix="/patients", tags=["Patients"])
api_router.include_router(doctor.router, prefix="/doctors", tags=["Doctors"])