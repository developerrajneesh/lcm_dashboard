import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiFileText, FiArrowLeft, FiSmartphone, FiFacebook } from "react-icons/fi";
import metaApi from "../../../utils/metaApi";
import { adAPI } from "../../../utils/api";

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
    targeting: {
      geo_locations: { countries: [] },
      device_platforms: [],
      publisher_platforms: [],
    },
  });

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
    if (!formData.page_id.trim()) {
      alert("Please enter Page ID");
      return;
    }
    if (formData.targeting.geo_locations.countries.length === 0) {
      alert("Please select at least one country");
      return;
    }
    if (formData.targeting.device_platforms.length === 0) {
      alert("Please select at least one device platform");
      return;
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
      const adsetPayload = {
        name: formData.name,
        campaign_id: campaignData.campaign_id,
        daily_budget: formData.daily_budget.toString(),
        page_id: formData.page_id,
        billing_event: "IMPRESSIONS",
        status: "PAUSED",
        targeting: formData.targeting,
      };

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
                Daily Budget <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="daily_budget"
                name="daily_budget"
                value={formData.daily_budget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter daily budget"
                required
              />
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
                <div className="grid grid-cols-2 gap-3">
                  {publisherPlatforms.map((publisher) => {
                    const IconComponent = publisher.icon;
                    return (
                      <button
                        key={publisher.value}
                        type="button"
                        onClick={() => handlePublisherToggle(publisher.value)}
                        className={`p-4 border-2 rounded-lg transition-all flex items-center justify-between ${
                          formData.targeting.publisher_platforms.includes(publisher.value)
                            ? `border-${publisher.color}-500 bg-${publisher.color}-50`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-5 h-5 text-${publisher.color}-600`} />
                          <span className="font-medium text-gray-900">{publisher.label}</span>
                        </div>
                        {formData.targeting.publisher_platforms.includes(publisher.value) && (
                          <span className="text-green-500">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
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

