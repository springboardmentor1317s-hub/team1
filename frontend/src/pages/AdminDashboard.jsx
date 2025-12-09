import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Calendar, Users, TrendingUp, BarChart3, Plus, Download, Eye, MessageSquare, User, LogOut, Settings, Filter, Search, CheckCircle, AlertCircle, XCircle, Clock, Building, Trash2, X, MapPin, DollarSign, Tag, Bell, Activity, Shield, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileSettings from '../components/ProfileSettings';
import { EventRegistrations, ActivityLogs, CollegeAdminApproval, AdminFeedbackAnalysis } from '../components/admin';
import UserManagement from '../components/admin/UserManagement';
import EventManagement from '../components/admin/EventManagement';
import Overview from '../components/admin/Overview';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { API_BASE_URL } from '../config/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeUsers: 0,
    totalRegistrations: 0,
    avgParticipants: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const token = localStorage.getItem('token');
  const dropdownRef = useRef(null);

  // Users data
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('student'); // For super admin filter
  const [userSearchTerm, setUserSearchTerm] = useState(''); // For user search

  // Events data - fetched from database
  const [events, setEvents] = useState([]);
  const [eventSearchTerm, setEventSearchTerm] = useState(''); // For event search
  
  // Registration analytics data
  const [registrationsByCategory, setRegistrationsByCategory] = useState({});
  
  // System health data - real-time data from API
  const [systemHealth, setSystemHealth] = useState({
    server: { status: 'Loading...' },
    database: { status: 'Loading...' },
    api: { status: 'Loading...' },
    uptime: { percentage: 'Loading...' }
  });

  // Analytics data - real-time data from API
  const [analytics, setAnalytics] = useState({
    activeUsers: { count: 0, change: 0 },
    averageParticipants: { average: 0, change: 0 },
    totalEvents: 0,
    totalRegistrations: 0,
    monthlyComparison: { events: { change: 0 }, registrations: { change: 0 } }
  });

  // Feedback analytics data
  const [feedbackByEvent, setFeedbackByEvent] = useState({});

  // Add pagination state for feedback
  const [feedbackPage, setFeedbackPage] = useState(1);
  const FEEDBACK_PER_PAGE = 15;

  // Function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch events created by the current admin (or all events for super admin)
  const fetchAdminEvents = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Fetch all events
      const response = await fetch(`${API_BASE_URL}/events?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        let filteredEvents;
        // Super admin sees ALL events, college admin sees only their events
        if (currentUser?.role === 'super_admin') {
          filteredEvents = data.data.events; // Show all events
        } else {
          // Filter events by current user (college admin) - only events they created
          filteredEvents = data.data.events.filter(event => 
            event.created_by && event.created_by._id === currentUser?.id
          );
        }
        setEvents(filteredEvents);
        return filteredEvents; // Return the events for chaining
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching admin events:', error);
      setError('Failed to fetch events. Please try again.');
      setEvents([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update fetchAdminStats to fetch role-specific stats
  const fetchAdminStats = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // For college admin, stats should reflect only their events
          // For super admin, stats show global data
          const statsData = data.data.overview;
          
          if (currentUser?.role === 'college_admin') {
            // Filter stats based on current user's events only
            const userEvents = events; // This is already filtered for college admin
            const userRegistrations = statsData.total_registrations || 0; // Backend should filter this
            
            setStats({
              totalEvents: userEvents.length,
              activeUsers: statsData.active_events || 0,
              totalRegistrations: userRegistrations,
              avgParticipants: userEvents.length > 0 ? Math.round(userRegistrations / userEvents.length) : 0
            });
          } else {
            // Super admin gets global stats
            setStats({
              totalEvents: statsData.total_events || 0,
              activeUsers: statsData.active_events || 0,
              totalRegistrations: statsData.total_registrations || 0,
              avgParticipants: Math.round(statsData.total_registrations / Math.max(statsData.total_events, 1)) || 0
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Keep default stats on error
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('Analytics data received:', data.data);
          setAnalytics(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics({
        activeUsers: { count: 0, change: 0 },
        averageParticipants: { average: 0, change: 0 },
        totalEvents: 0,
        totalRegistrations: 0,
        monthlyComparison: { events: { change: 0 }, registrations: { change: 0 } }
      });
    }
  };

  // Fetch system health data
  const fetchSystemHealth = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/system/health`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSystemHealth(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
      setSystemHealth({
        server: { status: 'Error', message: 'Failed to fetch' },
        database: { status: 'Error', message: 'Failed to fetch' },
        api: { status: 'Error', message: 'Failed to fetch' },
        uptime: { percentage: 'Error' }
      });
    }
  };

  // Fetch registration analytics by category
  const fetchRegistrationAnalytics = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events/all/registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration Analytics Data:', data);
        if (data.success && data.data.registrations) {
          // Aggregate registrations by event category
          const categoryMap = {};
          
          data.data.registrations.forEach(registration => {
            let category = registration.event_id && registration.event_id.category
              ? registration.event_id.category
              : 'Uncategorized';
            // For college admin, only count registrations for their events
            if (currentUser?.role === 'college_admin') {
              // Check if this registration is for an event created by the current admin
              // Use the event's created_by field instead of comparing with local events array
              if (registration.event_id.created_by && 
                  registration.event_id.created_by._id === currentUser?.id) {
                categoryMap[category] = (categoryMap[category] || 0) + 1;
              }
            } else {
              // Super admin sees all registrations
              categoryMap[category] = (categoryMap[category] || 0) + 1;
            }
          });
          
          console.log('Registration by Category:', categoryMap);
          setRegistrationsByCategory(categoryMap);
        }
      } else {
        console.error('Failed to fetch registrations:', response.status);
      }
    } catch (error) {
      console.error('Error fetching registration analytics:', error);
      setRegistrationsByCategory({});
    }
  };

  // Fetch all users
  const fetchUsers = async (roleFilter = null) => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const token = getAuthToken();
      
      if (!token) {
        setUsersError('No authentication token found');
        return;
      }

      // Build endpoint based on role and filter
      let endpoint = `${API_BASE_URL}/users`;
      
      // Super admin can filter by role; college admin always gets students only (backend filters)
      if (currentUser?.role === 'super_admin' && roleFilter) {
        endpoint += `?role=${roleFilter}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersError('Failed to fetch users. Please try again.');
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch user details
  const fetchUserDetails = async (userId) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setSelectedUser(data.data.user);
        setShowUserDetails(true);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to fetch user details. Please try again.');
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      setDeleteUserLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Remove user from local state
        setUsers(users.filter(user => (user._id || user.id) !== userId));
        alert('User deleted successfully');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Failed to delete user. Please try again.');
    } finally {
      setDeleteUserLoading(false);
    }
  };

  // Handle delete user confirmation
  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      deleteUser(userId);
    }
  };

  // Delete event function
  const deleteEvent = async (eventId) => {
    try {
      setDeleteLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Remove the deleted event from the local state
        setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        // Close modal if the deleted event was being viewed
        if (selectedEvent && selectedEvent._id === eventId) {
          closeEventDetails();
        }
        // Refresh stats
        fetchAdminStats();
        setError(null);
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // View event details function
  const viewEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Close event details modal
  const closeEventDetails = () => {
    setSelectedEvent(null);
    setShowEventDetails(false);
  };

  // Handle delete confirmation
  const handleDeleteEvent = (event, eventId) => {
    event.stopPropagation(); // Prevent triggering view details
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent(eventId);
    }
  };

  // Fetch feedback analytics
  const fetchFeedbackAnalytics = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/feedback/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.stats) {
          setFeedbackByEvent(data.data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching feedback analytics:', error);
      setFeedbackByEvent({});
    }
  };

  // Load data when component mounts or currentUser changes
  useEffect(() => {
    if (currentUser?.id) {
      const loadData = async () => {
        // First load events
        await fetchAdminEvents();
        // Then fetch analytics and stats that are now role-specific
        await fetchAnalytics();
        fetchAdminStats();
        fetchRegistrationAnalytics();
        fetchSystemHealth();
        fetchFeedbackAnalytics();
      };
      
      loadData();
    }
  }, [currentUser]);

  // Auto-refresh system health every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser?.id) {
        fetchSystemHealth();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [currentUser]);

  // Auto-refresh analytics every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser?.id) {
        fetchAnalytics();
      }
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [currentUser]);

  // Load users when user management tab is active or filter changes
  useEffect(() => {
    if (activeTab === 'user-management' && currentUser?.id) {
      fetchUsers(currentUser?.role === 'super_admin' ? userRoleFilter : null);
    }
  }, [activeTab, currentUser, userRoleFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
    setShowDropdown(false);
  };

  // Handle settings click
  const handleSettingsClick = () => {
    setShowSettings(true);
    setShowDropdown(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const HandleEventCreation = () => {
    navigate('/create-event');
  };

  // Filtered events based on search term
  const filteredEvents = useMemo(() => {
    if (!eventSearchTerm.trim()) return events;
    
    return events.filter(event => 
      event.title.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
      event.category?.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(eventSearchTerm.toLowerCase())
    );
  }, [events, eventSearchTerm]);

  // Filtered users based on search term
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return users;
    
    return users.filter(user => 
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.college?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [users, userSearchTerm]);

  // Add state for pagination
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 15;

  // Add state for event pagination
  const [eventPage, setEventPage] = useState(1);
  const EVENTS_PER_PAGE = 15;

  // Paginate users
  const paginatedUsers = useMemo(() => {
    const startIndex = 0;
    const endIndex = userPage * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, userPage]);

  // Paginate events
  const paginatedEvents = useMemo(() => {
    const startIndex = 0;
    const endIndex = eventPage * EVENTS_PER_PAGE;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, eventPage]);

  const DashboardStats = () => {
    // Calculate event category distribution
    const categories = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {});
    
    const categoryData = Object.entries(categories).map(([name, count]) => ({
      name,
      count,
      percentage: events.length > 0 ? (count / events.length * 100).toFixed(1) : 0
    }));

    // Calculate total registrations from the same data source as chart
    const totalRegistrationsFromChart = Object.values(registrationsByCategory).reduce((a, b) => a + b, 0);

    return (
      <>
        {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Events</p>
            <p className="text-2xl sm:text-3xl font-bold">{analytics.totalEvents}</p>
            <p className="text-blue-200 text-xs">+{analytics.monthlyComparison.events.change}% vs last month</p>
          </div>
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
        </div>
      </div>
      
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Active Users</p>
            <p className="text-2xl sm:text-3xl font-bold">{analytics.activeUsers.count}</p>
            <p className="text-green-200 text-xs">+{analytics.activeUsers.change}% vs last month</p>
          </div>
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
        </div>
      </div>
      
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Total Registrations</p>
            {/* Use the same data source as chart */}
            <p className="text-2xl sm:text-3xl font-bold">{totalRegistrationsFromChart}</p>
            <p className="text-purple-200 text-xs">+{analytics.monthlyComparison.registrations.change}% vs last month</p>
          </div>
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
        </div>
      </div>
      
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Average Participants</p>
            <p className="text-2xl sm:text-3xl font-bold">{analytics.averageParticipants.average}</p>
            <p className="text-orange-200 text-xs">+{analytics.averageParticipants.change}% vs last month</p>
          </div>
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-200" />
        </div>
      </div>
    </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
          {/* Event Category Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Event Distribution by Category
            </h3>
            <div className={`flex flex-col ${categoryData.length > 0 ? 'space-y-4' : ''} flex-1`} style={{ minHeight: '280px' }}>
              {categoryData.length > 0 ? categoryData.map((cat, idx) => (
                <div key={cat.name} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{cat.name}</span>
                    <span className="text-sm text-gray-500">{cat.count} events ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        idx % 4 === 0 ? 'bg-blue-500' :
                        idx % 4 === 1 ? 'bg-green-500' :
                        idx % 4 === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-gray-500 text-center">No events data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Student Registration Analytics Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Student Registration Analytics
            </h3>
            <p className="text-sm text-gray-600 mb-4">Student participation by event category</p>
            <div className="flex-1" style={{ minHeight: '280px' }}>
              <Bar
                data={{
                  labels: Object.keys(registrationsByCategory).length > 0 
                    ? Object.keys(registrationsByCategory).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)) 
                    : ['No Data'],
                  datasets: [
                    {
                      label: 'Student Registrations',
                      data: Object.keys(registrationsByCategory).length > 0 
                        ? Object.values(registrationsByCategory) 
                        : [0],
                      backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',   // Blue
                        'rgba(16, 185, 129, 0.8)',   // Green
                        'rgba(139, 92, 246, 0.8)',   // Purple
                        'rgba(249, 115, 22, 0.8)',   // Orange
                        'rgba(236, 72, 153, 0.8)',   // Pink
                        'rgba(234, 179, 8, 0.8)',    // Yellow
                      ],
                      borderColor: [
                        'rgba(59, 130, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(249, 115, 22, 1)',
                        'rgba(236, 72, 153, 1)',
                        'rgba(234, 179, 8, 1)',
                      ],
                      borderWidth: 1,
                      borderRadius: 4,
                      maxBarThickness: 50,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    title: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.parsed.y} Students Registered`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0, // Ensure whole numbers only
                        font: {
                          size: 11
                        }
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                      title: {
                        display: true,
                        text: 'Number of Students',
                        font: {
                          size: 11
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 11
                        }
                      },
                      grid: {
                        display: false,
                      },
                      title: {
                        display: true,
                        text: 'Event Categories',
                        font: {
                          size: 11
                        }
                      },
                      categoryPercentage: 0.7,
                      barPercentage: 0.7
                    }
                  },
                  animation: {
                    duration: 1000,
                    easing: 'easeOutQuart',
                  }
                }}
              />
            </div>
            
            {/* Quick Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
              <div>
                {/* Use the same calculation as the stats card */}
                <p className="text-2xl font-bold text-blue-600">{totalRegistrationsFromChart}</p>
                <p className="text-xs text-gray-600">Total Registrations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{Object.keys(registrationsByCategory).length}</p>
                <p className="text-xs text-gray-600">Active Categories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Object.keys(registrationsByCategory).length > 0 
                    ? Object.entries(registrationsByCategory).sort((a, b) => b[1] - a[1])[0][0].charAt(0).toUpperCase() + Object.entries(registrationsByCategory).sort((a, b) => b[1] - a[1])[0][0].slice(1)
                    : 'N/A'}
                </p>
                <p className="text-xs text-gray-600">Most Popular</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
          {(event.status || 'upcoming').toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(event.start_date || event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          <span>{event.current_registrations || event.registrations || 0}/{event.registration_limit || event.maxParticipants || 0} registered</span>
        </div>
        {event.location && (
          <div className="flex items-center">
            <Building className="w-4 h-4 mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
        {event.category && (
          <div className="flex items-center">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
              {event.category}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => viewEventDetails(event)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4 inline mr-2" />
          View Details
        </button>
        <button 
          onClick={(e) => handleDeleteEvent(e, event._id)}
          disabled={deleteLoading}
          className="bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Event"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const SystemHealth = () => {
    const getStatusColor = (status) => {
      switch(status?.toLowerCase()) {
        case 'healthy':
        case 'connected':
        case 'responsive':
          return 'text-green-600';
        case 'error':
        case 'disconnected':
        case 'slow':
          return 'text-red-600';
        case 'loading...':
          return 'text-yellow-600';
        default:
          return 'text-gray-600';
      }
    };

    const getStatusIcon = (status) => {
      switch(status?.toLowerCase()) {
        case 'healthy':
        case 'connected':
        case 'responsive':
          return <CheckCircle className="w-4 h-4 mr-1" />;
        case 'error':
        case 'disconnected':
        case 'slow':
          return <XCircle className="w-4 h-4 mr-1" />;
        case 'loading...':
          return <Clock className="w-4 h-4 mr-1" />;
        default:
          return <AlertCircle className="w-4 h-4 mr-1" />;
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          System Health
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Server Status</span>
            <span className={`flex items-center text-sm font-medium ${getStatusColor(systemHealth.server?.status)}`}>
              {getStatusIcon(systemHealth.server?.status)}
              {systemHealth.server?.status || 'Loading...'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Database</span>
            <span className={`flex items-center text-sm font-medium ${getStatusColor(systemHealth.database?.status)}`}>
              {getStatusIcon(systemHealth.database?.status)}
              {systemHealth.database?.status || 'Loading...'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">API Response</span>
            <span className={`flex items-center text-sm font-medium ${getStatusColor(systemHealth.api?.status)}`}>
              {getStatusIcon(systemHealth.api?.status)}
              {systemHealth.api?.averageResponseTime || systemHealth.api?.status || 'Loading...'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Uptime</span>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-800">
                {systemHealth.uptime?.percentage || 'Loading...'}
              </span>
              {systemHealth.uptime?.duration && (
                <div className="text-xs text-gray-500">
                  {systemHealth.uptime.duration}
                </div>
              )}
            </div>
          </div>
          {systemHealth.timestamp && (
            <div className="pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                Last updated: {new Date(systemHealth.timestamp).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const EventDetailsModal = () => {
    if (!showEventDetails || !selectedEvent) return null;

    return (
      <div 
        className="fixed inset-0 z-50 p-4 flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
        onClick={closeEventDetails}
      >
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
            <button
              onClick={closeEventDetails}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Event Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Event Image */}
                {selectedEvent.image && (
                  <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={`${API_BASE_URL.replace('/api', '')}${selectedEvent.image}`} 
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedEvent.description || 'No description provided.'}
                  </p>
                </div>

                {/* Tags */}
                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          <Tag className="w-3 h-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Event Details Sidebar */}
              <div className="space-y-4">
                {/* Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedEvent.status || 'upcoming')}`}>
                    {(selectedEvent.status || 'upcoming').toUpperCase()}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Event Schedule</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Start: {new Date(selectedEvent.start_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>End: {new Date(selectedEvent.end_date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <div className="flex items-center text-sm text-gray-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{selectedEvent.location || 'Location not specified'}</span>
                  </div>
                </div>

                {/* Registration Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Registration</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>
                        {selectedEvent.current_registrations || 0} / {selectedEvent.registration_limit} registered
                      </span>
                    </div>
                    {selectedEvent.registration_deadline && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Deadline: {new Date(selectedEvent.registration_deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Pricing</h4>
                  <div className="flex items-center text-sm text-gray-700">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{selectedEvent.price === 0 ? 'Free' : `₹${selectedEvent.price}`}</span>
                  </div>
                </div>

                {/* Category & College */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Details</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>
                      <strong>Category:</strong> <span className="capitalize">{selectedEvent.category || 'General'}</span>
                    </div>
                    <div>
                      <strong>College:</strong> {selectedEvent.college_name || 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleDeleteEvent(e, selectedEvent._id)}
                    disabled={deleteLoading}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Delete Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MiniCalendar = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2" />
        Recent Events
      </h3>
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No events created yet</p>
          </div>
        ) : (
          events.slice(0, 3).map(event => (
            <div key={event._id || event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                 onClick={() => viewEventDetails(event)}>
              <div>
                <p className="font-medium text-sm text-gray-800">{event.title}</p>
                <p className="text-xs text-gray-500">{new Date(event.start_date || event.date).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status || 'upcoming')}`}>
                {event.status || 'upcoming'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );


  const tabs = useMemo(() => {
    const baseTabs = [
    { id: 'overview', name: 'Overview', shortName: 'Overview', icon: BarChart3 },
    { id: 'user-management', name: 'User Management', shortName: 'Users', icon: Users },
    { id: 'event-management', name: 'Event Management', shortName: 'Events', icon: Calendar },
      { id: 'registrations', name: 'Registrations', shortName: 'Registrations', icon: CheckCircle },
      { id: 'feedback-analysis', name: 'Feedback Analysis', shortName: 'Feedback', icon: Star },
      { id: 'logs', name: 'Activity Logs', shortName: 'Logs', icon: Activity }
    ];
    
    // Add Admin Approval tab only for super admin
    if (currentUser?.role === 'super_admin') {
      baseTabs.splice(2, 0, { 
        id: 'admin-approval', 
        name: 'Admin Approval', 
        shortName: 'Approvals', 
        icon: Shield 
      });
    }
    
    return baseTabs;
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-1">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <img
                    src="/A.png"
                    alt="Logo"
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">CampusEventHub</h1>
                  <span className="hidden xs:inline-block mt-1 sm:mt-0 sm:ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    Admin
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-3">
                {/* Admin/Super Admin Purple Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentUser?.role === 'super_admin' 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                    : currentUser?.role === 'college_admin'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}>
                  {currentUser?.role === 'super_admin' || currentUser?.role === 'college_admin' ? (
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-700">{currentUser?.name || 'Admin'}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      currentUser?.role === 'student' 
                        ? 'bg-green-100 text-green-800' 
                        : currentUser?.role === 'college_admin' || currentUser?.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : currentUser?.role === 'super_admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {currentUser?.role === 'student' ? 'Student' : 
                       currentUser?.role === 'college_admin' ? 'Admin' :
                       currentUser?.role === 'super_admin' ? 'Super Admin' :
                       currentUser?.role === 'admin' ? 'Admin' :
                       'User'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{currentUser?.college || 'College Admin'}</p>
                </div>
                
                {/* Settings Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <Settings 
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-blue-600 cursor-pointer" 
                    onClick={() => setShowDropdown(!showDropdown)}
                  />
                  
                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={handleSettingsClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-1 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Show ProfileSettings if showSettings is true */}
        {showSettings && (
          <ProfileSettings 
            currentUser={currentUser} 
            logout={logout} 
            token={token}
            onBack={() => setShowSettings(false)}
          />
        )}

        {/* Dashboard Header */}
        {!showSettings && activeTab !== 'overview' && !['user-management', 'admin-approval', 'registrations', 'logs', 'feedback-analysis'].includes(activeTab) && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6 sm:mb-8">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-8 text-gray-900">Event Organizer Dashboard</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your events and track performance</p>
          </div>
          <div className="flex-shrink-0">
            <button 
              onClick={HandleEventCreation}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Create Event</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
        )}

        {/* Stats are rendered inside Overview; avoid duplicate */}
        {/* User Management Tab */}
        {!showSettings && activeTab === 'user-management' && (
          <UserManagement 
    currentUser={currentUser}
    userSearchTerm={userSearchTerm}
    setUserSearchTerm={setUserSearchTerm}
    userRoleFilter={userRoleFilter}
    setUserRoleFilter={setUserRoleFilter}
    usersLoading={usersLoading}
    usersError={usersError}
    paginatedUsers={paginatedUsers}
    filteredUsers={filteredUsers}
    USERS_PER_PAGE={USERS_PER_PAGE}
    setUserPage={setUserPage}
    fetchUsers={fetchUsers}
    fetchUserDetails={fetchUserDetails}
    handleDeleteUser={handleDeleteUser}
    deleteUserLoading={deleteUserLoading}
  />
        )}

        {/* Event Management Tab */}
        {!showSettings && activeTab === 'event-management' && (
          <EventManagement 
    eventSearchTerm={eventSearchTerm}
    setEventSearchTerm={setEventSearchTerm}
    eventPage={eventPage}
    setEventPage={setEventPage}
    loading={loading}
    paginatedEvents={paginatedEvents}
    filteredEvents={filteredEvents}
    EVENTS_PER_PAGE={EVENTS_PER_PAGE}
    viewEventDetails={viewEventDetails}
    handleDeleteEvent={handleDeleteEvent}
    deleteLoading={deleteLoading}
    getStatusColor={getStatusColor}
  />
        )}

        {/* Registrations Tab Content */}
        {!showSettings && activeTab === 'registrations' && (
          <EventRegistrations />
        )}

        {/* Feedback Analysis Tab Content */}
        {!showSettings && activeTab === 'feedback-analysis' && (
          <AdminFeedbackAnalysis />
        )}

        {/* Activity Logs Tab Content */}
        {!showSettings && activeTab === 'logs' && (
          <ActivityLogs />
        )}

        {/* Admin Approval Tab Content (Super Admin Only) */}
        {!showSettings && activeTab === 'admin-approval' && currentUser?.role === 'super_admin' && (
          <CollegeAdminApproval />
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  if (currentUser?.id) {
                    fetchAdminEvents();
                    fetchAdminStats();
                  }
                }}
                className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Overview Tab - Main Dashboard */}
        {!showSettings && activeTab === 'overview' && (
          <Overview
            currentUser={currentUser}
            loading={loading}
            events={events}
            analytics={analytics}
            registrationsByCategory={registrationsByCategory}
            systemHealth={systemHealth}
            viewEventDetails={viewEventDetails}
            HandleEventCreation={HandleEventCreation}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Event Details Modal */}
      <EventDetailsModal />

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div 
          className="fixed inset-0 z-50 p-4 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
          onClick={() => setShowUserDetails(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* User Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                
                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Full Name:</span>
                        <p className="text-gray-900">{selectedUser.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email Address:</span>
                        <p className="text-gray-900">{selectedUser.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">College:</span>
                        <p className="text-gray-900">{selectedUser.college}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Role:</span>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedUser.role === 'college_admin' ? 'bg-purple-100 text-purple-800' : 
                          selectedUser.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedUser.role === 'college_admin' ? 'Admin' : 
                           selectedUser.role === 'super_admin' ? 'Super Admin' : 'Student'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Status</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedUser.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Account Created:</span>
                        <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                      </div>
                      {selectedUser.lastLogin && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Last Login:</span>
                          <p className="text-gray-900">{new Date(selectedUser.lastLogin).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-500">User ID:</span>
                        <p className="text-gray-900 text-xs font-mono">{selectedUser._id}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Security Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Security Information</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Password and other sensitive authentication data are not displayed for security reasons. Only basic account information is shown.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
