import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo-text">CampusEventHub</span>
      </div>
      <div className="navbar-right">
        <Link to="/events">Events</Link>
        {user && user.role !== "student" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}
        {user && (
          <Link to="/dashboard">My Dashboard</Link>
        )}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
