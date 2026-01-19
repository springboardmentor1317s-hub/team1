import React, { useState, useEffect } from 'react';
import { Star, Send, Trash2, User, CheckCircle, AlertCircle, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

// Toast Notification
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

// Review Form Component (Compact, Amazon-style)
const ReviewForm = ({ eventId, existingReview, onSubmitSuccess, onCancel }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState(existingReview?.comments || '');
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setToast({ message: 'Please select a rating', type: 'error' });
      return;
    }
    
    if (review.trim().length < 10) {
      setToast({ message: 'Review must be at least 10 characters', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const url = existingReview 
        ? `${API_BASE_URL}/feedback/${existingReview._id}`
        : `${API_BASE_URL}/feedback`;
      
      const method = existingReview ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: eventId,
          rating,
          comments: review.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setToast({ message: data.message || 'Review submitted successfully!', type: 'success' });
        if (!existingReview) {
          setRating(0);
          setReview('');
        }
        
        if (onSubmitSuccess) {
          setTimeout(() => onSubmitSuccess(), 1500);
        }
      } else {
        setToast({ message: data.message || 'Failed to submit review', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setToast({ message: 'Error submitting review. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="space-y-5">
        {/* Star Rating */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-3">
            Rate this event *
          </label>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-125 focus:outline-none p-0.5 sm:p-1"
              >
                <Star
                  size={28}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  } transition-colors sm:w-9 sm:h-9`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 sm:ml-3 text-sm sm:text-base font-semibold text-gray-700">
                {rating === 1 && '⭐ Poor'}
                {rating === 2 && '⭐⭐ Fair'}
                {rating === 3 && '⭐⭐⭐ Good'}
                {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review" className="block text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-3">
            Write your review *
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did you like or dislike? What did you use this event for?"
            rows="5"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition text-gray-800"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Minimum 10 characters required
            </p>
            <p className={`text-xs font-medium ${review.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
              {review.length} characters
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || rating === 0 || review.trim().length < 10}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 text-sm sm:text-base"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-gray-900"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
              Submit Review
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Single Review with Replies (Instagram Style)
const ReviewItem = ({ review, currentUserId, onDeleteReview, onReplyAdded }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [toast, setToast] = useState(null);

  const isOwnReview = review.user_id?._id === currentUserId;
  const replies = review.replies || [];
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 2);
  
  // Check if current user is admin
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'college_admin' || currentUser.role === 'super_admin';
  const canDelete = isOwnReview || isAdmin;

  const formatTimestamp = (date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diff = Math.floor((now - reviewDate) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return reviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSubmitReply = async () => {
    if (replyText.trim().length === 0) {
      setToast({ message: 'Reply cannot be empty', type: 'error' });
      return;
    }

    try {
      setSubmittingReply(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/feedback/${review._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: replyText.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setReplyText('');
        setShowReplyInput(false);
        setToast({ message: 'Reply added!', type: 'success' });
        if (onReplyAdded) onReplyAdded();
      } else {
        setToast({ message: data.message || 'Failed to add reply', type: 'error' });
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      setToast({ message: 'Error adding reply', type: 'error' });
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/${review._id}/reply/${replyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setToast({ message: 'Reply deleted', type: 'success' });
        if (onReplyAdded) onReplyAdded();
      } else {
        setToast({ message: data.message || 'Failed to delete reply', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      setToast({ message: 'Error deleting reply', type: 'error' });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      {/* Main Review */}
      <div className="flex gap-3 sm:gap-4">
        {/* Avatar */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
          isOwnReview
            ? 'bg-gradient-to-br from-blue-500 to-purple-500'
            : 'bg-gradient-to-br from-gray-400 to-gray-500'
        }`}>
          <User size={20} className="text-white sm:w-6 sm:h-6" />
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  {review.user_id?.name || 'Anonymous'}
                </span>
                {isOwnReview && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
                <span className="text-xs text-gray-500">{formatTimestamp(review.timestamp)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{review.user_id?.college || ''}</p>
            </div>
            
            {/* Stars and Delete */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={`${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } sm:w-4 sm:h-4`}
                  />
                ))}
              </div>
              {canDelete && (
                <button
                  onClick={() => onDeleteReview(review._id)}
                  className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 rounded"
                  title="Delete review"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Review Text */}
          <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed">{review.comments}</p>

          {/* Reply Button */}
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-xs sm:text-sm font-medium text-gray-500 hover:text-blue-600 transition"
          >
            Reply
          </button>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmitReply()}
              />
              <button
                onClick={handleSubmitReply}
                disabled={submittingReply}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-50 whitespace-nowrap"
              >
                {submittingReply ? '...' : 'Post'}
              </button>
            </div>
          )}

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {visibleReplies.map((reply) => {
                const isOwnReply = reply.user_id?._id === currentUserId;
                const isReplyAuthorAdmin = reply.user_id?.role === 'college_admin' || reply.user_id?.role === 'super_admin';
                const canDeleteReply = isOwnReply || isAdmin;
                return (
                  <div key={reply._id} className="flex gap-2 sm:gap-3 ml-2 sm:ml-6">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isReplyAuthorAdmin
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : isOwnReply
                        ? 'bg-gradient-to-br from-blue-400 to-purple-400'
                        : 'bg-gray-300'
                    }`}>
                      <User size={14} className="text-white sm:w-4 sm:h-4" />
                    </div>
                    <div className={`flex-1 rounded-lg px-3 py-2 min-w-0 ${
                      isReplyAuthorAdmin ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                            {reply.user_id?.name || 'Anonymous'}
                          </span>
                          {isReplyAuthorAdmin && (
                            <span className="text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0 font-semibold">
                              Admin
                            </span>
                          )}
                          {isOwnReply && !isReplyAuthorAdmin && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              You
                            </span>
                          )}
                          <span className="text-xs text-gray-500 flex-shrink-0">{formatTimestamp(reply.timestamp)}</span>
                        </div>
                        {canDeleteReply && (
                          <button
                            onClick={() => handleDeleteReply(reply._id)}
                            className="text-red-500 hover:text-red-700 transition flex-shrink-0"
                          >
                            <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 break-words">{reply.text}</p>
                    </div>
                  </div>
                );
              })}

              {/* View More Replies Button (Instagram Style) */}
              {replies.length > 2 && (
                <button
                  onClick={() => setShowAllReplies(!showAllReplies)}
                  className="ml-2 sm:ml-6 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
                >
                  {showAllReplies ? (
                    <>
                      <ChevronUp size={14} className="sm:w-4 sm:h-4" />
                      Hide replies
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                      View {replies.length - 2} more {replies.length - 2 === 1 ? 'reply' : 'replies'}
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Review Section Component
const ReviewSection = ({ eventId, currentUserId, showForm = true, limit = null }) => {
  const [allReviews, setAllReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, count: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [toast, setToast] = useState(null);
  const [displayCount, setDisplayCount] = useState(5);
  
  const REVIEWS_PER_PAGE = 5;

  useEffect(() => {
    fetchReviews();
    if (currentUserId && showForm) {
      checkReviewEligibility();
    }
  }, [eventId, currentUserId]);

  useEffect(() => {
    // Update displayed reviews when displayCount changes
    if (limit) {
      setDisplayedReviews(allReviews.slice(0, limit));
    } else {
      setDisplayedReviews(allReviews.slice(0, displayCount));
    }
  }, [allReviews, displayCount, limit]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/feedback/event/${eventId}`);
      const data = await response.json();

      if (data.success) {
        setAllReviews(data.data.feedbacks || []);
        setStats(data.data.stats || { average: 0, count: 0, distribution: {} });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setToast({ message: 'Failed to load reviews', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayCount(prev => prev + REVIEWS_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  };

  const checkReviewEligibility = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/feedback/can-feedback/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setCanReview(data.canProvideFeedback);
        if (data.feedback) {
          setExistingReview(data.feedback);
        }
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setToast({ message: 'Review deleted successfully', type: 'success' });
        fetchReviews();
        checkReviewEligibility();
      } else {
        setToast({ message: data.message || 'Failed to delete review', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setToast({ message: 'Error deleting review', type: 'error' });
    }
  };

  const handleReviewSuccess = () => {
    fetchReviews();
    checkReviewEligibility();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for average rating */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-4 sm:p-6 border border-blue-200 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        
        {/* Loading skeleton for reviews */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 sm:gap-4 animate-pulse">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      {/* Average Rating Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-4 sm:p-6 border border-blue-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Event Reviews</h3>
            <p className="text-xs sm:text-sm text-gray-600">{stats.count} {stats.count === 1 ? 'review' : 'reviews'} for this event</p>
          </div>
          {stats.count > 0 && (
            <div className="text-center bg-white rounded-lg px-4 sm:px-6 py-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Star size={24} className="fill-yellow-400 text-yellow-400 sm:w-7 sm:h-7" />
                <span className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.average}</span>
                <span className="text-sm text-gray-500">out of 5</span>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= Math.round(stats.average)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Form - Only show if user hasn't reviewed yet */}
      {showForm && canReview && !existingReview && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">
              Review This Event
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Share your experience with other students</p>
          </div>
          <div className="p-4 sm:p-6">
            <ReviewForm
              eventId={eventId}
              existingReview={null}
              onSubmitSuccess={handleReviewSuccess}
              onCancel={null}
            />
          </div>
        </div>
      )}

      {/* Already Reviewed Message */}
      {showForm && existingReview && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 mb-1 text-sm sm:text-base">Thank You for Your Review!</h4>
              <p className="text-xs sm:text-sm text-green-700">
                You have already submitted a review for this event. You can see it below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cannot Review Message */}
      {showForm && !canReview && !existingReview && currentUserId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1 text-sm sm:text-base">Review Not Available</h4>
              <p className="text-xs sm:text-sm text-yellow-700">
                Only students who have registered and been approved for this event can write reviews.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            All Reviews ({allReviews.length})
          </h3>
          {!limit && displayedReviews.length < allReviews.length && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing {displayedReviews.length} of {allReviews.length} reviews
            </p>
          )}
        </div>
        {allReviews.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-4 sm:w-14 sm:h-14" />
            <h4 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No Reviews Yet</h4>
            <p className="text-sm text-gray-500">Be the first to share your experience!</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {displayedReviews.map((review) => (
                <ReviewItem
                  key={review._id}
                  review={review}
                  currentUserId={currentUserId}
                  onDeleteReview={handleDeleteReview}
                  onReplyAdded={fetchReviews}
                />
              ))}
            </div>

            {/* Load More Button */}
            {!limit && displayedReviews.length < allReviews.length && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full py-3 px-6 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Reviews ({Math.min(REVIEWS_PER_PAGE, allReviews.length - displayedReviews.length)} more)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

