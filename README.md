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

## 🛠️ Tech Stack

- **Backend:** Django, Django REST Framework, xhtml2pdf
- **Frontend:** React, Axios, Bootstrap
- **Database:** SQLite (default, can be changed)

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




