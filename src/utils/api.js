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
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem("fb_access_token");
      localStorage.removeItem("fb_ad_account_id");
    }
    return Promise.reject(error);
  }
);

// Campaign API
export const campaignAPI = {
  create: (data) => api.post("/campaigns", data),
  getAll: (adAccountId) => api.get("/campaigns/all", { params: { adAccountId } }),
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
};

export default api;

