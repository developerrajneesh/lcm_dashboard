import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import "./Login.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is already logged in
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");
      
      // Only redirect if both user and authToken exist and are valid
      if (user && authToken && user !== "null" && authToken !== "null") {
        try {
          const userData = JSON.parse(user);
          // Redirect based on role
          if (userData.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/user", { replace: true });
          }
        } catch (parseError) {
          // If JSON parsing fails, clear invalid data and stay on login page
          console.error("Error parsing user data:", parseError);
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      // Don't redirect on error, just stay on login page
    }
  }, [navigate]);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get email from location state (if coming from signup)
  useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.email,
      }));
      setSuccess(location.state.message || "Registration successful! Please login.");
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("authToken", result.token || "authenticated");

        setSuccess("Login successful! Redirecting...");
        
        // Redirect based on user role
        const userRole = result.user?.role || "user";
        let redirectPath = "/user";
        
        if (userRole === "admin") {
          redirectPath = "/admin";
        } else {
          // For users, check if they were trying to access a specific page
          redirectPath = location.state?.from?.pathname || "/user";
        }
        
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1000);
      } else {
        setError(result.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Branding */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo">
            <img src="/LCMLOGO.png" alt="LCM Logo" className="logo-image" />
            <span className="logo-text">LCM</span>
          </div>
          <h1 className="login-title">Welcome Back!</h1>
          <p className="login-subtitle">
            Sign in to access your marketing dashboard and manage all your campaigns in one place.
          </p>
          <div className="login-features">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <span>Meta Ads Management</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📞</div>
              <span>IVR Call Marketing</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <span>Multi-Channel Support</span>
            </div>
          </div>
        </div>
        <div className="login-left-background">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-container">
          <div className="login-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                <FiMail className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="form-input"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                <FiLock className="input-icon" />
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="form-footer">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="button-icon" />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="login-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="signup-link">
                  Sign Up Free
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
