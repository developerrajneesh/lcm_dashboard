import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiImage, FiArrowLeft, FiPhone, FiLink, FiFileText } from "react-icons/fi";
import metaApi from "../../../utils/metaApi";
import { adAPI } from "../../../utils/api";

export default function CallAdCreative() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    page_id: previousData.page_id || "",
    picture_url: "",
    business_page_url: "",
    phone_number: "",
  });
  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);

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
        // Auto-select the first page if no page_id is set (and previousData doesn't have one)
        setFormData((prev) => {
          if (prev.page_id || previousData.page_id) {
            // Keep existing page_id or use previousData.page_id
            return {
              ...prev,
              page_id: prev.page_id || previousData.page_id,
            };
          } else if (pagesData.length > 0) {
            // Auto-select first page
            return {
              ...prev,
              page_id: pagesData[0].id,
            };
          }
          return prev;
        });
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
    if (!formData.phone_number.trim()) {
      alert("Please enter Phone Number");
      return;
    }

    setLoading(true);
    try {
      const creativePayload = {
        name: formData.name,
        page_id: formData.page_id,
        picture_url: formData.picture_url,
        business_page_url: formData.business_page_url,
        phone_number: formData.phone_number,
      };

      const response = await metaApi.createCallAdCreative(creativePayload);

      navigate("/user/meta-management/call/launch", {
        state: {
          ...previousData,
          creative_id: response.data.id,
          credentials: previousData.credentials,
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
    <div className="space-y-6">
      <button
        onClick={() => navigate("/user/meta-management/call/adset", { state: previousData })}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <FiImage className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Ad Creative - Call Campaign</h1>
            <p className="text-gray-600 mt-1">Create your ad creative with image and call-to-action</p>
          </div>
        </div>

        {previousData.campaign_id && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Previous Steps Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Campaign ID:</strong> {previousData.campaign_id || "N/A"}</div>
              {previousData.adset_id && (
                <div><strong>Ad Set ID:</strong> {previousData.adset_id || "N/A"}</div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Creative Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter ad creative name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiFileText /> Page ID <span className="text-red-500">*</span>
            </label>
            {loadingPages ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <span className="text-gray-500">Loading pages...</span>
              </div>
            ) : pages.length > 0 ? (
              <select
                name="page_id"
                value={formData.page_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                name="page_id"
                value={formData.page_id}
                onChange={handleInputChange}
                placeholder="Enter your Facebook Page ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            )}
            <small className="text-gray-500 text-sm mt-1 block">Your Facebook Page ID where the ad will appear</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiImage /> Picture URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="picture_url"
              value={formData.picture_url}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <small className="text-gray-500 text-sm mt-1 block">URL of the image for your ad (must be publicly accessible)</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiLink /> Business Page URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="business_page_url"
              value={formData.business_page_url}
              onChange={handleInputChange}
              placeholder="https://yourbusiness.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <small className="text-gray-500 text-sm mt-1 block">URL of your business page or website</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiPhone /> Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="+1234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <small className="text-gray-500 text-sm mt-1 block">Phone number with country code (e.g., +1234567890)</small>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Ad Creative"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

