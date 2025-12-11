import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventCreationForm } from './components/event-actions/EventCreationForm.jsx';
import { EventRegistrationPage } from './components/event-actions/EventRegistrationPage.jsx';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// ⭐ TTS Import
import TTS from "./components/TTS";

// ⭐ Auto Voice Import
import AutoTTS from "./components/AutoTTS";

// ⭐ Voice Assistant Button
import VoiceAssistantButton from "./components/VoiceAssistantButton";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route
const AdminRoute = ({ children }) => {
  const { hasRole, loading, isAuthenticated } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!hasRole(['college_admin', 'super_admin'])) return <Navigate to="/student/dashboard" replace />;
  return children;
};

// Student Route
const StudentRoute = ({ children }) => {
  const { hasRole, currentUser, loading, isAuthenticated } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!hasRole(['student'])) {
    if (currentUser?.role === 'super_admin') return <Navigate to="/super-admin/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

// App Routes
const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col w-full">

      {/* ⭐ AUTO-SPEAK ON PAGE LOAD */}
      <AutoTTS text="Welcome to Campus Event Hub." />

      {/* ⭐ Voice Assistant Floating Button */}
      <VoiceAssistantButton />

      <div className="flex-1 w-full">

        <Routes>

          {/* TTS Page */}
          <Route path="/tts" element={<TTS />} />

          {/* Public Pages */}
          <Route path="/create-event" element={<EventCreationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/event-registration" element={<EventRegistrationPage />} />
          <Route path="/event-register/:eventId" element={<EventRegistrationPage />} />

          {/* Landing redirect */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {currentUser?.role === 'student' ? (
                  <Navigate to="/student/dashboard" replace />
                ) : currentUser?.role === 'super_admin' ? (
                  <Navigate to="/super-admin/dashboard" replace />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )}
              </ProtectedRoute>
            }
          />

          {/* Student Dashboard */}
          <Route
            path="/student/dashboard"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Super Admin */}
          <Route
            path="/super-admin/dashboard"
            element={
              <AdminRoute>
                <SuperAdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>

      <Footer />
      <Chatbot />
    </div>
  );
};

// Main App
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
