import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Users, CheckCircle, Clock, XCircle, Eye, ArrowRight, Download, X, DollarSign, Tag } from 'lucide-react';
import DownloadTicketButton from '../event-actions/DownloadTicket';
import ReviewSection from '../ReviewSection';
import { API_BASE_URL } from '../../config/api';

const StudentMyRegistrations = ({ registrations, onViewDetails, userEvents = [], currentUser, handleRegister }) => {
  // Pagination state
  const [registrationPage, setRegistrationPage] = useState(1);
  const REGISTRATIONS_PER_PAGE = 7;
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Paginate registrations
  const paginatedRegistrations = useMemo(() => {
    const startIndex = 0;
    const endIndex = registrationPage * REGISTRATIONS_PER_PAGE;
    return registrations.slice(startIndex, endIndex);
  }, [registrations, registrationPage]);
  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-50 border-green-200 text-green-700';
      case 'pending': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'rejected': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const stats = {
    total: registrations.length,
    approved: registrations.filter(r => r.registrationStatus === 'approved').length,
    pending: registrations.filter(r => r.registrationStatus === 'pending').length,
    rejected: registrations.filter(r => r.registrationStatus === 'rejected').length,
  };

  const closeEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-1">Total</p>
              <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-700">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl shadow-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Registrations List */}
      <div className="space-y-6">
        {paginatedRegistrations.map((event) => (
          <div
            key={event.id}
            className={`bg-white rounded-2xl shadow-lg border-2 ${getStatusColor(event.registrationStatus)} p-8 hover:shadow-xl transition-all duration-300 group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  {getStatusIcon(event.registrationStatus)}
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">College</p>
                      <p className="font-semibold">{event.college}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(event.registrationStatus)}`}>
                    {event.registrationStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="ml-6 flex flex-col gap-3">
                {/* Download Ticket Button for Approved Registrations */}
                {event.registrationStatus === 'approved' && event.registrationId && (
                  <button
                    onClick={() => {
                      // Create a mini version of download button for inline use
                      const registrationId = event.registrationId;
                      const token = localStorage.getItem('token');
                      
                      if (!token) {
                        alert('Please login to download your ticket');
                        return;
                      }

                      // Download ticket
                      fetch(`${API_BASE_URL}/tickets/${registrationId}`, {
                        method: 'GET',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                        },
                      })
                      .then(response => {
                        if (!response.ok) {
                          throw new Error('Failed to download ticket');
                        }
                        return response.blob();
                      })
                      .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `ticket-${registrationId}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      })
                      .catch(error => {
                        console.error('Error downloading ticket:', error);
                        alert('Failed to download ticket. Please try again.');
                      });
                    }}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 group-hover:scale-105 shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-semibold">Download Ticket</span>
                  </button>
                )}
                
                {/* View Details Button */}
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventDetails(true);
                  }}
                  className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 group-hover:scale-105 shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">View Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button for Registrations */}
      {paginatedRegistrations.length < registrations.length && (
        <div className="text-center py-8">
          <button
            onClick={() => setRegistrationPage(prev => prev + 1)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Load More Registrations ({registrations.length - paginatedRegistrations.length} remaining)
          </button>
        </div>
      )}

      {/* Reset button when all registrations loaded */}
      {paginatedRegistrations.length === registrations.length && registrations.length > REGISTRATIONS_PER_PAGE && (
        <div className="text-center py-6">
          <button
            onClick={() => setRegistrationPage(1)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Show Less Registrations
          </button>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
          onClick={closeEventDetails}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-full h-[90vh] overflow-y-auto animate-fade-in mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Enhanced for full width */}
            <div className="relative h-80 lg:h-96">
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.title}
                className="w-full h-full object-cover rounded-t-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-t-xl"></div>
              
              {/* Close button */}
              <button
                onClick={closeEventDetails}
                className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
              
              {/* Registration status badge */}
              {selectedEvent.registrationStatus && (
                <div className={`absolute top-6 left-6 px-6 py-3 rounded-full font-bold text-lg backdrop-blur-sm border-2 shadow-lg ${getStatusColor(selectedEvent.registrationStatus)}`}>
                  {selectedEvent.registrationStatus.toUpperCase()}
                </div>
              )}

              {/* Event title overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                  {selectedEvent.title}
                </h2>
                <p className="text-xl text-gray-200 font-medium">
                  {selectedEvent.college}
                </p>
              </div>
            </div>

            {/* Modal Content - Better spacing for full width */}
            <div className="p-8 lg:p-12">
              {/* Event Info Grid - Optimized for full width */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center text-blue-600 mb-3">
                    <Calendar className="w-6 h-6 mr-3" />
                    <p className="text-sm font-semibold uppercase tracking-wide">Date & Time</p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-600 font-medium">{selectedEvent.time}</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                  <div className="flex items-center text-green-600 mb-3">
                    <MapPin className="w-6 h-6 mr-3" />
                    <p className="text-sm font-semibold uppercase tracking-wide">Location</p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">{selectedEvent.location}</p>
                  <p className="text-gray-600 font-medium">{selectedEvent.college}</p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                  <div className="flex items-center text-purple-600 mb-3">
                    <Users className="w-6 h-6 mr-3" />
                    <p className="text-sm font-semibold uppercase tracking-wide">Participants</p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">
                    {selectedEvent.participants}/{selectedEvent.maxParticipants}
                  </p>
                  <p className="text-gray-600 font-medium">Registered</p>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                  <div className="flex items-center text-orange-600 mb-3">
                    <DollarSign className="w-6 h-6 mr-3" />
                    <p className="text-sm font-semibold uppercase tracking-wide">Fee</p>
                  </div>
                  <p className="font-bold text-green-600 text-2xl">₹{selectedEvent.fee}</p>
                  <p className="text-gray-600 font-medium">Registration</p>
                </div>
              </div>

              {/* Category Section */}
              <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                <div className="flex items-center text-gray-700 mb-3">
                  <Tag className="w-6 h-6 mr-3 text-blue-600" />
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">Category</p>
                </div>
                <p className="font-bold text-gray-900 text-xl capitalize">{selectedEvent.category}</p>
              </div>

              {/* Description - Full width with better typography */}
              <div className="mb-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-4"></div>
                  About This Event
                </h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-2 h-6 bg-gradient-to-b from-green-600 to-blue-600 rounded-full mr-4"></div>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedEvent.tags.map((tag, index) => (
                      <span key={index} className="px-6 py-3 bg-blue-100 text-blue-800 text-lg font-medium rounded-full border border-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons - Better aligned for full width */}
              <div className="bg-gray-50 p-8 rounded-2xl mb-10">
                <div className="max-w-4xl mx-auto">
                  {userEvents.some(e => e.id === selectedEvent.id) ? (
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                      <div className="flex-1 w-full lg:w-auto">
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 p-8 rounded-2xl font-bold text-2xl text-center border-2 border-green-300 shadow-lg">
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircle className="w-8 h-8" />
                            <span>✓ Already Registered</span>
                          </div>
                          <p className="text-lg font-medium mt-2 text-green-600">
                            You're all set for this event!
                          </p>
                        </div>
                      </div>
                      {selectedEvent.registrationStatus === 'approved' && selectedEvent.registrationId && (
                        <div className="w-full lg:w-auto">
                          <DownloadTicketButton registrationId={selectedEvent.registrationId} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => {
                          closeEventDetails();
                          handleRegister(selectedEvent.id);
                        }}
                        disabled={selectedEvent.participants >= selectedEvent.maxParticipants}
                        className={`px-12 py-6 rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-lg ${
                          selectedEvent.participants >= selectedEvent.maxParticipants
                            ? 'bg-red-100 text-red-700 cursor-not-allowed border-2 border-red-300'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-xl'
                        }`}
                      >
                        {selectedEvent.participants >= selectedEvent.maxParticipants ? 
                          'Event Full - Registration Closed' : 
                          'Register for This Event'
                        }
                      </button>
                      {selectedEvent.participants < selectedEvent.maxParticipants && (
                        <p className="text-gray-600 mt-4 text-lg">
                          Join {selectedEvent.participants} other participants
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-gray-200 mb-10"></div>

              {/* Reviews Section - Full width with better spacing */}
              <div className="w-full">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full mr-4"></div>
                  Event Reviews & Ratings
                </h3>
                <ReviewSection 
                  eventId={selectedEvent.id} 
                  currentUserId={currentUser?.id}
                  showForm={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMyRegistrations;

