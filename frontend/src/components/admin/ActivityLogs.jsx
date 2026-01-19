import React, { useState, useEffect } from 'react';
import { Activity, Clock, User, AlertCircle, RefreshCw, Filter, Trash2, ChevronDown, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}>
        {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

const ActivityLogs = () => {
  const [allLogs, setAllLogs] = useState([]);
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(10);
  const [stats, setStats] = useState({
    recentActivity: 0,
    totalLogs: 0,
    actionCounts: []
  });
  const [showClearMenu, setShowClearMenu] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [toast, setToast] = useState(null);

  const { currentUser } = useAuth();
  const token = localStorage.getItem('token');
  const isSuperAdmin = currentUser?.role === 'super_admin';
  
  const LOGS_PER_PAGE = 10;

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filter]);

  useEffect(() => {
    // Update displayed logs when displayCount or filter changes
    const filtered = filterLogs();
    setDisplayedLogs(filtered.slice(0, displayCount));
  }, [allLogs, filter, displayCount]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.logs) {
          setAllLogs(data.data.logs);
        }
      } else {
        console.error('Failed to fetch logs');
        setToast({ message: 'Failed to load activity logs', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setToast({ message: 'Error loading logs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching log stats:', error);
    }
  };

  const filterLogs = () => {
    if (filter === 'all') {
      return allLogs;
    }
    return allLogs.filter(log => log.action === filter);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + LOGS_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  };

  const handleClearLogs = async (period) => {
    if (!isSuperAdmin) {
      setToast({ message: 'Only super admins can clear logs', type: 'error' });
      return;
    }

    const confirmMessage = period === 'all' 
      ? 'Are you sure you want to clear ALL activity logs? This action cannot be undone!'
      : `Are you sure you want to clear logs older than ${period}?`;

    if (!window.confirm(confirmMessage)) {
      setShowClearMenu(false);
      return;
    }

    try {
      setClearing(true);
      const response = await fetch(`${API_BASE_URL}/logs/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ period })
      });

      const data = await response.json();
      if (data.success) {
        setToast({ message: `Successfully cleared ${data.data.deletedCount} log(s)`, type: 'success' });
        fetchLogs();
        fetchStats();
        setDisplayCount(LOGS_PER_PAGE); // Reset to first page
      } else {
        setToast({ message: data.message || 'Failed to clear logs', type: 'error' });
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
      setToast({ message: 'Error clearing logs', type: 'error' });
    } finally {
      setClearing(false);
      setShowClearMenu(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'event_created':
      case 'event_updated':
      case 'event_deleted':
        return '📅';
      case 'registration_status_update':
        return '✅';
      case 'user_created':
      case 'user_updated':
      case 'user_deleted':
        return '👤';
      case 'login':
      case 'logout':
        return '🔐';
      default:
        return '📝';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'event_created':
      case 'user_created':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'event_deleted':
      case 'user_deleted':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'event_updated':
      case 'user_updated':
      case 'registration_status_update':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'login':
      case 'logout':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatActionName = (action) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const actionFilters = [
    { value: 'all', label: 'All Activities' },
    { value: 'event_created', label: 'Events Created' },
    { value: 'event_deleted', label: 'Events Deleted' },
    { value: 'registration_status_update', label: 'Registration Updates' }
  ];

  const filteredLogs = filterLogs();

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="w-7 h-7 mr-2 text-blue-600" />
            Activity Logs
          </h2>
          <p className="text-gray-500 text-sm mt-1">Track all important system activities</p>
          {displayedLogs.length < filteredLogs.length && (
            <p className="text-xs text-gray-400 mt-1">
              Showing {displayedLogs.length} of {filteredLogs.length} logs
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => { fetchLogs(); fetchStats(); }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Clear Logs Button (Super Admin Only) */}
          {isSuperAdmin && (
            <div className="relative">
              <button
                onClick={() => setShowClearMenu(!showClearMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={clearing}
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Logs</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showClearMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleClearLogs('1-month')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Clear logs older than 1 month
                    </button>
                    <button
                      onClick={() => handleClearLogs('3-months')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Clear logs older than 3 months
                    </button>
                    <button
                      onClick={() => handleClearLogs('6-months')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Clear logs older than 6 months
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => handleClearLogs('all')}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      Clear ALL logs
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Recent Activity (24h)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLogs}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Most Common Action</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.actionCounts.length > 0 
                  ? formatActionName(stats.actionCounts[0]._id)
                  : 'N/A'
                }
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex space-x-2 overflow-x-auto">
            {actionFilters.map(filterOption => (
              <button
                key={filterOption.value}
                onClick={() => {
                  setFilter(filterOption.value);
                  setDisplayCount(LOGS_PER_PAGE); // Reset to first page
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === filterOption.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        {loading ? (
          <div className="text-center p-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Loading activity logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>No activity logs found.</p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {displayedLogs.map((log) => (
                <div
                  key={log._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl border ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {log.description}
                          </p>
                          <div className="flex items-center space-x-3 mt-1 flex-wrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                              {formatActionName(log.action)}
                            </span>
                            {log.user_id && (
                              <span className="text-xs text-gray-500 flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {log.user_id.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>

                      {/* Details */}
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {log.details.event_title && (
                            <div>Event: <span className="font-medium">{log.details.event_title}</span></div>
                          )}
                          {log.details.student_name && (
                            <div>Student: <span className="font-medium">{log.details.student_name}</span></div>
                          )}
                          {log.details.old_status && log.details.new_status && (
                            <div>Status: <span className="font-medium">{log.details.old_status}</span> → <span className="font-medium">{log.details.new_status}</span></div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {displayedLogs.length < filteredLogs.length && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full py-3 px-6 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Logs ({Math.min(LOGS_PER_PAGE, filteredLogs.length - displayedLogs.length)} more)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showClearMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowClearMenu(false)}
        />
      )}
    </div>
  );
};

export default ActivityLogs;
