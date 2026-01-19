import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const ProfileSettings = ({ currentUser, logout, token, onBack }) => {
    const { updateUserProfile } = useAuth();
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    
    // Password change fields
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('profile'); // 'profile' or 'password'

    const handleUpdateProfile = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to update profile');

            // Update context
            updateUserProfile({ name, email });

            setMessage('Profile updated successfully!');

            setTimeout(() => {
                setMessage(null);
            }, 3000);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all password fields');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    oldPassword, 
                    newPassword 
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to change password');

            setMessage('Password changed successfully!');
            
            // Clear password fields
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                setMessage(null);
            }, 3000);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-blue-600 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => {
                        setActiveSection('profile');
                        setError(null);
                        setMessage(null);
                    }}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                        activeSection === 'profile'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Profile Information
                </button>
                <button
                    onClick={() => {
                        setActiveSection('password');
                        setError(null);
                        setMessage(null);
                    }}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                        activeSection === 'password'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Lock className="w-4 h-4 inline mr-1" />
                    Change Password
                </button>
            </div>

            {/* Messages */}
            {message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 font-medium">{message}</p>
                </div>
            )}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {/* Profile Information Section */}
            {activeSection === 'profile' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 cursor-pointer hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </div>
            )}

            {/* Password Change Section */}
            {activeSection === 'password' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter new password (min. 8 characters)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                        <p className="font-medium mb-1">Password Requirements:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Minimum 8 characters long</li>
                            <li>Must match in both fields</li>
                        </ul>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleChangePassword}
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 cursor-pointer hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;
