import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiImage, FiArrowLeft, FiPhone, FiLink, FiFileText, FiUpload, FiX } from "react-icons/fi";
import metaApi from "../../../utils/metaApi";
import { adAPI } from "../../../utils/api";
import axios from "axios";

// Get API base URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB");
      return;
    }

    setSelectedImage(file);
    setUploadingImage(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setImagePreview(base64String);

      try {
        // Upload to S3 automatically
        const response = await axios.post(
          `${API_BASE_URL}/ads/upload-image-s3`,
          {
            imageBase64: base64String,
          }
        );

        if (response.data.success && response.data.url) {
          setFormData((prev) => ({
            ...prev,
            picture_url: response.data.url,
          }));
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(`Failed to upload image: ${error.response?.data?.error || error.message}`);
        // Reset on error
        setSelectedImage(null);
        setImagePreview(null);
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      picture_url: "",
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

        <form onSubmit={handleSubmit}>
          {/* Two-column layout when image is uploaded, single column when not */}
          <div className={`grid gap-6 ${(imagePreview || formData.picture_url) ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Form Fields Column */}
            <div className="space-y-6">
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
                  <FiImage /> Picture <span className="text-red-500">*</span>
                </label>
                
                {/* Image Upload Section */}
                <div className="space-y-3">
                  {!imagePreview && !formData.picture_url && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <FiUpload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Click to upload an image
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </label>
                    </div>
                  )}

                  {formData.picture_url && !uploadingImage && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-green-600 text-sm">✓ Image uploaded successfully</span>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Manual URL input as fallback */}
                  {!imagePreview && !formData.picture_url && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Or enter image URL manually:</p>
                      <input
                        type="url"
                        name="picture_url"
                        value={formData.picture_url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
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
            </div>

            {/* Image Preview Column - Only shown when image is uploaded */}
            {(imagePreview || formData.picture_url) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiImage /> Image Preview
                  </label>
                  <div className="relative flex items-center justify-center bg-gray-50 rounded-lg border border-gray-300 p-4 min-h-[300px]">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full max-h-[400px] object-contain rounded-lg"
                        />
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                            <div className="text-white text-center">
                              <div className="animate-spin mb-2">⏳</div>
                              <div className="text-sm">Uploading to AWS...</div>
                            </div>
                          </div>
                        )}
                        {!uploadingImage && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : formData.picture_url ? (
                      <img
                        src={formData.picture_url}
                        alt="Preview"
                        className="max-w-full max-h-[400px] object-contain rounded-lg"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

