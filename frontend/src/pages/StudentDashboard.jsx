import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { apiRequest } from "../api";

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const [regs, setRegs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest("/registrations/my", "GET", null, token);
        setRegs(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [token]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="muted">Track your registrations and event activity.</p>
        </div>
      </div>
      <div className="card">
        <h2>My Registrations</h2>
        {regs.length === 0 && (
          <p className="muted">You have not registered for any events yet.</p>
        )}
        {regs.map((r) => (
            <div key={r._id} className="feedback-item">
                <h3>{r.event_id?.title}</h3>
                <p>
                    Status:{" "}
                    <span className={`status-badge ${r.status}`}>
                        {r.status.toUpperCase()}
                    </span>
                </p>
                <p className="muted small">
                    Registered on: {new Date(r.timestamp).toLocaleString()}
                </p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
