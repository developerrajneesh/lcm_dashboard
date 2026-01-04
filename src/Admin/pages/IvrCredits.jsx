import React, { useState, useEffect } from "react";
import { FiCreditCard, FiUser, FiDollarSign, FiCalendar, FiCheckCircle } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const IvrCredits = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    if (!user?.id) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/ivr-credits`, {
        headers: {
          "user-id": user.id,
        },
      });
      const result = await response.json();

      if (result.success) {
        setPurchases(result.data || []);
      } else {
        setError(result.error || "Failed to fetch IVR credits purchases");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading && purchases.length === 0) {
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
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FiCreditCard className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">IVR Credits Purchases</h1>
              <p className="text-gray-600 mt-1">View all IVR credits purchase transactions</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
            Error: {error}
          </div>
        )}

        {/* Purchases Table */}
        {purchases.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FiCreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No IVR credits purchases found</p>
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
                      IVR Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price per Credit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <tr key={purchase._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {purchase.userId?.profileImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={purchase.userId.profileImage}
                                alt={purchase.userId.name || "User"}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold">
                                  {(purchase.userId?.name || "U")[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {purchase.userId?.name || "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {purchase.userId?.email || "N/A"}
                            </div>
                            {purchase.ivrRequestId?.accountUserId && (
                              <div className="text-xs text-gray-400 mt-1">
                                IVR ID: {purchase.ivrRequestId.accountUserId}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {purchase.ivrType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {purchase.credits.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{purchase.pricePerCredit.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(purchase.totalAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 font-mono">
                          {purchase.razorpayPaymentId ? (
                            <span className="text-xs">{purchase.razorpayPaymentId.slice(0, 20)}...</span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(purchase.paymentDate || purchase.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {purchases.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Purchases</p>
                  <p className="text-3xl font-bold text-gray-900">{purchases.length}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FiCreditCard className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Credits Sold</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {purchases.reduce((sum, p) => sum + p.credits, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiDollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(purchases.reduce((sum, p) => sum + p.totalAmount, 0))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IvrCredits;

