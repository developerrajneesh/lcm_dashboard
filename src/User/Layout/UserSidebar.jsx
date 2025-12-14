import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiTrendingUp,
  FiImage,
  FiX,
  FiSettings,
  FiCreditCard,
  FiMessageCircle,
  FiFacebook,
  FiDollarSign,
  FiGift,
} from "react-icons/fi";

const UserSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const menuItems = [
    { path: "/user", icon: FiHome, label: "Dashboard" },
    { path: "/user/marketing", icon: FiTrendingUp, label: "Marketing" },
    { path: "/user/creative-workshop", icon: FiImage, label: "Creative Workshop" },
    { path: "/user/subscription", icon: FiCreditCard, label: "Subscription" },
    { path: "/user/wallet", icon: FiDollarSign, label: "Wallet" },
    { path: "/user/referral", icon: FiGift, label: "Referral" },
    { path: "/user/chat-support", icon: FiMessageCircle, label: "Chat Support" },
    { path: "/user/settings", icon: FiSettings, label: "Settings" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiFacebook className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LCM</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2024 LCM Dashboard
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;

