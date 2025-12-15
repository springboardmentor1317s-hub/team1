import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  Award,
  Moon,
  Sun
} from "lucide-react";
import { StudentQuickStats, StudentUpcomingEvents } from "./";

/* ============================= */
/* GREETING HELPER */
/* ============================= */
const getGreetingMessage = (userName, userEvents = []) => {
  const hour = new Date().getHours();
  let greeting = "Hello";

  if (hour < 12) greeting = "🌞 Good Morning";
  else if (hour < 17) greeting = "🌤 Good Afternoon";
  else greeting = "🌙 Good Evening";

  const upcomingCount = userEvents.filter(
    e => new Date(e.start_date || e.date) >= new Date()
  ).length;

  return {
    title: `${greeting}, ${userName || "Student"}!`,
    subtitle:
      upcomingCount > 0
        ? `You have ${upcomingCount} upcoming event${upcomingCount > 1 ? "s" : ""}`
        : "No upcoming events today. Take a break 🎉",
  };
};

/* ============================= */
/* COUNTDOWN */
/* ============================= */
const getCountdown = (startDate) => {
  if (!startDate) return "—";
  const diff = new Date(startDate) - new Date();
  if (diff <= 0) return "Started";

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);

  return `${d}d : ${h}h : ${m}m`;
};

/* ============================= */
/* PROFILE COMPLETION */
/* ============================= */
const getProfileCompletion = (user = {}) => {
  const fields = ["name", "email", "college", "phone"];
  const completed = fields.filter(f => user[f]).length;
  return Math.round((completed / fields.length) * 100);
};

/* ============================= */
/* SUGGESTED EVENTS */
/* ============================= */
const getSuggestedEvents = (events = [], userEvents = []) => {
  const registeredIds = userEvents.map(e => e.id);
  return events.filter(e => !registeredIds.includes(e.id)).slice(0, 3);
};

const DashboardSection = ({
  currentUser = {},
  userEvents = [],
  events = [],
  handleViewDetails = () => {},
  setActiveTab = () => {}
}) => {
  const [darkMode, setDarkMode] = useState(false);

  const greeting = getGreetingMessage(currentUser.name, userEvents);
  const profilePercent = getProfileCompletion(currentUser);
  const suggestedEvents = getSuggestedEvents(events, userEvents);

  return (
    <div
      className={`min-h-screen p-6 space-y-8 transition ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >

      {/* HEADER + DARK MODE */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Welcome back, {currentUser?.name || "Student"}!
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg border"
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </div>

      {/* GREETING CARD */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold">{greeting.title}</h2>
        <p className="text-gray-600">{greeting.subtitle}</p>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Profile Completion */}
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Profile</h3>
            <CheckCircle className="text-green-500" />
          </div>
          <div className="h-3 bg-gray-200 rounded mt-3">
            <div
              className="h-full bg-green-500 rounded"
              style={{ width: `${profilePercent}%` }}
            />
          </div>
          <p className="text-sm mt-2">{profilePercent}% completed</p>
        </div>

        {/* Today */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Today</h3>
          <p className="text-lg font-bold text-blue-600">
            {new Date().toDateString()}
          </p>
        </div>

        {/* Tip */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold flex gap-2 items-center">
            <Sparkles className="text-yellow-500" /> Tip
          </h3>
          <p className="text-sm mt-2">
            Attend events to gain certificates & skills 🚀
          </p>
        </div>

        {/* Achievements */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold flex gap-2 items-center">
            <Award className="text-purple-500" /> Badges
          </h3>
          <p className="text-sm mt-2">
            🎖 {userEvents.length} Events Joined
          </p>
        </div>
      </div>

      {/* QUICK STATS */}
      <StudentQuickStats registrations={userEvents} allEvents={events} />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* RECENT REGISTRATIONS */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Recent Registrations</h2>

          {userEvents.length > 0 ? (
            userEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                onClick={() => handleViewDetails(event)}
                className="p-4 mb-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer"
              >
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-red-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Starts in {getCountdown(event.start_date || event.date)}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <Calendar className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 mb-4">No registrations yet</p>
              <button
                onClick={() => setActiveTab("browse")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Browse Events
              </button>
            </div>
          )}
        </div>

        {/* UPCOMING EVENTS */}
        <StudentUpcomingEvents
          events={events}
          onViewDetails={handleViewDetails}
          onExploreMore={() => setActiveTab("browse")}
        />
      </div>

      {/* SUGGESTED EVENTS */}
      {suggestedEvents.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Suggested for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedEvents.map(event => (
              <div
                key={event.id}
                onClick={() => handleViewDetails(event)}
                className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer"
              >
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-gray-600">{event.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardSection;
