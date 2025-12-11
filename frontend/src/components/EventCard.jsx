import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const dateStr = new Date(event.start_date).toLocaleDateString();
  return (
    <div className="card">
      <h3>{event.title}</h3>
      <p className="muted">{event.category?.toUpperCase()}</p>
      <p>{event.description.slice(0, 100)}...</p>
      <p>
        <strong>When:</strong> {dateStr}
      </p>
      <p>
        <strong>Where:</strong> {event.location}
      </p>
      <Link className="btn-primary" to={`/events/${event._id}`}>
        View Details
      </Link>
    </div>
  );
};

export default EventCard;
