import uuid
from sqlalchemy import UUID, Column, String, Enum as SqlEnum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from uuid import uuid4
from app.models.enums import Role

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    role = Column(SqlEnum(Role), nullable=False)

    doctor = relationship("Doctor", uselist=False, back_populates="user")
    patient = relationship("Patient", uselist=False, back_populates="user")
