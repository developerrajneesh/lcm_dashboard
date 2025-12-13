import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiTrendingUp, FiImage, FiArrowRight } from "react-icons/fi";

const UserDashboard = () => {
  const stats = [
    { label: "Active Campaigns", value: "12", color: "text-blue-600" },
    { label: "Total Spend", value: "$2,450", color: "text-green-600" },
    { label: "Impressions", value: "124K", color: "text-purple-600" },
    { label: "CTR", value: "3.2%", color: "text-orange-600" },
  ];

  const quickActions = [
    {
      title: "Meta Ads",
      description: "Create and manage your Meta advertising campaigns",
      icon: FiFacebook,
      link: "/user/meta-ads",
      color: "bg-blue-500",
    },
    {
      title: "Marketing",
      description: "Explore different marketing channels and options",
      icon: FiTrendingUp,
      link: "/user/marketing",
      color: "bg-green-500",
    },
    {
      title: "Creative Workshop",
      description: "Design and create stunning ad creatives",
      icon: FiImage,
      link: "/user/creative-workshop",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                  <span>Get Started</span>
                  <FiArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FiFacebook className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Campaign Created</p>
              <p className="text-xs text-gray-500">Summer Sale Campaign - 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Campaign Activated</p>
              <p className="text-xs text-gray-500">New Collection Campaign - 5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

