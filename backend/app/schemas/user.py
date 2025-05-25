from pydantic import BaseModel, EmailStr
from enum import Enum

class Role(str, Enum):
    admin = "admin"
    doctor = "doctor"
    patient = "patient"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: Role

class UserOut(BaseModel):
    id: str
    email: EmailStr
    role: Role
