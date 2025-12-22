import React, { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  X,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

const StudentMyRegistrations = ({ registrations = [] }) => {
  const [page, setPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const PER_PAGE = 5;

  const paginatedRegistrations = useMemo(() => {
    return registrations.slice(0, page * PER_PAGE);
  }, [registrations, page]);

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedEvent(null);
  };

  const getStatusIcon = (status) => {
    if (status === "approved")
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === "pending")
      return <Clock className="w-5 h-5 text-yellow-600" />;
    if (status === "rejected")
      return <XCircle className="w-5 h-5 text-red-600" />;
    return null;
  };

  // =================================================
  // ✅ COMMON DOWNLOAD FUNCTION (JWT SAFE)
  // =================================================
  const downloadFile = async (url, filename) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("File not available");
        return;
      }

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  return (
    <div className="space-y-6">
      {paginatedRegistrations.map((event) => (
        <div
          key={event.registrationId}
          className="rounded-xl bg-slate-100 p-6 shadow-md flex justify-between items-start"
        >
          {/* LEFT SIDE */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(event.registrationStatus)}
              <h3 className="text-xl font-semibold text-gray-900">
                {event.title}
              </h3>
            </div>

            <div className="text-sm text-gray-600 flex gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event.college}
              </span>
            </div>

            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.registrationStatus === "approved"
                    ? "bg-green-200 text-green-800"
                    : event.registrationStatus === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {event.registrationStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex gap-3">
            {event.registrationStatus === "approved" && (
              <>
                {/* TICKET DOWNLOAD */}
                <button
                  onClick={() =>
                    downloadFile(
                      `${API_BASE_URL}/tickets/${event.registrationId}`,
                      `ticket-${event.registrationId}.pdf`
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  Download Ticket
                </button>

                {/* ✅ CERTIFICATE DOWNLOAD (FIXED) */}
                <button
                  onClick={() =>
                    downloadFile(
                      `${API_BASE_URL}/certificates/${event.registrationId}`,
                      `certificate-${event.registrationId}.pdf`
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
              </>
            )}

            <button
              onClick={() => {
                setSelectedEvent(event);
                setShowDetails(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        </div>
      ))}

      {paginatedRegistrations.length < registrations.length && (
        <div className="text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}

      {/* DETAILS MODAL */}
      {showDetails && selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={closeDetails}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedEvent.title}
            </h2>

            <p className="text-gray-700 mb-2">
              <strong>Date:</strong>{" "}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>College:</strong> {selectedEvent.college}
            </p>
            <p className="text-gray-700 mt-4">
              {selectedEvent.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMyRegistrations;
