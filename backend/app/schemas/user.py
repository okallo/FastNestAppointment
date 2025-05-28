from uuid import UUID
from pydantic import BaseModel, EmailStr
from app.models.enums import Role

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    role: Role

class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    username: str
    role: Role
class UserLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        use_enum_values = True
        from_attributes = True