import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: ""
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration Failed");
        return;
      }

      navigate("/");

    } catch (err) {
      setError("Server Error");
    }

  };

  return (

    <div className="register-container">

      <div className="register-box">

        <h1 className="register-title">HealSync</h1>

        <p className="register-subtitle">
          Smart Hospital Queue System
        </p>

        <h2 className="register-heading">
          Create Account
        </h2>

        {error && (
          <p className="register-error">{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            className="register-input"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="register-input"
            type="tel"
            placeholder="Mobile Number (e.g. 9876543210)"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            className="register-input"
            type="password"
            placeholder="Create Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className="register-btn" type="submit">
            Register
          </button>

        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>

      </div>

    </div>

  );

}

export default Register;