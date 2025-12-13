import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiFacebook, 
  FiTrendingUp, 
  FiImage, 
  FiArrowRight, 
  FiMessageCircle, 
  FiCreditCard,
  FiPhone,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalCreatives: 0,
    totalChats: 0,
    ivrStatus: null,
    subscriptionStatus: "Free",
  });
  const [recentCreatives, setRecentCreatives] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get user from localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Fetch all data in parallel
        await Promise.all([
          fetchCreativesCount(parsedUser.id),
          fetchChatConversations(parsedUser.id),
          fetchIvrStatus(parsedUser.id),
          fetchRecentCreatives(parsedUser.id),
        ]);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreativesCount = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/image-texts`, {
        headers: {
          "user-id": userId,
        },
      });
      const result = await response.json();
      
      if (result.success) {
        setStats((prev) => ({
          ...prev,
          totalCreatives: result.count || result.data?.length || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching creatives count:", error);
    }
  };

  const fetchChatConversations = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: {
          "user-id": userId,
        },
      });
      const result = await response.json();
      
      if (result.success) {
        setStats((prev) => ({
          ...prev,
          totalChats: result.data?.length || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching chat conversations:", error);
    }
  };

  const fetchIvrStatus = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ivr-requests/my-requests`, {
        headers: {
          "user-id": userId,
        },
      });
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const latestRequest = result.data[0];
        setStats((prev) => ({
          ...prev,
          ivrStatus: latestRequest.status,
        }));
      }
    } catch (error) {
      console.error("Error fetching IVR status:", error);
    }
  };

  const fetchRecentCreatives = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/image-texts`, {
        headers: {
          "user-id": userId,
        },
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        // Get recent 3 creatives
        const recent = result.data.slice(0, 3);
        setRecentCreatives(recent);
      }
    } catch (error) {
      console.error("Error fetching recent creatives:", error);
    }
  };

  const getIvrStatusBadge = () => {
    if (!stats.ivrStatus) return null;
    
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: FiClock, text: "Pending" },
      approved: { color: "bg-green-100 text-green-800", icon: FiCheckCircle, text: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", icon: FiXCircle, text: "Rejected" },
    };
    
    const config = statusConfig[stats.ivrStatus];
    if (!config) return null;
    
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-gray-600 mt-1">Here's your overview and quick access to everything you need.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Creatives</p>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiImage className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">{stats.totalCreatives}</p>
          <p className="text-xs text-gray-500 mt-1">Creative workshops created</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Chat Conversations</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiMessageCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalChats}</p>
          <p className="text-xs text-gray-500 mt-1">Active support chats</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">IVR Status</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiPhone className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            {stats.ivrStatus ? (
              getIvrStatusBadge()
            ) : (
              <p className="text-sm text-gray-500">Not applied</p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Voice campaign status</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Subscription</p>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FiCreditCard className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-lg font-bold text-indigo-600">{stats.subscriptionStatus}</p>
          <p className="text-xs text-gray-500 mt-1">Current plan</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/user/marketing"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <FiFacebook className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Meta Ads</h3>
            <p className="text-sm text-gray-600 mb-4">Create and manage your Meta advertising campaigns</p>
            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
              <span>Get Started</span>
              <FiArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            to="/user/marketing"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing</h3>
            <p className="text-sm text-gray-600 mb-4">Explore different marketing channels and options</p>
            <div className="flex items-center text-green-600 font-medium text-sm group-hover:gap-2 transition-all">
              <span>Explore</span>
              <FiArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            to="/user/creative-workshop"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <FiImage className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Creative Workshop</h3>
            <p className="text-sm text-gray-600 mb-4">Design and create stunning ad creatives</p>
            <div className="flex items-center text-purple-600 font-medium text-sm group-hover:gap-2 transition-all">
              <span>Create</span>
              <FiArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Creatives */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Creatives</h2>
          <Link
            to="/user/creative-workshop"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All
          </Link>
        </div>
        {recentCreatives.length === 0 ? (
          <div className="text-center py-8">
            <FiImage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No creatives yet</p>
            <Link
              to="/user/creative-workshop"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 inline-block"
            >
              Create your first creative →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentCreatives.map((creative) => (
              <Link
                key={creative.id || creative._id}
                to={`/user/creative-workshop/${creative.id || creative._id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {creative.thumbnail ? (
                    <img
                      src={creative.thumbnail}
                      alt="Creative"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{ display: creative.thumbnail ? "none" : "flex" }}>
                    <FiImage className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                    Creative Workshop
                  </p>
                  <p className="text-xs text-gray-500">
                    {creative.imageCount || 0} images • {formatTime(creative.createdAt)}
                  </p>
                  {creative.category && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded">
                      {creative.category.name}
                    </span>
                  )}
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
