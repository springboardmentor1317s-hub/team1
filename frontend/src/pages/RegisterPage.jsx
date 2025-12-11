import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    role: "student",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register({
        name: form.name,
        email: form.email,
        college: form.college,
        password: form.password,
        role: form.role
      });
      navigate("/events");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="muted">Join CampusEventHub today</p>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Full name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <label>Email address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <label>College / University</label>
          <input
            name="college"
            value={form.college}
            onChange={handleChange}
            required
          />
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="college_admin">College Admin</option>
          </select>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="muted small">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
