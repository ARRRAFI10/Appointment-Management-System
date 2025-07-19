import axios from "axios";
import React, { useEffect, useState } from "react";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/accounts/my-appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const renderAppointmentCard = (appt) => (
    <div className="card mb-3 shadow-sm" key={appt.id}>
      <div className="card-body">
        <h5 className="card-title">{appt.doctor_name || "Doctor"}</h5>
        <p className="card-text">
          <b>Date:</b> {appt.appointment_date}<br />
          <b>Time:</b> {appt.timeslot}<br />
          <b>Status:</b> {appt.status}
        </p>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Appointments</h2>
      <div className="row">
        <div className="col-md-6">
          <h4>Upcoming Appointments</h4>
          {appointments.upcoming.length === 0 ? (
            <div className="text-muted">No upcoming appointments.</div>
          ) : (
            appointments.upcoming.map(renderAppointmentCard)
          )}
        </div>
        <div className="col-md-6">
          <h4>Past Appointments</h4>
          {appointments.past.length === 0 ? (
            <div className="text-muted">No past appointments.</div>
          ) : (
            appointments.past.map(renderAppointmentCard)
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;