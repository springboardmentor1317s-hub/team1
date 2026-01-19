import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing user on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, authToken) => {
    console.log("Login called with userData:", userData);
    console.log("User role:", userData.role);
    
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    setToken(authToken);

    // Redirect based on user role
    if (userData.role === 'student') {
      console.log("Redirecting to student dashboard");
      navigate('/student/dashboard');
    } else if (userData.role === 'super_admin') {
      console.log("Redirecting to super admin dashboard");
      navigate('/super-admin/dashboard');
    } else {
      console.log("Redirecting to admin dashboard");
      navigate('/admin/dashboard');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setToken(null);
    navigate('/login');
  };

  // Update user profile
  const updateUserProfile = (updatedUserData) => {
    const updatedUser = { ...currentUser, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  // Context value
  const value = {
    currentUser,
    token,
    login,
    logout,
    updateUserProfile,
    isAuthenticated,
    hasRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};