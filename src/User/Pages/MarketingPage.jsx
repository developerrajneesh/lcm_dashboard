import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiMail, FiMessageSquare, FiArrowRight } from "react-icons/fi";

const MarketingPage = () => {
  const marketingOptions = [
    {
      id: 1,
      title: "Meta Ads",
      description:
        "Reach your target audience with precision targeting and powerful analytics",
      icon: FiFacebook,
      color: "#1877F2",
      stats: { engagement: "92%", roi: "3.5x", time: "24h" },
      link: "/user/meta-ads",
    },
    {
      id: 2,
      title: "Email Marketing",
      description:
        "Create effective email campaigns that convert with our templates",
      icon: FiMail,
      color: "#EA4335",
      stats: { engagement: "85%", roi: "2.8x", time: "12h" },
      link: "/user/email-marketing",
    },
    {
      id: 3,
      title: "SMS Marketing",
      description: "Send targeted text messages with high open rates",
      icon: FiMessageSquare,
      color: "#8E44AD",
      stats: { engagement: "95%", roi: "3.2x", time: "1h" },
      link: "/user/sms-marketing",
    },
  ];

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
          return (
            <Link
              key={option.id}
              to={option.link}
              className="bg-white rounded-lg border-2 border-l-4 border-gray-200 hover:shadow-lg transition-all duration-200 p-6"
              style={{ borderLeftColor: option.color }}
            >
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

              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-lg font-bold" style={{ color: option.color }}>
                    {option.stats.engagement}
                  </p>
                  <p className="text-xs text-gray-600">Engagement</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: option.color }}>
                    {option.stats.roi}
                  </p>
                  <p className="text-xs text-gray-600">ROI</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: option.color }}>
                    {option.stats.time}
                  </p>
                  <p className="text-xs text-gray-600">Setup</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: option.color }}>
                  Get Started
                </span>
                <FiArrowRight
                  className="w-5 h-5"
                  style={{ color: option.color }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Need help choosing?
        </h3>
        <p className="text-gray-700 mb-4">
          Each marketing channel has its strengths. Meta Ads is great for reaching
          new audiences, Email Marketing excels at nurturing existing customers, and
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

