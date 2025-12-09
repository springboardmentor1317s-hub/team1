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

// Protected Route Component for any authenticated user
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin-only Route Component
const AdminRoute = ({ children }) => {
  const { hasRole, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasRole(['college_admin', 'super_admin'])) {
    return <Navigate to="/student/dashboard" replace />;
  }
  
  return children;
};

// Student-only Route Component
const StudentRoute = ({ children }) => {
  const { hasRole, currentUser, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasRole(['student'])) {
    // Redirect based on admin type
    if (currentUser?.role === 'super_admin') {
      return <Navigate to="/super-admin/dashboard" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};

// App Component with Routes
const AppRoutes = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  console.log("Current user:", currentUser);
  console.log("Is authenticated:", isAuthenticated());
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 w-full">
        <Routes>
          {/* Public routes */}
          <Route path="/create-event" element={<EventCreationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/event-registration" element={<EventRegistrationPage />} />
          <Route path="/event-register/:eventId" element={<EventRegistrationPage />} />
          
          {/* Root route - redirect based on role */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                {currentUser && currentUser.role === 'student' ? (
                  <Navigate to="/student/dashboard" replace />
                ) : currentUser && currentUser.role === 'super_admin' ? (
                  <Navigate to="/super-admin/dashboard" replace />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )}
              </ProtectedRoute>
            } 
          />
          
          {/* Student routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          
          {/* Super Admin route */}
          <Route 
            path="/super-admin/dashboard" 
            element={
              <AdminRoute>
                <SuperAdminDashboard />
              </AdminRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
};

// Main App Component
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