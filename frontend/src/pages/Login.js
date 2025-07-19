// import axios from "axios";
// import React, { useState } from "react";

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     try {
//       const res = await axios.post("http://127.0.0.1:8000/api/token/", form);
//       // Save tokens to localStorage
//       localStorage.setItem("access", res.data.access);
//       localStorage.setItem("refresh", res.data.refresh);
//       setMessage("Login successful!");
//       // Redirect to dashboard or home if you want
//       window.location.href = "/dashboard";
//     } catch (err) {
//       setError(
//         err.response?.data?.detail ||
//         JSON.stringify(err.response?.data) ||
//         "Login failed"
//       );
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Login</h2>
//       {message && <div className="alert alert-success">{message}</div>}
//       {error && <div className="alert alert-danger">{error}</div>}
//       <form onSubmit={handleSubmit}>
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           className="form-control mb-2"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           className="form-control mb-2"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" className="btn btn-primary">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

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
      // 1. Authenticate and get token
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });
      localStorage.setItem("access", res.data.access);

      // 2. Fetch user profile
      const profileRes = await axios.get("http://127.0.0.1:8000/api/accounts/profile/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      // 3. Redirect based on user_type
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