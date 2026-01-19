import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, Users, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const EventRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [events, setEvents] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch all events for dropdown
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch registrations when selectedEvent changes
  useEffect(() => {
    if (selectedEvent !== 'All') {
      fetchRegistrations(selectedEvent);
    } else {
      fetchAllRegistrations();
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.events) {
          setEvents(data.data.events);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.registrations) {
          setRegistrations(data.data.registrations);
        }
      } else {
        console.error('Failed to fetch registrations');
        setRegistrations([]);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/events/all/registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.registrations) {
          setRegistrations(data.data.registrations);
        }
      } else {
        // If the endpoint doesn't exist yet, fetch from each event individually
        const allRegs = [];
        for (const event of events) {
          const res = await fetch(`${API_BASE_URL}/events/${event._id}/registrations`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data.registrations) {
              allRegs.push(...data.data.registrations.map(reg => ({
                ...reg,
                eventTitle: event.title,
                eventType: event.category
              })));
            }
          }
        }
        setRegistrations(allRegs);
      }
    } catch (error) {
      console.error('Error fetching all registrations:', error);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      setUpdateLoading(registrationId);
      const response = await fetch(`${API_BASE_URL}/events/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update local state
        setRegistrations(regs =>
          regs.map(reg =>
            reg._id === registrationId ? { ...reg, status: newStatus } : reg
          )
        );
      } else {
        alert('Failed to update registration status');
      }
    } catch (error) {
      console.error('Error updating registration status:', error);
      alert('Error updating registration status');
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleExcelExport = async () => {
    try {
      setExportLoading(true);
      
      const queryParams = new URLSearchParams();
      if (selectedEvent !== 'All') {
        queryParams.append('eventId', selectedEvent);
      }
      
      const response = await fetch(`${API_BASE_URL}/events/export/registrations/excel?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export data');
      }

      // Get the Excel file
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const eventName = selectedEvent === 'All' ? 'All_Events' : 
        events.find(e => e._id === selectedEvent)?.title.replace(/[^a-zA-Z0-9]/g, '_') || 'Event';
      const fileName = `${eventName}_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message (you can replace with your toast system)
      alert('Registration data exported successfully!');

    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data: ' + error.message);
    } finally {
      setExportLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-100 border-green-200';
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'rejected': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  // Filtering by search, status, and selected event
  const filteredRegistrations = registrations.filter(reg => {
    const matchesFilter = filter === 'All' || reg.status === filter.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      reg.user_id?.name?.toLowerCase().includes(searchLower) ||
      reg.user_id?.email?.toLowerCase().includes(searchLower) ||
      reg.user_id?.college?.toLowerCase().includes(searchLower) ||
      reg.eventTitle?.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  // Stats
  const total = filteredRegistrations.length;
  const pending = filteredRegistrations.filter(r => r.status === 'pending').length;
  const approved = filteredRegistrations.filter(r => r.status === 'approved').length;
  const rejected = filteredRegistrations.filter(r => r.status === 'rejected').length;

  return (
    <div>
      
      {/* Event Selection Dropdown */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <label className="text-gray-800 font-bold text-lg">Select Event:</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Events</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Excel Export Button */}
          <button
            onClick={handleExcelExport}
            disabled={exportLoading || loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Excel</span>
              </>
            )}
          </button>
          
          {/* Refresh Button */}
          <button
            onClick={() => selectedEvent === 'All' ? fetchAllRegistrations() : fetchRegistrations(selectedEvent)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Registrations</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <Users className="w-8 h-8 text-blue-500" />
        </div>

        <div
          className={`p-4 rounded-xl shadow-md border cursor-pointer transition-all ${filter === 'Pending' ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-gray-200'}`}
          onClick={() => setFilter(filter === 'Pending' ? 'All' : 'Pending')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-xl shadow-md border cursor-pointer transition-all ${filter === 'Approved' ? 'bg-green-100 border-green-400' : 'bg-white border-gray-200'}`}
          onClick={() => setFilter(filter === 'Approved' ? 'All' : 'Approved')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-700">{approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-xl shadow-md border cursor-pointer transition-all ${filter === 'Rejected' ? 'bg-red-100 border-red-400' : 'bg-white border-gray-200'}`}
          onClick={() => setFilter(filter === 'Rejected' ? 'All' : 'Rejected')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter Buttons */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto p-1">
            {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        {loading ? (
          <div className="text-center p-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Loading registrations...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>No registrations found.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STUDENT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLLEGE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EVENT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REGISTRATION DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {reg.user_id?.name?.[0] || '?'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{reg.user_id?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{reg.user_id?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reg.user_id?.college || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reg.eventTitle || reg.event_id?.title || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{reg.eventType || reg.event_id?.category || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reg.timestamp || reg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border capitalize ${getStatusColor(reg.status)}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {reg.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(reg._id, 'approved')}
                          disabled={updateLoading === reg._id}
                          className="px-3 py-1 text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(reg._id, 'rejected')}
                          disabled={updateLoading === reg._id}
                          className="px-3 py-1 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
                        >
                          <XCircle className="w-3 h-3 mr-1" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Actioned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventRegistrations;

