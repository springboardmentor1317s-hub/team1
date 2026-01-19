import React from 'react';
import { Search, Calendar, Users, Building, Trash2, Eye } from 'lucide-react';

const EventManagement = ({
  eventSearchTerm,
  setEventSearchTerm,
  eventPage,
  setEventPage,
  loading,
  paginatedEvents,
  filteredEvents,
  EVENTS_PER_PAGE,
  viewEventDetails,
  handleDeleteEvent,
  deleteLoading,
  getStatusColor
}) => {
  return (
    <div>
      <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={eventSearchTerm}
            onChange={(e) => {
              setEventSearchTerm(e.target.value);
              setEventPage(1); // Reset pagination on search
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading events...</p>
                </td>
              </tr>
            ) : paginatedEvents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <p className="text-sm text-gray-500">
                    {eventSearchTerm ? 'No events found matching your search' : 'No events found. Create your first event to get started!'}
                  </p>
                </td>
              </tr>
            ) : (
              paginatedEvents.map(event => (
                <tr key={event._id || event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{new Date(event.start_date || event.date).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{event.category || 'General'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.current_registrations || event.registrations || 0} participants</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.status || 'upcoming')}`}>
                      {event.status || 'upcoming'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => viewEventDetails(event)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button 
                      onClick={(e) => handleDeleteEvent(e, event._id)}
                      disabled={deleteLoading}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading events...</p>
          </div>
        ) : paginatedEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              {eventSearchTerm ? 'No events found matching your search' : 'No events found. Create your first event to get started!'}
            </p>
          </div>
        ) : (
          paginatedEvents.map(event => (
            <div key={event._id || event.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(event.start_date || event.date).toLocaleDateString()}</div>
                </div>
                <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.status || 'upcoming')}`}>
                  {event.status || 'upcoming'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Category: </span>
                  <span className="text-gray-900 capitalize">{event.category || 'General'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Participants: </span>
                  <span className="text-gray-900">{event.current_registrations || event.registrations || 0}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => viewEventDetails(event)}
                  className="flex-1 text-xs text-blue-600 hover:text-blue-900 font-medium bg-blue-50 hover:bg-blue-100 py-2 px-3 rounded-lg transition-colors"
                >
                  View Details
                </button>
                <button 
                  onClick={(e) => handleDeleteEvent(e, event._id)}
                  disabled={deleteLoading}
                  className="flex-1 text-xs text-red-600 hover:text-red-900 font-medium bg-red-50 hover:bg-red-100 py-2 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button for Events */}
      {!loading && paginatedEvents.length < filteredEvents.length && (
        <div className="text-center py-6">
          <button
            onClick={() => setEventPage(prev => prev + 1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Load More Events ({filteredEvents.length - paginatedEvents.length} remaining)
          </button>
        </div>
      )}

      {/* Reset button when all events loaded */}
      {paginatedEvents.length === filteredEvents.length && filteredEvents.length > EVENTS_PER_PAGE && (
        <div className="text-center py-6">
          <button
            onClick={() => setEventPage(1)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Show Less Events
          </button>
        </div>
      )}
    </div>
  );
};

export default EventManagement;