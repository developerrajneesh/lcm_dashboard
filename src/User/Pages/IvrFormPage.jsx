import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPhone, FiUser, FiMail, FiPhoneCall, FiBriefcase, FiMapPin, FiCheckCircle, FiClock, FiX } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const IvrFormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    emailId: "",
    userId: "",
    password: "",
    companyName: "",
    businessType: "",
    state: "",
  });
  const [user, setUser] = useState(null);

  // Check for existing IVR request on mount and when component is focused
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        checkExistingRequest(parsedUser.id);
      } catch (e) {
        console.error("Error parsing user data:", e);
        setCheckingStatus(false);
      }
    } else {
      setCheckingStatus(false);
    }
  }, []);

  // Re-check when user navigates back to this page
  useEffect(() => {
    const handleFocus = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.id) {
            checkExistingRequest(parsedUser.id);
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const checkExistingRequest = async (userId) => {
    try {
      setCheckingStatus(true);
      const response = await fetch(`${API_BASE_URL}/ivr-requests/my-requests`, {
        headers: {
          "user-id": userId,
        },
      });
      const result = await response.json();

      console.log("IVR Request Check Result:", result);

      if (result.success && result.data && result.data.length > 0) {
        // Get the most recent request
        const latestRequest = result.data[0];
        console.log("Found existing request:", latestRequest);
        setExistingRequest(latestRequest);
      } else {
        console.log("No existing IVR request found");
        setExistingRequest(null);
      }
    } catch (err) {
      console.error("Error checking existing request:", err);
      setExistingRequest(null);
    } finally {
      setCheckingStatus(false);
    }
  };

  const businessTypes = [
    "Individual",
    "Proprietorship",
    "Partnership",
    "Pvt Ltd",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check if user already has a pending or approved request (allow re-apply if rejected)
    if (existingRequest && existingRequest.status !== "rejected") {
      const errorMessage = existingRequest.status === "pending"
        ? "You have already submitted an IVR request. Please wait for admin approval."
        : "You already have an approved IVR account. Please use your existing credentials.";
      setError(errorMessage);
      setLoading(false);
      return;
    }

    // Validation
    if (!formData.fullName || !formData.mobileNumber || !formData.emailId || 
        !formData.userId || !formData.password || !formData.companyName || 
        !formData.state) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailId)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    try {
      // Get current user ID from localStorage
      const userData = localStorage.getItem("user");
      const currentUser = userData ? JSON.parse(userData) : null;

      const response = await fetch(`${API_BASE_URL}/ivr-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": currentUser?.id || "",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Immediately refresh existing request status to show pending screen
        if (user?.id) {
          await checkExistingRequest(user.id);
        }
        // Reset form
        setFormData({
          fullName: "",
          mobileNumber: "",
          emailId: "",
          userId: "",
          password: "",
          companyName: "",
          businessType: "",
          state: "",
        });
        setError("");
        setSuccess(false);
      } else {
        setError(result.error || result.message || "Failed to submit request");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error submitting IVR request:", err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking existing request
  if (checkingStatus) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking your application status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show pending status
  if (existingRequest?.status === "pending") {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiPhone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LCM – Voice Campaign</h1>
              <p className="text-gray-600 mt-1">Your IVR account application</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiClock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Pending</h2>
          <p className="text-gray-700 text-lg mb-4">
            Your application is pending. Please wait for admin approval.
          </p>
          <p className="text-sm text-gray-600">
            Submitted on: {new Date(existingRequest.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  }

  // Show approved status with credentials
  if (existingRequest?.status === "approved") {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiPhone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LCM – Voice Campaign</h1>
              <p className="text-gray-600 mt-1">Your IVR account is ready!</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Approved!</h2>
            <p className="text-gray-700 mb-6">
              Your IVR account has been approved. Use the credentials below to access the IVR platform.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Login Credentials</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={existingRequest.accountUserId || existingRequest.userId || ""}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={() => {
                      const userId = existingRequest.accountUserId || existingRequest.userId || "";
                      navigator.clipboard.writeText(userId);
                      alert("User ID copied to clipboard!");
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={existingRequest.accountPassword || existingRequest.password || ""}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={() => {
                      const password = existingRequest.accountPassword || existingRequest.password || "";
                      navigator.clipboard.writeText(password);
                      alert("Password copied to clipboard!");
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                window.location.href = "https://voice.whatsupninja.in/";
              }}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <FiPhone className="w-5 h-5" />
              Go to IVR
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show rejected status (only show if form is empty, otherwise show form for re-apply)
  if (existingRequest?.status === "rejected" && !formData.fullName) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiPhone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LCM – Voice Campaign</h1>
              <p className="text-gray-600 mt-1">Your IVR account application</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Rejected</h2>
            <p className="text-gray-700 text-lg mb-4">
              Your application has been rejected. Please review the admin notes below and re-apply if needed.
            </p>
          </div>

          {existingRequest.adminNotes && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-red-200">
              <p className="text-sm font-semibold text-gray-900 mb-2">Admin Notes:</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{existingRequest.adminNotes}</p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => {
                setExistingRequest(null);
                setFormData({
                  fullName: "",
                  mobileNumber: "",
                  emailId: "",
                  userId: "",
                  password: "",
                  companyName: "",
                  businessType: "",
                  state: "",
                });
                setError("");
              }}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <FiCheckCircle className="w-5 h-5" />
              Re-apply
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <FiPhone className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LCM – Voice Campaign</h1>
            <p className="text-gray-600 mt-1">Fill out the form to create your IVR account</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <FiCheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">
            Request submitted successfully! Your account will be verified by admin.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        {/* User Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FiUser className="w-5 h-5 text-indigo-600" />
            User Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                maxLength="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Account Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FiBriefcase className="w-5 h-5 text-indigo-600" />
            Account Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Create User ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Create Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="8"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Business Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FiBriefcase className="w-5 h-5 text-indigo-600" />
            Business Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type <span className="text-gray-500">(Optional)</span>
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Business Type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <FiCheckCircle className="w-5 h-5" />
                Create Account & Submit for Verification
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/user/marketing")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default IvrFormPage;

