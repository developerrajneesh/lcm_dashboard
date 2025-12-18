import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiImage,
  FiTrendingUp,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSettings,
  FiBarChart2,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import "./AdminDashboard.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreatives: 0,
    newUsersThisMonth: 0,
    newCreativesThisMonth: 0,
    usersGrowth: 0,
    creativesGrowth: 0,
  });
  const [recentCreatives, setRecentCreatives] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch creatives
      const creativesResponse = await fetch(`${API_BASE_URL}/image-texts`);
      const creativesData = await creativesResponse.json();

      if (creativesData.success) {
        const creatives = creativesData.data || [];
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const newCreativesThisMonth = creatives.filter(
          (c) => new Date(c.createdAt) >= startOfMonth
        ).length;

        const newCreativesLastMonth = creatives.filter(
          (c) =>
            new Date(c.createdAt) >= startOfLastMonth &&
            new Date(c.createdAt) < startOfMonth
        ).length;

        const creativesGrowth =
          newCreativesLastMonth > 0
            ? ((newCreativesThisMonth - newCreativesLastMonth) / newCreativesLastMonth) * 100
            : newCreativesThisMonth > 0
            ? 100
            : 0;

        // Get recent creatives (last 5)
        const recent = creatives
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentCreatives(recent);
        setStats((prev) => ({
          ...prev,
          totalCreatives: creatives.length,
          newCreativesThisMonth: newCreativesThisMonth,
          creativesGrowth: creativesGrowth,
        }));
      }

      // Fetch users
      const usersResponse = await fetch(`${API_BASE_URL}/user/all`);
      const usersData = await usersResponse.json();

      if (usersData.success) {
        const users = usersData.data || [];
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const newUsersThisMonth = users.filter(
          (u) => new Date(u.createdAt) >= startOfMonth
        ).length;

        const newUsersLastMonth = users.filter(
          (u) =>
            new Date(u.createdAt) >= startOfLastMonth &&
            new Date(u.createdAt) < startOfMonth
        ).length;

        const usersGrowth =
          newUsersLastMonth > 0
            ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
            : newUsersThisMonth > 0
            ? 100
            : 0;

        // Get recent users (last 5)
        const recent = users
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentUsers(recent);
        setStats((prev) => ({
          ...prev,
          totalUsers: users.length,
          newUsersThisMonth: newUsersThisMonth,
          usersGrowth: usersGrowth,
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Create New Creative",
      description: "Add a new image-text creative",
      icon: FiPlus,
      color: "bg-blue-500",
      onClick: () => navigate("/admin/image-text-editor"),
    },
    {
      title: "Manage Creatives",
      description: "View and edit all creatives",
      icon: FiEdit,
      color: "bg-green-500",
      onClick: () => navigate("/admin/creative-management"),
    },
    {
      title: "Manage Users",
      description: "View and manage users",
      icon: FiUsers,
      color: "bg-purple-500",
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Settings",
      description: "Configure system settings",
      icon: FiSettings,
      color: "bg-gray-500",
      onClick: () => navigate("/admin/settings"),
    },
  ];

  const StatCard = ({ title, value, growth, icon: Icon, color }) => (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="stat-growth">
          {growth !== undefined && (
            <span className={growth >= 0 ? "text-green-600" : "text-red-600"}>
              {growth >= 0 ? <FiArrowUp className="inline" /> : <FiArrowDown className="inline" />}
              {Math.abs(growth).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="dashboard-date">
          <FiCalendar className="inline mr-2" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          growth={stats.usersGrowth}
          icon={FiUsers}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Creatives"
          value={stats.totalCreatives}
          growth={stats.creativesGrowth}
          icon={FiImage}
          color="bg-green-500"
        />
        <StatCard
          title="New Users This Month"
          value={stats.newUsersThisMonth}
          icon={FiTrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          title="New Creatives This Month"
          value={stats.newCreativesThisMonth}
          icon={FiBarChart2}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="quick-action-card"
              >
                <div className={`quick-action-icon ${action.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="quick-action-content">
                  <h3 className="quick-action-title">{action.title}</h3>
                  <p className="quick-action-description">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section-grid">
        {/* Recent Creatives */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Creatives</h2>
            <button
              onClick={() => navigate("/admin/creative-management")}
              className="view-all-btn"
            >
              View All
            </button>
          </div>
          <div className="recent-list">
            {recentCreatives.length > 0 ? (
              recentCreatives.map((creative) => (
                <div key={creative.id} className="recent-item">
                  <div className="recent-item-image">
                    {creative.thumbnail ? (
                      <img
                        src={creative.thumbnail}
                        alt="Creative thumbnail"
                        className="thumbnail-img"
                      />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <FiImage className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="recent-item-content">
                    <p className="recent-item-title">
                      Creative #{creative.id.slice(-6)}
                    </p>
                    <p className="recent-item-meta">
                      {creative.imageCount} image{creative.imageCount !== 1 ? "s" : ""} •{" "}
                      {new Date(creative.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/image-text-editor/${creative.id}`)}
                    className="recent-item-action"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FiImage className="w-12 h-12 text-gray-400 mb-4" />
                <p className="empty-state-text">No creatives yet</p>
                <button
                  onClick={() => navigate("/admin/image-text-editor")}
                  className="empty-state-btn"
                >
                  Create Your First Creative
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Users</h2>
            <button
              onClick={() => navigate("/admin/users")}
              className="view-all-btn"
            >
              View All
            </button>
          </div>
          <div className="recent-list">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="recent-item">
                  <div className="recent-item-avatar">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="avatar-img"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="recent-item-content">
                    <p className="recent-item-title">{user.name}</p>
                    <p className="recent-item-meta">{user.email}</p>
                  </div>
                  <span className="recent-item-badge">
                    {user.role || "user"}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FiUsers className="w-12 h-12 text-gray-400 mb-4" />
                <p className="empty-state-text">No users yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
