import { Route, Routes } from 'react-router-dom';
import './App.css';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorSummary from './pages/DoctorSummary';
import Landing from './pages/Landing';
import Login from './pages/Login';
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
    </Routes>
  );
}

export default App;
