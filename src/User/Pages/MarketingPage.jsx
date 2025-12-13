import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiFacebook, FiMail, FiMessageSquare, FiArrowRight, FiPhone, FiX } from "react-icons/fi";

const MarketingPage = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonService, setComingSoonService] = useState("");
  const navigate = useNavigate();

  const marketingOptions = [
    {
      id: 1,
      title: "Meta Ads",
      description:
        "Reach your target audience with precision targeting and powerful analytics",
      icon: FiFacebook,
      color: "#1877F2",
      link: "/user/meta-ads",
      comingSoon: false,
    },
    {
      id: 2,
      title: "IVR",
      description:
        "Interactive Voice Response system for automated customer engagement",
      icon: FiPhone,
      color: "#10B981",
      link: "/user/ivr",
      comingSoon: false,
    },
    {
      id: 3,
      title: "SMS Marketing",
      description: "Send targeted text messages with high open rates",
      icon: FiMessageSquare,
      color: "#8E44AD",
      link: "/user/sms-marketing",
      comingSoon: true,
    },
    {
      id: 4,
      title: "Email Marketing",
      description:
        "Create effective email campaigns that convert with our templates",
      icon: FiMail,
      color: "#EA4335",
      link: "/user/email-marketing",
      comingSoon: true,
    },
  ];

  const handleServiceClick = (option, e) => {
    if (option.comingSoon) {
      e.preventDefault();
      setComingSoonService(option.title);
      setShowComingSoon(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marketing Options</h1>
        <p className="text-gray-600 mt-1">
          Choose the right channel for your campaign
        </p>
      </div>

      {/* Marketing Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketingOptions.map((option) => {
          const Icon = option.icon;
          const Component = option.comingSoon ? "div" : Link;
          const props = option.comingSoon
            ? {
                onClick: (e) => handleServiceClick(option, e),
                className:
                  "bg-white rounded-lg border-2 border-l-4 border-gray-200 hover:shadow-lg transition-all duration-200 p-6 cursor-pointer relative",
                style: { borderLeftColor: option.color },
              }
            : {
                to: option.link,
                className:
                  "bg-white rounded-lg border-2 border-l-4 border-gray-200 hover:shadow-lg transition-all duration-200 p-6 relative",
                style: { borderLeftColor: option.color },
              };

          return (
            <Component key={option.id} {...props}>
              {option.comingSoon && (
                <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                  Coming Soon
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${option.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: option.color }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{option.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{option.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: option.color }}>
                  {option.comingSoon ? "Learn More" : "Get Started"}
                </span>
                <FiArrowRight
                  className="w-5 h-5"
                  style={{ color: option.color }}
                />
              </div>
            </Component>
          );
        })}
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Coming Soon!
              </h2>
              <p className="text-gray-600 mb-6">
                <span className="font-semibold">{comingSoonService}</span> is currently under
                development. We're working hard to bring you this amazing feature soon!
              </p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors w-full"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Need help choosing?
        </h3>
        <p className="text-gray-700 mb-4">
          Each marketing channel has its strengths. Meta Ads is great for reaching
          new audiences, IVR provides automated customer engagement, Email Marketing excels at nurturing existing customers, and
          SMS Marketing provides instant engagement.
        </p>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          Contact our experts →
        </button>
      </div>
    </div>
  );
};

export default MarketingPage;

