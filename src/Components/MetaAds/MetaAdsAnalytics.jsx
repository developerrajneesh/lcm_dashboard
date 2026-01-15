import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiEye, FiMousePointer, FiRefreshCw } from "react-icons/fi";
import { campaignAPI } from "../../utils/api";

// Rupee Icon Component
const RupeeIcon = ({ className }) => (
  <span className={`font-bold text-lg ${className}`}>₹</span>
);

const MetaAdsAnalytics = ({ accessToken, adAccountId }) => {
  const [dateRange, setDateRange] = useState("30");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    impressions: "0",
    reach: "0",
    clicks: "0",
    ctr: "0%",
    costPerResult: "₹0.00",
    amountSpent: "₹0.00",
  });

  useEffect(() => {
    if (adAccountId && accessToken) {
      fetchCampaignData();
    }
  }, [adAccountId, accessToken, dateRange]);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      
      // Fetch campaigns
      const campaignsResponse = await campaignAPI.getAll(adAccountId);
      if (campaignsResponse.data.success && campaignsResponse.data.campaigns?.data) {
        const campaignsData = campaignsResponse.data.campaigns.data;
        setCampaigns(campaignsData);

        // Calculate aggregate stats from campaigns
        // Note: For real insights, we'd need to fetch insights from Facebook API
        // This is a placeholder - you'd need to add insights endpoint to backend
        calculateStats(campaignsData);
      }
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (campaignsData) => {
    // Placeholder calculation - in production, fetch real insights from Facebook
    // For now, show campaign count and basic info
    const totalCampaigns = campaignsData.length;
    const activeCampaigns = campaignsData.filter(c => c.status === "ACTIVE").length;
    
    setStats({
      impressions: totalCampaigns > 0 ? "Loading..." : "0",
      reach: activeCampaigns.toString(),
      clicks: totalCampaigns.toString(),
      ctr: totalCampaigns > 0 ? "N/A" : "0%",
      costPerResult: "₹0.00",
      amountSpent: "₹0.00",
    });
  };

  const statsDisplay = [
    {
      label: "Impressions",
      value: stats.impressions,
      icon: FiEye,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Active Campaigns",
      value: stats.reach,
      icon: FiTrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Total Campaigns",
      value: stats.clicks,
      icon: FiMousePointer,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "CTR",
      value: stats.ctr,
      icon: FiTrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Cost per Result",
      value: stats.costPerResult,
      icon: RupeeIcon,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      label: "Amount Spent",
      value: stats.amountSpent,
      icon: RupeeIcon,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800";
      case "DELETED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={fetchCampaignData}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <FiRefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h4>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>
      </div>

      {/* Campaign Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Campaign Breakdown</h4>
          <span className="text-sm text-gray-600">{campaigns.length} campaigns</span>
        </div>
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No campaigns found. Create your first campaign to see analytics.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h5 className="font-semibold text-gray-900">{campaign.name}</h5>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Campaign ID</p>
                    <p className="font-semibold text-gray-900 text-xs truncate">{campaign.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Objective</p>
                    <p className="font-semibold text-gray-900">{campaign.objective || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Status</p>
                    <p className="font-semibold text-gray-900">{campaign.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Insights</p>
                    <p className="text-xs text-gray-500 italic">
                      Fetch insights from Facebook API
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Note: To view detailed analytics (impressions, clicks, spend), you need to fetch insights from Facebook's Insights API. 
                    This requires adding an insights endpoint to your backend.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaAdsAnalytics;

