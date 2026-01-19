import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventListPage from "./pages/EventListPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import FeedbackPage from "./pages/FeedbackPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EventFormPage from "./pages/EventFormPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./AuthContext";

const App = () => {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/login" element={user ? <Navigate to="/events" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/events" /> : <RegisterPage />} />
        <Route path="/events" element={<EventListPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        {/* Feedback route for specific event */}
        <Route
          path="/events/:id/feedback"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        {/* Dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["student", "college_admin", "super_admin"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["college_admin", "super_admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Event management routes for admins */}
        <Route
          path="/admin/events/new"
          element={
            <ProtectedRoute roles={["college_admin", "super_admin"]}>
              <EventFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
