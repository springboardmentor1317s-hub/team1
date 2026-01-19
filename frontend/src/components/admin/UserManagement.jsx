import React from 'react';
import { Search, User } from 'lucide-react';

const UserManagement = ({ 
  currentUser,
  userSearchTerm,
  setUserSearchTerm,
  userRoleFilter,
  setUserRoleFilter,
  usersLoading,
  usersError,
  paginatedUsers,
  filteredUsers,
  USERS_PER_PAGE,
  setUserPage,
  fetchUsers,
  fetchUserDetails,
  handleDeleteUser,
  deleteUserLoading
}) => {
  return (
    <div>
      <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {currentUser?.role === 'super_admin' ? 'User Management' : 'Student Management'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {currentUser?.role === 'super_admin' 
                ? 'Manage all users across the system' 
                : `Manage students from ${currentUser?.college}`}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Show filter only for super admin */}
            {currentUser?.role === 'super_admin' && (
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="student">Students</option>
                <option value="college_admin">College Admins</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading users...</p>
                </td>
              </tr>
            ) : usersError ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <p className="text-sm text-red-500">{usersError}</p>
                  <button 
                    onClick={fetchUsers}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Retry
                  </button>
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <p className="text-sm text-gray-500">
                    {userSearchTerm ? 'No users found matching your search' : 'No users found'}
                  </p>
                </td>
              </tr>
            ) : (
              paginatedUsers.map(user => (
                <tr key={user._id || user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.college}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'college_admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'college_admin' ? 'Admin' : 
                       user.role === 'super_admin' ? 'Super Admin' : 'Student'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => fetchUserDetails(user._id || user.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id || user.id, user.name)}
                      disabled={deleteUserLoading}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteUserLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Load More Button - Add after table */}
      {!usersLoading && paginatedUsers.length < filteredUsers.length && (
        <div className="text-center py-6">
          <button
            onClick={() => setUserPage(prev => prev + 1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Load More ({filteredUsers.length - paginatedUsers.length} remaining)
          </button>
        </div>
      )}

      {/* Reset button when all loaded */}
      {paginatedUsers.length === filteredUsers.length && filteredUsers.length > USERS_PER_PAGE && (
        <div className="text-center py-6">
          <button
            onClick={() => setUserPage(1)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;