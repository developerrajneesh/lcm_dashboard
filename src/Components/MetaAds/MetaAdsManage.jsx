import React, { useState, useEffect } from "react";
import { FiMoreVertical, FiPlay, FiPause, FiTrash2, FiEdit, FiChevronRight, FiArrowLeft, FiX, FiPlus } from "react-icons/fi";
import { campaignAPI, adsetAPI, adAPI } from "../../utils/api";

const MetaAdsManage = ({ accessToken, adAccountId, onCreateAdSet, onCreateCampaign, onCreateAd }) => {
  const [view, setView] = useState("campaigns"); // "campaigns", "adsets", "ads"
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedAdSet, setSelectedAdSet] = useState(null);
  
  const [campaigns, setCampaigns] = useState([]);
  const [adSets, setAdSets] = useState([]);
  const [ads, setAds] = useState([]);
  const [adInsights, setAdInsights] = useState({}); // Store insights by ad ID
  
  const [loading, setLoading] = useState(true);
  const [actionMenu, setActionMenu] = useState(null);

  useEffect(() => {
    if (adAccountId) {
      fetchCampaigns();
    }
  }, [adAccountId]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignAPI.getAll(adAccountId);
      if (response.data.success && response.data.campaigns?.data) {
        setCampaigns(response.data.campaigns.data);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdSets = async (campaignId) => {
    try {
      setLoading(true);
      const response = await adsetAPI.getAll(campaignId);
      if (response.data.success && response.data.adsets?.data) {
        setAdSets(response.data.adsets.data);
      } else {
        setAdSets([]);
      }
    } catch (error) {
      console.error("Error fetching ad sets:", error);
      setAdSets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAds = async (adsetId) => {
    try {
      setLoading(true);
      const response = await adAPI.getAll(adsetId);
      if (response.data.success && response.data.ads?.data) {
        const adsData = response.data.ads.data;
        setAds(adsData);
        
        // Fetch insights for each ad
        const insightsPromises = adsData.map(async (ad) => {
          try {
            const insightsResponse = await adAPI.getInsights(ad.id, "last_30d");
            if (insightsResponse.data.success && insightsResponse.data.insights?.data) {
              return { adId: ad.id, insights: insightsResponse.data.insights.data[0] || null };
            }
          } catch (error) {
            console.error(`Error fetching insights for ad ${ad.id}:`, error);
            return { adId: ad.id, insights: null };
          }
          return { adId: ad.id, insights: null };
        });
        
        const insightsResults = await Promise.all(insightsPromises);
        const insightsMap = {};
        insightsResults.forEach(({ adId, insights }) => {
          insightsMap[adId] = insights;
        });
        setAdInsights(insightsMap);
      } else {
        setAds([]);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignClick = async (campaign) => {
    setSelectedCampaign(campaign);
    await fetchAdSets(campaign.id);
    setView("adsets");
  };

  const handleAdSetClick = async (adSet) => {
    setSelectedAdSet(adSet);
    await fetchAds(adSet.id);
    setView("ads");
  };

  const handleBackToCampaigns = () => {
    setView("campaigns");
    setSelectedCampaign(null);
    setAdSets([]);
  };

  const handleBackToAdSets = () => {
    setView("adsets");
    setSelectedAdSet(null);
    setAds([]);
  };

  const handlePause = async (type, id) => {
    try {
      if (type === "campaign") {
        await campaignAPI.pause(id);
        fetchCampaigns();
      } else if (type === "adset") {
        await adsetAPI.pause(id);
        if (selectedCampaign) fetchAdSets(selectedCampaign.id);
      } else if (type === "ad") {
        await adAPI.pause(id);
        if (selectedAdSet) fetchAds(selectedAdSet.id);
      }
      setActionMenu(null);
    } catch (error) {
      alert(`Failed to pause ${type}`);
    }
  };

  const handleActivate = async (type, id) => {
    try {
      if (type === "campaign") {
        await campaignAPI.activate(id);
        fetchCampaigns();
      } else if (type === "adset") {
        await adsetAPI.activate(id);
        if (selectedCampaign) fetchAdSets(selectedCampaign.id);
      } else if (type === "ad") {
        await adAPI.activate(id);
        if (selectedAdSet) fetchAds(selectedAdSet.id);
      }
      setActionMenu(null);
    } catch (error) {
      alert(`Failed to activate ${type}`);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      if (type === "campaign") {
        await campaignAPI.delete(id);
        fetchCampaigns();
      } else if (type === "adset") {
        await adsetAPI.delete(id);
        if (selectedCampaign) fetchAdSets(selectedCampaign.id);
      } else if (type === "ad") {
        await adAPI.delete(id);
        if (selectedAdSet) fetchAds(selectedAdSet.id);
      }
      setActionMenu(null);
    } catch (error) {
      alert(`Failed to delete ${type}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800";
      case "DELETED":
        return "bg-red-100 text-red-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && view === "campaigns" && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Campaigns View
  if (view === "campaigns") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Campaigns</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{campaigns.length} total</span>
            <button
              onClick={() => {
                if (onCreateCampaign) {
                  onCreateCampaign();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPause className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-4">Create your first campaign to get started</p>
            <button
              onClick={() => {
                if (onCreateCampaign) {
                  onCreateCampaign();
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create Your First Campaign</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCampaignClick(campaign)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Objective: {campaign.objective || "N/A"}</span>
                      <span>ID: {campaign.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">View AdSets</span>
                    <FiChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // AdSets View
  if (view === "adsets") {
    return (
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button
            onClick={handleBackToCampaigns}
            className="hover:text-blue-600 flex items-center gap-1"
          >
            <FiArrowLeft className="w-4 h-4" />
            Campaigns
          </button>
          <FiChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">AdSets</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              AdSets for "{selectedCampaign?.name}"
            </h3>
            <p className="text-sm text-gray-600">Campaign ID: {selectedCampaign?.id}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{adSets.length} ad sets</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent any parent click handlers
                if (onCreateAdSet && selectedCampaign) {
                  onCreateAdSet(selectedCampaign.id, selectedCampaign.name);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create AdSet</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : adSets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPause className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No ad sets yet</h3>
            <p className="text-gray-600 mb-4">This campaign doesn't have any ad sets</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onCreateAdSet && selectedCampaign) {
                  onCreateAdSet(selectedCampaign.id, selectedCampaign.name);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create Your First AdSet</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {adSets.map((adSet) => (
              <div
                key={adSet.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleAdSetClick(adSet)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{adSet.name || adSet.id}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          adSet.status
                        )}`}
                      >
                        {adSet.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>ID: {adSet.id}</span>
                      {adSet.daily_budget && (
                        <span>Budget: ${(adSet.daily_budget / 100).toFixed(2)}/day</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">View Ads</span>
                    <FiChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Ads View
  if (view === "ads") {
    return (
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button
            onClick={handleBackToCampaigns}
            className="hover:text-blue-600 flex items-center gap-1"
          >
            <FiArrowLeft className="w-4 h-4" />
            Campaigns
          </button>
          <FiChevronRight className="w-4 h-4" />
          <button
            onClick={handleBackToAdSets}
            className="hover:text-blue-600"
          >
            AdSets
          </button>
          <FiChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Ads</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Ads for "{selectedAdSet?.name || selectedAdSet?.id}"
            </h3>
            <p className="text-sm text-gray-600">
              AdSet ID: {selectedAdSet?.id} | Campaign: {selectedCampaign?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{ads.length} ads</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onCreateAd && selectedAdSet && selectedCampaign) {
                  onCreateAd(selectedAdSet.id, selectedAdSet.name || selectedAdSet.id, selectedCampaign.id, selectedCampaign.name);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <FiPlus className="w-4 h-4" />
              Create Ad
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPause className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No ads yet</h3>
            <p className="text-gray-600 mb-4">This ad set doesn't have any ads</p>
            <button
              onClick={() => {
                if (onCreateAd && selectedAdSet && selectedCampaign) {
                  onCreateAd(selectedAdSet.id, selectedAdSet.name || selectedAdSet.id, selectedCampaign.id, selectedCampaign.name);
                }
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Create Your First Ad
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {ads.map((ad) => {
              const insights = adInsights[ad.id];
              const formatNumber = (num) => {
                if (!num || num === "0") return "0";
                return parseFloat(num).toLocaleString();
              };
              const formatCurrency = (amount) => {
                if (!amount || amount === "0") return "₹0.00";
                return `₹${parseFloat(amount).toFixed(2)}`;
              };
              const formatPercent = (value) => {
                if (!value || value === "0") return "0%";
                return `${parseFloat(value).toFixed(2)}%`;
              };

              return (
                <div
                  key={ad.id}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{ad.name || ad.id}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            ad.status
                          )}`}
                        >
                          {ad.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>ID: {ad.id}</span>
                        {ad.effective_status && (
                          <span>Effective Status: {ad.effective_status}</span>
                        )}
                      </div>

                      {/* Analytics Section */}
                      {insights ? (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-semibold text-gray-900 mb-3">Analytics (Last 30 Days)</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Impressions</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatNumber(insights.impressions)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Clicks</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatNumber(insights.clicks)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">CTR</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {insights.ctr ? formatPercent(insights.ctr) : "0%"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Spend</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(insights.spend)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Reach</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatNumber(insights.reach)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">CPC</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {insights.cpc ? formatCurrency(insights.cpc) : "₹0.00"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">CPM</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {insights.cpm ? formatCurrency(insights.cpm) : "₹0.00"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Frequency</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {insights.frequency ? parseFloat(insights.frequency).toFixed(2) : "0.00"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500 italic">Analytics data loading or not available</p>
                        </div>
                      )}
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionMenu(actionMenu === ad.id ? null : ad.id);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <FiMoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {actionMenu === ad.id && (
                        <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[150px]">
                          {ad.status === "ACTIVE" ? (
                            <button
                              onClick={() => handlePause("ad", ad.id)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FiPause className="w-4 h-4" />
                              Pause
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate("ad", ad.id)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FiPlay className="w-4 h-4" />
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete("ad", ad.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {actionMenu && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setActionMenu(null)}
          ></div>
        )}
      </div>
    );
  }

  return null;
};

export default MetaAdsManage;
