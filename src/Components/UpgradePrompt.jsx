import React from "react";
import { Link } from "react-router-dom";
import { FiLock, FiArrowRight, FiZap, FiStar } from "react-icons/fi";

const UpgradePrompt = ({ message, isPremiumFeature = false }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${
          isPremiumFeature 
            ? "from-purple-600 via-pink-600 to-purple-600" 
            : "from-blue-600 to-indigo-600"
        } p-8 text-white text-center`}>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <FiLock className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Feature Locked</h2>
          <p className="text-white/90">{message}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Upgrade to Premium Plan to unlock:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FiZap className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">SMS Marketing</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FiZap className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">IVR Voice Campaign</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FiStar className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">24x7 Priority Support</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FiZap className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">All Basic Plan Features</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Premium Plan</h4>
                <p className="text-gray-600 text-sm">₹2,999/month</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">40% OFF</p>
                <p className="text-sm text-gray-500 line-through">₹5,000</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/user/subscription"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold text-center hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Upgrade Now
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/user"
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold text-center hover:bg-gray-300 transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;

