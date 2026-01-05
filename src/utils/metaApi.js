const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

class MetaApiService {
  /**
   * Get auth headers from localStorage or user input
   * Priority: fb_access_token > fb_token, fb_ad_account_id > act_ad_account_id
   */
  getAuthHeaders() {
    // Try fb_access_token first (from ConnectMetaAccount), fallback to fb_token
    const fbToken = localStorage.getItem("fb_access_token") || localStorage.getItem("fb_token");
    
    // Try fb_ad_account_id first (from ConnectMetaAccount), fallback to act_ad_account_id
    const actAdAccountId = localStorage.getItem("fb_ad_account_id") || localStorage.getItem("act_ad_account_id");
    
    if (!actAdAccountId || !fbToken) {
      throw new Error("Meta credentials not found. Please connect your Meta account.");
    }

    return {
      "Content-Type": "application/json",
      "act_ad_account_id": actAdAccountId,
      "fb_token": fbToken,
    };
  }

  /**
   * Create a campaign (Click to Call)
   */
  async createCallCampaign(campaignData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-call/campaigns`, {
      method: "POST",
      headers,
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create campaign");
    }

    return await response.json();
  }

  /**
   * Create an ad set (Click to Call)
   */
  async createCallAdSet(adsetData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-call/adsets`, {
      method: "POST",
      headers,
      body: JSON.stringify(adsetData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create ad set");
    }

    return await response.json();
  }

  /**
   * Create an ad creative (Click to Call)
   */
  async createCallAdCreative(creativeData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-call/adcreatives`, {
      method: "POST",
      headers,
      body: JSON.stringify(creativeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create ad creative");
    }

    return await response.json();
  }

  /**
   * Create an ad (Click to Call)
   */
  async createCallAd(adData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-call/ads`, {
      method: "POST",
      headers,
      body: JSON.stringify(adData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create ad");
    }

    return await response.json();
  }

  /**
   * Create a campaign (Click to WhatsApp)
   */
  async createWhatsAppCampaign(campaignData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-whatsapp/campaigns`, {
      method: "POST",
      headers,
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create campaign");
    }

    return await response.json();
  }

  /**
   * Create an ad set (Click to WhatsApp)
   */
  async createWhatsAppAdSet(adsetData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-whatsapp/adsets`, {
      method: "POST",
      headers,
      body: JSON.stringify(adsetData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create ad set");
    }

    return await response.json();
  }

  /**
   * Create an ad creative (Click to WhatsApp)
   */
  async createWhatsAppAdCreative(creativeData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-whatsapp/adcreatives`, {
      method: "POST",
      headers,
      body: JSON.stringify(creativeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create ad creative");
    }

    return await response.json();
  }

  /**
   * Create an ad (Click to WhatsApp)
   */
  async createWhatsAppAd(adData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-whatsapp/ads`, {
      method: "POST",
      headers,
      body: JSON.stringify(adData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create ad");
    }

    return await response.json();
  }

  /**
   * Create a campaign (Click to Link)
   */
  async createLinkCampaign(campaignData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-link/campaigns`, {
      method: "POST",
      headers,
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create campaign");
    }

    return await response.json();
  }

  /**
   * Create an ad set (Click to Link)
   */
  async createLinkAdSet(adsetData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-link/adsets`, {
      method: "POST",
      headers,
      body: JSON.stringify(adsetData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create ad set");
    }

    return await response.json();
  }

  /**
   * Create an ad creative (Click to Link)
   */
  async createLinkAdCreative(creativeData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-link/adcreatives`, {
      method: "POST",
      headers,
      body: JSON.stringify(creativeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create ad creative");
    }

    return await response.json();
  }

  /**
   * Create an ad (Click to Link)
   */
  async createLinkAd(adData) {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/click-to-link/ads`, {
      method: "POST",
      headers,
      body: JSON.stringify(adData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create ad");
    }

    return await response.json();
  }
}

export default new MetaApiService();

