import React, { useState, useEffect, useRef } from "react";
import { FiBell, FiCheck, FiX, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { connectSocket, disconnectSocket, getSocket } from "../utils/socket";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const NotificationDropdown = ({ userId, userRole = "user" }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    fetchNotifications();
    fetchUnreadCount();

    // Connect to socket
    const socket = connectSocket(userId);

    // Listen for new notifications
    const handleNewNotification = (data) => {
      if (data.success && data.data) {
        setNotifications((prev) => [data.data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    };

    // Listen for unread count updates
    const handleUnreadCountUpdate = (data) => {
      if (data.success) {
        setUnreadCount(data.count || 0);
      }
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("unread_count_update", handleUnreadCountUpdate);

    // Cleanup
    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("unread_count_update", handleUnreadCountUpdate);
    };
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "user-id": userId,
        },
        params: {
          limit: 20,
        },
      });

      if (response.data.success) {
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId) return;

    try {
      const authToken = localStorage.getItem("authToken");

      const response = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "user-id": userId,
        },
      });

      if (response.data.success) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "user-id": userId,
          },
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `${API_BASE_URL}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "user-id": userId,
          },
        }
      );

      // Update local state (socket will also emit unread_count_update)
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      // Unread count will be updated via socket event
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    if (notification.link) {
      navigate(notification.link);
      setShowDropdown(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const getNotificationIcon = (type) => {
    const icons = {
      ugc_request_created: "📹",
      ugc_request_status_updated: "✅",
      payment_success: "💰",
      payment_failed: "❌",
      subscription_activated: "🎉",
      subscription_expired: "⚠️",
      referral_reward: "🎁",
      general: "🔔",
    };
    return icons[type] || "🔔";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) {
            fetchNotifications();
          }
        }}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
      >
        <FiBell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  !notification.isRead
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                        </div>
                        {notification.link && (
                          <FiChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    navigate(userRole === "admin" ? "/admin" : "/user");
                    setShowDropdown(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;

