import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [notify, setNotify] = useState(false);

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

    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/accounts/upcoming-appointment-notification/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotify(res.data.notify);
      } catch (err) {
        // Optionally handle error
      }
    };

    fetchProfile();
    fetchNotification();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  // Card data for each user type
  const cardData = {
    patient: [
      { label: "Book Appointment", color: "primary", path: "/book-appointment" },
      { label: "My Appointments", color: "secondary", path: "/my-appointments" },
      { label: "My Prescriptions", color: "info", path: "/my-prescriptions" },
    ],
    doctor: [
      { label: "Manage Schedule", color: "primary", path: "/doctor-schedule" },
      { label: "View Appointments", color: "secondary", path: "/doctor/appointments" },
      { label: "Summary Report", color: "info", path: "/doctor/summary" },
    ],
    admin: [
      { label: "Manage Appointments", color: "warning", path: "/admin/appointments" },
      { label: "Generate Reports", color: "success", path: "/admin/reports" },
    ],
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center mb-4">
        <div className="col-md-2 text-center">
          {profile.profile_image ? (
            <img
              src={`http://127.0.0.1:8000${profile.profile_image}`}
              alt="Profile"
              className="rounded-circle shadow"
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
              style={{ width: 100, height: 100, color: "#fff", fontSize: 36 }}
            >
              {profile.full_name.charAt(0)}
            </div>
          )}
        </div>
        <div className="col-md-10">
          <h2 className="fw-bold mb-1">Welcome, {profile.full_name}!</h2>
          <p className="mb-0 text-muted">
            <b>Your role:</b> {profile.user_type.charAt(0).toUpperCase() + profile.user_type.slice(1)}
          </p>
          {notify && (
            <div className="blinking-notification mt-2">
              You have an appointment within the next 24 hours!
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <button
                className="btn btn-outline-info w-100 mb-2"
                onClick={() => navigate("/profile")}
              >
                <i className="bi bi-person-circle me-2"></i>View Profile
              </button>
            </div>
          </div>
        </div>
        {cardData[profile.user_type].map((btn, idx) => (
          <div className="col-12 col-md-4" key={idx}>
            <div className={`card border-${btn.color} shadow-sm h-100`}>
              <div className="card-body text-center">
                <button
                  className={`btn btn-${btn.color} w-100`}
                  onClick={() => navigate(btn.path)}
                >
                  {btn.label}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;