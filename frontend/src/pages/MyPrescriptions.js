import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPrescriptions = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/accounts/appointments/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    })
    .then(res => setAppointments(res.data))
    .catch(err => setError("Failed to load prescriptions"));
  }, []);

  
  const appointmentsWithPrescriptions = appointments.filter(app => app.prescription);

  return (
    <div className="container mt-5">
      <h2>My Prescriptions</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {appointmentsWithPrescriptions.length === 0 ? (
        <div>No prescriptions found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Prescription</th>
              <th>Download PDF</th>
            </tr>
          </thead>
          <tbody>
            {appointmentsWithPrescriptions.map(app => (
              <tr key={app.id}>
                <td>{app.doctor_name || (app.doctor && app.doctor.full_name) || "Doctor"}</td>
                <td>{app.appointment_date}</td>
                <td>
                  <div style={{ whiteSpace: "pre-line" }}>
                    {app.prescription.content}
                  </div>
                </td>
                <td>
                  <a
                    href={`http://127.0.0.1:8000/api/accounts/prescriptions/${app.id}/pdf/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-info"
                  >
                    PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyPrescriptions;