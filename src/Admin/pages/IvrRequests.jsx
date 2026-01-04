import React, { useState, useEffect } from "react";
import { FiPhone, FiCheckCircle, FiXCircle, FiClock, FiEye, FiFileText, FiX } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const IvrRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminNotes, setAdminNotes] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [statusFilter, user]);

  const fetchRequests = async () => {
    if (!user?.id) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const url = statusFilter === "all" 
        ? `${API_BASE_URL}/ivr-requests`
        : `${API_BASE_URL}/ivr-requests?status=${statusFilter}`;
      
      const response = await fetch(url, {
        headers: {
          "user-id": user.id,
        },
      });
      const result = await response.json();

      if (result.success) {
        setRequests(result.data || []);
      } else {
        setError(result.error || "Failed to fetch IVR requests");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    if (!user?.id) {
      alert("User not found. Please login again.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ivr-requests/${requestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-id": user.id,
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        fetchRequests();
        setSelectedRequest(null);
        setAdminNotes("");
        alert(`Request ${newStatus} successfully!`);
      } else {
        alert(result.error || "Failed to update request status");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: FiClock },
      approved: { color: "bg-green-100 text-green-800", icon: FiCheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: FiXCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiPhone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">IVR Requests</h1>
              <p className="text-gray-600 mt-1">Manage voice campaign account requests</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
            Error: {error}
          </div>
        )}

        {/* Requests Table */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FiPhone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No IVR requests found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IVR Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {request.userId?.profileImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={request.userId.profileImage}
                                alt={request.userId.name || request.fullName}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold">
                                  {(request.userId?.name || request.fullName)?.[0] || "U"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.fullName}
                            </div>
                            <div className="text-sm text-gray-500">{request.emailId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.companyName}</div>
                        {request.businessType && (
                          <div className="text-sm text-gray-500">{request.businessType}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {request.ivrType ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {request.ivrType}
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.accountUserId || (typeof request.userId === 'string' ? request.userId : 'N/A')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View/Update Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">IVR Request Details</h2>
                  <button
                    onClick={() => {
                      setSelectedRequest(null);
                      setAdminNotes("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.mobileNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Email ID</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.emailId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">User ID</label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{selectedRequest.accountUserId || (typeof selectedRequest.userId === 'string' ? selectedRequest.userId : 'N/A')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{selectedRequest.accountPassword || selectedRequest.password || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.companyName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Business Type</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedRequest.businessType || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.state}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">IVR Type</label>
                        <p className="mt-1">
                          {selectedRequest.ivrType ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                              {selectedRequest.ivrType}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">Not specified</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* GST Certificate */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">GST Certificate</h3>
                    <div>
                      {selectedRequest.gstCertificate && (
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedRequest.gstCertificate;
                            const userId = selectedRequest.accountUserId || (typeof selectedRequest.userId === 'string' ? selectedRequest.userId : selectedRequest._id);
                            link.download = `GST_Certificate_${userId}_${selectedRequest._id}.${selectedRequest.gstCertificate.split('.').pop().split('?')[0]}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          <FiFileText className="w-5 h-5" />
                          Download GST Certificate
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add notes about this request..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    {selectedRequest.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(selectedRequest._id, "approved")}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiCheckCircle className="w-5 h-5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedRequest._id, "rejected")}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiXCircle className="w-5 h-5" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedRequest(null);
                        setAdminNotes("");
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IvrRequests;

