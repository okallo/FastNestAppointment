import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# Load .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Get the database URL from the env
DATABASE_URL = os.getenv("DATABASE_URL")

config = context.config
fileConfig(config.config_file_name)

# Set the SQLAlchemy URL programmatically
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Import your metadata (update path)
from app.db.base_class import Base 
from app.models.user import User
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.timeoff import DoctorTimeOff
from app.models.audit import AuditLog
from app.models.availability import Availability
from app.models.medical_record import MedicalRecord



target_metadata = Base.metadata
