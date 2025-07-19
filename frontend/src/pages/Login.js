

import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });
      localStorage.setItem("access", res.data.access);

      
      const profileRes = await axios.get("http://127.0.0.1:8000/api/accounts/profile/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      
      if (profileRes.data.user_type === "admin") {
        navigate("/admin/custom-requests");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div className="container py-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-success" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;