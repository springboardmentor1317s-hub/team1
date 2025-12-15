import React from "react";

const ProfilePage = ({ currentUser, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-3xl mx-auto">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
        <button
          onClick={onBack}
          className="text-blue-600 text-sm hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <input
          defaultValue={currentUser?.name || ""}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        <input
          defaultValue={currentUser?.email || ""}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          defaultValue={currentUser?.college || ""}
          placeholder="College"
          className="w-full border p-2 rounded"
        />
        <input
          defaultValue={currentUser?.phone || ""}
          placeholder="Phone"
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
