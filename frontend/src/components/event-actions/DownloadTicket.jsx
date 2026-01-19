import React, { useState } from 'react';
import { Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const DownloadTicketButton = ({ registrationId }) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDownloadTicket = async () => {
    try {
      setDownloading(true);
      setError(null);
      setSuccess(false);

      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to download your ticket');
        return;
      }

      // Make API request to download ticket
      const response = await fetch(`${API_BASE_URL}/tickets/${registrationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download ticket');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${registrationId}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('Error downloading ticket:', err);
      setError(err.message || 'Failed to download ticket. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full mt-4">
      <button
        onClick={handleDownloadTicket}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {downloading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Generating Ticket...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Downloaded Successfully!</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download Your Ticket</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-green-800 font-medium">Success!</p>
            <p className="text-sm text-green-600">Your ticket has been downloaded. Check your downloads folder.</p>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 mb-1">Ticket Information</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your ticket includes a QR code for event check-in</li>
              <li>• Present this ticket (digital or printed) at the event entrance</li>
              <li>• You can download your ticket multiple times if needed</li>
              <li>• Keep your registration ID safe for reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadTicketButton;

