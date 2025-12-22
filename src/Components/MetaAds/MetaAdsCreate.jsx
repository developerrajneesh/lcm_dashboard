import React, { useState, useEffect } from "react";
import { FiUpload, FiX, FiCheck, FiArrowRight } from "react-icons/fi";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
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
  const [optimizationGoal, setOptimizationGoal] = useState("LINK_CLICKS");
  const [bidStrategy, setBidStrategy] = useState("LOWEST_COST_WITHOUT_CAP");
  const [bidAmount, setBidAmount] = useState("");
  const [bidConstraints, setBidConstraints] = useState({ roas_average_floor: "" });
  const [publisherPlatforms, setPublisherPlatforms] = useState(["facebook", "instagram"]);
  
  // Targeting Details
  const [targeting, setTargeting] = useState({
    country: "IN", // Default to India
    countryName: "India",
    state: null,
    stateName: null,
    stateKey: null, // Meta region key
    city: null,
    cityName: null,
    cityKey: null, // Meta city key
    cityRadius: 10,
    distanceUnit: "mile",
    ageMin: 18,
    ageMax: 45,
  });
  
  const [searchingRegions, setSearchingRegions] = useState(false);
  const [searchingCities, setSearchingCities] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  
  // Ad Creative
  const [adName, setAdName] = useState("");
  const [pageId, setPageId] = useState("");
  const [imageHash, setImageHash] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [callToActionType, setCallToActionType] = useState("LEARN_MORE");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [adCreative, setAdCreative] = useState({
    primaryText: "",
    headline: "",
    description: "",
    media: null,
    mediaUrl: null,
  });
  const [ogImageTag, setOgImageTag] = useState(""); // Store Open Graph tag for display

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingImage(true);
      try {
        // Read file as base64 for preview
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Image = reader.result;
          setAdCreative({
            ...adCreative,
            media: base64Image,
            mediaUrl: base64Image,
          });

          // Upload to Meta to get image hash
          try {
            const uploadResponse = await adAPI.uploadImage({
              adAccountId,
              imageBase64: base64Image,
              pageId: pageId, // Pass pageId for alternative upload method
            });

            if (uploadResponse.data.success) {
              if (uploadResponse.data.imageHash) {
                // ✅ Perfect! We have image_hash - this is the preferred method
                setImageHash(uploadResponse.data.imageHash);
                console.log("✅ Image uploaded successfully with image_hash:", uploadResponse.data.imageHash);
                console.log("✅ Using image_hash (preferred method) - image will show in your ad");
              } else {
                // No hash returned - this is OK for Facebook/Instagram ads
                const message = uploadResponse.data.message || uploadResponse.data.warning;
                
                if (message) {
                  console.log("ℹ️", message);
                }
                
                // Only show alert for WhatsApp ads (which require hash)
                // For Facebook/Instagram ads, silently continue - image URL will be used
                if (callToActionType === "WHATSAPP_MESSAGE" && uploadResponse.data.requiresCapability !== false) {
                  alert(
                    "⚠️ Meta App Configuration Required\n\n" +
                    "Your Meta app doesn't have the 'adimages' capability enabled.\n\n" +
                    "For WhatsApp ads, image_hash is required. Please enable the 'adimages' capability in your Meta App Dashboard:\n" +
                    "1. Go to developers.facebook.com\n" +
                    "2. Select your app\n" +
                    "3. Go to Settings > Advanced > Capabilities\n" +
                    "4. Enable 'adimages' capability"
                  );
                } else {
                  // For Facebook/Instagram ads, we'll use redirect page fallback
                  console.log("ℹ️ No image_hash available. Will use redirect page method to show image.");
                  console.log("💡 Tip: Enable 'adimages' capability in Meta App Dashboard to use image_hash (preferred method)");
                }
                
                // Set the image URL if available
                if (uploadResponse.data.imageUrl) {
                  console.log("ℹ️ Image URL available:", uploadResponse.data.imageUrl);
                  // Store the image URL for use in ad creation
                  setAdCreative(prev => ({
                    ...prev,
                    mediaUrl: uploadResponse.data.imageUrl
                  }));
                  
                  // Store Open Graph tag if provided
                  if (uploadResponse.data.ogImageTag) {
                    setOgImageTag(uploadResponse.data.ogImageTag);
                  } else if (uploadResponse.data.imageUrl) {
                    // Generate Open Graph tag
                    setOgImageTag(`<meta property="og:image" content="${uploadResponse.data.imageUrl}">`);
                  }
                }
              }
            } else {
              console.error("❌ Upload failed:", uploadResponse.data.error);
              // Only alert for critical errors, not for capability issues on non-WhatsApp ads
              if (callToActionType === "WHATSAPP_MESSAGE") {
                alert("Failed to upload image to Meta: " + (uploadResponse.data.error || "Unknown error"));
              } else {
                console.warn("⚠️ Image upload had issues, but you can still create the ad:", uploadResponse.data.error);
              }
            }
          } catch (uploadError) {
            console.error("Error uploading image to Meta:", uploadError);
            const errorMsg = uploadError.response?.data?.message || uploadError.message || "Unknown error";
            
            if (errorMsg.includes("capability") || errorMsg.includes("#3")) {
              // Only show alert for WhatsApp ads
              if (callToActionType === "WHATSAPP_MESSAGE") {
                alert(
                  "⚠️ Meta App Configuration Required\n\n" +
                  "Your Meta app doesn't have the 'adimages' capability enabled.\n\n" +
                  "To fix this:\n" +
                  "1. Go to Meta App Dashboard (developers.facebook.com)\n" +
                  "2. Select your app\n" +
                  "3. Go to Settings > Advanced\n" +
                  "4. Enable 'adimages' capability\n\n" +
                  "For WhatsApp ads, image_hash is required."
                );
              } else {
                // For Facebook/Instagram ads, just log - not a blocker
                console.log("ℹ️ Image hash not available due to capability issue, but this is OK for Facebook/Instagram ads. You can still create ads without image hash.");
              }
            } else {
              // For non-capability errors, only alert if it's WhatsApp
              if (callToActionType === "WHATSAPP_MESSAGE") {
                alert("Image preview loaded, but failed to upload to Meta: " + errorMsg);
              } else {
                console.warn("⚠️ Image upload failed, but you can still create Facebook/Instagram ads without it: " + errorMsg);
              }
            }
          } finally {
            setUploadingImage(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error reading image:", error);
        setUploadingImage(false);
      }
    }
  };

  // Load Facebook pages
  const loadPages = async () => {
    if (!accessToken) return;
    
    setLoadingPages(true);
    try {
      const response = await adAPI.getPages();
      if (response.data.success && response.data.pages?.data) {
        setPages(response.data.pages.data);
        // Auto-select first page if available
        if (response.data.pages.data.length > 0 && !pageId) {
          setPageId(response.data.pages.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading pages:", error);
    } finally {
      setLoadingPages(false);
    }
  };

  // Search for regions using Meta API
  const searchRegions = async (stateName, countryCode) => {
    if (!stateName || stateName.length < 2) {
      setRegionOptions([]);
      return;
    }

    setSearchingRegions(true);
    try {
      const response = await adsetAPI.getTargetingSearch({
        q: stateName,
        type: "region",
        country_code: countryCode,
      });

      if (response.data.success && response.data.data) {
        setRegionOptions(response.data.data || []);
      }
    } catch (error) {
      console.error("Error searching regions:", error);
      setRegionOptions([]);
    } finally {
      setSearchingRegions(false);
    }
  };

  // Search for cities using Meta API
  const searchCities = async (cityName, countryCode) => {
    if (!cityName || cityName.length < 2) {
      setCityOptions([]);
      return;
    }

    setSearchingCities(true);
    try {
      const response = await adsetAPI.getTargetingSearch({
        q: cityName,
        type: "city",
        country_code: countryCode,
      });

      if (response.data.success && response.data.data) {
        setCityOptions(response.data.data || []);
      }
    } catch (error) {
      console.error("Error searching cities:", error);
      setCityOptions([]);
    } finally {
      setSearchingCities(false);
    }
  };

  // Handle country change
  const handleCountryChange = (countryCode) => {
    // Ensure we're using the ISO code, not the name
    if (!countryCode || countryCode.trim() === "") {
      return;
    }
    
    // Find country by ISO code
    const country = countries.find(c => c.isoCode === countryCode || c.isoCode === countryCode.toUpperCase());
    
    // If not found by ISO code, try to find by name (fallback)
    const countryByName = countries.find(c => c.name === countryCode);
    
    // Use the found country or default to the provided code
    const finalCountry = country || countryByName;
    const finalCountryCode = finalCountry?.isoCode || countryCode.toUpperCase().substring(0, 2);
    
    console.log("🌍 Country change:", { countryCode, finalCountryCode, country: finalCountry });
    
    setTargeting({
      ...targeting,
      country: finalCountryCode, // Always use ISO code
      countryName: finalCountry?.name || "",
      state: null,
      stateName: null,
      stateKey: null,
      city: null,
      cityName: null,
      cityKey: null,
    });
    setRegionOptions([]);
    setCityOptions([]);
    setStates([]);
    setCities([]);
  };

  // Handle state change
  const handleStateChange = async (stateId) => {
    if (!stateId) {
      setTargeting({
        ...targeting,
        state: null,
        stateName: null,
        stateKey: null,
        city: null,
        cityName: null,
        cityKey: null,
      });
      setRegionOptions([]);
      setCities([]);
      return;
    }

    const state = states.find(s => s.id === parseInt(stateId));
    if (state) {
      setTargeting({
        ...targeting,
        state: stateId,
        stateName: state.name,
        stateKey: null, // Will be set when user selects from Meta results
        city: null,
        cityName: null,
        cityKey: null,
      });
      setCityOptions([]);
      setCities([]);
      // Search for Meta region key
      await searchRegions(state.name, targeting.country);
    }
  };

  // Handle city change
  const handleCityChange = async (cityId) => {
    if (!cityId) {
      setTargeting({
        ...targeting,
        city: null,
        cityName: null,
        cityKey: null,
      });
      setCityOptions([]);
      return;
    }

    const city = cities.find(c => c.id === parseInt(cityId));
    if (city) {
      setTargeting({
        ...targeting,
        city: cityId,
        cityName: city.name,
        cityKey: null, // Will be set when user selects from Meta results
      });
      // Search for Meta city key
      await searchCities(city.name, targeting.country);
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

      // Validate country is selected
      if (!targeting.country || String(targeting.country).trim() === "") {
        alert("Please select a country");
        setLoading(false);
        return;
      }

      // Build detailed targeting data
      // Ensure country code is uppercase (Meta API requires uppercase)
      let countryCode = String(targeting.country).trim().toUpperCase();
      
      // If country code is longer than 2 characters, it might be a country name
      // Try to find the ISO code from the countries list
      if (countryCode.length > 2) {
        const foundCountry = countries.find(c => 
          c.name.toUpperCase() === countryCode || 
          c.isoCode.toUpperCase() === countryCode
        );
        if (foundCountry) {
          countryCode = foundCountry.isoCode.toUpperCase();
          console.log("🌍 Converted country name to ISO code:", countryCode);
        } else {
          alert(`Invalid country: ${countryCode}. Please select a valid country from the dropdown.`);
          setLoading(false);
          return;
        }
      }
      
      // Validate country code format (must be 2 letters)
      if (countryCode.length !== 2 || !/^[A-Z]{2}$/.test(countryCode)) {
        alert(`Invalid country code: ${countryCode}. Please select a valid country from the dropdown.`);
        setLoading(false);
        return;
      }
      
      console.log("🌍 Selected country code:", countryCode);
      console.log("🌍 Full targeting object:", targeting);
      console.log("🌍 Available countries count:", countries.length);
      
      const geoLocations = {
        countries: [countryCode],
      };
      
      // Add region if selected
      if (targeting.stateKey) {
        geoLocations.regions = [{ key: String(targeting.stateKey) }];
      }
      
      // Add city if selected
      if (targeting.cityKey) {
        geoLocations.cities = [{
          key: String(targeting.cityKey),
          radius: parseInt(targeting.cityRadius) || 10,
          distance_unit: targeting.distanceUnit || "mile"
        }];
      }
      
      const targetingData = {
        geo_locations: geoLocations,
        age_min: parseInt(targeting.ageMin) || 18,
        age_max: parseInt(targeting.ageMax) || 45,
        publisher_platforms: publisherPlatforms,
      };
      
      console.log("📦 Targeting data to send:", JSON.stringify(targetingData, null, 2));

      // Convert budget to paise (×100) - Meta uses paise for INR
      // Minimum is ₹225 = 22500 paise
      const dailyBudgetPaise = Math.round(parseFloat(budget) * 100);
      if (isNaN(dailyBudgetPaise) || dailyBudgetPaise < 22500) {
        throw new Error("Daily budget must be at least ₹225.00 (22500 paise)");
      }

      // Build payload with conditional fields
      const adSetPayload = {
        campaignId: createdCampaignId,
        adAccountId,
        name: adSetName,
        optimizationGoal: optimizationGoal,
        billingEvent: billingEvent, // Use validated billing event
        bidStrategy: bidStrategy,
        dailyBudget: dailyBudgetPaise, // Send in paise
        targeting: targetingData,
        status: "PAUSED",
        autoFixBudget: false, // Set to true if you want auto-fix
      };

      // Add bidAmount if required by bid strategy
      if (bidStrategy === "LOWEST_COST_WITH_BID_CAP" || bidStrategy === "COST_CAP") {
        if (!bidAmount || parseFloat(bidAmount) <= 0) {
          alert("Bid Amount is required for the selected bid strategy");
          setLoading(false);
          return;
        }
        adSetPayload.bidAmount = parseFloat(bidAmount);
      }

      // Add bidConstraints if required by bid strategy
      if (bidStrategy === "LOWEST_COST_WITH_MIN_ROAS") {
        if (!bidConstraints.roas_average_floor || parseFloat(bidConstraints.roas_average_floor) <= 0) {
          alert("ROAS Average Floor is required for ROAS Goal bid strategy");
          setLoading(false);
          return;
        }
        adSetPayload.bidConstraints = bidConstraints;
      }

      const adSetResponse = await adsetAPI.create(adSetPayload);

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

    // Validate required fields based on call to action type
    if (callToActionType === "WHATSAPP_MESSAGE") {
      if (!pageId) {
        alert("Page ID is required for WhatsApp ads");
        return;
      }
      if (!imageHash) {
        alert("Image is required for WhatsApp ads. Please upload an image.");
        return;
      }
    } else {
      // For Facebook/Instagram ads, image is optional but recommended
      // If no image is uploaded, we'll proceed without it
      if (!adCreative.media && !imageHash) {
        const proceed = confirm("No image uploaded. Do you want to continue without an image?");
        if (!proceed) {
          return;
        }
      }
    }

    setLoading(true);

    try {
      // Build object_story_spec based on call to action type
      let objectStorySpec = {};

      if (callToActionType === "WHATSAPP_MESSAGE") {
        // WhatsApp ad format
        objectStorySpec = {
          page_id: pageId,
          link_data: {
            image_hash: imageHash,
            message: adCreative.primaryText || adCreative.message || "Chat with us on WhatsApp to get instant details",
            call_to_action: {
              type: "WHATSAPP_MESSAGE",
            },
          },
        };
      } else {
        // Standard link ad format for Facebook/Instagram
        // page_id is REQUIRED for link ads in most cases
        if (!pageId) {
          alert("Page ID is required for Facebook/Instagram link ads. Please select a Facebook page.");
          setLoading(false);
          return;
        }

        const linkData = {
          message: adCreative.primaryText || "Check out our offer!",
          link: destinationUrl || "https://www.example.com",
          name: adCreative.headline || adName,
          description: adCreative.description || "",
          call_to_action: {
            type: callToActionType || "LEARN_MORE",
          },
        };

        // Meta only supports image_hash in link_data, not image_url
        // PRIORITY: Always use image_hash if available (preferred method - direct and reliable)
        if (imageHash) {
          linkData.image_hash = imageHash;
          console.log("✅ Using image_hash (preferred method):", imageHash);
          console.log("✅ Image will show in the ad using image_hash");
          // Keep original destination URL when using image_hash
        } else if (adCreative.mediaUrl) {
          // Fallback: No image_hash available, use redirect page with Open Graph tags
          const redirectPageUrl = adAPI.getRedirectPageUrl(
            adCreative.mediaUrl,
            destinationUrl || "https://www.example.com",
            adCreative.headline || adName,
            adCreative.description || ""
          );
          
          console.log("ℹ️ No image_hash available. Using redirect page method as fallback.");
          console.log("💡 To use image_hash (preferred method), enable 'adimages' capability in Meta App Dashboard");
          
          // Use the redirect page URL as the destination link
          linkData.link = redirectPageUrl;
        } else {
          console.log("ℹ️ No image available. Meta will use page's profile picture or default image.");
        }

        // Remove empty fields to avoid validation errors
        if (!linkData.message || linkData.message.trim() === "") {
          delete linkData.message;
        }
        if (!linkData.name || linkData.name.trim() === "") {
          linkData.name = adName; // Use ad name as fallback
        }
        if (!linkData.description || linkData.description.trim() === "") {
          delete linkData.description;
        }

        objectStorySpec = {
          page_id: pageId, // Required for link ads
          link_data: linkData,
        };
      }

      const adResponse = await adAPI.create({
        adsetId: createdAdSetId,
        name: adName,
        creative: {
          object_story_spec: objectStorySpec,
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
      setPageId("");
      setImageHash("");
      setCallToActionType("LEARN_MORE");
      setDestinationUrl("");
      setBudget("");
      setObjective("OUTCOME_TRAFFIC");
      setOptimizationGoal("LINK_CLICKS");
      setBidStrategy("LOWEST_COST_WITHOUT_CAP");
      setBidAmount("");
      setBidConstraints({ roas_average_floor: "" });
      setPublisherPlatforms(["facebook", "instagram"]);
      setTargeting({
        country: "IN",
        countryName: "India",
        state: null,
        stateName: null,
        stateKey: null,
        city: null,
        cityName: null,
        cityKey: null,
        cityRadius: 10,
        distanceUnit: "mile",
        ageMin: 18,
        ageMax: 45,
      });
      setRegionOptions([]);
      setCityOptions([]);
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
    setPageId("");
    setImageHash("");
    setCallToActionType("LEARN_MORE");
    setDestinationUrl("");
    setBudget("");
    setObjective("OUTCOME_TRAFFIC");
    setOptimizationGoal("LINK_CLICKS");
    setBidStrategy("LOWEST_COST_WITHOUT_CAP");
    setBidAmount("");
    setBidConstraints({ roas_average_floor: "" });
    setPublisherPlatforms(["facebook", "instagram"]);
    setTargeting({
      country: "IN",
      countryName: "India",
      state: null,
      stateName: null,
      stateKey: null,
      city: null,
      cityName: null,
      cityKey: null,
      cityRadius: 10,
      distanceUnit: "mile",
      ageMin: 18,
      ageMax: 45,
    });
    setRegionOptions([]);
    setCityOptions([]);
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

  // Load pages when step 3 is shown
  useEffect(() => {
    if (step === 3 && accessToken) {
      loadPages();
    }
  }, [step, accessToken]);

  // Ensure default country is set when step 2 is shown
  useEffect(() => {
    if (step === 2 && (!targeting.country || targeting.country.trim() === "")) {
      setTargeting(prev => ({
        ...prev,
        country: "IN",
        countryName: "India"
      }));
    }
  }, [step]);

  // Comprehensive country list (static, always available)
  const staticCountries = [
    { isoCode: "IN", name: "India" },
    { isoCode: "US", name: "United States" },
    { isoCode: "GB", name: "United Kingdom" },
    { isoCode: "CA", name: "Canada" },
    { isoCode: "AU", name: "Australia" },
    { isoCode: "DE", name: "Germany" },
    { isoCode: "FR", name: "France" },
    { isoCode: "IT", name: "Italy" },
    { isoCode: "ES", name: "Spain" },
    { isoCode: "NL", name: "Netherlands" },
    { isoCode: "BE", name: "Belgium" },
    { isoCode: "CH", name: "Switzerland" },
    { isoCode: "AT", name: "Austria" },
    { isoCode: "SE", name: "Sweden" },
    { isoCode: "NO", name: "Norway" },
    { isoCode: "DK", name: "Denmark" },
    { isoCode: "FI", name: "Finland" },
    { isoCode: "PL", name: "Poland" },
    { isoCode: "PT", name: "Portugal" },
    { isoCode: "GR", name: "Greece" },
    { isoCode: "IE", name: "Ireland" },
    { isoCode: "BR", name: "Brazil" },
    { isoCode: "MX", name: "Mexico" },
    { isoCode: "AR", name: "Argentina" },
    { isoCode: "CL", name: "Chile" },
    { isoCode: "CO", name: "Colombia" },
    { isoCode: "PE", name: "Peru" },
    { isoCode: "JP", name: "Japan" },
    { isoCode: "CN", name: "China" },
    { isoCode: "KR", name: "South Korea" },
    { isoCode: "SG", name: "Singapore" },
    { isoCode: "MY", name: "Malaysia" },
    { isoCode: "TH", name: "Thailand" },
    { isoCode: "ID", name: "Indonesia" },
    { isoCode: "PH", name: "Philippines" },
    { isoCode: "VN", name: "Vietnam" },
    { isoCode: "AE", name: "United Arab Emirates" },
    { isoCode: "SA", name: "Saudi Arabia" },
    { isoCode: "IL", name: "Israel" },
    { isoCode: "TR", name: "Turkey" },
    { isoCode: "ZA", name: "South Africa" },
    { isoCode: "EG", name: "Egypt" },
    { isoCode: "NG", name: "Nigeria" },
    { isoCode: "KE", name: "Kenya" },
    { isoCode: "NZ", name: "New Zealand" },
  ];

  // Load countries on mount - try API first, fallback to static list
  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      
      // First, set static countries immediately so dropdown works
      setCountries(staticCountries);
      setLoadingCountries(false);
      
      // Set default to India
      setTargeting(prev => ({
        ...prev,
        country: prev.country && prev.country.length === 2 ? prev.country : "IN",
        countryName: prev.country === "IN" ? "India" : (prev.countryName || "India")
      }));
      
      // Try to load from API in background (optional enhancement)
      try {
        console.log("🌍 Attempting to load countries from API...");
        const countriesData = await GetCountries();
        console.log("🌍 GetCountries response:", countriesData);
        
        // Handle different response formats
        let countriesList = [];
        if (Array.isArray(countriesData)) {
          countriesList = countriesData;
        } else if (countriesData && Array.isArray(countriesData.data)) {
          countriesList = countriesData.data;
        } else if (countriesData && countriesData.countries) {
          countriesList = countriesData.countries;
        }
        
        // Filter to only include countries with valid ISO codes
        const validCountries = countriesList.filter(c => 
          c && 
          c.isoCode && 
          typeof c.isoCode === 'string' && 
          c.isoCode.length === 2 &&
          c.name
        );
        
        // If we got valid countries from API, use them (they might have more countries)
        if (validCountries.length > 0) {
          console.log("✅ Loaded", validCountries.length, "countries from API");
          setCountries(validCountries);
        } else {
          console.log("⚠️ API returned no valid countries, using static list");
        }
      } catch (error) {
        console.warn("⚠️ Could not load countries from API, using static list:", error.message);
        // Static list is already set, so no action needed
      }
    };
    
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    const loadStates = async () => {
      if (targeting.country) {
        try {
          // Find country ID from countries list
          const country = countries.find(c => c.isoCode === targeting.country);
          if (country) {
            const statesData = await GetState(country.id);
            setStates(statesData || []);
          }
        } catch (error) {
          console.error("Error loading states:", error);
          setStates([]);
        }
      } else {
        setStates([]);
      }
    };
    loadStates();
  }, [targeting.country, countries]);

  // Load cities when state changes
  useEffect(() => {
    const loadCities = async () => {
      if (targeting.country && targeting.state) {
        try {
          const country = countries.find(c => c.isoCode === targeting.country);
          if (country) {
            const citiesData = await GetCity(country.id, parseInt(targeting.state));
            setCities(citiesData || []);
          }
        } catch (error) {
          console.error("Error loading cities:", error);
          setCities([]);
        }
      } else {
        setCities([]);
      }
    };
    loadCities();
  }, [targeting.country, targeting.state, countries]);

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
            
            <div className="space-y-6">
              {/* AdSet Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AdSet Name *
                </label>
                <input
                  type="text"
                  value={adSetName}
                  onChange={(e) => setAdSetName(e.target.value)}
                  placeholder="e.g., My_AdSet_Gonda_UP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Optimization Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optimization Goal *
                </label>
                <select
                  value={optimizationGoal}
                  onChange={(e) => setOptimizationGoal(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LINK_CLICKS">Link Clicks</option>
                  <option value="CONVERSIONS">Conversions</option>
                  <option value="VALUE">Value</option>
                  <option value="OUTCOME_TRAFFIC">Outcome Traffic</option>
                  <option value="OUTCOME_ENGAGEMENT">Outcome Engagement</option>
                  <option value="OUTCOME_CONVERSIONS">Outcome Conversions</option>
                  <option value="BRAND_AWARENESS">Brand Awareness</option>
                  <option value="REACH">Reach</option>
                  <option value="VIDEO_VIEWS">Video Views</option>
                  <option value="POST_ENGAGEMENT">Post Engagement</option>
                </select>
              </div>

              {/* Bid Strategy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Strategy *
                </label>
                <select
                  value={bidStrategy}
                  onChange={(e) => {
                    setBidStrategy(e.target.value);
                    // Reset related fields when strategy changes
                    if (e.target.value === "LOWEST_COST_WITHOUT_CAP") {
                      setBidAmount("");
                      setBidConstraints({ roas_average_floor: "" });
                    } else if (e.target.value === "LOWEST_COST_WITH_MIN_ROAS") {
                      setBidAmount("");
                      setOptimizationGoal("VALUE"); // ROAS requires VALUE optimization goal
                    } else {
                      setBidConstraints({ roas_average_floor: "" });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LOWEST_COST_WITHOUT_CAP">Lowest Cost (No Cap)</option>
                  <option value="LOWEST_COST_WITH_BID_CAP">Lowest Cost with Bid Cap</option>
                  <option value="COST_CAP">Cost Cap</option>
                  <option value="LOWEST_COST_WITH_MIN_ROAS">Lowest Cost with ROAS Goal</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Note: Bid Cap and ROAS Goal require additional parameters
                </p>
              </div>

              {/* Bid Amount - shown when LOWEST_COST_WITH_BID_CAP or COST_CAP is selected */}
              {(bidStrategy === "LOWEST_COST_WITH_BID_CAP" || bidStrategy === "COST_CAP") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bid Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="e.g., 10.00"
                    min="0.01"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum amount you're willing to pay per action (in rupees)
                  </p>
                </div>
              )}

              {/* ROAS Average Floor - shown when LOWEST_COST_WITH_MIN_ROAS is selected */}
              {bidStrategy === "LOWEST_COST_WITH_MIN_ROAS" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ROAS Average Floor *
                  </label>
                  <input
                    type="number"
                    value={bidConstraints.roas_average_floor}
                    onChange={(e) => setBidConstraints({ roas_average_floor: e.target.value })}
                    placeholder="e.g., 2.5"
                    min="0.01"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum Return on Ad Spend (ROAS) you want to achieve. Optimization Goal will be set to "VALUE" automatically.
                  </p>
                </div>
              )}

              {/* Daily Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Budget (₹) *
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., 500 (minimum ₹225.00)"
                  min="225"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum: ₹225.00 per day</p>
              </div>

              {/* Targeting Section */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Targeting</h4>
                
                {/* Country */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  {loadingCountries ? (
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                      <span className="text-sm text-gray-500">Loading countries...</span>
                    </div>
                  ) : countries.length === 0 ? (
                    <div className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50">
                      <span className="text-sm text-red-600">
                        Failed to load countries. Please refresh the page.
                      </span>
                    </div>
                  ) : (
                    <select
                      value={targeting.country && targeting.country.length === 2 ? targeting.country : ""}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        console.log("🌍 Dropdown changed to:", selectedValue);
                        if (selectedValue && selectedValue.length === 2) {
                          handleCountryChange(selectedValue);
                        } else {
                          setTargeting(prev => ({
                            ...prev,
                            country: "",
                            countryName: ""
                          }));
                        }
                      }}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Country *</option>
                      {countries.map((country) => {
                        // Ensure we only use valid ISO codes
                        if (!country || !country.isoCode || country.isoCode.length !== 2 || !country.name) {
                          return null;
                        }
                        return (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        );
                      })}
                    </select>
                  )}
                  {!loadingCountries && countries.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {countries.length} countries available
                    </p>
                  )}
                </div>

                {/* State/Region */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Region (Optional)
                  </label>
                  <select
                    value={targeting.state || ""}
                    onChange={(e) => handleStateChange(e.target.value)}
                    disabled={!targeting.country || states.length === 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select State/Region</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Meta Region Search Results */}
                  {targeting.stateName && regionOptions.length > 0 && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Select Meta Region Key:
                      </label>
                      <select
                        value={targeting.stateKey || ""}
                        onChange={(e) => {
                          const selected = regionOptions.find(r => r.key === e.target.value);
                          setTargeting({
                            ...targeting,
                            stateKey: e.target.value,
                          });
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Region Key</option>
                        {regionOptions.map((region) => (
                          <option key={region.key} value={region.key}>
                            {region.name} (Key: {region.key})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {searchingRegions && (
                    <p className="text-xs text-gray-500 mt-1">Searching regions...</p>
                  )}
                </div>

                {/* City */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City (Optional)
                  </label>
                  <select
                    value={targeting.city || ""}
                    onChange={(e) => handleCityChange(e.target.value)}
                    disabled={!targeting.state || cities.length === 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Meta City Search Results */}
                  {targeting.cityName && cityOptions.length > 0 && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Select Meta City Key:
                      </label>
                      <select
                        value={targeting.cityKey || ""}
                        onChange={(e) => {
                          setTargeting({
                            ...targeting,
                            cityKey: e.target.value,
                          });
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select City Key</option>
                        {cityOptions.map((city) => (
                          <option key={city.key} value={city.key}>
                            {city.name} (Key: {city.key})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {searchingCities && (
                    <p className="text-xs text-gray-500 mt-1">Searching cities...</p>
                  )}
                  
                  {/* City Radius (only if city is selected) */}
                  {targeting.cityKey && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Radius
                        </label>
                        <input
                          type="number"
                          value={targeting.cityRadius}
                          onChange={(e) => setTargeting({ ...targeting, cityRadius: e.target.value })}
                          min="1"
                          max="50"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Distance Unit
                        </label>
                        <select
                          value={targeting.distanceUnit}
                          onChange={(e) => setTargeting({ ...targeting, distanceUnit: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="mile">Miles</option>
                          <option value="km">Kilometers</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Age Range */}
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                      onChange={(e) => setTargeting({ ...targeting, ageMax: parseInt(e.target.value) || 45 })}
                      min="13"
                      max="65"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Publisher Platforms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publisher Platforms *
                  </label>
                  <div className="space-y-2">
                    {["facebook", "instagram", "messenger", "audience_network"].map((platform) => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={publisherPlatforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPublisherPlatforms([...publisherPlatforms, platform]);
                            } else {
                              setPublisherPlatforms(publisherPlatforms.filter(p => p !== platform));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {platform.replace("_", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
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
              disabled={
                loading || 
                !adSetName.trim() || 
                !budget || 
                parseFloat(budget) < 225 || 
                !targeting.country || targeting.country.trim() === "" ||
                publisherPlatforms.length === 0 ||
                (bidStrategy === "LOWEST_COST_WITH_BID_CAP" && (!bidAmount || parseFloat(bidAmount) <= 0)) ||
                (bidStrategy === "COST_CAP" && (!bidAmount || parseFloat(bidAmount) <= 0)) ||
                (bidStrategy === "LOWEST_COST_WITH_MIN_ROAS" && (!bidConstraints.roas_average_floor || parseFloat(bidConstraints.roas_average_floor) <= 0))
              }
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
                  placeholder="e.g., WhatsApp Creative"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Call to Action Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call to Action Type *
                </label>
                <select
                  value={callToActionType}
                  onChange={(e) => setCallToActionType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LEARN_MORE">Learn More</option>
                  <option value="SHOP_NOW">Shop Now</option>
                  <option value="SIGN_UP">Sign Up</option>
                  <option value="DOWNLOAD">Download</option>
                  <option value="BOOK_TRAVEL">Book Travel</option>
                  <option value="CONTACT_US">Contact Us</option>
                  <option value="WHATSAPP_MESSAGE">WhatsApp Message</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select "WhatsApp Message" for WhatsApp ads
                </p>
              </div>

              {/* Facebook Page Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Page *
                </label>
                {loadingPages ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-500">Loading pages...</span>
                  </div>
                ) : (
                  <select
                    value={pageId}
                    onChange={(e) => setPageId(e.target.value)}
                    required={callToActionType === "WHATSAPP_MESSAGE"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Facebook Page</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.name} ({page.id})
                      </option>
                    ))}
                  </select>
                )}
                {pages.length === 0 && !loadingPages && (
                  <p className="text-xs text-red-500 mt-1">
                    No pages found. Make sure your Facebook account has pages.
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image {callToActionType === "WHATSAPP_MESSAGE" ? "*" : "(Recommended)"}
                </label>
                {callToActionType !== "WHATSAPP_MESSAGE" && (
                  <p className="text-xs text-gray-500 mb-2">
                    Image is recommended for better ad performance. If upload fails, you can still create the ad without an image.
                  </p>
                )}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-sm text-gray-600">Uploading image to Meta...</p>
                    </div>
                  ) : adCreative.media ? (
                    <div className="relative">
                      <img
                        src={adCreative.media}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setAdCreative({ ...adCreative, media: null, mediaUrl: null });
                          setImageHash("");
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                      {imageHash && (
                        <div className="mt-2 text-xs text-green-600">
                          ✓ Image uploaded (Hash: {imageHash.substring(0, 20)}...)
                        </div>
                      )}
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
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Recommended size: 1200×628px (Required for WhatsApp ads)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Message/Primary Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message {callToActionType === "WHATSAPP_MESSAGE" ? "*" : "(Optional)"}
                </label>
                <textarea
                  value={adCreative.primaryText}
                  onChange={(e) => setAdCreative({ ...adCreative, primaryText: e.target.value })}
                  placeholder={
                    callToActionType === "WHATSAPP_MESSAGE"
                      ? "Chat with us on WhatsApp to get instant details"
                      : "The main text of your ad"
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Destination URL - Only show for non-WhatsApp ads */}
              {callToActionType !== "WHATSAPP_MESSAGE" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination URL *
                    </label>
                    <input
                      type="url"
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      placeholder="https://www.example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headline (Optional)
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
                      Description (Optional)
                    </label>
                    <textarea
                      value={adCreative.description}
                      onChange={(e) => setAdCreative({ ...adCreative, description: e.target.value })}
                      placeholder="Details about the offer"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
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
              disabled={
                loading || 
                !adName.trim() ||
                (callToActionType === "WHATSAPP_MESSAGE" && (!pageId || !imageHash)) ||
                (callToActionType !== "WHATSAPP_MESSAGE" && (!pageId || !destinationUrl))
              }
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title={
                callToActionType === "WHATSAPP_MESSAGE" && !imageHash
                  ? "Image is required for WhatsApp ads"
                  : callToActionType !== "WHATSAPP_MESSAGE" && !pageId
                  ? "Facebook Page is required for link ads"
                  : callToActionType !== "WHATSAPP_MESSAGE" && !destinationUrl
                  ? "Destination URL is required"
                  : ""
              }
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
