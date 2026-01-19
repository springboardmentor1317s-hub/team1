import React, { useState, useEffect } from 'react';
import { Star, Send, Trash2, User, CheckCircle, AlertCircle, MessageSquare, ThumbsUp, Edit2, X } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

// Toast Notification Component
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

// Feedback Form Component
const FeedbackForm = ({ eventId, existingFeedback, onSubmitSuccess, onCancel }) => {
  const [rating, setRating] = useState(existingFeedback?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState(existingFeedback?.comments || '');
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setToast({ message: 'Please select a rating', type: 'error' });
      return;
    }
    
    if (feedback.trim().length < 10) {
      setToast({ message: 'Feedback must be at least 10 characters', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const url = existingFeedback 
  ? `${API_BASE_URL}/feedback/${existingFeedback._id}`
  : `${API_BASE_URL}/feedback`;
      
      const method = existingFeedback ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: eventId,
          rating,
          comments: feedback.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setToast({ message: data.message || 'Feedback submitted successfully!', type: 'success' });
        setRating(0);
        setFeedback('');
        
        if (onSubmitSuccess) {
          setTimeout(() => onSubmitSuccess(), 1500);
        }
      } else {
        setToast({ message: data.message || 'Failed to submit feedback', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setToast({ message: 'Error submitting feedback. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          {existingFeedback ? 'Edit Your Feedback' : 'Share Your Feedback'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        )}
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Rate this event
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-3 text-sm font-medium text-gray-600 self-center">
                {rating === 1 && '⭐ Poor'}
                {rating === 2 && '⭐⭐ Fair'}
                {rating === 3 && '⭐⭐⭐ Good'}
                {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Feedback
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us about your experience at this event..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition"
          />
          <p className="text-xs text-gray-500 mt-1">
            {feedback.length} characters (minimum 10 required)
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          {submitting ? 'Submitting...' : existingFeedback ? 'Update Feedback' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
};

// All Feedbacks Display Component
const AllFeedbacksDisplay = ({ eventId, currentUserId, onRefresh }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ average: 0, count: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, [eventId]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/feedback/event/${eventId}`);
      const data = await response.json();

      if (data.success) {
        setFeedbacks(data.data.feedbacks || []);
        setStats(data.data.stats || { average: 0, count: 0, distribution: {} });
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

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
        setToast({ message: 'Feedback deleted successfully', type: 'success' });
        fetchFeedbacks();
        if (onRefresh) onRefresh();
      } else {
        setToast({ message: data.message || 'Failed to delete feedback', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setToast({ message: 'Error deleting feedback', type: 'error' });
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const feedbackDate = new Date(date);
    const diff = Math.floor((now - feedbackDate) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-2">Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Event Feedback ({stats.count})
        </h3>
        {stats.count > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
            <Star size={24} className="fill-yellow-400 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.average}</div>
              <div className="text-xs text-gray-600">Average</div>
            </div>
          </div>
        )}
      </div>

      {stats.count > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Rating Distribution</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 w-8">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${stats.count > 0 ? (stats.distribution[star] / stats.count) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{stats.distribution[star] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No feedback yet. Be the first to share your experience!</p>
          </div>
        ) : (
          feedbacks.map((fb) => {
            const isOwn = fb.user_id?._id === currentUserId;
            return (
              <div
                key={fb._id}
                className={`p-5 rounded-lg border-l-4 transition ${
                  isOwn 
                    ? 'bg-blue-50 border-l-blue-500' 
                    : 'bg-gray-50 border-l-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isOwn
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        {fb.user_id?.name || 'Anonymous'}
                        {isOwn && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500">{fb.user_id?.college || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-start gap-3">
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= fb.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(fb.timestamp)}
                      </span>
                    </div>
                    {isOwn && (
                      <button
                        onClick={() => handleDeleteFeedback(fb._id)}
                        className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 rounded"
                        title="Delete feedback"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{fb.comments}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Comment Section Component
const CommentSection = ({ eventId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/feedback/comments/event/${eventId}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim().length < 3) {
      setToast({ message: 'Comment must be at least 3 characters', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/feedback/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: eventId,
          text: newComment.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setNewComment('');
        setToast({ message: 'Comment posted successfully!', type: 'success' });
        fetchComments();
      } else {
        setToast({ message: data.message || 'Failed to post comment', type: 'error' });
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setToast({ message: 'Error posting comment. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setToast({ message: 'Comment deleted', type: 'success' });
        fetchComments();
      } else {
        setToast({ message: data.message || 'Failed to delete comment', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setToast({ message: 'Error deleting comment', type: 'error' });
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diff = Math.floor((now - commentDate) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddComment();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-2">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Discussion ({comments.length})
      </h3>

      <div className="mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts about this event..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {newComment.length} characters • Press Ctrl+Enter to post
              </p>
              <button
                onClick={handleAddComment}
                disabled={submitting}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-lg flex items-center gap-2 transition shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => {
            const isOwn = comment.user_id?._id === currentUserId;
            return (
              <div
                key={comment._id}
                className={`flex gap-3 p-4 rounded-lg transition ${
                  isOwn ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isOwn
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    <User size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {comment.user_id?.name || 'Anonymous'}
                        {isOwn && (
                          <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500">{comment.user_id?.college || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTimestamp(comment.timestamp)}
                      </span>
                      {isOwn && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 rounded"
                          title="Delete comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2 break-words">{comment.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Main Feedback Section Component
const FeedbackSection = ({ eventId, currentUserId }) => {
  const [canProvideFeedback, setCanProvideFeedback] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    checkFeedbackEligibility();
  }, [eventId, refreshKey]);

  const checkFeedbackEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCanProvideFeedback(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/feedback/can-feedback/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setCanProvideFeedback(data.canProvideFeedback);
        if (data.feedback) {
          setExistingFeedback(data.feedback);
        } else {
          setExistingFeedback(null);
        }
      }
    } catch (error) {
      console.error('Error checking feedback eligibility:', error);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleFeedbackSuccess = () => {
    setShowFeedbackForm(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleEditFeedback = () => {
    setShowFeedbackForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Form Section */}
      {!checkingEligibility && (canProvideFeedback || existingFeedback) && (
        <>
          {showFeedbackForm ? (
            <FeedbackForm 
              eventId={eventId}
              existingFeedback={existingFeedback}
              onSubmitSuccess={handleFeedbackSuccess}
              onCancel={() => setShowFeedbackForm(false)}
            />
          ) : existingFeedback ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">You've already provided feedback</h3>
                    <p className="text-sm text-gray-600">Thank you for sharing your experience!</p>
                  </div>
                </div>
                <button
                  onClick={handleEditFeedback}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit2 size={16} />
                  Edit Feedback
                </button>
              </div>
            </div>
          ) : canProvideFeedback && !showFeedbackForm ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Share your experience</h3>
                    <p className="text-sm text-gray-600">Let others know what you thought about this event</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                >
                  <Star size={18} />
                  Add Feedback
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* All Feedbacks Display */}
      <AllFeedbacksDisplay 
        eventId={eventId}
        currentUserId={currentUserId}
        key={refreshKey}
        onRefresh={() => setRefreshKey(prev => prev + 1)}
      />

      {/* Comment Section */}
      <CommentSection 
        eventId={eventId}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default FeedbackSection;

