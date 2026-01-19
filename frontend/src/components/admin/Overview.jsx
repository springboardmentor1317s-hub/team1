import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Calendar, Users, TrendingUp, BarChart3, Plus, Eye, Settings, 
         MessageSquare, Clock, Building, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

const Overview = ({
  // currentUser,
  loading,
  events,
  analytics,
  registrationsByCategory,
  systemHealth,
  viewEventDetails,
  HandleEventCreation,
  setActiveTab
}) => {
  // const navigate = useNavigate();

  // Move these functions to the main component scope
  const getSystemStatusColor = (status) => {
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

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status || 'upcoming')}`}>
          {(event.status || 'upcoming').toUpperCase()
        }</span>
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
      </div>
    </div>
  );

  return (
    <div>
      {/* Dashboard Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-8 text-gray-900">Event Organizer Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your events and track performance</p>
        </div>
      </div>

      {/* Stats Cards - Show on Overview */}
      <DashboardStats />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Events</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading your events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Events Created Yet</h4>
                <p className="text-gray-500 mb-4">Start by creating your first event to manage your campus activities.</p>
                <button 
                  onClick={HandleEventCreation}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </button>
              </div>
            ) : (
              <>
                {events.slice(0, 3).map(event => (
                  <EventCard key={event._id || event.id} event={event} />
                ))}
                {events.length > 3 && (
                  <button
                    onClick={() => setActiveTab('event-management')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-md flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View All Events ({events.length})
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar - Quick Actions, Calendar & System Health */}
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                onClick={HandleEventCreation}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Event
              </button>
            
              <button 
                onClick={() => setActiveTab('registrations')}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All Registrations
              </button>
              <button 
                onClick={() => setActiveTab('feedback-analysis')}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                View Feedback
              </button>
            </div>
          </div>

          {/* Recent Events Mini View */}
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

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              System Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className={`flex items-center text-sm font-medium ${getSystemStatusColor(systemHealth.server?.status)}`}>
                  {getStatusIcon(systemHealth.server?.status)}
                  {systemHealth.server?.status || 'Loading...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className={`flex items-center text-sm font-medium ${getSystemStatusColor(systemHealth.database?.status)}`}>
                  {getStatusIcon(systemHealth.database?.status)}
                  {systemHealth.database?.status || 'Loading...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Response</span>
                <span className={`flex items-center text-sm font-medium ${getSystemStatusColor(systemHealth.api?.status)}`}>
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
        </div>
      </div>
    </div>
  );
};

export default Overview;