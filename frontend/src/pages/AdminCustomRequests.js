import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminCustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/accounts/custom-appointment-requests/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch (err) {
        setError("Failed to load requests.");
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="container py-4">
      <h3>Custom Appointment Requests</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Admin Comment</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.patient_name}</td>
              <td>{req.doctor_name}</td>
              <td>{req.desired_date}</td>
              <td>{req.desired_timeslot}</td>
              <td>{req.reason}</td>
              <td>{req.status}</td>
              <td>{req.admin_comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomRequests;