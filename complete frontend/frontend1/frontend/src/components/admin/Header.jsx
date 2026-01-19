import React from 'react';
import { User, LogOut, Settings, Shield, Building } from 'lucide-react';

const Header = ({ 
  currentUser, 
  showDropdown, 
  setShowDropdown, 
  dropdownRef, 
  handleLogout, 
  handleSettingsClick 
}) => {
  return (
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
  );
};

export default Header;