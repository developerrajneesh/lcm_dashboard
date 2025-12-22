import React, { useState, useEffect } from "react";
import { FiGift, FiCopy, FiCheck, FiUsers, FiDollarSign } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const ReferralPage = () => {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchReferrals();
      fetchTotalEarnings();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log("Loaded user data:", parsedUser);
        setUser(parsedUser);
        
        // Check if user has a referral code, if not, assign one
        const userId = parsedUser.id || parsedUser._id;
        const hasReferralCode = parsedUser.referralCode && 
                                parsedUser.referralCode !== "N/A" && 
                                parsedUser.referralCode.trim() !== "";
        
        console.log("User ID:", userId, "Has referral code:", hasReferralCode, "Referral code:", parsedUser.referralCode);
        
        if (!hasReferralCode && userId) {
          console.log("Assigning referral code for user:", userId);
          await assignReferralCode(userId);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignReferralCode = async (userId) => {
    try {
      console.log("Assigning referral code for user:", userId);
      const response = await fetch(`${API_BASE_URL}/user/assign-referral-code/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        console.error("API Error:", response.status, errorData);
        return;
      }

      const result = await response.json();
      console.log("Referral code assignment result:", result);

      if (result.success && result.user) {
        // Update user in localStorage and state
        const currentUserData = localStorage.getItem("user");
        if (currentUserData) {
          const currentUser = JSON.parse(currentUserData);
          const updatedUser = { ...currentUser, referralCode: result.user.referralCode };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          console.log("Referral code assigned:", result.user.referralCode);
        }
      } else {
        console.error("Failed to assign referral code:", result);
      }
    } catch (error) {
      console.error("Error assigning referral code:", error);
    }
  };

  const fetchReferrals = async () => {
    if (!user?.id) return;

    try {
      // Fetch users referred by this user
      const response = await fetch(`${API_BASE_URL}/user/referrals/${user.id}`);
      const result = await response.json();

      if (result.success) {
        setReferrals(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  const fetchTotalEarnings = async () => {
    if (!user?.id) return;

    try {
      // Fetch wallet and calculate total referral earnings
      const walletResponse = await fetch(`${API_BASE_URL}/wallet/${user.id}/transactions`);
      const walletResult = await walletResponse.json();

      if (walletResult.success) {
        const referralTransactions = (walletResult.data.transactions || []).filter(
          (t) => t.description?.includes("Referral bonus") && t.type === "credit"
        );
        const total = referralTransactions.reduce((sum, t) => sum + t.amount, 0);
        setTotalEarnings(total);
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getReferralLink = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/signup?ref=${user?.referralCode || ""}`;
    }
    return "";
  };

  const copyReferralLink = () => {
    const link = getReferralLink();
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
          <p className="text-gray-600 mt-1">Earn ₹50 for every friend you refer</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-gray-900">{referrals.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">₹{totalEarnings.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Potential Earnings</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{(referrals.length * 50).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FiGift className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <FiGift className="w-8 h-8" />
            <h2 className="text-2xl font-semibold">Your Referral Code</h2>
          </div>
          <div className="bg-white/20 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <code className="text-3xl font-bold tracking-wider">
                {user?.referralCode || "N/A"}
              </code>
              <button
                onClick={copyReferralCode}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {copied ? (
                  <>
                    <FiCheck className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy className="w-5 h-5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-sm mb-2">Or share your referral link:</p>
            <div className="flex items-center justify-between gap-4">
              <code className="text-sm flex-1 truncate">{getReferralLink()}</code>
              <button
                onClick={copyReferralLink}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <FiCheck className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy className="w-5 h-5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Your Code</h3>
              <p className="text-sm text-gray-600">
                Share your referral code or link with friends and family
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">They Sign Up</h3>
              <p className="text-sm text-gray-600">
                Your friend signs up using your referral code
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">You Earn ₹50</h3>
              <p className="text-sm text-gray-600">
                ₹50 is automatically credited to your wallet
              </p>
            </div>
          </div>
        </div>

        {/* Referred Users List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Referred Users</h2>
          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No referrals yet</p>
              <p className="text-sm text-gray-400">
                Start sharing your referral code to earn rewards!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Joined Date
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr
                      key={referral._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {referral.profileImage ? (
                            <img
                              src={referral.profileImage}
                              alt={referral.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-semibold">
                                {referral.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{referral.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{referral.email}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(referral.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;

