import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiImage,
  FiSettings,
  FiX,
  FiShield,
  FiTag,
  FiMessageCircle,
  FiPhone,
} from "react-icons/fi";

const AdminSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const menuItems = [
    { path: "/admin", icon: FiHome, label: "Dashboard" },
    { path: "/admin/users", icon: FiUsers, label: "Users" },
    { path: "/admin/image-text-editor", icon: FiImage, label: "Create Upload" },
    { path: "/admin/creative-management", icon: FiShield, label: "Creative Management" },
    { path: "/admin/category-management", icon: FiTag, label: "Category Management" },
    { path: "/admin/chat-support", icon: FiMessageCircle, label: "Chat Support" },
    { path: "/admin/ivr-requests", icon: FiPhone, label: "IVR Requests" },
    { path: "/admin/settings", icon: FiSettings, label: "Settings" },
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
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <img 
                src="/LCMLOGO.png" 
                alt="LCM Logo" 
                className="h-8 w-auto"
              />
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
                            ? "bg-indigo-50 text-indigo-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      onClick={() => {
                        if (window.innerWidth < 1024) {
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
              © 2024 Admin Panel
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
