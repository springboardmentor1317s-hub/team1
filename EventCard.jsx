import React from "react";
import { Calendar, Users, MapPin, Clock } from "lucide-react";

/* ✅ Progress calculation */
const calculateProgress = (current, max) => {
  if (!max || max === 0) return 0;
  return Math.min(100, Math.round((current / max) * 100));
};

const EventCard = ({ event, onViewDetails, onRegister, showRegister }) => {
  const progress = calculateProgress(
    event.participants,
    event.maxParticipants
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
      
      {/* Image */}
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-40 object-cover"
      />

      {/* Content */}
      <div className="p-5 space-y-3">

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {event.title}
        </h3>

        {/* Calendar */}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
          {new Date(event.date).toLocaleDateString()}
        </div>

        {/* Time */}
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-blue-600" />
          {event.time}
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
          {event.location || event.college}
        </div>

        {/* Participants */}
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-blue-600" />
          {event.participants}/{event.maxParticipants} Registered
        </div>

        {/* 🔥 Progress Bar */}
        <div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full ${
                progress > 80
                  ? "bg-red-500"
                  : progress > 50
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progress}% filled
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => onViewDetails(event)}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View Details
          </button>

          {showRegister && (
            <button
              onClick={() => onRegister(event.id)}
              disabled={event.participants >= event.maxParticipants}
              className={`px-4 py-1.5 text-sm rounded-lg font-medium ${
                event.participants >= event.maxParticipants
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Register
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default EventCard;

