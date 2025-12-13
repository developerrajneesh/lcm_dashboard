import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      const user = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");

      // Only check if both exist and are not null strings
      if (user && authToken && user !== "null" && authToken !== "null" && user.trim() !== "" && authToken.trim() !== "") {
        try {
          const userData = JSON.parse(user);
          if (userData.role === "admin") {
            setIsAuthenticated(true);
            setIsAdmin(true);
          } else {
            // User is authenticated but not an admin
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        } catch (parseError) {
          // If JSON parsing fails, clear invalid data
          console.error("Error parsing user data:", parseError);
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    // Redirect to login with the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;

