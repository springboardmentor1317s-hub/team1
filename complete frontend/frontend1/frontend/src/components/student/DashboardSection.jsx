import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { StudentQuickStats, StudentUpcomingEvents } from './';

const DashboardSection = ({ 
  currentUser, 
  userEvents, 
  events, 
  handleViewDetails,
  setActiveTab,
  getRegistrationStatusColor
}) => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.name || 'Student'}!</h1>
            <p className="text-blue-100 text-lg">Ready to discover amazing events?</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Calendar className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <StudentQuickStats registrations={userEvents} allEvents={events} />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Registrations</h2>
              <div className="flex items-center gap-2 text-blue-600">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">{userEvents.length} Total</span>
              </div>
            </div>
            
            {userEvents.length > 0 ? (
              <div className="space-y-4">
                {userEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="group p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all cursor-pointer border border-gray-200 hover:border-blue-300"
                    onClick={() => handleViewDetails(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-3 h-3 rounded-full ${
                            event.registrationStatus === 'approved' ? 'bg-green-500' :
                            event.registrationStatus === 'pending' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {event.title}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                            {event.college}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-blue-500" />
                            {event.category}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRegistrationStatusColor(event.registrationStatus)}`}>
                          {event.registrationStatus.toUpperCase()}
                        </span>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {userEvents.length > 3 && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setActiveTab('registered')}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mx-auto"
                    >
                      View All Registrations
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Registrations Yet</h3>
                <p className="text-gray-500 mb-6">Start exploring and register for exciting events!</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Browse Events
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming Events Sidebar */}
        <div className="lg:col-span-1">
          <StudentUpcomingEvents 
            events={events} 
            onViewDetails={handleViewDetails}
            onExploreMore={() => setActiveTab('browse')}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;