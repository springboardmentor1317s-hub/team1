import React from 'react';
import { Calendar } from 'lucide-react';
import StudentMyRegistrations from './StudentMyRegistrations';

const MyRegistrations = ({ userEvents, onViewDetails, onBrowseEvents, currentUser, handleRegister }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Registrations</h2>
      {userEvents.length > 0 ? (
        <StudentMyRegistrations 
          registrations={userEvents} 
          onViewDetails={onViewDetails}
          userEvents={userEvents}
          currentUser={currentUser}
          handleRegister={handleRegister}
        />
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Registrations Yet</h3>
          <p className="text-gray-500 mb-6">Start exploring and register for exciting events!</p>
          <button
            onClick={onBrowseEvents}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;