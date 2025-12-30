import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiUser, FiLogOut } from "react-icons/fi";
import NotificationDropdown from "../../Components/NotificationDropdown";

const AdminHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <FiMenu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {user && (
            <NotificationDropdown
              userId={user.id || user._id}
              userRole="admin"
            />
          )}
          
          <div className="relative">
            <div
              className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || "admin@example.com"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/admin/settings");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiUser className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
