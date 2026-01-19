import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, Users, Shield, RefreshCw, Building } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';


const CollegeAdminApproval = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [updateLoading, setUpdateLoading] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users?role=college_admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.users) {
          setAdmins(data.data.users);
        }
      } else {
        console.error('Failed to fetch admins');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      setUpdateLoading(userId);
      const response = await fetch(`${API_BASE_URL}/users/${userId}/approval`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approval_status: newStatus })
      });

      if (response.ok) {
        // Update local state
        setAdmins(admins =>
          admins.map(admin =>
            admin._id === userId ? { ...admin, approval_status: newStatus } : admin
          )
        );
      } else {
        alert('Failed to update approval status');
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
      alert('Error updating approval status');
    } finally {
      setUpdateLoading(null);
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

  // Filtering by search and status
  const filteredAdmins = admins.filter(admin => {
    const matchesFilter = filter === 'All' || admin.approval_status === filter.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      admin.name?.toLowerCase().includes(searchLower) ||
      admin.email?.toLowerCase().includes(searchLower) ||
      admin.college?.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  // Stats
  const total = filteredAdmins.length;
  const pending = filteredAdmins.filter(a => a.approval_status === 'pending').length;
  const approved = filteredAdmins.filter(a => a.approval_status === 'approved').length;
  const rejected = filteredAdmins.filter(a => a.approval_status === 'rejected').length;

  return (
    <div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="w-7 h-7 mr-2 text-purple-600" />
            College Admin Approval
          </h2>
          <p className="text-gray-500 text-sm mt-1">Review and approve college admin registrations</p>
        </div>
        
        <button
          onClick={fetchAdmins}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Admins</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <Users className="w-8 h-8 text-purple-500" />
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto p-1">
            {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === status
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        {loading ? (
          <div className="text-center p-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-500 mt-4">Loading college admins...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>No college admins found.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADMIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLLEGE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REGISTRATION DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {admin.name?.[0] || '?'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{admin.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{admin.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <Building className="w-4 h-4 mr-2 text-gray-400" />
                      {admin.college || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border capitalize ${getStatusColor(admin.approval_status)}`}>
                      {admin.approval_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {admin.approval_status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(admin._id, 'approved')}
                          disabled={updateLoading === admin._id}
                          className="px-3 py-1 text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(admin._id, 'rejected')}
                          disabled={updateLoading === admin._id}
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

export default CollegeAdminApproval;

