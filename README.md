# Appointment APP
### Live link:
- https://fastnestappointment.onrender.com/docs

#### 🔐 Test Credentials

Use the following test accounts to interact with the API during development or testing:

| Role    | Email                 | Password     |
|---------|-----------------------|--------------|
| Admin   | `admin@example.com`   | `admin123`   |
| Doctor  | `doctor@example.com`  | `doctor123`  |
| Patient | `patient@example.com` | `password123`|

> ✅ **Note:** These credentials are for **testing purposes only** and should **not** be used in a production environment.

---



**Appointment APP** is a healthcare scheduling application designed to help clinics manage doctor–patient appointments. It enables patients to register and book available time slots with doctors, tracks doctor availability and time-off, and stores medical records for completed visits.

Key features include:

- **Role-Based User Accounts** (Patients, Doctors, Admins)
- **Doctor Availability & Time-Off Management**
- **Appointment Booking & Scheduling**
- **Medical Records for Patient Visits**
- **Audit Logging of User Actions for Accountability**

---

## 🧑‍⚕️ Role-Based Users
- Patients, doctors, and admin staff
- Fields: `id`, `name`, `email`, `role`, etc.

## 👨‍⚕️ Doctor Profiles
- Doctors have specialties and can set availability or request time-off.

## 📅 Appointment Scheduling
- Patients can view available slots and book an appointment.

## 📋 Medical Records
- After each visit, doctors create records containing notes and diagnosis.

## 📜 Audit Log
- All user actions (e.g. booking, record creation) are logged with timestamps.

---

## 🚀 Installation

To set up the project locally:

### 1. Clone the repository
```


**Appointment APP** is a healthcare scheduling application designed to help clinics manage doctor–patient appointments. It enables patients to register and book available time slots with doctors, tracks doctor availability and time-off, and stores medical records for completed visits.

Key features include:

- **Role-Based User Accounts** (Patients, Doctors, Admins)
- **Doctor Availability & Time-Off Management**
- **Appointment Booking & Scheduling**
- **Medical Records for Patient Visits**
- **Audit Logging of User Actions for Accountability**

---

## 🧑‍⚕️ Role-Based Users
- Patients, doctors, and admin staff
- Fields: `id`, `name`, `email`, `role`, etc.

## 👨‍⚕️ Doctor Profiles
- Doctors have specialties and can set availability or request time-off.

## 📅 Appointment Scheduling
- Patients can view available slots and book an appointment.

## 📋 Medical Records
- After each visit, doctors create records containing notes and diagnosis.

## 📜 Audit Log
- All user actions (e.g. booking, record creation) are logged with timestamps.

---

## 🚀 Installation

To set up the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/okallo/FastNestAppointment.git
cd FastNestAppointment/backend

```

### 2. Create a Python virtual environment
```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```
### 4.Set up the database
```bash
alembic upgrade head
```
### 5.Seed the database(optional)
```bash
python -m app.seed
```

### 5. Run the application
```bash
uvicorn app.main:app --reload
```
---

## 📜 Schemas Overview
#### User
- Fields: id,name,email,hashed_password,role.

#### Doctor
- Fields: id, user_id, specialty, license_number

#### Patient
- Fields: id, user_id, insurance_number, contact_info

#### Appointment
- Fields: id, patient_id, doctor_id, appointment_time, status

#### Availability
- Fields: id, doctor_id, day_of_week, start_time, end_time

#### TimeOff
- Fields: id, doctor_id, start_date, end_date, reason

#### MedicalRecord
- Fields: id, appointment_id, patient_id, doctor_id, notes, created_at

#### AuditLog
- Fields: id, user_id, action, timestamp

### 📡 API Endpoints
#### 🔐 Users
- POST /users/ – Register a new user

- GET /users/{user_id} – Get user details

- PATCH /users/{user_id} – Update user

- DELETE /users/{user_id} – Delete user

#### 👨‍⚕️ Doctors
- POST /doctors/ – Create doctor profile

- GET /doctors/ – List all doctors

- GET /doctors/{doctor_id} – Doctor details

- PATCH /doctors/{doctor_id} – Update doctor

- GET /doctors/{doctor_id}/availability – View availability

- POST /doctors/{doctor_id}/availability – Add availability

#### 🧑 Patients
- POST /patients/ – Create patient profile

- GET /patients/ – List all patients

- GET /patients/{patient_id} – Patient details

- PATCH /patients/{patient_id} – Update patient

#### 📅 Appointments
- POST /appointments/ – Book appointment

- GET /appointments/ – List appointments

- GET /appointments/{appointment_id} – Appointment details

- PATCH /appointments/{appointment_id} – Update appointment

- DELETE /appointments/{appointment_id} – Cancel appointment

#### 📋 Medical Records
- POST /medical-records/ – Create medical record

- GET /medical-records/ – List records

- GET /medical-records/{record_id} – Record details

#### 🗓 Time Off
- POST /doctors/{doctor_id}/time-off – Request time-off

- GET /doctors/{doctor_id}/time-off – View time-off

- DELETE /doctors/{doctor_id}/time-off/{timeoff_id} – Cancel time-off

## 📈 Mermaid Diagrams

### system sequence
```mermaid
sequenceDiagram
    participant Admin as Admin (admin role)
    participant Doctor as Doctor (doctor role)
    participant Patient as Patient (patient role)
    participant API as FastAPI Backend
    participant DB as Database

    Admin->>API: POST /users/doctor (Create Doctor)
    API->>DB: INSERT INTO doctors
    DB-->>API: Doctor Created
    API-->>Admin: 201 Created

    Doctor->>API: POST /auth/login
    API->>DB: Validate doctor credentials
    DB-->>API: Doctor info + JWT token
    API-->>Doctor: 200 OK (Token)

    Doctor->>API: POST /availability (JWT)
    API->>DB: INSERT availability slots (day, time)
    DB-->>API: Slots Created
    API-->>Doctor: 201 Created

    Patient->>API: POST /auth/login
    API->>DB: Validate patient credentials
    DB-->>API: Patient info + JWT token
    API-->>Patient: 200 OK (Token)

    Patient->>API: GET /availability?doctor_id=&day=
    API->>DB: SELECT * FROM availability WHERE is_booked=false
    DB-->>API: List of available slots
    API-->>Patient: 200 OK (slots)

    Patient->>API: POST /appointments (JWT, selected slot)
    API->>DB: SELECT availability WHERE id AND is_booked=false
    alt Slot Available
        API->>DB: INSERT INTO appointments
        API->>DB: UPDATE availability SET is_booked=true
        DB-->>API: Appointment Created
        API-->>Patient: 201 Created (Confirmation)
    else Slot Already Booked
        API-->>Patient: 409 Conflict (Slot taken)
    end
```

### Appointment Booking Flowchart
```mermaid
flowchart TD
    A[Patient] --> B[Select Doctor]
    B --> C[Select Time Slot]
    C --> D{Doctor Available?}
    D -- Yes --> E[Book Appointment]
    D -- No --> F[Show Error: Try another time]
    E --> G[Appointment Confirmed]
    G --> H[Wait until Appointment Date]
    H --> I[Doctor Meets Patient]
    I --> J[Doctor Creates Medical Record]
    J --> K[Medical Record Saved]
```
### User Registration to Medical Record(Sequence)
```mermaid
sequenceDiagram
    participant User
    participant System
    participant Doctor
    User->>System: POST /users (register)
    System-->>User: 201 Created (user ID)
    User->>System: POST /appointments (booking)
    System-->>User: 200 OK (appointment confirmed)
    System-->>Doctor: Notify new appointment
    Note right of System: [On appointment date...]
    Doctor->>System: POST /medical-records (create record)
    System-->>Doctor: 201 Created (record ID)
```
### Database Schema Diagram
```mermaid
erDiagram
    USER {
        uuid id PK
        string name
        string email
        string role
    }
    DOCTOR {
        uuid id PK
        string specialty
        string license_number
        string user_id FK
    }
    PATIENT {
        uuid id PK
        string insurance
        string user_id FK
    }
    APPOINTMENT {
        uuid id PK
        datetime time
        uuid patient_id FK
        uuid doctor_id FK
        string status
    }
    AVAILABILITY {
        uuid id PK
        uuid doctor_id FK
        string day_of_week
        time start_time
        time end_time
    }
    TIMEOFF {
        uuid id PK
        uuid doctor_id FK
        date start_date
        date end_date
        string reason
    }
    MEDICAL_RECORD {
        uuid id PK
        uuid appointment_id FK
        uuid patient_id FK
        string doctor_id FK
        string notes
        datetime created_at
    }
    AUDIT_LOG {
        uuid id PK
        string user_id FK
        string action
        datetime timestamp
    }
    USER ||--|| DOCTOR : "is a"
    USER ||--|| PATIENT : "is a"
    DOCTOR ||--o{ AVAILABILITY : "sets"
    DOCTOR ||--o{ TIMEOFF : "requests"
    PATIENT ||--o{ APPOINTMENT : "schedules"
    DOCTOR ||--o{ APPOINTMENT : "accepts"
    PATIENT ||--o{ MEDICAL_RECORD : "has"
    DOCTOR ||--o{ MEDICAL_RECORD : "writes"
    USER ||--o{ AUDIT_LOG : "logs"
```
## Notes
- All API endpoints use JSON

