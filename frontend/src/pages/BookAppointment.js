import React, { useState, useEffect } from "react";
import axios from "axios";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctor: "",
    appointment_date: "",
    timeslot: "",
    notes: ""
  });
  const [timeslots, setTimeslots] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch doctors on mount
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/accounts/doctors/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    })
    .then(res => setDoctors(res.data))
    .catch(err => setError("Failed to load doctors"));
  }, []);

  // Update timeslots when doctor changes
  useEffect(() => {
    const selectedDoctor = doctors.find(d => d.id === Number(form.doctor));
    if (selectedDoctor) {
      setTimeslots(
        (selectedDoctor.available_timeslots || "").split(",").map(s => s.trim())
      );
    } else {
      setTimeslots([]);
    }
  }, [form.doctor, doctors]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/accounts/appointments/",
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
      );
      setMessage("Appointment booked successfully!");
      setForm({ doctor: "", appointment_date: "", timeslot: "", notes: "" });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Booking failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Book Appointment</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <select
          name="doctor"
          className="form-control mb-2"
          value={form.doctor}
          onChange={handleChange}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.full_name} ({doc.specialization || "Doctor"})
            </option>
          ))}
        </select>
        <input
          name="appointment_date"
          type="date"
          className="form-control mb-2"
          value={form.appointment_date}
          onChange={handleChange}
          required
        />
        <select
          name="timeslot"
          className="form-control mb-2"
          value={form.timeslot}
          onChange={handleChange}
          required
        >
          <option value="">Select Timeslot</option>
          {timeslots.map((slot, idx) => (
            <option key={idx} value={slot}>{slot}</option>
          ))}
        </select>
        <textarea
          name="notes"
          placeholder="Notes/Symptoms"
          className="form-control mb-2"
          value={form.notes}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary">Book</button>
      </form>
    </div>
  );
};

export default BookAppointment;