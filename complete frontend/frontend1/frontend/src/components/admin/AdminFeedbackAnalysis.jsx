import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Star, 
  MessageCircle, 
  Calendar, 
  User, 
  TrendingUp, 
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Send,
  Shield,
  Users,
  CheckCircle,
  X
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}>
        {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

const AdminFeedbackAnalysis = () => {
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [displayedFeedbacks, setDisplayedFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterEvent, setFilterEvent] = useState('all');
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    totalEvents: 0,
    recentFeedbacks: 0
  });
  const [expandedReview, setExpandedReview] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [displayCount, setDisplayCount] = useState(10);
  const [toast, setToast] = useState(null);
  
  const FEEDBACKS_PER_PAGE = 10;

  useEffect(() => {
    fetchAllFeedbacks();
    fetchEvents();
  }, []);

  useEffect(() => {
    // Update displayed feedbacks when displayCount or filter changes
    const filtered = filterFeedbacks();
    setDisplayedFeedbacks(filtered.slice(0, displayCount));
  }, [allFeedbacks, searchQuery, filterRating, filterEvent, displayCount]);

  const fetchAllFeedbacks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        const feedbacks = data.data.feedbacks || [];
        setAllFeedbacks(feedbacks);
        setStats(data.data.stats || {});
        console.log('Loaded feedbacks:', feedbacks.length);
        console.log('Feedback events:', feedbacks.map(f => ({ 
          eventId: f.event_id?._id || f.event_id, 
          eventTitle: f.event_id?.title 
        })));
      } else {
        setToast({ message: 'Failed to load feedbacks', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setToast({ message: 'Error loading feedbacks', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/events?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        const eventsList = data.data.events || [];
        setEvents(eventsList);
        console.log('Loaded events for filter:', eventsList.length);
        console.log('Events data:', eventsList.map(e => ({ id: e._id, title: e.title })));
      } else {
        console.error('Failed to fetch events:', data.message);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const filterFeedbacks = () => {
    return allFeedbacks.filter(feedback => {
      // Search filter
      const matchesSearch = 
        feedback.user_id?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.event_id?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.comments?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Rating filter
      const matchesRating = filterRating === 'all' || 
        (filterRating === '5' && feedback.rating === 5) ||
        (filterRating === '4' && feedback.rating === 4) ||
        (filterRating === '3' && feedback.rating === 3) ||
        (filterRating === '1-2' && feedback.rating <= 2);
      
      // Event filter - compare both string and ObjectId, handle both populated and non-populated cases
      const matchesEvent = filterEvent === 'all' || 
        feedback.event_id?._id === filterEvent ||
        feedback.event_id?._id?.toString() === filterEvent ||
        feedback.event_id === filterEvent ||
        feedback.event_id?.toString() === filterEvent;
      
      // Debug logging
      if (filterEvent !== 'all') {
        console.log('Filtering feedback:', {
          feedbackEventId: feedback.event_id?._id || feedback.event_id,
          filterEvent,
          matchesEvent,
          feedbackTitle: feedback.event_id?.title
        });
      }
      
      return matchesSearch && matchesRating && matchesEvent;
    });
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + FEEDBACKS_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  };

  const handleReply = async (feedbackId) => {
    const text = replyText[feedbackId]?.trim();
    if (!text) {
      setToast({ message: 'Please enter a reply', type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      if (data.success) {
        setToast({ message: 'Reply added successfully', type: 'success' });
        setReplyText({ ...replyText, [feedbackId]: '' });
        fetchAllFeedbacks();
      } else {
        setToast({ message: data.message || 'Failed to add reply', type: 'error' });
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      setToast({ message: 'Error adding reply', type: 'error' });
    }
  };

  const handleDeleteReply = async (feedbackId, replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}/reply/${replyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setToast({ message: 'Reply deleted successfully', type: 'success' });
        fetchAllFeedbacks();
      } else {
        setToast({ message: data.message || 'Failed to delete reply', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      setToast({ message: 'Error deleting reply', type: 'error' });
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setToast({ message: 'Review deleted successfully', type: 'success' });
        fetchAllFeedbacks();
      } else {
        setToast({ message: data.message || 'Failed to delete review', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setToast({ message: 'Error deleting review', type: 'error' });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // Mobile-friendly relative time for recent dates
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    // For older dates, use compact format
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 bg-green-50';
    if (rating >= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>

        {/* Feedbacks Loading */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredFeedbacks = filterFeedbacks();

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Reviews</p>
              <p className="text-3xl font-bold">{stats.totalFeedbacks}</p>
            </div>
            <MessageCircle className="w-10 h-10 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Average Rating</p>
              <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</p>
            </div>
            <Star className="w-10 h-10 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Events Reviewed</p>
              <p className="text-3xl font-bold">{stats.totalEvents}</p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Recent (7 days)</p>
              <p className="text-3xl font-bold">{stats.recentFeedbacks}</p>
            </div>
            <AlertCircle className="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Event Reviews & Feedback</h2>
              <p className="text-sm text-gray-600 mt-1">Manage and respond to student reviews</p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by student, event, or review content..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setDisplayCount(FEEDBACKS_PER_PAGE); // Reset pagination on search
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={filterEvent}
                onChange={(e) => {
                  setFilterEvent(e.target.value);
                  setDisplayCount(FEEDBACKS_PER_PAGE); // Reset pagination on filter
                  console.log('Event filter changed to:', e.target.value);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white min-w-[200px]"
              >
                <option value="all">All Events ({events.length})</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
              <select
                value={filterRating}
                onChange={(e) => {
                  setFilterRating(e.target.value);
                  setDisplayCount(FEEDBACKS_PER_PAGE); // Reset pagination on filter
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white min-w-[180px]"
              >
                <option value="all">All Ratings</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                <option value="3">⭐⭐⭐ (3 stars)</option>
                <option value="1-2">⭐⭐ (1-2 stars)</option>
              </select>
            </div>
            
            {/* Clear Filters Button */}
            {(searchQuery || filterRating !== 'all' || filterEvent !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterRating('all');
                  setFilterEvent('all');
                  setDisplayCount(FEEDBACKS_PER_PAGE);
                }}
                className="self-start px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {displayedFeedbacks.length} of {filteredFeedbacks.length} reviews
            {searchQuery || filterRating !== 'all' || filterEvent !== 'all' ? ' (filtered)' : ''}
          </div>
        </div>

        {/* Feedbacks List */}
        <div className="p-6">
          {filteredFeedbacks.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reviews Found</h3>
              <p className="text-sm text-gray-500">
                {searchQuery || filterRating !== 'all' || filterEvent !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No reviews have been submitted yet'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {displayedFeedbacks.map((feedback) => {
                  const isExpanded = expandedReview === feedback._id;
                  const currentUserRole = JSON.parse(localStorage.getItem('user'))?.role;
                  
                  return (
                    <div 
                      key={feedback._id} 
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200"
                    >
                      {/* Review Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <User size={24} className="text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-900 text-base">
                                  {feedback.user_id?.name || 'Anonymous'}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {feedback.user_id?.college || ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-600">
                                <Calendar size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
                                <span className="truncate">{formatTimestamp(feedback.timestamp)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {renderStars(feedback.rating)}
                              <span className={`px-2 py-1 rounded-lg text-sm font-semibold ${getRatingColor(feedback.rating)}`}>
                                {feedback.rating}.0
                              </span>
                            </div>
                          </div>

                          {/* Event Info */}
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm mb-3">
                            <Users size={14} />
                            <span className="font-medium">{feedback.event_id?.title || 'Unknown Event'}</span>
                          </div>

                          {/* Review Text */}
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {feedback.comments}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 text-sm">
                            <button
                              onClick={() => setExpandedReview(isExpanded ? null : feedback._id)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              {isExpanded ? 'Hide' : 'Reply'} 
                              {feedback.replies?.length > 0 && ` (${feedback.replies.length})`}
                            </button>
                            <button
                              onClick={() => handleDeleteFeedback(feedback._id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
                            >
                              <Trash2 size={16} />
                              Delete Review
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Section - Replies */}
                      {isExpanded && (
                        <div className="ml-16 mt-4 space-y-4 border-t border-gray-200 pt-4">
                          {/* Existing Replies */}
                          {feedback.replies && feedback.replies.length > 0 && (
                            <div className="space-y-3 mb-4">
                              {feedback.replies.map((reply) => {
                                const isReplyAuthorAdmin = reply.user_id?.role === 'college_admin' || 
                                               reply.user_id?.role === 'super_admin';
                                const isOwnReply = reply.user_id?._id === JSON.parse(localStorage.getItem('user'))?._id;
                                // Admin viewing this page can delete any reply
                                const canDeleteReply = true;
                                
                                return (
                                  <div 
                                    key={reply._id} 
                                    className={`flex gap-3 ${isReplyAuthorAdmin ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'} rounded-lg p-3`}
                                  >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      isReplyAuthorAdmin 
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                                        : 'bg-gray-300'
                                    }`}>
                                      {isReplyAuthorAdmin ? <Shield size={16} className="text-white" /> : <User size={16} className="text-white" />}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-semibold text-gray-900 text-sm">
                                            {reply.user_id?.name || 'Anonymous'}
                                          </span>
                                          {isReplyAuthorAdmin && (
                                            <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full font-semibold">
                                              Admin
                                            </span>
                                          )}
                                          {isOwnReply && !isReplyAuthorAdmin && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                              You
                                            </span>
                                          )}
                                          <span className="text-xs text-gray-500 truncate">
                                            {formatTimestamp(reply.timestamp)}
                                          </span>
                                        </div>
                                        {canDeleteReply && (
                                          <button
                                            onClick={() => handleDeleteReply(feedback._id, reply._id)}
                                            className="text-red-500 hover:text-red-700 transition"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-700">{reply.text}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Reply Input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyText[feedback._id] || ''}
                              onChange={(e) => setReplyText({ ...replyText, [feedback._id]: e.target.value })}
                              placeholder="Write your admin reply..."
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleReply(feedback._id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleReply(feedback._id)}
                              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 font-medium"
                            >
                              <Send size={16} />
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {displayedFeedbacks.length < filteredFeedbacks.length && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Reviews ({Math.min(FEEDBACKS_PER_PAGE, filteredFeedbacks.length - displayedFeedbacks.length)} more)
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackAnalysis;

