import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiCamera, FiX } from "react-icons/fi";
import "./SignUp.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const SignUp = () => {
  const navigate = useNavigate();
  
  // Note: Signup page should always be accessible
  // If user is already logged in, they can still access signup (they might want to create another account)
  // The redirect after successful signup will handle navigation
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      <div className="signup-container">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Sign up to get started with LCM Dashboard</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
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
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="profile-image-placeholder">
                    <FiCamera className="camera-icon" />
                    <span>Upload Profile Image</span>
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
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phoneNumber">
              <FiPhone className="input-icon" />
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number (optional)"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              <FiLock className="input-icon" />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password (min 8 characters)"
              required
              minLength={8}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
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
  );
};

export default SignUp;

