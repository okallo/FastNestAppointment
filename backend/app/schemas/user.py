from pydantic import BaseModel, EmailStr

from app.models.enums import Role


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: Role

class UserOut(BaseModel):
    id: str
    email: EmailStr
    role: Role
