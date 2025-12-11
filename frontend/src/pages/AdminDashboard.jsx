import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { apiRequest } from "../api";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiRequest("/admin/dashboard", "GET", null, token);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    const loadMyEvents = async () => {
      try {
        const data = await apiRequest("/events/mine", "GET", null, token);
        setMyEvents(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
    loadMyEvents();
  }, [token]);

  const loadParticipants = async () => {
    try {
      const data = await apiRequest(
        `/registrations/event/${selectedEventId}`,
        "GET",
        null,
        token
      );
      setParticipants(data);
    } catch (err) {
      console.error(err);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await apiRequest(
        `/registrations/${id}/status`,
        "PATCH",
        { status },
        token
      );
      loadParticipants();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="muted">
            Manage events, registrations, and keep track of system activity.
          </p>
        </div>
        <Link className="btn-primary" to="/admin/events/new">
          + Create New Event
        </Link>
      </div>

      {stats && (
        <div className="grid stats-grid">
          <div className="card stat-card">
            <p className="muted small">Total Events</p>
            <h2>{stats.totalEvents}</h2>
          </div>
          <div className="card stat-card">
            <p className="muted small">Total Registrations</p>
            <h2>{stats.totalRegistrations}</h2>
          </div>
          <div className="card stat-card">
            <p className="muted small">Total Feedback</p>
            <h2>{stats.totalFeedback}</h2>
          </div>
        </div>
      )}

      <div className="grid">
        {/* Participant Management */}
        <div className="card">
          <h2>Participant Management</h2>
          <p className="muted small">
            Select an event to view & manage participant requests.
          </p>

          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">-- Select Event --</option>
            {myEvents.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </select>

          <button
            className="btn-secondary"
            onClick={loadParticipants}
            disabled={!selectedEventId}
          >
            Load Participants
          </button>

          {participants.length === 0 && selectedEventId && (
            <p className="muted small">No registrations yet.</p>
          )}

          {participants.map((p) => (
            <div key={p._id} className="feedback-item">
              <p>
                <strong>{p.user_id?.name}</strong> ({p.user_id?.college}) –{" "}
                <span className={`status-badge ${p.status}`}>
                  {p.status.toUpperCase()}
                </span>
              </p>

              <div className="btn-group-inline">
                <button
                  className="btn-primary small-btn"
                  onClick={() => changeStatus(p._id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="btn-secondary small-btn"
                  onClick={() => changeStatus(p._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Admin Activity */}
        <div className="card">
          <h2>Recent Admin Activity</h2>
          {stats?.recentLogs?.length === 0 && (
            <p className="muted">No activity yet.</p>
          )}

          {stats?.recentLogs?.map((log) => {
            const studentName =
              log.registration_id?.user_id?.name || "Unknown User";
            const eventTitle =
              log.registration_id?.event_id?.title || "Unknown Event";
            const currentStatus = log.registration_id?.status || "";

            return (
              <div key={log._id} className="feedback-item">
                <p>
                  Changed registration for{" "}
                  <strong>{studentName}</strong> ({eventTitle}) to{" "}
                  <span className={`status-badge ${currentStatus}`}>
                    {currentStatus.toUpperCase()}
                  </span>
                </p>
                <p className="muted small">
                  By <strong>{log.user_id?.name || "Admin"}</strong> at{" "}
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
