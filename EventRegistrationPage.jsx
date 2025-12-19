import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Users, DollarSign, Star, X, Check, 
  CheckCircle, XCircle, AlertCircle, Building, Tag, Loader, ArrowLeft,
  Share2, Bookmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ReviewSection from '../ReviewSection';
import { API_BASE_URL } from '../../config/api';

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 z-50 animate-fadeIn`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Payment Method Selection Modal
const PaymentMethodModal = ({ event, onSelectPayment, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm sm:max-w-md lg:max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] relative shadow-2xl transform transition-all duration-300 scale-100 animate-modalSlideIn overflow-hidden flex flex-col">
        {/* Decorative gradient background */}
        <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

        <button
          onClick={onCancel}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gray-200 transition-colors z-10 bg-black/20 rounded-full p-2 hover:bg-black/30"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="relative flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl border-4 border-white">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Choose Payment Method</h2>
              <p className="text-gray-600 text-base sm:text-lg px-2">Select your preferred payment option</p>
            </div>

            {/* Payment Options */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {/* QR Code Payment Option */}
              <button
                onClick={() => onSelectPayment('qr')}
                disabled={isLoading}
                className="w-full p-4 sm:p-6 border-2 border-blue-200 rounded-xl sm:rounded-2xl hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-5 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img src="/payment.jpg" alt="QR Code" className="w-6 h-6 sm:w-9 sm:h-9 object-contain filter brightness-0 invert" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">QR Code Payment</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Scan and pay instantly with UPI</p>
                    <div className="flex items-center mt-2 gap-1 sm:gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Fast & Secure</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">No Fees</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center ml-2 sm:ml-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </button>

              {/* Stripe Payment Option */}
              <button
                onClick={() => onSelectPayment('stripe')}
                disabled={isLoading}
                className="w-full p-4 sm:p-6 border-2 border-purple-200 rounded-xl sm:rounded-2xl hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-5 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg className="w-6 h-6 sm:w-9 sm:h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Card Payment</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Pay securely with credit/debit card</p>
                    <div className="flex items-center mt-2 gap-1 sm:gap-2">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Secure</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">International</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center ml-2 sm:ml-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </button>
            </div>

            {/* Amount Display */}
            <div className="text-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-300">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Total Amount</p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₹{event.price}</p>
              <p className="text-xs sm:text-sm text-gray-600 truncate px-2">{event.title}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// QR Code Payment Modal
const QRPaymentModal = ({ event, qrImageUrl, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm sm:max-w-md lg:max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] relative shadow-2xl transform transition-all duration-300 scale-100 animate-modalSlideIn overflow-hidden flex flex-col">
        {/* Decorative gradient background */}
        <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>

        <button
          onClick={onCancel}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gray-200 transition-colors z-10 bg-black/20 rounded-full p-2 hover:bg-black/30"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="relative flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl border-4 border-white">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Complete Your Payment</h2>
              <p className="text-gray-600 text-base sm:text-lg px-2">Scan the QR code to pay securely</p>
            </div>

            {/* QR Code Section */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-100 shadow-inner">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-block p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-100">
                  <img
                    src={qrImageUrl}
                    alt="Payment QR Code"
                    className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Amount Display */}
              <div className="text-center bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white">
                <p className="text-xs sm:text-sm font-medium opacity-90 mb-1">Payment Amount</p>
                <p className="text-2xl sm:text-3xl font-bold">₹{event.price}</p>
                <p className="text-xs sm:text-sm opacity-90 mt-1 truncate px-2">{event.title}</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-2 sm:mb-3">How to Pay</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-blue-800">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 sm:mr-3 flex-shrink-0">1</span>
                      <span className="text-xs sm:text-sm">Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 sm:mr-3 flex-shrink-0">2</span>
                      <span className="text-xs sm:text-sm">Scan the QR code above</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 sm:mr-3 flex-shrink-0">3</span>
                      <span className="text-xs sm:text-sm">Complete the payment</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 sm:mr-3 flex-shrink-0">4</span>
                      <span className="text-xs sm:text-sm">Click "I've Completed Payment" below</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-3 sm:px-6 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    I've Completed Payment
                  </>
                )}
              </button>
            </div>

            {/* Footer Note */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-500">
                Your registration will be confirmed after payment verification
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Registration Confirmation Modal
const RegistrationModal = ({ event, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative shadow-2xl transform transition-all">
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Registration</h2>
          <p className="text-gray-600">Review the details before registering</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Event</p>
              <p className="font-bold text-gray-900 truncate">{event.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-semibold text-gray-900 text-sm truncate">{event.location}</p>
              </div>
            </div>
          </div>

          {event.price > 0 && (
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Registration Fee</span>
                <span className="text-2xl font-bold text-blue-600">₹{event.price}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Confirm & Register
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Event Details Page with Registration
export const EventRegistrationPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState('not_registered');
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [toast, setToast] = useState(null);
  const ASSETS_BASE_URL = API_BASE_URL.replace('/api', '');

  useEffect(() => {
    // Check for payment status from URL query params
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment_success')) {
      const sessionId = query.get('session_id');
      
      if (sessionId) {
        setToast({ message: "Payment successful! Verifying registration...", type: 'success' });
        
        // Clean up URL first
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Verify payment and create/update registration
        verifyPaymentRegistration(sessionId);
      } else {
        setToast({ message: "Payment completed but verification failed. Please contact support.", type: 'error' });
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    if (query.get('payment_cancelled')) {
      setToast({ message: "Payment was cancelled. You can try again.", type: 'error' });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchEventDetails();
    if (currentUser?.id) {
      checkRegistrationStatus();
    }
  }, [eventId, currentUser]);

  const fetchEventDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      const data = await response.json();
      if (data.success) {
        setEvent(data.data.event);
      } else {
        throw new Error(data.error || 'Failed to fetch event details');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      setToast({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/events/${eventId}/registration/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const status = data.data.status || 'not_registered';
          setRegistrationStatus(status);
        }
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  const handleRegisterClick = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/event-register/${eventId}` } });
      return;
    }

    // For paid events, show payment method selection first
    if (event.price > 0) {
      setShowPaymentModal(true);
    } else {
      // For free events, show confirmation modal directly
      setShowModal(true);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setShowPaymentModal(false);

    if (method === 'qr') {
      // For QR payment, directly call registration with QR method
      handleConfirmRegistration(method);
    } else {
      // For Stripe, show confirmation modal first
      setShowModal(true);
    }
  };

  const handleConfirmRegistration = async (paymentMethod = null) => {
    setIsRegistering(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const requestBody = paymentMethod === 'qr' ? { paymentMethod: 'qr' } : {};

      const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: Object.keys(requestBody).length > 0 ? JSON.stringify(requestBody) : undefined
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.paymentMethod === 'qr') {
          // QR Code payment - show QR modal
          setQrImageUrl(data.qrImageUrl);
          setShowQRModal(true);
          setShowModal(false);
          setToast({ message: 'Registration created! Please complete payment using QR code.', type: 'success' });
        } else if (data.paymentUrl) {
          // Stripe payment - redirect to checkout
          window.location.href = data.paymentUrl;
          return;
        } else {
          // Free event flow
          setRegistrationStatus('pending');
          setShowModal(false);
          setToast({ message: 'Registration submitted successfully!', type: 'success' });
        }
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      setToast({ message: error.message || 'Registration failed. Please try again.', type: 'error' });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleQRPaymentConfirm = () => {
    setShowQRModal(false);
    setToast({
      message: 'Payment submitted! Your registration is pending admin approval. You will receive a confirmation email once payment is verified.',
      type: 'success'
    });
    // Refresh registration status
    setTimeout(() => {
      checkRegistrationStatus();
    }, 1000);
  };

  const verifyPaymentRegistration = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setToast({ message: "Please log in to complete registration.", type: 'error' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events/verify-payment-registration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRegistrationStatus('pending');
          setToast({ 
            message: "Payment successful! Your registration is now pending admin approval.", 
            type: 'success' 
          });
          
          // Force refresh the registration status after a short delay
          setTimeout(() => {
            checkRegistrationStatus();
          }, 1000);
        }
      } else {
        const errorData = await response.json();
        console.error('Payment verification failed:', errorData);
        setToast({ 
          message: "Payment verification failed. Please contact support.", 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error verifying payment registration:', error);
      setToast({ 
        message: "Error verifying payment. Please contact support.", 
        type: 'error' 
      });
    }
  };

  const getButtonConfig = () => {
    switch (registrationStatus) {
      case 'not_registered':
        return {
          text: 'Register Now',
          className: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl',
          icon: Check,
          disabled: false,
          onClick: handleRegisterClick
        };
      case 'pending':
        return {
          text: 'Registration Pending',
          className: 'bg-yellow-500 text-white cursor-not-allowed',
          icon: Clock,
          disabled: true,
          onClick: null
        };
      case 'approved':
        return {
          text: 'Registration Approved',
          className: 'bg-green-500 text-white cursor-not-allowed',
          icon: CheckCircle,
          disabled: true,
          onClick: null
        };
      case 'rejected':
        return {
          text: 'Registration Declined',
          className: 'bg-red-500 text-white cursor-not-allowed',
          icon: XCircle,
          disabled: true,
          onClick: null
        };
      default:
        return {
          text: 'Register Now',
          className: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl',
          icon: Check,
          disabled: false,
          onClick: handleRegisterClick
        };
    }
  };

  if (isLoading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  const buttonConfig = getButtonConfig();
  const ButtonIcon = buttonConfig.icon;
  const isFull = event.current_registrations >= event.registration_limit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      {/* Navigation Bar - Matching your app's style */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <img
                      src="/A.png"
                      alt="Logo"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    CampusEventHub
                  </span>
                  <div className="text-xs text-gray-500 -mt-1">Connect • Discover • Engage</div>
                </div>
              </a>
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                // Check if user is logged in and determine their role
                if (currentUser) {
                  if (currentUser.role === 'student') {
                    // Navigate to student dashboard with browse tab active
                    navigate('/student/dashboard', { state: { activeTab: 'browse' } });
                  } else if (currentUser.role === 'college_admin' || currentUser.role === 'super_admin') {
                    // Navigate to admin dashboard
                    navigate('/admin/dashboard');
                  } else {
                    // Fallback to previous page
                    navigate(-1);
                  }
                } else {
                  // For non-logged in users, go to login page
                  navigate('/login');
                }
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back to Events</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <div className="relative aspect-[16/9] group">
                <img 
                  src={event.image ? `${ASSETS_BASE_URL}${event.image}` : 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop'}
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-semibold rounded-full shadow-lg capitalize">
                    {event.category}
                  </span>
                </div>

              

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">{event.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-white/90">
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{event.college_name}</span>
                    </div>
                    {event.rating && (
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">{event.rating.average || 0}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-3"></div>
                About This Event
              </h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            {/* Event Details Grid */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-3"></div>
                Event Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">Date</p>
                    <p className="font-bold text-gray-900">
                      {new Date(event.start_date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    {event.end_date !== event.start_date && (
                      <p className="text-sm text-gray-600">
                        to {new Date(event.end_date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start p-4 bg-purple-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">Time</p>
                    <p className="font-bold text-gray-900">
                      {new Date(event.start_date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-green-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">Location</p>
                    <p className="font-bold text-gray-900 truncate">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-orange-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Capacity</p>
                    <p className="font-bold text-gray-900">
                      {event.current_registrations} / {event.registration_limit} registered
                    </p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((event.current_registrations / event.registration_limit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xl border border-gray-100 sticky top-24">
              {/* Price Section */}
              <div className="text-center mb-6">
                <p className="text-gray-500 mb-2 font-medium text-sm">Registration Fee</p>
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {event.price > 0 ? `₹${event.price}` : 'Free'}
                </div>
              </div>

              {/* Registration Button */}
              <button
                onClick={buttonConfig.onClick}
                disabled={buttonConfig.disabled || isFull}
                className={`w-full py-4 px-6 rounded-lg font-bold text-base transition-all transform hover:scale-105 flex items-center justify-center mb-6 ${
                  isFull 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : buttonConfig.className
                }`}
              >
                <ButtonIcon className="w-5 h-5 mr-2" />
                {isFull ? 'Event Full' : buttonConfig.text}
              </button>

              {/* Status Messages */}
              {registrationStatus === 'pending' && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-yellow-900 text-sm mb-1">Pending Approval</p>
                      <p className="text-xs text-yellow-700">
                        Your registration is under review. You'll receive an email notification once approved.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {registrationStatus === 'approved' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-green-900 text-sm mb-1">You're Registered!</p>
                      <p className="text-xs text-green-700">
                        Your spot is confirmed. Check your email for event updates and details.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium text-sm">Available Spots</span>
                  <span className="text-xl font-bold text-gray-900">
                    {event.registration_limit - event.current_registrations}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium text-sm">Total Capacity</span>
                  <span className="text-xl font-bold text-gray-900">
                    {event.registration_limit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Reviews Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-3"></div>
            What Students Are Saying
          </h2>
          <ReviewSection 
            eventId={eventId} 
            currentUserId={currentUser?.id}
            showForm={true}
          />
        </div>
      </div>

      {/* Payment Method Selection Modal */}
      {showPaymentModal && (
        <PaymentMethodModal
          event={event}
          onSelectPayment={handlePaymentMethodSelect}
          onCancel={() => setShowPaymentModal(false)}
          isLoading={isRegistering}
        />
      )}

      {/* QR Code Payment Modal */}
      {showQRModal && (
        <QRPaymentModal
          event={event}
          qrImageUrl={qrImageUrl}
          onConfirm={handleQRPaymentConfirm}
          onCancel={() => setShowQRModal(false)}
          isLoading={isRegistering}
        />
      )}

      {/* Registration Modal */}
      {showModal && (
        <RegistrationModal
          event={event}
          onConfirm={() => handleConfirmRegistration(selectedPaymentMethod)}
          onCancel={() => setShowModal(false)}
          isLoading={isRegistering}
        />
      )}
    </div>
  );
};