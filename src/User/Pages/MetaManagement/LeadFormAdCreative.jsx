import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiImage, FiArrowLeft, FiFileText, FiHash, FiType, FiAlignLeft } from "react-icons/fi";
import metaApi from "../../../utils/metaApi";
import { adAPI } from "../../../utils/api";

export default function LeadFormAdCreative() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    page_id: previousData.page_id || "",
    picture_url: "",
    business_page_url: "",
    headline: "",
    description: "",
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
        }
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      alert("Failed to fetch Facebook pages. Please try again.");
    } finally {
      setLoadingPages(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter ad creative name");
      return;
    }
    if (!formData.page_id.trim()) {
      alert("Please enter Page ID");
      return;
    }
    if (!formData.picture_url.trim()) {
      alert("Please enter Picture URL");
      return;
    }
    if (!formData.business_page_url.trim()) {
      alert("Please enter Business Page URL");
      return;
    }

    setLoading(true);
    try {
      const creativePayload = {
        name: formData.name,
        page_id: formData.page_id,
        picture_url: formData.picture_url,
        business_page_url: formData.business_page_url,
        headline: formData.headline,
        description: formData.description,
      };

      const response = await metaApi.createLeadFormAdCreative(creativePayload);

      console.log("Ad Creative created:", response.data);

      navigate("/user/meta-management/lead-form/launch", {
        state: {
          ...previousData,
          creative_id: response.data.id,
          page_id: formData.page_id,
        },
      });
    } catch (error) {
      alert(`Error creating ad creative: ${error.message}`);
      console.error("Ad Creative creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/user/meta-management/lead-form/adset", { state: previousData })}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <FiImage className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Ad Creative - Lead Form Campaign</h1>
              <p className="text-gray-600 mt-1">Create your ad creative with image and lead form call-to-action</p>
            </div>
          </div>

          {previousData.campaign_id && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Previous Steps Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-gray-500 text-xs mb-1">Campaign ID</div>
                  <div className="text-gray-900 font-semibold">{previousData.campaign_id || "N/A"}</div>
                </div>
                {previousData.adset_id && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-gray-500 text-xs mb-1">Ad Set ID</div>
                    <div className="text-gray-900 font-semibold">{previousData.adset_id || "N/A"}</div>
                  </div>
                )}
                {previousData.leadgen_form_id && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-gray-500 text-xs mb-1">Lead Form ID</div>
                    <div className="text-gray-900 font-semibold">{previousData.leadgen_form_id || "N/A"}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Ad Creative Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter ad creative name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="page_id" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiHash className="w-4 h-4" />
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
              <p className="text-xs text-gray-500">Select the Facebook Page where the ad will appear</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="picture_url" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiImage className="w-4 h-4" />
                Picture URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="picture_url"
                name="picture_url"
                value={formData.picture_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="https://example.com/image.jpg"
                required
              />
              <p className="text-xs text-gray-500">URL of the image for your ad (must be publicly accessible)</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="business_page_url" className="block text-sm font-semibold text-gray-700">
                Business Page URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="business_page_url"
                name="business_page_url"
                value={formData.business_page_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="https://yourbusiness.com"
                required
              />
              <p className="text-xs text-gray-500">URL of your business page or website</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="headline" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiType className="w-4 h-4" />
                Headline
              </label>
              <input
                type="text"
                id="headline"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter ad headline"
              />
              <p className="text-xs text-gray-500">Optional: Main headline text for your ad</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiAlignLeft className="w-4 h-4" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter ad description"
                rows="3"
              />
              <p className="text-xs text-gray-500">Optional: Description text for your ad</p>
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
                    Create Ad Creative
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

