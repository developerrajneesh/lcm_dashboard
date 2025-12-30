import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiStar, FiZap, FiShield, FiTrendingUp, FiAward, FiClock, FiCalendar, FiCreditCard, FiArrowRight } from "react-icons/fi";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchActiveSubscription(parsedUser);
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const fetchActiveSubscription = async (userData) => {
    try {
      setLoadingSubscription(true);
      const authToken = localStorage.getItem("authToken");
      const userId = userData.id || userData._id;

      const config = {
        params: {
          userId: userId,
        },
      };

      if (authToken) {
        config.headers = {
          Authorization: `Bearer ${authToken}`,
        };
      }

      const response = await axios.get(`${API_BASE_URL}/subscription/active-subscription`, config);

      if (response.data.success) {
        setActiveSubscription(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching active subscription:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const plans = [
    {
      id: 1,
      name: "BASIC PLAN",
      regularPrice: 2000,
      earlyBirdPrice: 999,
      discount: 50,
      period: "month",
      features: [
        "Meta Ads",
        "WhatsApp Marketing",
        "Email Marketing",
        "Premium Festival Creatives",
        "Basic Customer Support",
      ],
      popular: false,
    },
    {
      id: 2,
      name: "PREMIUM PLAN",
      regularPrice: 5000,
      earlyBirdPrice: 2999,
      discount: 40,
      period: "month",
      features: [
        "Meta Ads",
        "WhatsApp Marketing",
        "Email Marketing",
        "SMS Marketing",
        "IVR Voice Campaign",
        "24x7 Priority Support",
        "Premium Festival Creatives",
      ],
      popular: true,
    },
  ];

  const handleSubscribe = async (plan) => {
    if (!user) {
      alert("Please login to subscribe");
      navigate("/login");
      return;
    }

    if (!window.Razorpay) {
      alert("Payment gateway is loading. Please wait a moment and try again.");
      return;
    }

    setLoading(true);

    try {
      // Get auth token
      const authToken = localStorage.getItem("authToken");
      const userId = user.id || user._id;

      // Create order on backend
      const config = {};
      if (authToken) {
        config.headers = {
          Authorization: `Bearer ${authToken}`,
        };
      }
      
      const orderResponse = await axios.post(
        `${API_BASE_URL}/subscription/create-order`,
        {
          amount: plan.earlyBirdPrice,
          currency: "INR",
          planId: plan.id,
          planName: plan.name,
          userId: userId,
        },
        config
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || "Failed to create order");
      }

      const { order, keyId } = orderResponse.data;

      // Initialize Razorpay checkout
      const options = {
        key: keyId || RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LCM",
        description: `${plan.name} Subscription`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyConfig = {};
            if (authToken) {
              verifyConfig.headers = {
                Authorization: `Bearer ${authToken}`,
              };
            }
            
            const verifyResponse = await axios.post(
              `${API_BASE_URL}/subscription/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
                planName: plan.name,
                amount: plan.earlyBirdPrice,
                userId: userId,
              },
              verifyConfig
            );

            if (verifyResponse.data.success) {
              alert("Payment successful! Your subscription is now active.");
              // Refresh subscription data
              if (user) {
                fetchActiveSubscription(user);
              }
              // You can redirect or update UI here
              window.location.reload();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phoneNumber || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (error) {
      console.error("Subscription error:", error);
      alert(error.response?.data?.message || error.message || "Failed to process subscription");
      setLoading(false);
    }
  };

  const earlyBirdBenefits = [
    "Flat Discount (Till 10 Jan 2026)",
    "1 Month 100 Users Bonuses",
    "1 Month Extra Subscription Free",
    "5 Premium Bonus Creatives",
    "500 Free Voice Call Credits",
    'Exclusive "Founder Badge" in App',
  ];

  const whyChooseLCM = [
    "AI-Based Meta Ads Support",
    "Unlimited Premium Creative Designs",
    "Voice Campaign Automation",
    "Real-Time Performance Dashboard",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            LCM - Launch Price Plans
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Choose the perfect plan for your business needs
          </p>
          
          {/* Payment History Link */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => navigate("/user/payment-history")}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
            >
              <FiCreditCard className="w-5 h-5" />
              View Payment History
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Subscription Card */}
        {loadingSubscription ? (
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : activeSubscription ? (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Active Subscription</h2>
                  <p className="text-green-100 text-sm">{activeSubscription.planName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{formatAmount(activeSubscription.amount)}</p>
                <p className="text-green-100 text-sm">per month</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-3">
                <FiCalendar className="w-5 h-5 text-green-100" />
                <div>
                  <p className="text-green-100 text-xs">Start Date</p>
                  <p className="font-semibold">{formatDate(activeSubscription.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiClock className="w-5 h-5 text-green-100" />
                <div>
                  <p className="text-green-100 text-xs">End Date</p>
                  <p className="font-semibold">{formatDate(activeSubscription.endDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiCreditCard className="w-5 h-5 text-green-100" />
                <div>
                  <p className="text-green-100 text-xs">Payment Status</p>
                  <p className="font-semibold capitalize">{activeSubscription.paymentStatus}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative group ${
                plan.popular ? "md:-mt-2" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-purple-600 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div
                className={`relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-purple-200 scale-105"
                    : "border-gray-200"
                }`}
              >
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {plan.name}
                    </h3>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-gray-900">
                          ₹{plan.earlyBirdPrice.toLocaleString()}
                        </span>
                        <span className="text-gray-600">/{plan.period}</span>
                        {plan.discount && (
                          <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                            {plan.discount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-gray-400 line-through text-sm">
                          From ₹{plan.regularPrice.toLocaleString()}
                        </span>
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                          Launching Offer
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                            <FiCheck className="w-3 h-3 text-purple-600" />
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Processing..." : "Get Started"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Early Bird Benefits */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiZap className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Early Bird Benefits
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earlyBirdBenefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <FiCheck className="w-3 h-3 text-orange-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose LCM */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden mb-12">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white bg-opacity-10 rounded-full -mr-36 -mt-36 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-300 bg-opacity-10 rounded-full -ml-28 -mb-28 blur-2xl"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-pink-300 bg-opacity-10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-10">
              <div className="mb-6 md:mb-0">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  Why Choose LCM?
                </h2>
                <p className="text-white text-lg font-medium opacity-95">
                  Discover what makes us the best choice for your business
                </p>
              </div>
              <div className="hidden md:block relative">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                  <FiStar className="w-10 h-10 text-yellow-900" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-purple-700 rounded-full shadow-md"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whyChooseLCM.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 border border-gray-200"></div>
                  <span className="text-gray-700 font-medium text-base">
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <FiShield className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                Secure Payment
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <FiTrendingUp className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                Cancel Anytime
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <FiAward className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                Premium Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

