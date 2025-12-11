import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../AuthContext";

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [event, setEvent] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const loadEvent = async () => {
    try {
      const data = await apiRequest(`/events/${id}`);
      setEvent(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFeedback = async () => {
    try {
      const data = await apiRequest(`/feedback/event/${id}`);
      setFeedback(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvent();
    loadFeedback();
    // eslint-disable-next-line
  }, [id]);

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await apiRequest("/registrations", "POST", { event_id: id }, token);
      setSuccess("Registration submitted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!event) return <p className="page">Loading...</p>;

  const start = new Date(event.start_date).toLocaleString();
  const end = new Date(event.end_date).toLocaleString();

  return (
    <div className="page">
      <div className="card">
        <h1>{event.title}</h1>
        <p className="muted">{event.category?.toUpperCase()}</p>
        <p>{event.description}</p>
        <p>
          <strong>Venue:</strong> {event.location}
        </p>
        <p>
          <strong>Starts:</strong> {start}
        </p>
        <p>
          <strong>Ends:</strong> {end}
        </p>
        <p className="muted small">
          Hosted by {event.college_id?.name} ({event.college_id?.college})
        </p>
        {error && <div className="alert">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button className="btn-primary" onClick={handleRegister}>
          Register for Event
        </button>
        {user && (
          <Link className="btn-secondary" to={`/events/${id}/feedback`}>
            Leave Feedback
          </Link>
        )}
      </div>

      <div className="card">
        <h2>Feedback</h2>
        {feedback.length === 0 && (
          <p className="muted">No feedback yet. Be the first to share!</p>
        )}
        {feedback.map((fb) => (
          <div key={fb._id} className="feedback-item">
            <p>
              <strong>{fb.user_id?.name}</strong> ({fb.user_id?.college})
            </p>
            <p>Rating: {"⭐".repeat(fb.rating)}</p>
            <p>{fb.comments}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventDetailsPage;
