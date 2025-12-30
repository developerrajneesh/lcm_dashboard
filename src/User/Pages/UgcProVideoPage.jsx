import React, { useState, useEffect } from "react";
import { FiVideo, FiPlus, FiClock, FiCheckCircle, FiXCircle, FiLoader, FiX } from "react-icons/fi";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const UgcProVideoPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    whatsappNumber: "",
    email: "",
    numberOfVideos: "",
    languagePreference: "English",
    companyBrandName: "",
    additionalRequirements: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const authToken = localStorage.getItem("authToken");

      if (!user || !authToken) {
        setLoading(false);
        return;
      }

      const userId = user.id || user._id;
      const response = await axios.get(`${API_BASE_URL}/ugc-requests/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "user-id": userId,
        },
      });

      if (response.data.success) {
        setRequests(response.data.data || []);
      } else {
        console.error("Failed to fetch requests:", response.data);
      }
    } catch (error) {
      console.error("Error fetching UGC requests:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone Number is required";
    }

    if (!formData.whatsappNumber.trim()) {
      errors.whatsappNumber = "WhatsApp Number is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.numberOfVideos || formData.numberOfVideos <= 0) {
      errors.numberOfVideos = "Number of Videos is required and must be greater than 0";
    }

    if (!formData.languagePreference) {
      errors.languagePreference = "Language Preference is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const authToken = localStorage.getItem("authToken");

      const userId = JSON.parse(localStorage.getItem("user")).id || JSON.parse(localStorage.getItem("user"))._id;
      const response = await axios.post(
        `${API_BASE_URL}/ugc-requests`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "user-id": userId,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Thank you! Your details are received. Our UGC expert will contact you shortly.");
        setFormData({
          fullName: "",
          phoneNumber: "",
          whatsappNumber: "",
          email: "",
          numberOfVideos: "",
          languagePreference: "English",
          companyBrandName: "",
          additionalRequirements: "",
        });
        setShowForm(false);
        // Refresh the requests list
        await fetchRequests();
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        alert(response.data.message || "Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting UGC request:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(error.response.data.message || "Failed to submit request. Please try again.");
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: FiClock, text: "Pending" },
      in_progress: { color: "bg-blue-100 text-blue-800", icon: FiLoader, text: "In Progress" },
      completed: { color: "bg-green-100 text-green-800", icon: FiCheckCircle, text: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", icon: FiXCircle, text: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">UGC Pro Video Editing – Requirements Form</h1>
                <p className="text-gray-600 mt-2">Share your UGC video requirements. Our team will contact you shortly.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Primary contact number"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="If same as phone number, type 'Same'"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.whatsappNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.whatsappNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.whatsappNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your active email address"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Videos Needed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfVideos"
                    value={formData.numberOfVideos}
                    onChange={handleInputChange}
                    placeholder="Example: 1, 3, 5, 10..."
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.numberOfVideos ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.numberOfVideos && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.numberOfVideos}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language Preference <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="languagePreference"
                    value={formData.languagePreference}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.languagePreference ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                  {formErrors.languagePreference && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.languagePreference}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  name="companyBrandName"
                  value={formData.companyBrandName}
                  onChange={handleInputChange}
                  placeholder="Enter your company/brand name (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleInputChange}
                  placeholder="Share any specific instructions or expectations"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Requirements"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">UGC Pro Video</h1>
          <p className="text-gray-600 mt-1">Professional UGC video editing services</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Request for Video
        </button>
      </div>

      {/* Previous Requests */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Requests</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <FiVideo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No requests yet</p>
            <p className="text-sm text-gray-400">Click "Request for Video" to submit your first request</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiVideo className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{request.numberOfVideos} Video(s)</span>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Language:</span> {request.languagePreference}</p>
                  <p><span className="font-medium">Submitted:</span> {formatDate(request.createdAt)}</p>
                  {request.companyBrandName && (
                    <p><span className="font-medium">Brand:</span> {request.companyBrandName}</p>
                  )}
                </div>
                {request.adminNotes && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                    <span className="font-medium">Admin Note:</span> {request.adminNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UgcProVideoPage;

