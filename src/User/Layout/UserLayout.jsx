import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";

const UserLayout = ({ children }) => {
  const location = useLocation();
  const isChatRoute = location.pathname.includes("/chat-support");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className="flex h-screen bg-gray-50"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Sidebar */}
      <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader toggleSidebar={toggleSidebar} />
        {/* Main Content Area */}
        <main className={`flex-1 bg-gray-50 ${isChatRoute ? "overflow-hidden" : "overflow-y-auto p-6"}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
