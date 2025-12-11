import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import EventCard from "../components/EventCard";

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const query = category ? `?category=${category}` : "";
      const data = await apiRequest(`/events${query}`);
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line
  }, [category]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>All Events</h1>
          <p className="muted">
            Discover inter-college events happening across campuses.
          </p>
        </div>
        <div className="filter-group">
          <label>Filter by category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="sports">Sports</option>
            <option value="hackathon">Hackathon</option>
            <option value="cultural">Cultural</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>
      </div>
      {loading && <p>Loading events...</p>}
      <div className="grid">
        {events.map((ev) => (
          <EventCard key={ev._id} event={ev} />
        ))}
        {!loading && events.length === 0 && (
          <p className="muted">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default EventListPage;
