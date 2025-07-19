import { Route, Routes } from 'react-router-dom';
import './App.css';
import AdminCustomRequests from "./pages/AdminCustomRequests";
import BookAppointment from './pages/BookAppointment';
import CustomAppointmentRequest from "./pages/CustomAppointmentRequest";
import CustomAppointments from './pages/CustomAppointments';
import Dashboard from './pages/Dashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorCustomRequests from "./pages/DoctorCustomRequests";
import DoctorSummary from './pages/DoctorSummary';
import Landing from './pages/Landing';
import Login from './pages/Login';
import MyAppointments from './pages/MyAppointments';
import MyPrescriptions from './pages/MyPrescriptions';
import Profile from './pages/Profile';
import Register from './pages/Register';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/my-prescriptions" element={<MyPrescriptions />} />
      <Route path="/doctor/summary" element={<DoctorSummary />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
      <Route path="/request-custom-appointment/:doctorId" element={<CustomAppointmentRequest />} />
      <Route path="/admin/custom-requests" element={<AdminCustomRequests />} />
      <Route path="/doctor/custom-requests" element={<DoctorCustomRequests />} />
      <Route path="/custom-appointments" element={<CustomAppointments />} />
      <Route path="/doctor/custom-requests" element={<DoctorCustomRequests />} />
    </Routes>
  );
}

export default App;
