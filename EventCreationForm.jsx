import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Users, DollarSign, Tag, FileText, Image, 
  Plus, X, Save, ArrowLeft, ArrowRight, Upload, AlertCircle, CheckCircle, 
  Trophy, Code, Palette, BookOpen, Building, Star
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

// Move form step components outside the main component to prevent re-creation
const BasicInfoStep = ({ formData, errors, handleInputChange, handleCustomCollegeChange, handleFieldFocus, handleImageUpload, upColleges, eventCategories, titleRef }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">College Name *</label>
      <div className="relative">
        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <select
          name="college_name"
          value={formData.college_name}
          onChange={handleInputChange}
          className={`w-full pl-10 pr-4 py-3 border ${errors.college_name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
          required
        >
          <option value="">Select your college</option>
          {upColleges.map((college, index) => (
            <option key={index} value={college}>
              {college}
            </option>
          ))}
        </select>
      </div>
      {formData.college_name === 'Other' && (
        <div className="mt-3">
          <input
            type="text"
            name="custom_college_name"
            value={formData.custom_college_name || ''}
            placeholder="Enter your college name"
            className={`w-full px-4 py-3 border ${errors.college_name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            onChange={handleCustomCollegeChange}
            onFocus={() => handleFieldFocus('college_name')}
          />
        </div>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
      <input
        ref={titleRef}
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        onFocus={() => handleFieldFocus('title')}
        className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        placeholder="Enter event title"
        required
      />
      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Event Description *</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        onFocus={() => handleFieldFocus('description')}
        rows={6}
        className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        placeholder="Provide a detailed description of your event..."
        required
      />
      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Event Category *</label>
      <div className="relative">
        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className={`w-full pl-10 pr-4 py-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
          required
        >
          <option value="">Select event category</option>
          {eventCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          onFocus={() => handleFieldFocus('location')}
          className={`w-full pl-10 pr-4 py-3 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter event location (e.g., Auditorium, Main Campus, Delhi)"
          required
        />
      </div>
      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drop your image here, or <span className="text-blue-600 hover:text-blue-700">browse</span>
          </p>
          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
        </label>
        {formData.image && (
          <p className="mt-2 text-sm text-green-600">✓ {formData.image.name}</p>
        )}
        {errors.image && (
          <p className="mt-2 text-sm text-red-600">{errors.image}</p>
        )}
      </div>
    </div>
  </div>
);

const ScheduleStep = ({ formData, errors, handleInputChange, handleFieldFocus }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            required
          />
        </div>
        {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border ${errors.end_date ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            required
          />
        </div>
        {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border ${errors.start_time ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            required
          />
        </div>
        {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border ${errors.end_time ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            required
          />
        </div>
        {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
      </div>
    </div>
  </div>
);

const RegistrationStep = ({ formData, errors, handleInputChange, handleFieldFocus }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Registration Limit *</label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            name="registration_limit"
            value={formData.registration_limit}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border ${errors.registration_limit ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Maximum participants"
            min="1"
            required
          />
        </div>
        {errors.registration_limit && <p className="text-red-500 text-sm mt-1">{errors.registration_limit}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Registration Fee (₹)</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="0 for free event"
            min="0"
          />
        </div>
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-blue-900 mb-1">Event Creation Note</h4>
          <p className="text-sm text-blue-700">
            After creating the event, the system will automatically track registrations, ratings, and feedback from participants.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const EventCreationForm = () => {
  const titleRef = useRef(null);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    college_name: '',
    custom_college_name: '',
    image: null,
    title: '',
    description: '',
    category: '',
    location: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    registration_limit: '',
    price: ''
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const upColleges = [
    'Aligarh Muslim University (AMU), Aligarh',
    'Banaras Hindu University (BHU), Varanasi',
    'University of Allahabad, Prayagraj',
    'Lucknow University, Lucknow',
    'Jamia Millia Islamia, New Delhi',
    'Indian Institute of Technology (IIT) Kanpur',
    'Indian Institute of Technology (IIT) BHU Varanasi',
    'Indian Institute of Information Technology (IIIT) Allahabad',
    'Motilal Nehru National Institute of Technology (NIT) Allahabad',
    'Harcourt Butler Technical University (HBTU), Kanpur',
    'Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow',
    'Integral University, Lucknow',
    'Amity University, Lucknow',
    'Amity University, Noida',
    'Sharda University, Greater Noida',
    'Gautam Buddha University, Greater Noida',
    'Jaypee Institute of Information Technology (JIIT), Noida',
    'Bennett University, Greater Noida',
    'Galgotias University, Greater Noida',
    'GL Bajaj Institute of Technology and Management, Greater Noida',
    'KIET Group of Institutions, Ghaziabad',
    'Ajay Kumar Garg Engineering College (AKGEC), Ghaziabad',
    'JSS Academy of Technical Education, Noida',
    'Delhi Technical Campus, Greater Noida',
    'Institute of Engineering and Technology (IET), Lucknow',
    'Kamla Nehru Institute of Technology (KNIT), Sultanpur',
    'Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur',
    'Bundelkhand University, Jhansi',
    'Chhatrapati Shahu Ji Maharaj University, Kanpur',
    'Deen Dayal Upadhyaya Gorakhpur University, Gorakhpur',
    'Mahatma Jyotiba Phule Rohilkhand University, Bareilly',
    'Veer Bahadur Singh Purvanchal University, Jaunpur',
    'Invertis University, Bareilly',
    'Mangalayatan University, Aligarh',
    'Monad University, Hapur',
    'Pranveer Singh Institute of Technology (PSIT), Kanpur',
    'United College of Engineering and Research (UCER), Prayagraj',
    'Hindustan College of Science and Technology, Farah',
    'Raj Kumar Goel Institute of Technology, Ghaziabad',
    'IMS Engineering College, Ghaziabad',
    'Krishna Institute of Engineering and Technology, Ghaziabad',
    'Babu Banarasi Das University, Lucknow',
    'Era University, Lucknow',
    'Goel Institute of Technology and Management, Lucknow',
    'Institute of Technology and Science (ITS), Ghaziabad',
    'Azad Institute of Engineering and Technology, Lucknow',
    'Maharana Pratap Engineering College, Kanpur',
    'IIT Bombay',
    'Other'
  ];

  const eventCategories = [
    { id: 'hackathon', name: 'Hackathon', icon: Code, color: 'bg-blue-100 text-blue-600' },
    { id: 'cultural', name: 'Cultural', icon: Palette, color: 'bg-purple-100 text-purple-600' },
    { id: 'sports', name: 'Sports', icon: Trophy, color: 'bg-green-100 text-green-600' },
    { id: 'workshop', name: 'Workshop', icon: BookOpen, color: 'bg-orange-100 text-orange-600' },
    { id: 'seminar', name: 'Seminar', icon: Users, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'competition', name: 'Competition', icon: Trophy, color: 'bg-red-100 text-red-600' }
  ];

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Event details and category' },
    { number: 2, title: 'Schedule', description: 'Dates and timing' },
    { number: 3, title: 'Registration', description: 'Limits and pricing' }
  ];

  // Focus only once
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // FIX: keep select value stable on "Other"
  const handleCustomCollegeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      custom_college_name: value,
      college_name: prev.college_name === 'Other' ? 'Other' : prev.college_name
    }));
  };

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type || !file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please upload a valid image file.' }));
      setFormData(prev => ({ ...prev, image: null }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors(prev => ({ ...prev, image: 'Image must be 5MB or smaller.' }));
      setFormData(prev => ({ ...prev, image: null }));
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    setErrors(prev => {
      const next = { ...prev };
      delete next.image;
      return next;
    });
  };

  const handleFieldFocus = (fieldName) => {
    setErrors(prev => {
      if (prev[fieldName]) {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      }
      return prev;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Event description is required';
    if (!formData.category) newErrors.category = 'Event category is required';
    if (!formData.location.trim()) newErrors.location = 'Event location is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (!formData.start_time) newErrors.start_time = 'Start time is required';
    if (!formData.end_time) newErrors.end_time = 'End time is required';
    if (!formData.registration_limit || formData.registration_limit <= 0) {
      newErrors.registration_limit = 'Registration limit must be greater than 0';
    }
    
    // Validate college name - if "Other" was selected, check if custom name is provided
    if (!formData.college_name || (formData.college_name === 'Other' && !formData.custom_college_name?.trim())) {
      newErrors.college_name = 'College name is required';
    }
    
    // Validate date logic
    const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
    const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
    
    if (startDateTime >= endDateTime) {
      newErrors.end_date = 'End date and time must be after start date and time';
    }
    
    if (startDateTime <= new Date()) {
      newErrors.start_date = 'Event cannot be scheduled in the past';
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare form data for submission
      const submitData = new FormData();
      
      // Add all form fields according to schema
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('category', formData.category);
      submitData.append('location', formData.location.trim());
      
      // Combine date and time for proper datetime format
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
      
      submitData.append('start_date', startDateTime.toISOString());
      submitData.append('end_date', endDateTime.toISOString());
      submitData.append('registration_limit', formData.registration_limit);
      submitData.append('price', formData.price || '0');
      
      // Add college info - use custom name if "Other" was selected and custom name provided
      const finalCollegeName = formData.college_name === 'Other' && formData.custom_college_name?.trim() 
        ? formData.custom_college_name.trim()
        : formData.college_name;
      submitData.append('college_name', finalCollegeName);
      
      // Add image if provided
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      // Submit to backend API
      const response = await fetch(`${API_BASE_URL}/events/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: submitData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }
      
      setSuccessMessage('Event created successfully!');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          college_name: '',
          custom_college_name: '',
          image: null,
          title: '',
          description: '',
          category: '',
          location: '',
          start_date: '',
          end_date: '',
          start_time: '',
          end_time: '',
          registration_limit: '',
          price: ''
        });
        setCurrentStep(1);
        setSuccessMessage('');
        
        // Navigate back to dashboard
        navigate('/admin/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ submit: error.message || 'Failed to create event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= step.number 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-600'}`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: 
        return (
          <BasicInfoStep 
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleCustomCollegeChange={handleCustomCollegeChange}
            handleFieldFocus={handleFieldFocus}
            handleImageUpload={handleImageUpload}
            upColleges={upColleges}
            eventCategories={eventCategories}
            titleRef={titleRef}
          />
        );
      case 2: 
        return (
          <ScheduleStep 
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleFieldFocus={handleFieldFocus}
          />
        );
      case 3: 
        return (
          <RegistrationStep 
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleFieldFocus={handleFieldFocus}
          />
        );
      default: 
        return (
          <BasicInfoStep 
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleCustomCollegeChange={handleCustomCollegeChange}
            handleFieldFocus={handleFieldFocus}
            handleImageUpload={handleImageUpload}
            upColleges={upColleges}
            eventCategories={eventCategories}
            titleRef={titleRef}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
            <p className="text-gray-600">Fill in the details based on your event schema</p>
          </div>
        </div>

        <StepIndicator />

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Step {currentStep}: {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>

          {renderCurrentStep()}

          <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </button>
            
            <div className="flex space-x-3">
              {currentStep === steps.length ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Event...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="w-5 h-5 mr-2" />
                      Create Event
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center"
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
          
          {/* Success Message */}
          {successMessage && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{successMessage}</span>
              </div>
            </div>
          )}
          
          {/* Error Messages */}
          {errors.submit && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{errors.submit}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};