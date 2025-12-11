import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

const EventFormPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "hackathon",
    location: "",
    start_date: "",
    end_date: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await apiRequest("/events", "POST", form, token);
      setMessage("Event created successfully!");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Create Event</h2>
        {error && <div className="alert">{error}</div>}
        {message && <div className="success">{message}</div>}
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
          />
          <label>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="hackathon">Hackathon</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
            <option value="workshop">Workshop</option>
          </select>
          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <label>Start Date & Time</label>
          <input
            type="datetime-local"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
          <label>End Date & Time</label>
          <input
            type="datetime-local"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
          />
          <button className="btn-primary">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default EventFormPage;
