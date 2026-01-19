import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "👋 Hi there! I'm your CampusEventHub AI assistant. I can help you with event registration, account management, and answer any questions about our platform. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    const responses = [];

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon')) {
      responses.push("Hello! 👋 Welcome to CampusEventHub! I'm here to help you make the most of our event platform. What can I assist you with today?");
      responses.push("You can ask me about:\n• Event registration and browsing\n• Account login and management\n• Creating and managing events\n• Payment and ticket information\n• Admin features and analytics");
    }

    // Registration related queries
    else if (message.includes('register') || message.includes('sign up') || message.includes('join event')) {
      if (message.includes('how') || message.includes('steps')) {
        responses.push("🎯 **Event Registration Guide:**\n\n1. **Log in** to your CampusEventHub account\n2. **Browse Events** from the dashboard or search\n3. **Click 'Register Now'** on your chosen event\n4. **Fill out** the registration form\n5. **Complete payment** (if it's a paid event)\n6. **Download your ticket** from 'My Registrations'\n\n💡 Pro tip: Check event capacity before registering!");
      } else if (message.includes('paid') || message.includes('free')) {
        responses.push("📝 **Registration Types:**\n\n• **Free Events**: Just fill out the form and you're registered!\n• **Paid Events**: Choose between QR code payment (UPI) or card payment\n\nBoth types give you access to tickets, event updates, and feedback submission.");
      } else {
        responses.push("🎫 To register for an event, simply log in to your account, browse available events, and click 'Register Now' on any event that interests you. I'll guide you through the payment process if needed!");
      }
    }

    // Login/Account related queries
    else if (message.includes('login') || message.includes('sign in') || message.includes('account')) {
      if (message.includes('forgot') || message.includes('password')) {
        responses.push("🔐 **Forgot Password?**\n\nDon't worry! Click 'Forgot Password' on the login page, enter your email, and we'll send you a reset link. Make sure to check your spam folder too!\n\nIf you're still having trouble, contact our support team.");
      } else if (message.includes('create') || message.includes('new account')) {
        responses.push("📋 **Creating a New Account:**\n\n1. Click 'Register' on the homepage\n2. Choose your role (Student or College Admin)\n3. Fill in your details and college information\n4. Verify your email\n5. Start exploring events!\n\nCollege admins need approval before they can create events.");
      } else {
        responses.push("🔑 **Login Process:**\n\n• Go to the login page\n• Enter your registered email and password\n• Click 'Sign In'\n• You'll be redirected to your personalized dashboard\n\nNew here? Click 'Register' to create your account!");
      }
    }

    // Event creation/management queries
    else if (message.includes('create event') || message.includes('organize') || message.includes('manage event')) {
      if (message.includes('admin') || message.includes('college')) {
        responses.push("👨‍💼 **For College Admins:**\n\nTo create events, you need to be a verified college admin. Here's how:\n\n1. **Register** as a College Admin\n2. **Wait for approval** from a Super Admin\n3. **Log in** once approved\n4. **Click 'Create Event'** in your dashboard\n5. **Fill in** all event details\n6. **Set pricing** and capacity\n7. **Upload images** and add tags\n\nYour events will be visible to all students once created!");
      } else {
        responses.push("🎪 **Event Creation:**\n\nOnly approved college administrators can create events. If you're a college admin:\n\n• Make sure your account is approved\n• Go to your admin dashboard\n• Click 'Create Event'\n• Fill in comprehensive event details\n• Set dates, capacity, and pricing\n\nStudents can only register for existing events.");
      }
    }

    // Payment related queries
    else if (message.includes('payment') || message.includes('pay') || message.includes('money') || message.includes('fee')) {
      if (message.includes('qr') || message.includes('upi')) {
        responses.push("📱 **QR Code Payment:**\n\nPerfect for Indian users! Here's how:\n\n1. Choose 'QR Code Payment' during registration\n2. Open any UPI app (Google Pay, PhonePe, Paytm, etc.)\n3. Scan the QR code displayed\n4. Complete the payment\n5. Click 'I've Completed Payment'\n6. Your registration will be confirmed\n\n⚡ Fast, secure, and no extra fees!");
      } else if (message.includes('card') || message.includes('stripe')) {
        responses.push("💳 **Card Payment:**\n\nFor international payments or card preferences:\n\n• Choose 'Card Payment' during registration\n• You'll be redirected to Stripe's secure checkout\n• Enter your card details\n• Complete the transaction\n• Automatic confirmation\n\n🔒 Your payment information is fully encrypted and secure.");
      } else {
        responses.push("💰 **Payment Options:**\n\nCampusEventHub offers two secure payment methods:\n\n**🏦 QR Code (UPI):** Perfect for Indian users - scan and pay instantly\n**💳 Card Payment:** International cards accepted via Stripe\n\nBoth methods are equally secure. Choose what works best for you!");
      }
    }

    // Ticket related queries
    else if (message.includes('ticket') || message.includes('download') || message.includes('certificate')) {
      responses.push("🎫 **Ticket Management:**\n\nAfter successful registration:\n\n1. **Go to 'My Registrations'** in your dashboard\n2. **Find your event** in the list\n3. **Click 'Download Ticket'**\n4. **Save the PDF** for event day\n\nYour ticket includes:\n• Event details and timing\n• Your registration number\n• Venue information\n• QR code for entry\n\n💡 Keep your ticket handy for event check-in!");
    }

    // Feedback/Review queries
    else if (message.includes('feedback') || message.includes('review') || message.includes('rating')) {
      responses.push("⭐ **Event Feedback:**\n\nYour feedback helps improve future events!\n\n**How to leave feedback:**\n1. Attend the event\n2. Go to the event page\n3. Click 'Leave Feedback'\n4. Rate the event (1-5 stars)\n5. Write your review\n\n**Why it matters:**\n• Helps other students choose events\n• Improves event quality\n• Recognizes great organizers\n\nThank you for helping our community grow! 🙏");
    }

    // Admin related queries
    else if (message.includes('admin') || message.includes('manage') || message.includes('super admin')) {
      if (message.includes('become') || message.includes('how to')) {
        responses.push("👨‍💼 **Becoming a College Admin:**\n\n1. **Register** as a College Admin\n2. **Provide** your college details\n3. **Wait for approval** from Super Admin\n4. **Receive confirmation** email\n5. **Start creating events!**\n\n**Admin Benefits:**\n• Create and manage events\n• View registration analytics\n• Manage student registrations\n• Access detailed reports");
      } else {
        responses.push("🏢 **Admin Roles:**\n\n**College Admin:**\n• Create and manage events for their college\n• Approve student registrations\n• View analytics and reports\n• Manage event settings\n\n**Super Admin:**\n• All college admin privileges\n• Approve new college admins\n• System-wide analytics\n• Platform management\n\nBoth roles help make CampusEventHub amazing for everyone!");
      }
    }

    // Search/Browse queries
    else if (message.includes('search') || message.includes('find') || message.includes('browse')) {
      responses.push("🔍 **Finding Events:**\n\n**Browse Options:**\n• **All Events**: See everything available\n• **Filter by Category**: Technical, Cultural, Sports, etc.\n• **Filter by Date**: Upcoming events\n• **Search by Name**: Use the search bar\n\n**Pro Tips:**\n• Check event ratings and reviews\n• Look at participant capacity\n• Note registration deadlines\n• Save interesting events for later\n\nWhat type of event are you looking for?");
    }

    // Help/Support queries
    else if (message.includes('help') || message.includes('support') || message.includes('problem') || message.includes('issue')) {
      responses.push("🆘 **How Can I Help You?**\n\nI'm here 24/7 to assist with:\n\n**🔐 Account Issues:** Login, registration, password reset\n**🎪 Event Management:** Creating, registering, managing events\n**💳 Payments:** QR codes, cards, refunds, issues\n**🎫 Tickets:** Downloads, entry, verification\n**👨‍💼 Admin Help:** Dashboard, analytics, approvals\n**📱 Technical:** App features, troubleshooting\n\n**Quick Actions:**\n• Try refreshing the page\n• Clear browser cache\n• Check your internet connection\n• Contact support for complex issues\n\nWhat's the specific problem you're facing?");
    }

    // Event categories
    else if (message.includes('technical') || message.includes('hackathon') || message.includes('coding')) {
      responses.push("💻 **Technical Events:**\n\nPopular categories include:\n• **Hackathons**: 24-48 hour coding challenges\n• **Workshops**: Hands-on tech learning\n• **Seminars**: Industry expert talks\n• **Competitions**: Coding contests, CTFs\n\n**Why join technical events?**\n• Build your portfolio\n• Network with tech professionals\n• Learn new technologies\n• Win prizes and certificates\n\nLooking for something specific?");
    }

    else if (message.includes('cultural') || message.includes('arts') || message.includes('music') || message.includes('dance')) {
      responses.push("🎭 **Cultural Events:**\n\nExperience the vibrant side of campus life:\n• **Music Festivals**: Concerts and performances\n• **Dance Competitions**: Various dance forms\n• **Drama & Theater**: Plays and skits\n• **Art Exhibitions**: Paintings, photography\n• **Literary Events**: Poetry, debates, quizzes\n\n**Benefits:**\n• Showcase your talents\n• Discover new interests\n• Build confidence\n• Make lasting memories\n\nWhich cultural activity interests you most?");
    }

    else if (message.includes('sports') || message.includes('games') || message.includes('athletics')) {
      responses.push("⚽ **Sports Events:**\n\nStay active and competitive:\n• **Inter-college tournaments**\n• **Intramural leagues**\n• **Fitness challenges**\n• **Esports competitions**\n\n**Sports categories:**\n• Cricket, Football, Basketball\n• Badminton, Tennis, Table Tennis\n• Athletics, Swimming\n• Chess, Carrom, and more!\n\nGreat for fitness and team spirit! 💪");
    }

    // General conversation
    else if (message.includes('thank') || message.includes('thanks')) {
      responses.push("You're very welcome! 😊 I'm glad I could help. If you have any more questions about CampusEventHub, feel free to ask anytime. Happy event exploring!");
    }

    else if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      responses.push("Goodbye! 👋 Thanks for chatting with me. Remember, CampusEventHub is always here when you need event information. Have a great day!");
    }

    // Default response with suggestions
    else {
      const suggestions = [
        "Try asking about: 'How do I register for events?'",
        "Or ask: 'How do I create an event?'",
        "You can also ask about: 'Payment methods'",
        "Try: 'How do I download my ticket?'"
      ];

      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

      responses.push(`🤔 I want to help, but I'm not sure I understood that correctly. ${randomSuggestion}\n\nYou can also ask me about:\n• Event registration and browsing\n• Account login and management\n• Creating and managing events\n• Payment options and tickets\n• Admin features and support\n\nWhat would you like to know?`);
    }

    // Add contextual follow-ups for some responses
    if (message.includes('register') && !message.includes('how')) {
      responses.push("\n💡 **Need more help?** Ask me 'how to register' for step-by-step instructions, or 'paid events' for payment details!");
    }

    if (message.includes('payment') && !message.includes('qr') && !message.includes('card')) {
      responses.push("\n💡 **Payment Tips:** We accept both UPI (QR code) and international cards. Which payment method do you prefer?");
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = {
        text: input.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      // Simulate realistic typing delay based on response length
      const response = getBotResponse(input.trim());
      const typingDelay = Math.min(1000 + (response.length * 10), 3000); // 1-3 seconds

      setTimeout(() => {
        const botMessage = {
          text: response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, typingDelay);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      text: "👋 Hi there! I'm your CampusEventHub AI assistant. I can help you with event registration, account management, and answer any questions about our platform. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Open CampusEventHub Assistant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 max-w-[calc(100vw-2rem)] h-[32rem] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-modal-slide-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">CampusEventHub AI</h3>
                <p className="text-xs text-blue-100">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
                aria-label="Clear chat"
                title="Clear conversation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {/* Avatar */}
                  <div className={`flex items-end space-x-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.text}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>

                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about CampusEventHub..."
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                  rows="1"
                  style={{minHeight: '48px'}}
                  disabled={isTyping}
                />
                <div className="absolute right-3 bottom-3 text-gray-400 text-sm">
                  Press Enter to send
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {["How to register?", "Payment methods", "Create event", "Download ticket"].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion)}
                  disabled={isTyping}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;