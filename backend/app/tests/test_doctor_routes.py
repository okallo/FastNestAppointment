
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app  
from app.db.base_class import Base  
from app.dependencies.db import get_db
from app.core.security import get_password_hash
from app.models.user import User, Role
from app.models.doctor import Doctor
from uuid import uuid4

from app.dependencies.auth import get_current_user


SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db


client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    admin_user = User(
        email="admin@example.com",
        username="admin",
        hashed_password=get_password_hash("adminpass"),
        role=Role.admin
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    yield
    Base.metadata.drop_all(bind=engine)

mock_user = User(id=uuid4(), username="doctoradmin", email="doctor1@example.com", role="admin")
app.dependency_overrides[get_current_user] = lambda: mock_user
def test_create_doctor():
    payload = {
        "email": "doctoro@example.com",
        "username": "doctoro",
        "password": "strongpass",
        "specialization": "cardiology",
        "license_number": "LIC129"
    }

    response = client.post("/api/v1/doctors/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["specialization"] == "cardiology"
    assert data["user"]["email"] == "doctoro@example.com"

def setup_test_doctor(db):
    user = User(email="testdoctor1@example.com", username="testuser", hashed_password="hashed_password", role="doctor")
    doctor = Doctor(user=user, specialization="Cardiology", license_number="LIC123")
    db.add(user)
    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    return doctor

def test_list_doctors():
    db = next(override_get_db())
    setup_test_doctor(db)
    response = client.get("/api/v1/doctors/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_set_doctor_time_off():
    db = next(override_get_db())
    # doctor = setup_test_doctor(db)
    doctor = db.query(Doctor).first()

    payload = {
        "start_time": "2025-06-01T08:00:00",
        "end_time": "2025-06-02T18:00:00"
    }

    
    from app.dependencies.auth import get_current_user
    #app.dependency_overrides[get_current_user] = lambda: doctor.user
    doctor.user.id = get_current_user().id
    #doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    response = client.post("/api/v1/doctors/time_off", json=payload)
    print(response.json())
    assert response.status_code == 201

def test_get_doctor_time_off():
    db = next(override_get_db())
    doctor = db.query(Doctor).first()
    response = client.get(f"/api/v1/doctors/{doctor.id}/time_off")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_time_off():
    db = next(override_get_db())
    time_off = db.query(Doctor).first().time_offs[0]

    payload = {
        "approved": True,
        "start_time": time_off.start_time,
        "end_time": time_off.end_time
    }

    response = client.patch(f"/api/v1/doctors/time_off/{time_off.id}", json=payload)
    assert response.status_code == 200
    assert response.json()["approved"] == True

def test_delete_time_off():
    db = next(override_get_db())
    time_off = db.query(Doctor).first().time_offs[0]

    response = client.delete(f"/api/v1/doctors/time_off/{time_off.id}")
    assert response.status_code == 204
