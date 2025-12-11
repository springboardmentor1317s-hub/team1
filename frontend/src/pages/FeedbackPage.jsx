import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { apiRequest } from "../api";

const FeedbackPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await apiRequest(
        "/feedback",
        "POST",
        { event_id: id, rating, comments },
        token
      );
      setSuccess("Feedback submitted!");
      setTimeout(() => navigate(`/events/${id}`), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Leave Feedback</h2>
        {error && <div className="alert">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <label>Rating</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <label>Comments</label>
          <textarea
            rows="4"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
          <button className="btn-primary">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
