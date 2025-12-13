import React, { useState, useEffect } from "react";
import { FiUpload, FiX, FiCheck, FiArrowRight } from "react-icons/fi";
import { campaignAPI, adsetAPI, adAPI } from "../../utils/api";

const MetaAdsCreate = ({ accessToken, adAccountId, onCampaignCreated, preselectedCampaignId, preselectedCampaignName, preselectedAdSetId, preselectedAdSetName }) => {
  // Start at step 3 if AdSet is preselected, step 2 if campaign is preselected, otherwise step 1
  const [step, setStep] = useState(preselectedAdSetId ? 3 : (preselectedCampaignId ? 2 : 1));
  const [loading, setLoading] = useState(false);
  
  // Store created IDs
  const [createdCampaignId, setCreatedCampaignId] = useState(preselectedCampaignId || null);
  const [createdAdSetId, setCreatedAdSetId] = useState(preselectedAdSetId || null);
  
  // Campaign Details
  const [campaignName, setCampaignName] = useState("");
  const [objective, setObjective] = useState("OUTCOME_TRAFFIC");
  
  // AdSet Details
  const [adSetName, setAdSetName] = useState(preselectedCampaignName ? `${preselectedCampaignName} - AdSet` : "");
  const [budget, setBudget] = useState("");
  const [targeting, setTargeting] = useState({
    location: "US",
    ageMin: 18,
    ageMax: 65,
  });
  
  // Ad Creative
  const [adName, setAdName] = useState("");
  const [adCreative, setAdCreative] = useState({
    primaryText: "",
    headline: "",
    description: "",
    media: null,
    mediaUrl: null,
  });

  const objectives = [
    { id: "OUTCOME_TRAFFIC", name: "Website Traffic", icon: "🌐" },
    { id: "CONVERSIONS", name: "Conversions", icon: "💰" },
    { id: "OUTCOME_ENGAGEMENT", name: "Engagement", icon: "👍" },
    { id: "BRAND_AWARENESS", name: "Brand Awareness", icon: "📢" },
    { id: "REACH", name: "Reach", icon: "👥" },
    { id: "LEAD_GENERATION", name: "Lead Generation", icon: "📋" },
    { id: "VIDEO_VIEWS", name: "Video Views", icon: "🎥" },
    { id: "POST_ENGAGEMENT", name: "Post Engagement", icon: "💬" },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdCreative({
          ...adCreative,
          media: reader.result,
          mediaUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1: Create Campaign
  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      alert("Please enter a campaign name");
      return;
    }

    setLoading(true);

    try {
      const campaignResponse = await campaignAPI.create({
        adAccountId,
        name: campaignName,
        objective: objective,
        status: "PAUSED",
        // Don't send special_ad_categories if it's ["NONE"] - Facebook doesn't accept "NONE" as a valid value
        // Omit it entirely for regular campaigns
      });

      if (!campaignResponse.data.success) {
        throw new Error(campaignResponse.data.message || "Failed to create campaign");
      }

      const campaignId = campaignResponse.data.campaign?.id;
      
      if (!campaignId) {
        throw new Error("Campaign created but no ID returned");
      }

      console.log("Campaign created successfully:", campaignId);
      
      // Verify campaign exists
      try {
        await campaignAPI.getById(campaignId);
      } catch (verifyError) {
        console.warn("Campaign verification failed, waiting...");
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      setCreatedCampaignId(campaignId);
      setAdSetName(`${campaignName} - AdSet`);
      setStep(2);
    } catch (error) {
      console.error("Error creating campaign:", error);
      console.error("Full error response:", error.response?.data);
      
      // Get detailed error message
      const fbError = error.response?.data?.fb;
      let errorMessage = "Failed to create campaign.\n\n";
      
      if (fbError) {
        errorMessage += `Facebook Error: ${fbError.message || "Unknown error"}`;
        if (fbError.error_user_msg) {
          errorMessage += `\n\n${fbError.error_user_msg}`;
        }
        if (fbError.error_subcode) {
          errorMessage += `\n\nError Code: ${fbError.code || "Unknown"} (Subcode: ${fbError.error_subcode})`;
        }
        if (fbError.error_user_title) {
          errorMessage = `${fbError.error_user_title}\n\n${errorMessage}`;
        }
      } else {
        errorMessage += error.response?.data?.message || error.message || "Please try again.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Create AdSet
  const handleCreateAdSet = async () => {
    if (!adSetName.trim()) {
      alert("Please enter an ad set name");
      return;
    }
    if (!budget || parseFloat(budget) <= 0) {
      alert("Please enter a valid daily budget (minimum ₹225.00)");
      return;
    }

    setLoading(true);

    try {
      // Universal allowed billing events for new ad accounts
      const ALLOWED_BILLING_EVENTS = ["IMPRESSIONS", "CLICKS", "LINK_CLICKS"];
      
      // Default billing event - use IMPRESSIONS for maximum compatibility with new accounts
      // New accounts only support IMPRESSIONS, not LINK_CLICKS or CLICKS
      let billingEvent = "IMPRESSIONS";
      
      // Validate billing_event - ensure it's in allowed list
      // For safety, always default to IMPRESSIONS for new accounts
      if (!ALLOWED_BILLING_EVENTS.includes(billingEvent)) {
        console.warn("Unsupported billing_event for this ad account. Using IMPRESSIONS.");
        billingEvent = "IMPRESSIONS";
      }
      
      // Log the billing event being used
      console.log("📊 Using billing_event:", billingEvent, "(IMPRESSIONS is safest for new accounts)");

      const targetingData = {
        geo_locations: {
          countries: [targeting.location],
        },
        age_min: parseInt(targeting.ageMin) || 18,
        age_max: parseInt(targeting.ageMax) || 65,
        interests: [],
      };

      // Convert budget to paise (×100) - Meta uses paise for INR
      // Minimum is ₹225 = 22500 paise
      const dailyBudgetPaise = Math.round(parseFloat(budget) * 100);
      if (isNaN(dailyBudgetPaise) || dailyBudgetPaise < 22500) {
        throw new Error("Daily budget must be at least ₹225.00 (22500 paise)");
      }

      const adSetResponse = await adsetAPI.create({
        campaignId: createdCampaignId,
        adAccountId,
        name: adSetName,
        optimizationGoal: "LINK_CLICKS",
        billingEvent: billingEvent, // Use validated billing event
        dailyBudget: dailyBudgetPaise, // Send in paise
        targeting: targetingData,
        status: "PAUSED",
        autoFixBudget: false, // Set to true if you want auto-fix
      });

      if (!adSetResponse.data.success) {
        const errorMsg = adSetResponse.data.message || adSetResponse.data.fb?.message || "Failed to create ad set";
        throw new Error(errorMsg); // Show error message directly
      }
      
      const adSetId = adSetResponse.data.adset?.id;
      if (!adSetId) {
        throw new Error("AdSet created but no ID returned");
      }
      
      // Show warning if billing event was changed
      if (adSetResponse.data.warning) {
        console.warn("⚠️", adSetResponse.data.warning);
        // Optionally show a non-blocking notification to user
        // You can replace this with a toast notification if you have one
        setTimeout(() => {
          console.log("ℹ️", adSetResponse.data.warning);
        }, 100);
      }
      
      console.log("AdSet created successfully:", adSetId);
      setCreatedAdSetId(adSetId);
      setAdName(`${adSetName} - Ad`);
      setStep(3);
    } catch (error) {
      console.error("Error creating ad set:", error);
      console.error("Full error response:", error.response?.data);
      
      // Get detailed error message
      const fbError = error.response?.data?.fb;
      let errorMessage = "Failed to create ad set.\n\n";
      
      if (fbError) {
        errorMessage += `Facebook Error: ${fbError.message || "Unknown error"}`;
        if (fbError.error_user_msg) {
          errorMessage += `\n\n${fbError.error_user_msg}`;
        }
        if (fbError.error_subcode) {
          errorMessage += `\n\nError Code: ${fbError.code || "Unknown"} (Subcode: ${fbError.error_subcode})`;
        }
        if (fbError.error_user_title) {
          errorMessage = `${fbError.error_user_title}\n\n${errorMessage}`;
        }
      } else {
        errorMessage += error.response?.data?.message || error.message || "Please try again.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Create Ad
  const handleCreateAd = async () => {
    if (!adName.trim()) {
      alert("Please enter an ad name");
      return;
    }

    setLoading(true);

    try {
      const adResponse = await adAPI.create({
        adsetId: createdAdSetId,
        name: adName,
        creative: {
          object_story_spec: {
            link_data: {
              message: adCreative.primaryText || "Check out our offer!",
              link: "https://www.example.com", // Replace with actual destination URL
              name: adCreative.headline || adName,
              description: adCreative.description || "",
              call_to_action: {
                type: "LEARN_MORE",
              },
            },
          },
        },
        status: "PAUSED",
      });

      if (!adResponse.data.success) {
        const errorMsg = adResponse.data.message || adResponse.data.fb?.message || "Failed to create ad";
        throw new Error(`Ad creation failed: ${errorMsg}`);
      }

      console.log("Ad created successfully:", adResponse.data.ad?.id);
      
      alert("Campaign, AdSet, and Ad created successfully!");
      
      // Reset form
      setCampaignName("");
      setAdSetName("");
      setAdName("");
      setBudget("");
      setObjective("OUTCOME_TRAFFIC");
      setTargeting({ location: "US", ageMin: 18, ageMax: 65 });
      setAdCreative({
        primaryText: "",
        headline: "",
        description: "",
        media: null,
        mediaUrl: null,
      });
      setCreatedCampaignId(null);
      setCreatedAdSetId(null);
      setStep(1);
      
      if (onCampaignCreated) {
        onCampaignCreated();
      }
    } catch (error) {
      console.error("Error creating ad:", error);
      alert(
        error.response?.data?.fb?.message ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create ad. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    // If preselected AdSet, go back to step 3, if preselected campaign go to step 2, otherwise step 1
    setStep(preselectedAdSetId ? 3 : (preselectedCampaignId ? 2 : 1));
    setCreatedCampaignId(preselectedCampaignId || null);
    setCreatedAdSetId(preselectedAdSetId || null);
    if (!preselectedCampaignId) {
      setCampaignName("");
    }
    setAdSetName(preselectedCampaignName ? `${preselectedCampaignName} - AdSet` : "");
    setAdName(preselectedAdSetName ? `${preselectedAdSetName} - Ad` : "");
    setBudget("");
    setObjective("OUTCOME_TRAFFIC");
    setTargeting({ location: "US", ageMin: 18, ageMax: 65 });
    setAdCreative({
      primaryText: "",
      headline: "",
      description: "",
      media: null,
      mediaUrl: null,
    });
  };
  
  // Initialize adSetName when component mounts with preselected campaign
  useEffect(() => {
    if (preselectedCampaignName && preselectedCampaignId && step === 2 && !adSetName) {
      setAdSetName(`${preselectedCampaignName} - AdSet`);
    }
  }, [preselectedCampaignName, preselectedCampaignId, step, adSetName]);

  // Initialize adName when component mounts with preselected AdSet
  useEffect(() => {
    if (preselectedAdSetName && preselectedAdSetId && step === 3 && !adName) {
      setAdName(`${preselectedAdSetName} - Ad`);
    }
  }, [preselectedAdSetName, preselectedAdSetId, step, adName]);

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step > s
                    ? "bg-green-500 text-white"
                    : step === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > s ? <FiCheck className="w-5 h-5" /> : s}
              </div>
              <span className="text-xs font-medium text-gray-700">
                {s === 1 ? "Campaign" : s === 2 ? "AdSet" : "Ad"}
              </span>
            </div>
            {s < 3 && (
              <div className={`w-16 h-0.5 ${step > s ? "bg-green-500" : "bg-gray-200"}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Create Campaign */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Create Campaign</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Summer Running Sale"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objective *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {objectives.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => setObjective(obj.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        objective === obj.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{obj.icon}</span>
                      <span className="text-sm font-medium text-gray-900">{obj.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreateCampaign}
              disabled={loading || !campaignName.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Creating..." : "Create Campaign"}
              {!loading && <FiArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Create AdSet */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Create AdSet</h3>
            {preselectedCampaignName ? (
              <p className="text-sm text-gray-600 mb-4">
                Create an AdSet for campaign "{preselectedCampaignName}".
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                Campaign "{campaignName}" created successfully! Now create an AdSet for this campaign.
              </p>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AdSet Name *
                </label>
                <input
                  type="text"
                  value={adSetName}
                  onChange={(e) => setAdSetName(e.target.value)}
                  placeholder="e.g., Summer Running Sale - AdSet"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Budget ($) *
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., 225 (minimum ₹225.00)"
                  min="225"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum: ₹225.00 per day</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Country Code) *
                </label>
                <input
                  type="text"
                  value={targeting.location}
                  onChange={(e) => setTargeting({ ...targeting, location: e.target.value.toUpperCase() })}
                  placeholder="e.g., US, GB, CA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Use 2-letter country code (e.g., US, GB, CA)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Age *
                  </label>
                  <input
                    type="number"
                    value={targeting.ageMin}
                    onChange={(e) => setTargeting({ ...targeting, ageMin: parseInt(e.target.value) || 18 })}
                    min="13"
                    max="65"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Age *
                  </label>
                  <input
                    type="number"
                    value={targeting.ageMax}
                    onChange={(e) => setTargeting({ ...targeting, ageMax: parseInt(e.target.value) || 65 })}
                    min="13"
                    max="65"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={resetFlow}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={handleCreateAdSet}
              disabled={loading || !adSetName.trim() || !budget || parseFloat(budget) < 1}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Creating..." : "Create AdSet"}
              {!loading && <FiArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Create Ad */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Create Ad</h3>
            <p className="text-sm text-gray-600 mb-4">
              {preselectedAdSetId 
                ? `Create an Ad for AdSet "${preselectedAdSetName || adSetName}".`
                : `AdSet "${adSetName}" created successfully! Now create an Ad for this AdSet.`
              }
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Name *
                </label>
                <input
                  type="text"
                  value={adName}
                  onChange={(e) => setAdName(e.target.value)}
                  placeholder="e.g., Summer Running Sale - Ad"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image/Video (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {adCreative.media ? (
                    <div className="relative">
                      <img
                        src={adCreative.media}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => setAdCreative({ ...adCreative, media: null, mediaUrl: null })}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Recommended size: 1200×628px
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Text
                </label>
                <textarea
                  value={adCreative.primaryText}
                  onChange={(e) => setAdCreative({ ...adCreative, primaryText: e.target.value })}
                  placeholder="The main text of your ad"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  value={adCreative.headline}
                  onChange={(e) => setAdCreative({ ...adCreative, headline: e.target.value })}
                  placeholder="Short headline"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={adCreative.description}
                  onChange={(e) => setAdCreative({ ...adCreative, description: e.target.value })}
                  placeholder="Details about the offer"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCreateAd}
              disabled={loading || !adName.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Creating..." : "Complete & Create Ad"}
              {!loading && <FiCheck className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaAdsCreate;
