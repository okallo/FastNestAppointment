from pydantic import BaseModel, EmailStr
from app.models.enums import Role

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    role: Role

class UserOut(BaseModel):
    id: str
    email: EmailStr
    username: str
    role: Role
class UserLogin(BaseModel):
    email: EmailStr
    password: str