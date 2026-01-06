import SuccessBadge from "./SuccessBadge";

const AdminEventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="font-semibold text-lg">{event.title}</h2>
      <p className="text-sm text-gray-500">{event.category}</p>

      <div className="mt-3 space-y-1 text-sm">
        <p>⭐ Rating: {event.avgRating}/5</p>
        <p>👥 Attendance: {event.attendanceRate}%</p>
        <p>💬 Engagement: {event.engagementScore}</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="font-bold text-blue-600">
          {event.successScore}/100
        </span>
        <SuccessBadge score={event.successScore} />
      </div>
    </div>
  );
};

export default AdminEventCard;
