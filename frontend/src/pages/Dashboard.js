import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/accounts/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile. Please login again.");
      }
    };
    fetchProfile();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>Welcome, {profile.full_name}!</h2>
      <p><b>Your role:</b> {profile.user_type.charAt(0).toUpperCase() + profile.user_type.slice(1)}</p>
      <div className="mb-3">
        <button className="btn btn-info me-2" onClick={() => navigate("/profile")}>View Profile</button>
        {profile.user_type === "patient" && (
          <>
            <button className="btn btn-primary me-2" onClick={() => navigate("/book-appointment")}>Book Appointment</button>
            <button className="btn btn-secondary" onClick={() => navigate("/my-appointments")}>My Appointments</button>
            <button className="btn btn-info me-2" onClick={() => navigate("/my-prescriptions")}>My Prescriptions</button>
          </>
        )}
        {profile.user_type === "doctor" && (
          <>
            <button className="btn btn-primary me-2" onClick={() => navigate("/doctor-schedule")}>Manage Schedule</button>
            <button className="btn btn-secondary" onClick={() => navigate("/doctor/appointments")}>View Appointments</button>
          </>
        )}
        {profile.user_type === "admin" && (
          <>
            <button className="btn btn-warning me-2" onClick={() => navigate("/admin/appointments")}>Manage Appointments</button>
            <button className="btn btn-success" onClick={() => navigate("/admin/reports")}>Generate Reports</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;