import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw, FiCreditCard, FiVolume2, FiPlusCircle, FiFileText } from "react-icons/fi";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const PaymentHistoryPage = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ totalSpent: 0, thisMonthSpent: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const filters = [
    { id: "all", label: "All" },
    { id: "subscription", label: "Subscription" },
    { id: "campaign", label: "Campaign" },
    { id: "topup", label: "Top-up" },
  ];

  useEffect(() => {
    fetchPaymentHistory();
  }, [selectedFilter]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const authToken = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");

      if (!userData) {
        alert("Please login to view payment history");
        navigate("/login");
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.id || user._id;

      const config = {
        params: {
          userId: userId,
          filter: selectedFilter,
        },
      };

      if (authToken) {
        config.headers = {
          Authorization: `Bearer ${authToken}`,
        };
      }

      const response = await axios.get(`${API_BASE_URL}/subscription/payment-history`, config);

      if (response.data.success) {
        setPayments(response.data.data.payments || []);
        setSummary(response.data.data.summary || { totalSpent: 0, thisMonthSpent: 0 });
      } else {
        throw new Error(response.data.message || "Failed to fetch payment history");
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError(err.response?.data?.message || err.message || "Failed to load payment history");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPaymentHistory();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "subscription":
        return <FiCreditCard className="w-6 h-6" />;
      case "campaign":
        return <FiVolume2 className="w-6 h-6" />;
      case "topup":
        return <FiPlusCircle className="w-6 h-6" />;
      default:
        return <FiFileText className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "subscription":
        return "bg-amber-100 text-amber-600";
      case "campaign":
        return "bg-indigo-100 text-indigo-600";
      case "topup":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
                <p className="text-sm text-gray-600 mt-1">View all your payment transactions</p>
              </div>
            </div>
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-5 h-5 text-gray-700 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-3 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === filter.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600 mb-2">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">{formatAmount(summary.totalSpent)}</p>
            </div>
            <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
              <p className="text-sm text-gray-600 mb-2">This Month</p>
              <p className="text-3xl font-bold text-gray-900">{formatAmount(summary.thisMonthSpent)}</p>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Payments</h2>

          {loading && payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading payment history...</p>
            </div>
          ) : error && payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FiFileText className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button
                onClick={fetchPaymentHistory}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiFileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium mb-2">No payments found</p>
              <p className="text-gray-600 text-sm text-center">
                {selectedFilter === "all"
                  ? "You haven't made any payments yet"
                  : `No ${selectedFilter} payments found`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(payment.type)}`}>
                      {getTypeIcon(payment.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{payment.description}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{payment.date}</span>
                        <span>•</span>
                        <span>{payment.method}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold mb-2 ${
                        payment.status === "failed" ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {formatAmount(payment.amount)}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;

