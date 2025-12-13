import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const isChatRoute = location.pathname.includes("/chat-support");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
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
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} />
        {/* Main Content Area */}
        <main className={`flex-1 bg-gray-50 ${isChatRoute ? "overflow-hidden" : "overflow-y-auto p-6"}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
