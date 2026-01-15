import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiFileText, FiArrowLeft, FiSmartphone, FiFacebook, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import metaApi from "../../../utils/metaApi";
import { adAPI } from "../../../utils/api";
import PlacesAutocomplete from "../../../Components/PlacesAutocomplete";

export default function LeadFormAdSet() {
  const navigate = useNavigate();
  const location = useLocation();
  const campaignData = location.state || {};
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    daily_budget: "",
    page_id: campaignData.page_id || "",
    min_age: "18",
    max_age: "45",
    genders: [],
    targeting: {
      geo_locations: { countries: [] },
      device_platforms: [],
      publisher_platforms: [],
      facebook_positions: [],
      instagram_positions: [],
    },
  });
  const [customLocations, setCustomLocations] = useState([]); // Array of { latitude, longitude, radius, distance_unit, name, address }
  const [selectedPlace, setSelectedPlace] = useState(null); // Store selected place from Google Places
  const [expandedLocations, setExpandedLocations] = useState(new Set()); // Track which location cards are expanded

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoadingPages(true);
      const response = await adAPI.getPages();
      if (response.data.success && response.data.pages?.data) {
        const pagesData = response.data.pages.data;
        setPages(pagesData);
        // Auto-select the first page if no page_id is set
        if (pagesData.length > 0 && !formData.page_id) {
          setFormData((prev) => ({
            ...prev,
            page_id: pagesData[0].id,
          }));
        } else if (formData.page_id && pagesData.find(p => p.id === formData.page_id)) {
          // Keep the existing page_id if it exists in the fetched pages
          // No change needed
        }
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      alert("Failed to fetch Facebook pages. Please try again.");
    } finally {
      setLoadingPages(false);
    }
  };

  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
  ];

  const devicePlatforms = [
    { value: "mobile", label: "Mobile", icon: FiSmartphone, color: "blue" },
    { value: "desktop", label: "Desktop", icon: FiSmartphone, color: "purple" },
  ];

  const publisherPlatforms = [
    { value: "facebook", label: "Facebook", icon: FiFacebook, color: "blue" },
    { value: "instagram", label: "Instagram", icon: FiFacebook, color: "pink" },
    { value: "messenger", label: "Messenger", icon: FiFacebook, color: "blue" },
    { value: "audience_network", label: "Audience Network", icon: FiFacebook, color: "green" },
  ];

  const genders = [
    { value: 1, label: "Male" },
    { value: 2, label: "Female" },
  ];

  const facebookPositions = [
    { value: "feed", label: "Feed" },
    { value: "instant_article", label: "Instant Article" },
  ];

  const instagramPositions = [
    { value: "stream", label: "Feed" },
    { value: "reels", label: "Reels" },
    { value: "story", label: "Story" },
    { value: "explore", label: "Explore" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryToggle = (countryCode) => {
    setFormData((prev) => {
      const countries = [...prev.targeting.geo_locations.countries];
      const index = countries.indexOf(countryCode);
      if (index > -1) {
        countries.splice(index, 1);
      } else {
        countries.push(countryCode);
      }
      return {
        ...prev,
        targeting: {
          ...prev.targeting,
          geo_locations: { countries },
        },
      };
    });
  };

  const handleDeviceToggle = (device) => {
    setFormData((prev) => {
      const devices = [...prev.targeting.device_platforms];
      const index = devices.indexOf(device);
      if (index > -1) {
        devices.splice(index, 1);
      } else {
        devices.push(device);
      }
      return {
        ...prev,
        targeting: {
          ...prev.targeting,
          device_platforms: devices,
        },
      };
    });
  };

  const handlePublisherToggle = (publisher) => {
    setFormData((prev) => {
      const publishers = [...prev.targeting.publisher_platforms];
      const index = publishers.indexOf(publisher);
      if (index > -1) {
        publishers.splice(index, 1);
      } else {
        publishers.push(publisher);
      }
      return {
        ...prev,
        targeting: {
          ...prev.targeting,
          publisher_platforms: publishers,
        },
      };
    });
  };

  const handleGenderToggle = (genderValue) => {
    setFormData((prev) => {
      const genders = [...prev.genders];
      const index = genders.indexOf(genderValue);
      if (index > -1) {
        genders.splice(index, 1);
      } else {
        genders.push(genderValue);
      }
      return {
        ...prev,
        genders,
      };
    });
  };

  const handleFacebookPositionToggle = (position) => {
    setFormData((prev) => {
      const positions = [...prev.targeting.facebook_positions];
      const index = positions.indexOf(position);
      if (index > -1) {
        positions.splice(index, 1);
      } else {
        positions.push(position);
      }
      return {
        ...prev,
        targeting: {
          ...prev.targeting,
          facebook_positions: positions,
        },
      };
    });
  };

  const handleInstagramPositionToggle = (position) => {
    setFormData((prev) => {
      const positions = [...prev.targeting.instagram_positions];
      const index = positions.indexOf(position);
      if (index > -1) {
        positions.splice(index, 1);
        // If removing explore, we can optionally remove stream too (but not required)
        // If removing stream and explore is still selected, keep explore but warn
        if (position === 'stream' && positions.includes('explore')) {
          // If stream is removed but explore is still there, remove explore too
          // because explore requires stream
          const exploreIndex = positions.indexOf('explore');
          if (exploreIndex > -1) {
            positions.splice(exploreIndex, 1);
          }
        }
      } else {
        positions.push(position);
        // If selecting explore, automatically add stream (feed) as it's required
        if (position === 'explore' && !positions.includes('stream')) {
          positions.push('stream');
        }
      }
      return {
        ...prev,
        targeting: {
          ...prev.targeting,
          instagram_positions: positions,
        },
      };
    });
  };

  // Handle place selection from Google Places
  const handlePlaceSelect = (placeInfo) => {
    if (placeInfo) {
      setSelectedPlace(placeInfo);
      console.log("📍 Place selected:", placeInfo);
      
      // Automatically add to custom_locations if coordinates are available
      if (placeInfo.location && placeInfo.location.lat && placeInfo.location.lng) {
        const newCustomLocation = {
          latitude: placeInfo.location.lat,
          longitude: placeInfo.location.lng,
          radius: 5, // Default radius in kilometers (within 2-17 km range)
          distance_unit: "kilometer", // Always use kilometers
          name: placeInfo.name || "",
          address: placeInfo.address || "",
          placeId: placeInfo.placeId || ""
        };
        
        // Ensure radius is within valid range (2-17 km)
        if (newCustomLocation.radius < 2) {
          newCustomLocation.radius = 2;
        } else if (newCustomLocation.radius > 17) {
          newCustomLocation.radius = 17;
        }
        
        // Check if this location already exists (avoid duplicates)
        const exists = customLocations.some(loc => 
          Math.abs(loc.latitude - newCustomLocation.latitude) < 0.0001 &&
          Math.abs(loc.longitude - newCustomLocation.longitude) < 0.0001
        );
        
        if (!exists) {
          setCustomLocations([...customLocations, newCustomLocation]);
          console.log("✅ Added to custom_locations:", newCustomLocation);
          // Clear selected place after adding so user can add more
          setTimeout(() => {
            setSelectedPlace(null);
          }, 2000);
        } else {
          console.log("ℹ️ Location already exists in custom_locations");
          setSelectedPlace(null);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter ad set name");
      return;
    }
    if (!formData.daily_budget) {
      alert("Please enter daily budget");
      return;
    }
    const budgetAmount = parseFloat(formData.daily_budget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      alert("Please enter a valid daily budget amount");
      return;
    }
    if (!formData.page_id.trim()) {
      alert("Please enter Page ID");
      return;
    }
    if (!formData.min_age || !formData.max_age) {
      alert("Please enter Min Age and Max Age");
      return;
    }
    if (parseInt(formData.min_age) < 13 || parseInt(formData.min_age) > 65) {
      alert("Min Age must be between 13 and 65");
      return;
    }
    if (parseInt(formData.max_age) < 13 || parseInt(formData.max_age) > 65) {
      alert("Max Age must be between 13 and 65");
      return;
    }
    if (parseInt(formData.min_age) > parseInt(formData.max_age)) {
      alert("Min Age cannot be greater than Max Age");
      return;
    }
    // Validate: Either countries or custom_locations must be provided
    if (
      formData.targeting.geo_locations.countries.length === 0 &&
      customLocations.length === 0
    ) {
      alert("Please select at least one country or add a custom location using Google Places");
      return;
    }
    
    // Validate all custom locations have valid radius (2-17 km)
    if (customLocations.length > 0) {
      const invalidLocations = customLocations.filter(loc => 
        !loc.radius || loc.radius < 2 || loc.radius > 17
      );
      if (invalidLocations.length > 0) {
        alert("All custom locations must have a radius between 2 km and 17 km. Please adjust the radius values.");
        return;
      }
    }
    if (formData.targeting.publisher_platforms.length === 0) {
      alert("Please select at least one publisher platform");
      return;
    }
    if (!campaignData.campaign_id) {
      alert("Campaign ID is missing. Please create campaign first.");
      return;
    }

    setLoading(true);
    try {
      // Build geo_locations object
      const geoLocations = {};
      
      // Priority: Use custom_locations from Google Places
      // Note: Meta API doesn't allow both custom_locations and countries together (causes overlap error)
      if (customLocations.length > 0) {
        geoLocations.custom_locations = customLocations.map(loc => ({
          latitude: loc.latitude,
          longitude: loc.longitude,
          radius: loc.radius,
          distance_unit: loc.distance_unit || "kilometer"
        }));
        
        // Don't include countries when using custom_locations to avoid overlap error
        console.log("✅ Using custom_locations from Google Places (countries excluded to avoid overlap):", geoLocations.custom_locations);
      } else {
        // No custom_locations - use countries
        geoLocations.countries = formData.targeting.geo_locations.countries;
      }

      // Build targeting object with all fields
      const targeting = {
        geo_locations: geoLocations,
        device_platforms: formData.targeting.device_platforms,
        publisher_platforms: formData.targeting.publisher_platforms,
        age_min: parseInt(formData.min_age),
        age_max: parseInt(formData.max_age),
      };

      // Add genders only if selected (empty array means all genders)
      if (formData.genders.length > 0) {
        targeting.genders = formData.genders;
      }

      // Add positions only if selected
      if (formData.targeting.facebook_positions.length > 0) {
        targeting.facebook_positions = formData.targeting.facebook_positions;
      }
      if (formData.targeting.instagram_positions.length > 0) {
        targeting.instagram_positions = formData.targeting.instagram_positions;
      }

      const adsetPayload = {
        name: formData.name,
        campaign_id: campaignData.campaign_id,
        daily_budget: (parseFloat(formData.daily_budget) * 100).toString(), // Convert rupees to paise (×100)
        page_id: formData.page_id,
        billing_event: "IMPRESSIONS",
        status: "PAUSED",
        targeting,
      };

      // Add leadgen_form_id if available from campaign
      if (campaignData.leadgen_form_id) {
        adsetPayload.leadgen_form_id = campaignData.leadgen_form_id;
      }

      const response = await metaApi.createLeadFormAdSet(adsetPayload);

      alert(`Ad Set created successfully! ID: ${response.data.id}`);
      console.log("Ad Set created:", response.data);

      navigate("/user/meta-management/lead-form/creative", {
        state: {
          ...campaignData,
          adset_id: response.data.id,
          page_id: formData.page_id,
        },
      });
    } catch (error) {
      alert(`Error creating ad set: ${error.message}`);
      console.error("Ad Set creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/user/meta-management/lead-form/form", { state: campaignData })}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <FiFileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Ad Set - Lead Form Campaign</h1>
              <p className="text-gray-600 mt-1">Configure your ad set settings for the lead form campaign</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Campaign Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-gray-500 text-xs mb-1">Campaign Name</div>
                <div className="text-gray-900 font-semibold">{campaignData.name || "N/A"}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-gray-500 text-xs mb-1">Objective</div>
                <div className="text-gray-900 font-semibold">{campaignData.objective || "N/A"}</div>
              </div>
              {campaignData.leadgen_form_id && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-gray-500 text-xs mb-1">Lead Form ID</div>
                  <div className="text-gray-900 font-semibold">{campaignData.leadgen_form_id}</div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Ad Set Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter ad set name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="daily_budget" className="block text-sm font-semibold text-gray-700">
                Daily Budget (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="daily_budget"
                name="daily_budget"
                value={formData.daily_budget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter daily budget in rupees (e.g., 500)"
                min="1"
                step="1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Amount will be converted to paise (×100) when submitting</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="page_id" className="block text-sm font-semibold text-gray-700">
                Facebook Page <span className="text-red-500">*</span>
              </label>
              {loadingPages ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-500">Loading pages...</span>
                </div>
              ) : pages.length > 0 ? (
                <select
                  id="page_id"
                  name="page_id"
                  value={formData.page_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select a Facebook Page</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name} ({page.id})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="page_id"
                  name="page_id"
                  value={formData.page_id}
                  onChange={handleInputChange}
                  placeholder="Enter your Facebook Page ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              )}
              <p className="text-xs text-gray-500">Select the Facebook Page for your lead form ad</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Optimization Goal:</strong> LEAD_GENERATION (automatically set for lead form ads)
                  </p>
                </div>
              </div>
            </div>

            {/* Targeting Section */}
            <div className="space-y-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Targeting</h3>

              {/* Google Places Autocomplete - Location Search */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Location *
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Search for a location using Google Places. You can add multiple locations - each will be automatically added to custom_locations for targeting.
                </p>
                <PlacesAutocomplete
                  key={`places-${customLocations.length}`}
                  value=""
                  onChange={() => {}}
                  onPlaceSelect={handlePlaceSelect}
                  showPlaceDetails={false}
                  placeholder="Search for a location (e.g., city, address, landmark)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>

              {/* Display Selected Place Details (temporary preview) */}
              {selectedPlace && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 text-sm">
                      Preview:
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlace(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1 text-sm text-gray-700">
                    {selectedPlace.name && (
                      <div><strong>Name:</strong> {selectedPlace.name}</div>
                    )}
                    {selectedPlace.address && (
                      <div><strong>Address:</strong> {selectedPlace.address}</div>
                    )}
                    {selectedPlace.location && (
                      <div className="text-xs text-gray-500">
                        <strong>Coordinates:</strong> {selectedPlace.location.lat.toFixed(6)}, {selectedPlace.location.lng.toFixed(6)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Display All Custom Locations - Each card is an accordion */}
              {customLocations.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-900 text-sm">
                      Custom Locations ({customLocations.length})
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomLocations([]);
                        setSelectedPlace(null);
                        setExpandedLocations(new Set());
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {customLocations.map((loc, idx) => {
                      const isExpanded = expandedLocations.has(idx);
                      return (
                        <div key={idx} className="bg-white border border-blue-200 rounded-lg overflow-hidden">
                          {/* Accordion Header for each location card */}
                          <button
                            type="button"
                            onClick={() => {
                              const newExpanded = new Set(expandedLocations);
                              if (isExpanded) {
                                newExpanded.delete(idx);
                              } else {
                                newExpanded.add(idx);
                              }
                              setExpandedLocations(newExpanded);
                            }}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1 text-left">
                              {loc.name && (
                                <div className="font-semibold text-gray-900 text-sm mb-1">
                                  {loc.name}
                                </div>
                              )}
                              {loc.address && (
                                <div className="text-xs text-gray-600">
                                  {loc.address}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCustomLocations(customLocations.filter((_, i) => i !== idx));
                                  const newExpanded = new Set(expandedLocations);
                                  newExpanded.delete(idx);
                                  // Adjust indices for remaining items
                                  const adjustedExpanded = new Set();
                                  newExpanded.forEach((expandedIdx) => {
                                    if (expandedIdx > idx) {
                                      adjustedExpanded.add(expandedIdx - 1);
                                    } else if (expandedIdx < idx) {
                                      adjustedExpanded.add(expandedIdx);
                                    }
                                  });
                                  setExpandedLocations(adjustedExpanded);
                                }}
                                className="text-gray-400 hover:text-red-600"
                                title="Remove location"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                              {isExpanded ? (
                                <FiChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <FiChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                          </button>
                          {/* Accordion Content - Details and Radius */}
                          {isExpanded && (
                            <div className="px-3 pb-3 border-t border-gray-200">
                              <div className="pt-3 space-y-2">
                                <div className="text-xs text-gray-500">
                                  <span className="font-mono">Lat: {loc.latitude.toFixed(6)}, Lng: {loc.longitude.toFixed(6)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs text-gray-700 whitespace-nowrap">
                                    Radius:
                                  </label>
                                  <input
                                    type="number"
                                    min="2"
                                    max="17"
                                    value={loc.radius}
                                    onChange={(e) => {
                                      const newLocations = [...customLocations];
                                      const newRadius = parseInt(e.target.value);
                                      // Validate and clamp radius between 2 and 17
                                      if (!isNaN(newRadius)) {
                                        if (newRadius < 2) {
                                          newLocations[idx].radius = 2;
                                        } else if (newRadius > 17) {
                                          newLocations[idx].radius = 17;
                                        } else {
                                          newLocations[idx].radius = newRadius;
                                        }
                                      } else {
                                        newLocations[idx].radius = 5; // Default if invalid
                                      }
                                      setCustomLocations(newLocations);
                                    }}
                                    onBlur={(e) => {
                                      // Ensure value is within range on blur
                                      const newLocations = [...customLocations];
                                      const radius = parseInt(e.target.value);
                                      if (isNaN(radius) || radius < 2) {
                                        newLocations[idx].radius = 2;
                                      } else if (radius > 17) {
                                        newLocations[idx].radius = 17;
                                      }
                                      setCustomLocations(newLocations);
                                    }}
                                    className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <span className="text-xs text-gray-600">km</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Age Range */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="min_age"
                    value={formData.min_age}
                    onChange={handleInputChange}
                    min="13"
                    max="65"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="max_age"
                    value={formData.max_age}
                    onChange={handleInputChange}
                    min="13"
                    max="65"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Genders */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genders (Optional)
                </label>
                <div className="flex gap-4">
                  {genders.map((gender) => (
                    <label key={gender.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.genders.includes(gender.value)}
                        onChange={() => handleGenderToggle(gender.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{gender.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to target all genders</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Countries <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountryToggle(country.code)}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        formData.targeting.geo_locations.countries.includes(country.code)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{country.flag}</span>
                          <span className="font-medium text-gray-900">{country.name}</span>
                        </div>
                        {formData.targeting.geo_locations.countries.includes(country.code) && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Device Platforms <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {devicePlatforms.map((device) => {
                    const IconComponent = device.icon;
                    return (
                      <button
                        key={device.value}
                        type="button"
                        onClick={() => handleDeviceToggle(device.value)}
                        className={`p-4 border-2 rounded-lg transition-all flex items-center justify-between ${
                          formData.targeting.device_platforms.includes(device.value)
                            ? `border-${device.color}-500 bg-${device.color}-50`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-5 h-5 text-${device.color}-600`} />
                          <span className="font-medium text-gray-900">{device.label}</span>
                        </div>
                        {formData.targeting.device_platforms.includes(device.value) && (
                          <span className="text-green-500">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Publisher Platforms <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {publisherPlatforms.map((publisher) => {
                    const IconComponent = publisher.icon;
                    return (
                      <label
                        key={publisher.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                          formData.targeting.publisher_platforms.includes(publisher.value)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium text-sm">{publisher.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.targeting.publisher_platforms.includes(publisher.value)}
                          onChange={() => handlePublisherToggle(publisher.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Facebook Positions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Positions (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {facebookPositions.map((position) => (
                    <label
                      key={position.value}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                        formData.targeting.facebook_positions.includes(position.value)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-medium">{position.label}</span>
                      <input
                        type="checkbox"
                        checked={formData.targeting.facebook_positions.includes(position.value)}
                        onChange={() => handleFacebookPositionToggle(position.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to use all positions</p>
              </div>

              {/* Instagram Positions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Positions (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {instagramPositions.map((position) => (
                    <label
                      key={position.value}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                        formData.targeting.instagram_positions.includes(position.value)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-medium">{position.label}</span>
                      <input
                        type="checkbox"
                        checked={formData.targeting.instagram_positions.includes(position.value)}
                        onChange={() => handleInstagramPositionToggle(position.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to use all positions</p>
              </div>

              {/* Device Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device Platforms (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {devicePlatforms.map((device) => {
                    const IconComponent = device.icon;
                    return (
                      <label
                        key={device.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                          formData.targeting.device_platforms.includes(device.value)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{device.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.targeting.device_platforms.includes(device.value)}
                          onChange={() => handleDeviceToggle(device.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to target all devices</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Ad Set
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

