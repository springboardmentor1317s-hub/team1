import React, { useState, useEffect } from 'react';
import { Heart, Github, Mail, Phone, MapPin, Moon, Sun } from 'lucide-react';

const Footer = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Section - Brand & Description */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Campus EventHub
              </h3>
            </div>
            <p className="text-gray-600 text-xs max-w-xs mx-auto md:mx-0">
              Connecting students across colleges through amazing events
            </p>
          </div>

          {/* Middle Section - Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-700">
            <a 
              href="mailto:support@campuseventhub.com"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              ashu9504saini@gmail.com
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a 
              href="tel:+15551234567"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              +91 6350395820
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Arya 
            </div>
          </div>

          {/* Right Section - Theme Toggle & Social Links */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white text-gray-600 rounded-lg flex items-center justify-center transition-all shadow-sm dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white text-gray-600 rounded-lg flex items-center justify-center transition-all shadow-sm"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="mailto:support@campuseventhub.com" 
              className="w-8 h-8 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white text-gray-600 rounded-lg flex items-center justify-center transition-all shadow-sm"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center space-x-1.5 text-gray-600 text-xs">
            <span>© 2025 Campus EventHub. Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" />
            <span>for students.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
