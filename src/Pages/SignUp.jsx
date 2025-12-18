import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiCamera, FiX, FiGift, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import "./SignUp.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    profileImage: null,
    referralCode: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setFormData((prev) => ({
        ...prev,
        referralCode: refCode.toUpperCase(),
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Convert to base64 for preview and upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

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

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
        setError("Please enter a valid phone number");
        return false;
      }
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
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          phoneNumber: formData.phoneNumber.trim() || undefined,
          profileImage: formData.profileImage || undefined,
          referralCode: formData.referralCode.trim().toUpperCase() || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! Redirecting...");
        // Store user data and redirect based on role
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
          localStorage.setItem("authToken", "authenticated");
          // Redirect based on role (should always be "user" for signup)
          const userRole = result.user?.role || "user";
          setTimeout(() => {
            if (userRole === "admin") {
              navigate("/admin");
            } else {
              navigate("/user");
            }
          }, 1000);
        }
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Left Side - Branding */}
      <div className="signup-left">
        <div className="signup-left-content">
          <div className="signup-logo">
            <img src="/LCMLOGO.png" alt="LCM Logo" className="logo-image" />
            <span className="logo-text">LCM</span>
          </div>
          <h1 className="signup-title">Join LCM Today!</h1>
          <p className="signup-subtitle">
            Create your account and start managing all your marketing campaigns from one powerful platform.
          </p>
          <div className="signup-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">✨</div>
              <div>
                <h3>Free Trial</h3>
                <p>14 days free, no credit card required</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🚀</div>
              <div>
                <h3>Quick Setup</h3>
                <p>Get started in less than 5 minutes</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💎</div>
              <div>
                <h3>All Features</h3>
                <p>Access to all marketing channels</p>
              </div>
            </div>
          </div>
        </div>
        <div className="signup-left-background">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="signup-right">
        <div className="signup-container">
          <div className="signup-header">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
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

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Profile Image Upload */}
            <div className="form-group profile-image-group">
              <label className="profile-image-label">
                <div className="profile-image-upload">
                  {previewImage ? (
                    <div className="profile-image-preview">
                      <img src={previewImage} alt="Profile preview" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={removeImage}
                        aria-label="Remove image"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className="profile-image-placeholder">
                      <FiCamera className="camera-icon" />
                      <span>Upload Photo</span>
                      <span className="hint">(Optional)</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="profile-image-input"
                  />
                </div>
              </label>
            </div>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">
                <FiUser className="input-icon" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="form-input"
              />
            </div>

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
                className="form-input"
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phoneNumber">
                <FiPhone className="input-icon" />
                Phone Number <span className="hint">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
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
                  placeholder="Enter your password (min 8 characters)"
                  required
                  minLength={8}
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

            {/* Referral Code */}
            <div className="form-group">
              <label htmlFor="referralCode">
                <FiGift className="input-icon" />
                Referral Code <span className="hint">(Optional)</span>
              </label>
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleInputChange}
                placeholder="Enter referral code if you have one"
                style={{ textTransform: "uppercase" }}
                className="form-input"
              />
              <small className="form-hint">
                Enter a referral code to help someone earn ₹50
              </small>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="button-icon" />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="signup-footer">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="login-link">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
