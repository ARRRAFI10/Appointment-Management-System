import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorCustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/accounts/doctor/custom-appointment-requests/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch {
        setError("Failed to load requests.");
      }
    };
    fetchRequests();
  }, []);

  const handleDecision = async (id, status) => {
    const token = localStorage.getItem("access");
    try {
      await axios.patch(`http://127.0.0.1:8000/api/accounts/custom-appointment-request/${id}/`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="container py-4">
      <h3>My Custom Appointment Requests</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.patient_name}</td>
              <td>{req.desired_date}</td>
              <td>{req.desired_timeslot}</td>
              <td>{req.reason}</td>
              <td>{req.status}</td>
              <td>
                {req.status === "pending_doctor" && (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleDecision(req.id, "doctor_approved")}>Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDecision(req.id, "doctor_rejected")}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorCustomRequests;