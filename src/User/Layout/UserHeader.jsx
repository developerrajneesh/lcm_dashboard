import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiBell, FiUser } from "react-icons/fi";

const UserHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <FiMenu className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex items-center gap-4 ml-auto">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <FiBell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                onClick={() => navigate("/user/settings")}
              />
            ) : (
              <div
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => navigate("/user/settings")}
              >
                <FiUser className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="hidden md:block cursor-pointer" onClick={() => navigate("/user/settings")}>
              <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;

