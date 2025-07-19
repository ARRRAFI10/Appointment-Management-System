



import axios from "axios";
import React, { useEffect, useState } from "react";

const CustomAppointmentRequest = ({ doctorId: propDoctorId, doctorName: propDoctorName }) => {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState(propDoctorId || "");
  const [desiredDate, setDesiredDate] = useState("");
  const [desiredTimeslot, setDesiredTimeslot] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(false);

 
  useEffect(() => {
    if (!propDoctorId) {
      setLoadingDoctors(true);
      const fetchDoctors = async () => {
        try {
          const token = localStorage.getItem("access");
          if (!token) {
            setError("You must be logged in to request an appointment.");
            setLoadingDoctors(false);
            return;
          }
          const res = await axios.get("http://127.0.0.1:8000/api/accounts/doctors/", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDoctors(res.data);
        } catch (err) {
          setError("Failed to load doctors. Please login or try again.");
        } finally {
          setLoadingDoctors(false);
        }
      };
      fetchDoctors();
    }
  }, [propDoctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!doctorId) {
      setError("Please select a doctor.");
      return;
    }
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setError("You must be logged in to submit a request.");
        return;
      }
      await axios.post("http://127.0.0.1:8000/api/accounts/custom-appointment-request/", {
        doctor: doctorId,
        desired_date: desiredDate,
        desired_timeslot: desiredTimeslot,
        reason,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Request submitted! Admin will contact you.");
      setDesiredDate(""); setDesiredTimeslot(""); setReason("");
      if (!propDoctorId) setDoctorId("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Failed to submit request."
      );
    }
  };

  return (
    <div className="container py-4">
      <h3>Request Custom Appointment</h3>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        
        {!propDoctorId && (
          <div className="mb-3">
            <label>Doctor</label>
            {loadingDoctors ? (
              <div>Loading doctors...</div>
            ) : (
              <select
                className="form-control"
                value={doctorId}
                onChange={e => setDoctorId(e.target.value)}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.full_name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        {propDoctorId && (
          <div className="mb-3">
            <label>Doctor</label>
            <input
              className="form-control"
              value={propDoctorName || "Selected Doctor"}
              disabled
              readOnly
            />
          </div>
        )}
        <div className="mb-3">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            value={desiredDate}
            onChange={e => setDesiredDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Preferred Time</label>
          <input
            type="text"
            className="form-control"
            value={desiredTimeslot}
            onChange={e => setDesiredTimeslot(e.target.value)}
            placeholder="e.g. 3:00 PM - 3:30 PM"
            required
          />
        </div>
        <div className="mb-3">
          <label>Reason (optional)</label>
          <textarea
            className="form-control"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default CustomAppointmentRequest;