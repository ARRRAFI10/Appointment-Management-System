import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", form);
      // Save tokens to localStorage
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      setMessage("Login successful!");
      // Redirect to dashboard or home if you want
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Login failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="form-control mb-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;