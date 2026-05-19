import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {

  const [form, setForm] = useState({
    phone: "",
    password: ""
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid Credentials");
        return;
      }

      localStorage.setItem("token", data.token || "");

      // 🔥 FIXED ROUTING (IMPORTANT)
      navigate("/patient");

    } catch (err) {
      setError("Server Error");
    }
  };

  return (

    <div className="login-container">

      <div className="login-box">

        <h1 className="login-title">HealSync</h1>

        <p className="login-subtitle">
          Smart Hospital Queue System
        </p>

        <h2 className="login-heading">
          Login to your account
        </h2>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            className="login-input"
            type="tel"
            placeholder="Mobile Number (e.g. 9876543210)"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            className="login-input"
            type="password"
            placeholder="Enter secure password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className="login-btn" type="submit">
            Sign In
          </button>

        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>

      </div>

    </div>

  );

}

export default Login;