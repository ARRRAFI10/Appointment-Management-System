# Appointment Management System

A full-stack web application for managing doctor appointments, custom appointment requests, prescriptions, and user profiles for patients, doctors, and admins.

---

## 🚀 Features

- **User Registration & Login** (Patient, Doctor)
- **Profile Management**
- **Book Appointments** (with available timeslots)
- **Custom Appointment Requests** (when no slot is available)
- **Admin Management**
  - View and assign custom requests
  - Create appointments from approved requests
- **Doctor Dashboard**
  - Approve/reject custom requests
  - View appointments and summary
- **Patient Dashboard**
  - View upcoming/past appointments
  - See notifications for approved custom requests
  - Download/view prescriptions
- **PDF Prescription Generation**
- **Role-based Navigation and Access**

---

## 🏗️ Architecture

The Appointment Management System is a full-stack web application with a Django REST Framework backend and a React frontend. The backend exposes RESTful APIs for user authentication, appointment management, custom requests, and prescriptions. The frontend consumes these APIs and provides role-based dashboards for patients, doctors, and admins.

- **Backend:** Django, Django REST Framework
- **Frontend:** React, Axios, Bootstrap
- **Database:** PostgreSQL
- **PDF Generation:** xhtml2pdf (for prescriptions)
- **Scheduler:** Celery (for reminders, if configured)

**Component Overview:**

- **accounts app:** Handles users, appointments, custom requests, and prescriptions.
- **core app:** Project settings and configuration.

---

## 📚 API Documentation

### Authentication

- `POST /api/accounts/register/` — Register as patient or doctor
- `POST /api/accounts/login/` — Obtain JWT token
- `POST /api/accounts/token/refresh/` — Refresh JWT token
- `POST /api/accounts/token/verify/` — Verify JWT token

### User/Profile

- `GET /api/accounts/profile/` — Get current user profile (auth required)

### Appointments

- `GET /api/accounts/appointments/` — List appointments (role-based)
- `POST /api/accounts/appointments/` — Book appointment (patient)
- `PATCH /api/accounts/appointments/<id>/edit/` — Update appointment
- `GET /api/accounts/my-appointments/` — List upcoming/past appointments (patient)

### Doctors

- `GET /api/accounts/doctors/` — List all doctors
- `GET /api/accounts/doctor/appointment-summary/` — Doctor's appointment summary

### Prescriptions

- `POST /api/accounts/prescriptions/` — Create prescription (doctor)
- `GET /api/accounts/prescriptions/<appointment>/` — Get prescription for appointment
- `PATCH /api/accounts/prescriptions/<id>/edit/` — Update prescription
- `GET /api/accounts/prescriptions/<appointment>/pdf/` — Download prescription PDF

### Custom Appointment Requests

- `POST /api/accounts/custom-appointment-request/` — Create custom request (patient)
- `GET /api/accounts/custom-appointment-requests/` — List all custom requests (admin)
- `GET /api/accounts/doctor/custom-appointment-requests/` — List custom requests for doctor
- `PATCH /api/accounts/custom-appointment-request/<id>/` — Update custom request (approve/reject)
- `GET /api/accounts/patient/custom-appointment-requests/` — List patient's custom requests

### Notifications

- `GET /api/accounts/upcoming-appointment-notification/` — Check for upcoming appointments (24h)

#### Example: Register User

```http
POST /api/accounts/register/
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "mobile": "+88012345678901",
  "password": "Password1!",
  "user_type": "patient",
  "division": "Dhaka",
  "district": "Dhaka",
  "thana": "Dhanmondi",
  "address": "123 Main St"
}
```

#### Example: Book Appointment

```http
POST /api/accounts/appointments/
{
  "doctor": 2,
  "appointment_date": "2025-07-20",
  "timeslot": "10:00-10:30",
  "notes": "Routine checkup"
}
```

---

## 🗄️ Database Schema

### CustomUser

- `id`: PK
- `full_name`, `email`, `mobile`, `user_type` (admin/doctor/patient), `division`, `district`, `thana`, `address`, `profile_image`
- Doctor fields: `license_number`, `experience_years`, `consultation_fee`, `available_timeslots`

### Appointment

- `id`: PK
- `patient`: FK to CustomUser
- `doctor`: FK to CustomUser
- `appointment_date`, `timeslot`, `notes`, `status` (pending/confirmed/cancelled/completed), `notified`

### Prescription

- `id`: PK
- `appointment`: OneToOne FK to Appointment
- `doctor`: FK to CustomUser
- `patient`: FK to CustomUser
- `content`, `created_at`

### CustomAppointmentRequest

- `id`: PK
- `patient`: FK to CustomUser
- `doctor`: FK to CustomUser
- `desired_date`, `desired_timeslot`, `reason`, `status` (pending, doctor_approved, etc.), `admin_comment`, `created_at`

---

## 📝 Challenges & Assumptions

- **Assumptions:**
  - Only doctors and patients can register via the API; admins are created by superusers.
  - Email notifications require proper SMTP configuration in environment variables.
  - Time zones are assumed to be consistent between server and users.
- **Challenges:**
  - Ensuring secure password and data validation.
  - Handling appointment slot conflicts and custom requests.
  - Generating PDFs reliably across platforms.
  - Scheduling reminders efficiently (Celery/Task Scheduler).

---

## 🛠️ Tech Stack

- **Backend:** Django, Django REST Framework, xhtml2pdf
- **Frontend:** React, Axios, Bootstrap
- **Database:** PostgreSQL

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd Appointment-Management-System
```

### 2. Backend Setup (Django)

```sh
cd backend
python -m venv venv
# Activate the virtual environment:
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (admin)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

### 3. Frontend Setup (React)

```sh
cd ../frontend
npm install
npm start
```

The React app will run on [http://localhost:3000](http://localhost:3000) and the Django backend on [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## 🔑 Environment Variables

- **Backend:**
  - Configure database and email settings in `backend/core/settings.py` as needed.
- **Frontend:**
  - API URLs are hardcoded as `http://127.0.0.1:8000` in Axios calls. Update if deploying.

---

## 📦 Project Structure

```
Appointment-Management-System/
  backend/
    accounts/           # Django app for users, appointments, prescriptions
    core/               # Django project settings
    manage.py
    requirements.txt
  frontend/
    src/
      pages/            # React pages (Dashboard, Register, etc.)
      App.js
    package.json
```

---

## 🧑‍💻 Usage

- **Register** as a patient or doctor.
- **Login** to access your dashboard.
- **Patients:** Book appointments or request custom appointments if no slots are available.
- **Doctors:** Approve/reject custom requests, manage schedule.
- **Admins:** Manage all users, appointments, and custom requests.

---

## 🗃️ Database Setup & Sample Data

After running migrations, we can populate our database with sample Bangladeshi users, doctors, and appointments using the provided management command:

```sh
cd backend
python manage.py seed_sample_data
```

- This will create:
  - Two doctors (e.g., Dr. Ayesha Siddiqua, Dr. Mahmudul Hasan)
  - Two patients (e.g., Rahim Uddin, Fatema Begum)
  - Sample appointments and a custom appointment request
- All users have the default password: `Password1!`
- The script is idempotent (safe to run multiple times).



---
