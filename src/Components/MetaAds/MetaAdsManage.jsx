import React, { useState, useEffect } from "react";
import { FiPlay, FiPause, FiTrash2, FiEdit, FiChevronRight, FiArrowLeft, FiX, FiPlus } from "react-icons/fi";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);

  useEffect(() => {
    if (adAccountId) {
      fetchCampaigns();
    }
  }, [adAccountId]);

  const fetchCampaigns = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setCampaigns([]); // Clear existing campaigns on refresh
        setHasMore(true);
        setNextCursor(null);
      }

      const response = await campaignAPI.getAll(adAccountId, 25, loadMore ? nextCursor : null);
      if (response.data.success && response.data.campaigns?.data) {
        if (loadMore) {
          // Append new campaigns to existing list
          setCampaigns((prevCampaigns) => [...prevCampaigns, ...response.data.campaigns.data]);
        } else {
          // Replace campaigns on initial load or refresh
          setCampaigns(response.data.campaigns.data);
        }

        // Check if there are more pages
        const paging = response.data.campaigns?.paging;
        if (paging?.cursors?.after) {
          setNextCursor(paging.cursors.after);
          setHasMore(true);
        } else {
          setNextCursor(null);
          setHasMore(false);
        }
      } else {
        if (!loadMore) {
          setCampaigns([]);
        }
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      if (!loadMore) {
        setCampaigns([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
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
        fetchCampaigns(false); // Reset pagination
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
        fetchCampaigns(false); // Reset pagination
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
        fetchCampaigns(false); // Reset pagination
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

  // Optimization goal display names
  const optimizationGoalNames = {
    "LINK_CLICKS": "Link Clicks",
    "CONVERSIONS": "Conversions",
    "VALUE": "Value",
    "BRAND_AWARENESS": "Brand Awareness",
    "AD_RECALL_LIFT": "Ad Recall Lift",
    "REACH": "Reach",
    "IMPRESSIONS": "Impressions",
    "THRUPLAY": "ThruPlay",
    "TWO_SECOND_VIDEO_VIEWS": "Two Second Video Views",
    "LANDING_PAGE_VIEWS": "Landing Page Views",
    "POST_ENGAGEMENT": "Post Engagement",
    "CONVERSATIONS": "Conversations",
    "PAGE_LIKES": "Page Likes",
    "EVENT_RESPONSES": "Event Responses",
    "LEAD_GENERATION": "Lead Generation",
    "QUALITY_CALL": "Quality Call",
    "OFFSITE_CONVERSIONS": "Offsite Conversions",
    "PRODUCT_CATALOG_SALES": "Product Catalog Sales",
    "APP_INSTALLS": "App Installs",
    "APP_ENGAGEMENT": "App Engagement",
    "VIDEO_VIEWS": "Video Views",
  };

  const getOptimizationGoalName = (optimizationGoal) => {
    return optimizationGoalNames[optimizationGoal] || optimizationGoal || "N/A";
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
          <>
            <div className="grid grid-cols-2 gap-4">
              {campaigns.map((campaign, index) => {
                // Colorful gradient backgrounds
                const gradients = [
                  { from: "#9333EA", to: "#EC4899" }, // purple to pink
                  { from: "#3B82F6", to: "#06B6D4" }, // blue to cyan
                  { from: "#10B981", to: "#059669" }, // green to emerald
                  { from: "#F97316", to: "#EF4444" }, // orange to red
                  { from: "#6366F1", to: "#9333EA" }, // indigo to purple
                  { from: "#14B8A6", to: "#3B82F6" }, // teal to blue
                  { from: "#EAB308", to: "#F97316" }, // yellow to orange
                  { from: "#EC4899", to: "#F43F5E" }, // pink to rose
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                <div
                  key={campaign.id}
                  className="rounded-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})`
                  }}
                  onClick={() => handleCampaignClick(campaign)}
                >
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg mb-2 line-clamp-2">{campaign.name}</h4>
                        <p className="text-white text-sm opacity-90 mb-1">Objective: {campaign.objective || "N/A"}</p>
                        <p className="text-white text-xs opacity-75">ID: {campaign.id}</p>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            campaign.status === "ACTIVE"
                              ? "bg-green-200 text-green-900"
                              : campaign.status === "PAUSED"
                              ? "bg-yellow-200 text-yellow-900"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white border-opacity-20">
                      <div className="flex items-center gap-2">
                        {campaign.status === "ACTIVE" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePause("campaign", campaign.id);
                            }}
                            className="p-2.5 rounded-lg bg-white bg-opacity-90 hover:bg-opacity-100 text-yellow-600 shadow-md transition-all hover:scale-110"
                            title="Pause Campaign"
                          >
                            <FiPause className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivate("campaign", campaign.id);
                            }}
                            className="p-2.5 rounded-lg bg-white bg-opacity-90 hover:bg-opacity-100 text-green-600 shadow-md transition-all hover:scale-110"
                            title="Activate Campaign"
                          >
                            <FiPlay className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete("campaign", campaign.id);
                          }}
                          className="p-2.5 rounded-lg bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 shadow-md transition-all hover:scale-110"
                          title="Delete Campaign"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-sm font-medium">View AdSets</span>
                        <FiChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => fetchCampaigns(true)}
                  disabled={loadingMore}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More Campaigns</span>
                  )}
                </button>
              </div>
            )}
          </>
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
          <div className="grid grid-cols-2 gap-4">
            {adSets.map((adSet, index) => {
              // Colorful gradient backgrounds
              const gradients = [
                { from: "#9333EA", to: "#EC4899" }, // purple to pink
                { from: "#3B82F6", to: "#06B6D4" }, // blue to cyan
                { from: "#10B981", to: "#059669" }, // green to emerald
                { from: "#F97316", to: "#EF4444" }, // orange to red
                { from: "#6366F1", to: "#9333EA" }, // indigo to purple
                { from: "#14B8A6", to: "#3B82F6" }, // teal to blue
                { from: "#EAB308", to: "#F97316" }, // yellow to orange
                { from: "#EC4899", to: "#F43F5E" }, // pink to rose
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
              <div
                key={adSet.id}
                className="rounded-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden"
                style={{
                  background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})`
                }}
                onClick={() => handleAdSetClick(adSet)}
              >
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg mb-2 line-clamp-2">{adSet.name || adSet.id}</h4>
                      <p className="text-white text-sm opacity-90 mb-1">ID: {adSet.id}</p>
                      {adSet.daily_budget && (
                        <p className="text-white text-sm opacity-90 mb-1">Budget: ${(adSet.daily_budget / 100).toFixed(2)}/day</p>
                      )}
                      {adSet.optimization_goal && (
                        <span className="inline-block px-2 py-1 bg-red-500 bg-opacity-100 text-white rounded text-xs font-medium mt-1">
                          {getOptimizationGoalName(adSet.optimization_goal)}
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          adSet.status === "ACTIVE"
                            ? "bg-green-200 text-green-900"
                            : adSet.status === "PAUSED"
                            ? "bg-yellow-200 text-yellow-900"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        {adSet.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white border-opacity-20">
                    <div className="flex items-center gap-2">
                      {adSet.status === "ACTIVE" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePause("adset", adSet.id);
                          }}
                          className="p-2.5 rounded-lg bg-white bg-opacity-90 hover:bg-opacity-100 text-yellow-600 shadow-md transition-all hover:scale-110"
                          title="Pause AdSet"
                        >
                          <FiPause className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivate("adset", adSet.id);
                          }}
                          className="p-2.5 rounded-lg bg-white bg-opacity-90 hover:bg-opacity-100 text-green-600 shadow-md transition-all hover:scale-110"
                          title="Activate AdSet"
                        >
                          <FiPlay className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete("adset", adSet.id);
                        }}
                        className="p-2.5 rounded-lg bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 shadow-md transition-all hover:scale-110"
                        title="Delete AdSet"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-sm font-medium">View Ads</span>
                      <FiChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
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
          <div className="grid grid-cols-2 gap-4">
            {ads.map((ad, index) => {
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

              // Colorful gradient backgrounds
              const gradients = [
                { from: "#9333EA", to: "#EC4899" }, // purple to pink
                { from: "#3B82F6", to: "#06B6D4" }, // blue to cyan
                { from: "#10B981", to: "#059669" }, // green to emerald
                { from: "#F97316", to: "#EF4444" }, // orange to red
                { from: "#6366F1", to: "#9333EA" }, // indigo to purple
                { from: "#14B8A6", to: "#3B82F6" }, // teal to blue
                { from: "#EAB308", to: "#F97316" }, // yellow to orange
                { from: "#EC4899", to: "#F43F5E" }, // pink to rose
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <div
                  key={ad.id}
                  className="rounded-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})`
                  }}
                >
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg mb-2 line-clamp-2">{ad.name || ad.id}</h4>
                        <p className="text-white text-sm opacity-90 mb-1">ID: {ad.id}</p>
                        {ad.effective_status && (
                          <p className="text-white text-xs opacity-75">Status: {ad.effective_status}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            ad.status === "ACTIVE"
                              ? "bg-green-200 text-green-900"
                              : ad.status === "PAUSED"
                              ? "bg-yellow-200 text-yellow-900"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          {ad.status}
                        </span>
                        {ad.status === "ACTIVE" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePause("ad", ad.id);
                            }}
                            className="p-2.5 rounded-lg bg-white hover:bg-gray-100 text-yellow-600 shadow-md transition-all hover:scale-110"
                            title="Pause Ad"
                          >
                            <FiPause className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivate("ad", ad.id);
                            }}
                            className="p-2.5 rounded-lg bg-white hover:bg-gray-100 text-green-600 shadow-md transition-all hover:scale-110"
                            title="Activate Ad"
                          >
                            <FiPlay className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete("ad", ad.id);
                          }}
                          className="p-2.5 rounded-lg bg-white hover:bg-gray-100 text-red-600 shadow-md transition-all hover:scale-110"
                          title="Delete Ad"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Analytics Section */}
                    {insights ? (
                      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                        <h5 className="text-sm font-bold text-white mb-3">Analytics (Last 30 Days)</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white bg-opacity-20 rounded-lg p-2">
                            <p className="text-xs text-white opacity-90 mb-1">Impressions</p>
                            <p className="text-sm font-bold text-white">
                              {formatNumber(insights.impressions)}
                            </p>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded-lg p-2">
                            <p className="text-xs text-white opacity-90 mb-1">Clicks</p>
                            <p className="text-sm font-bold text-white">
                              {formatNumber(insights.clicks)}
                            </p>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded-lg p-2">
                            <p className="text-xs text-white opacity-90 mb-1">CTR</p>
                            <p className="text-sm font-bold text-white">
                              {insights.ctr ? formatPercent(insights.ctr) : "0%"}
                            </p>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded-lg p-2">
                            <p className="text-xs text-white opacity-90 mb-1">Spend</p>
                            <p className="text-sm font-bold text-white">
                              {formatCurrency(insights.spend)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                        <p className="text-xs text-white opacity-75 italic">Analytics data loading or not available</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MetaAdsManage;
