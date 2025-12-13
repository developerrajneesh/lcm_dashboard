import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
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
          // Only allow users with role "user" to access user routes
          if (userData.role === "user") {
            setIsAuthenticated(true);
          } else {
            // If admin tries to access user routes, redirect to admin
            setIsAuthenticated(false);
          }
        } catch (parseError) {
          // If JSON parsing fails, clear invalid data
          console.error("Error parsing user data:", parseError);
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
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

  if (!isAuthenticated) {
    // Redirect to login with the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

