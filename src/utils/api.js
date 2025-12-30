import axios from "axios";

// Use VITE_BACKEND_URL and append /api/v1
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem("fb_access_token") || "";
};

// Request interceptor to add access token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["x-fb-access-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for token expiration error (code 190, error_subcode 463)
    const errorData = error.response?.data;
    const isTokenExpired = 
      error.response?.status === 401 &&
      (errorData?.tokenExpired === true ||
       errorData?.code === "TOKEN_EXPIRED" ||
       (errorData?.fb?.code === 190 && errorData?.fb?.error_subcode === 463) ||
       (errorData?.error?.code === 190 && errorData?.error?.error_subcode === 463));

    if (isTokenExpired) {
      console.warn("⚠️ Facebook access token has expired. Disconnecting...");
      
      // Clear tokens
      localStorage.removeItem("fb_access_token");
      localStorage.removeItem("fb_ad_account_id");
      
      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent("metaTokenExpired", {
        detail: {
          message: errorData?.error || "Facebook access token has expired. Please reconnect your account.",
          code: errorData?.code || "TOKEN_EXPIRED",
        }
      }));
    } else if (error.response?.status === 401) {
      // Handle other unauthorized errors
      localStorage.removeItem("fb_access_token");
      localStorage.removeItem("fb_ad_account_id");
    }
    return Promise.reject(error);
  }
);

// Campaign API
export const campaignAPI = {
  create: (data) => api.post("/campaigns", data),
  getAll: (adAccountId, limit, after) => {
    const params = { adAccountId };
    if (limit) params.limit = limit;
    if (after) params.after = after;
    return api.get("/campaigns/all", { params });
  },
  getById: (campaignId) => api.get(`/campaigns/${campaignId}`),
  update: (campaignId, data) => api.patch(`/campaigns/${campaignId}`, data),
  pause: (campaignId) => api.post(`/campaigns/${campaignId}/pause`),
  activate: (campaignId) => api.post(`/campaigns/${campaignId}/activate`),
  delete: (campaignId) => api.delete(`/campaigns/${campaignId}`),
  getAdAccounts: () => api.get("/campaigns"),
};

// AdSet API
export const adsetAPI = {
  create: (data) => api.post("/adsets", data),
  getAll: (campaignId) => api.get("/adsets/all", { params: { campaignId } }),
  getById: (adsetId) => api.get(`/adsets/${adsetId}`),
  update: (adsetId, data) => api.patch(`/adsets/${adsetId}`, data),
  pause: (adsetId) => api.post(`/adsets/${adsetId}/pause`),
  activate: (adsetId) => api.post(`/adsets/${adsetId}/activate`),
  delete: (adsetId) => api.delete(`/adsets/${adsetId}`),
  getTargetingSearch: (params) => api.get("/adsets/targeting-search", { params }),
  searchAdGeolocation: (params) => api.get("/adsets/search-geolocation", { params }),
  // WhatsApp Business Account APIs
  getWhatsAppBusinessAccounts: () => api.get("/adsets/whatsapp/waba"),
  getWhatsAppPhoneNumbers: (wabaId) => api.get(`/adsets/whatsapp/waba/${wabaId}/phone-numbers`),
  verifyWhatsAppPhoneNumber: (data) => api.post("/adsets/whatsapp/waba/verify-phone", data),
};

// Ad API
export const adAPI = {
  create: (data) => api.post("/ads", data),
  getAll: (adsetId) => api.get("/ads/all", { params: { adsetId } }),
  getById: (adId) => api.get(`/ads/${adId}`),
  getInsights: (adId, datePreset = "last_30d") => api.get(`/ads/${adId}/insights`, { params: { datePreset } }),
  update: (adId, data) => api.patch(`/ads/${adId}`, data),
  pause: (adId) => api.post(`/ads/${adId}/pause`),
  activate: (adId) => api.post(`/ads/${adId}/activate`),
  delete: (adId) => api.delete(`/ads/${adId}`),
  getPages: () => api.get("/ads/pages"),
  uploadImage: (data) => api.post("/ads/upload-image", data),
  uploadVideo: (data) => api.post("/ads/upload-video", data),
  getRedirectPageUrl: (imageUrl, redirectUrl, title, description) => {
    const params = new URLSearchParams({
      imageUrl,
      ...(redirectUrl && { redirectUrl }),
      ...(title && { title }),
      ...(description && { description }),
    });
    return `${api.defaults.baseURL}/ads/redirect-page?${params.toString()}`;
  },
};

export default api;

