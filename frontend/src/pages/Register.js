// src/pages/Register.js
import React, { useState } from "react";
import axios from "axios";

const initialState = {
  full_name: "",
  email: "",
  mobile: "",
  password: "",
  user_type: "patient",
  division: "",
  district: "",
  thana: "",
  address: "",
  profile_image: null,
  license_number: "",
  experience_years: "",
  consultation_fee: "",
  available_timeslots: "",
};

const Register = () => {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      const res = await axios.post(
        "http://127.0.0.1:8000/api/accounts/register/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(res.data.message || "Registration successful!");
      setForm(initialState);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Common fields */}
        <input name="full_name" placeholder="Full Name" className="form-control mb-2" value={form.full_name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" className="form-control mb-2" value={form.email} onChange={handleChange} required />
        <input name="mobile" placeholder="Mobile (+88...)" className="form-control mb-2" value={form.mobile} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="form-control mb-2" value={form.password} onChange={handleChange} required />
        <select name="user_type" className="form-control mb-2" value={form.user_type} onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        <input name="division" placeholder="Division" className="form-control mb-2" value={form.division} onChange={handleChange} required />
        <input name="district" placeholder="District" className="form-control mb-2" value={form.district} onChange={handleChange} required />
        <input name="thana" placeholder="Thana" className="form-control mb-2" value={form.thana} onChange={handleChange} required />
        <input name="address" placeholder="Address" className="form-control mb-2" value={form.address} onChange={handleChange} required />
        <input name="profile_image" type="file" className="form-control mb-2" onChange={handleChange} accept="image/png, image/jpeg" />

        {/* Doctor-only fields */}
        {form.user_type === "doctor" && (
          <>
            <input name="license_number" placeholder="License Number" className="form-control mb-2" value={form.license_number} onChange={handleChange} required />
            <input name="experience_years" type="number" placeholder="Experience Years" className="form-control mb-2" value={form.experience_years} onChange={handleChange} required />
            <input name="consultation_fee" type="number" placeholder="Consultation Fee" className="form-control mb-2" value={form.consultation_fee} onChange={handleChange} required />
            <input name="available_timeslots" placeholder="Available Timeslots (e.g. 10:00-11:00)" className="form-control mb-2" value={form.available_timeslots} onChange={handleChange} required />
          </>
        )}

        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;