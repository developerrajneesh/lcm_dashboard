import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiImage, FiArrowLeft, FiFileText, FiHash, FiType, FiAlignLeft, FiUpload, FiX } from "react-icons/fi";
import metaApi from "../../../utils/metaApi";
import { adAPI } from "../../../utils/api";
import axios from "axios";

// Get API base URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

export default function LeadFormAdCreative() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

          <form onSubmit={handleSubmit}>
            {/* Two-column layout when image is uploaded, single column when not */}
            <div className={`grid gap-6 ${(imagePreview || formData.picture_url) ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Form Fields Column */}
              <div className="space-y-6">
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
                    Picture <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Image Upload Section */}
                  <div className="space-y-3">
                    {!imagePreview && !formData.picture_url && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
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
                          id="picture_url"
                          name="picture_url"
                          value={formData.picture_url}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>
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
              </div>

              {/* Image Preview Column - Only shown when image is uploaded */}
              {(imagePreview || formData.picture_url) && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FiImage className="w-4 h-4" /> Image Preview
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
    </div>
  );
}

