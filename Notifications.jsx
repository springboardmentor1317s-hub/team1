import React, { useEffect, useState, useRef } from 'react';
import { Bell, X, Check, MessageCircle, Shield, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [flashId, setFlashId] = useState(null);
  const ref = useRef(null);

  // 🔊 sound
  const soundRef = useRef(null);

  useEffect(() => {
    soundRef.current = new Audio('/sounds/notify.mp3');
  }, []);

  // ✅ SAME FUNCTION NAME — JUST SAFETY ADDED
  const loadNotifications = async (playSound = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();

      // ✅ SAFETY FIX (THIS WAS MISSING)
      const newNotifications = Array.isArray(data?.data?.notifications)
        ? data.data.notifications
        : [];

      // 🔔 play sound only if new notification arrived
      if (playSound && newNotifications.length > notifications.length) {
        try {
          soundRef.current?.play();
        } catch {}

        setShake(true);
        setTimeout(() => setShake(false), 700);

        const newest = newNotifications[0]?._id;
        setFlashId(newest);
        setTimeout(() => setFlashId(null), 2000);
      }

      setNotifications(newNotifications);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  };

  // initial load
  useEffect(() => {
    if (currentUser?.id) loadNotifications(false);
  }, [currentUser]);

  // outside click close
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // 🔁 FIXED INTERVAL (NO CRASH)
  useEffect(() => {
    const interval = setInterval(() => loadNotifications(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error('Failed to mark notification read', e);
    }
  };

  const clearAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;
      setNotifications([]);
    } catch (e) {
      console.error('Failed to clear notifications', e);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-1 ${shake ? 'notify-shake' : ''}`}
      >
        <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b flex justify-between">
            <strong>Notifications</strong>
            {notifications.length > 0 && (
              <button onClick={clearAll} className="text-red-500 text-sm">
                Clear
              </button>
            )}
          </div>

          {notifications.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No notifications
            </div>
          )}

          {notifications.map(n => (
            <div
              key={n._id}
              className={`p-3 border-b ${!n.read ? 'bg-blue-50' : ''}`}
            >
              <p className="text-sm">{n.message}</p>
              {!n.read && (
                <button
                  onClick={() => markRead(n._id)}
                  className="text-xs text-blue-600"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
