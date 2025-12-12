import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Plus } from 'lucide-react';

const StudentUpcomingEvents = ({ events, onViewDetails, onExploreMore }) => {

  // ⭐ YOUR EXISTING FILTER CODE (unchanged)
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // ⭐ NEW: Countdown Timer State
  const [countdowns, setCountdowns] = useState({});

  // ⭐ NEW: Function to calculate remaining time
  const calculateCountdown = (date) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) return "Event Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${days}d : ${hours}h : ${minutes}m`;
  };

  // ⭐ NEW: Auto-update countdown every 1 minute
  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns = {};
      upcomingEvents.forEach(event => {
        newCountdowns[event.id] = calculateCountdown(event.date);
      });
      setCountdowns(newCountdowns);
    };

    updateCountdowns();              // Run immediately
    const interval = setInterval(updateCountdowns, 60000); // Update every 1 minute

    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Upcoming Events</h3>
        <Calendar className="w-6 h-6 text-blue-600" />
      </div>

      {upcomingEvents.length > 0 ? (
        <div className="space-y-4">

          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="group p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              onClick={() => onViewDetails(event)}
            >
              <div className="flex items-start justify-between">

                <div className="flex-1 min-w-0">

                  {/* Event title */}
                  <h4
                    className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-tight mb-2 overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {event.title}
                  </h4>

                  <div className="space-y-1">

                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center text-xs text-gray-600">
                      <Clock className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{event.time}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-xs text-gray-600">
                      <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate" title={event.college}>
                        {event.college}
                      </span>
                    </div>

                    {/* ⭐ NEW — Countdown Timer Display */}
                    <div className="flex items-center text-xs font-semibold text-blue-600 mt-1">
                      <Clock className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span>
                        {countdowns[event.id] || "Loading..."}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Arrow Icon */}
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
              </div>
            </div>
          ))}

          {/* Explore Button */}
          <button
            onClick={onExploreMore}
            className="w-full mt-4 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Explore More Events
          </button>

        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No upcoming events</p>
          <button
            onClick={onExploreMore}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentUpcomingEvents;
