import React from 'react';
import { Trophy, Calendar, CheckCircle, TrendingUp, Users, Clock, Star } from 'lucide-react';

const StudentQuickStats = ({ registrations, allEvents }) => {
  const stats = {
    totalRegistrations: registrations.length,
    approvedEvents: registrations.filter(r => r.registrationStatus === 'approved').length,
    pendingEvents: registrations.filter(r => r.registrationStatus === 'pending').length,
    availableEvents: allEvents.length,
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor, gradient }) => (
    <div className={`${bgColor} p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-2 font-medium">{label}</p>
          <p className={`text-4xl font-bold ${color} group-hover:scale-110 transition-transform duration-300`}>{value}</p>
        </div>
        <div className={`${gradient} p-4 rounded-xl group-hover:rotate-12 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Calendar}
        label="Total Registrations"
        value={stats.totalRegistrations}
        color="text-blue-600"
        bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
        gradient="bg-gradient-to-br from-blue-200 to-blue-300"
      />
      <StatCard
        icon={CheckCircle}
        label="Approved Events"
        value={stats.approvedEvents}
        color="text-green-600"
        bgColor="bg-gradient-to-br from-green-50 to-green-100"
        gradient="bg-gradient-to-br from-green-200 to-green-300"
      />
      <StatCard
        icon={Clock}
        label="Pending Approval"
        value={stats.pendingEvents}
        color="text-yellow-600"
        bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
        gradient="bg-gradient-to-br from-yellow-200 to-yellow-300"
      />
      <StatCard
        icon={Trophy}
        label="Available Events"
        value={stats.availableEvents}
        color="text-purple-600"
        bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
        gradient="bg-gradient-to-br from-purple-200 to-purple-300"
      />
    </div>
  );
};

export default StudentQuickStats;

