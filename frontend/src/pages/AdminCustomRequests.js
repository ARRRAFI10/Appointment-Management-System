import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminCustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [assignModal, setAssignModal] = useState({ show: false, req: null });
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeslot, setSelectedTimeslot] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      try {
        const reqRes = await axios.get("http://127.0.0.1:8000/api/accounts/custom-appointment-requests/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(reqRes.data);
        const docRes = await axios.get("http://127.0.0.1:8000/api/accounts/doctors/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(docRes.data);
      } catch {
        setError("Failed to load data.");
      }
    };
    fetchData();
  }, []);

  const openAssignModal = (req) => {
    setAssignModal({ show: true, req });
    setSelectedDoctor("");
    setSelectedDate("");
    setSelectedTimeslot("");
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("access");
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/accounts/custom-appointment-request/${assignModal.req.id}/`,
        {
          doctor: selectedDoctor,
          desired_date: selectedDate,
          desired_timeslot: selectedTimeslot,
          status: "pending_doctor"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignModal({ show: false, req: null });
      const reqRes = await axios.get("http://127.0.0.1:8000/api/accounts/custom-appointment-requests/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(reqRes.data);
    } catch {
      setError("Failed to assign doctor/timeslot.");
    }
  };

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
            <th>Assign</th>
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
              <td>
                {req.status === "pending" && (
                  <button className="btn btn-primary btn-sm" onClick={() => openAssignModal(req)}>
                    Assign
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      {assignModal.show && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAssign}>
                <div className="modal-header">
                  <h5 className="modal-title">Assign Doctor & Timeslot</h5>
                  <button type="button" className="btn-close" onClick={() => setAssignModal({ show: false, req: null })}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label>Doctor</label>
                    <select className="form-control" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} required>
                      <option value="">Select Doctor</option>
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Date</label>
                    <input type="date" className="form-control" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label>Timeslot</label>
                    <input type="text" className="form-control" value={selectedTimeslot} onChange={e => setSelectedTimeslot(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">Assign</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setAssignModal({ show: false, req: null })}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomRequests;