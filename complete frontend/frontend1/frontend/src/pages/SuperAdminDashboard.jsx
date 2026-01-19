import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';

const SuperAdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is actually a super admin
  React.useEffect(() => {
    if (currentUser && currentUser.role !== 'super_admin') {
      // Redirect non-super admins to regular admin dashboard
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate]);

  // Render the admin dashboard with super admin styling (selective light red accents)
  return (
    <div className="super-admin-theme">
      <style>{`
        /* Keep most colors same as college admin, only add red accents selectively */
        
        /* Header with light red background */
        .super-admin-theme header {
          background: linear-gradient(135deg, rgb(254, 242, 242) 0%, rgb(254, 226, 226) 100%) !important;
          border-bottom: 2px solid rgb(252, 165, 165);
        }
        
        /* Adjust header text colors for light red background */
        .super-admin-theme header .text-gray-800,
        .super-admin-theme header .text-gray-900 {
          color: rgb(127, 29, 29) !important;
        }
        
        .super-admin-theme header .text-gray-600,
        .super-admin-theme header .text-gray-700 {
          color: rgb(153, 27, 27) !important;
        }
        
        .super-admin-theme header .text-gray-500 {
          color: rgb(185, 28, 28) !important;
        }
        
        /* Only change the first stat card to red (Total Events) */
        .super-admin-theme .bg-gradient-to-r.from-blue-500.to-blue-600 {
          background: linear-gradient(to right, rgb(239, 68, 68), rgb(220, 38, 38)) !important;
        }
        
        .super-admin-theme .bg-gradient-to-r.from-blue-500.to-blue-600 .text-blue-100 {
          color: rgb(254, 226, 226) !important;
        }
        
        .super-admin-theme .bg-gradient-to-r.from-blue-500.to-blue-600 .text-blue-200 {
          color: rgb(254, 202, 202) !important;
        }
        
        /* Keep "Create New Event" button with red gradient */
        .super-admin-theme .bg-gradient-to-r.from-purple-600.to-blue-600 {
          background: linear-gradient(to right, rgb(220, 38, 38), rgb(239, 68, 68)) !important;
        }
        
        /* IMPORTANT: Keep ALL buttons their original colors - NO red buttons except create */
        .super-admin-theme button.bg-blue-600,
        .super-admin-theme button.bg-blue-500 {
          background-color: rgb(37, 99, 235) !important;
        }
        
        .super-admin-theme button.bg-blue-600:hover,
        .super-admin-theme button.bg-blue-500:hover {
          background-color: rgb(29, 78, 216) !important;
        }
        
        /* Keep View/Edit/Delete buttons exactly as they are */
        .super-admin-theme button .text-blue-600,
        .super-admin-theme a .text-blue-600 {
          color: rgb(37, 99, 235) !important;
        }
        
        /* Only change heading icons to red (not buttons) */
        .super-admin-theme h3 > .text-blue-600,
        .super-admin-theme h2 > .text-blue-600 {
          color: rgb(220, 38, 38) !important;
        }
        
        /* Super Admin Badge */
        .super-admin-theme .super-admin-badge {
          background: linear-gradient(135deg, rgb(220, 38, 38), rgb(239, 68, 68));
          color: white;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
        }
      `}</style>
      <AdminDashboard />
    </div>
  );
};

export default SuperAdminDashboard;

