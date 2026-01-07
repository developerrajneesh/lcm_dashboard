const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

class MetaApiService {
  /**
   * Get auth data from localStorage or user input
   * Priority: fb_access_token > fb_token, fb_ad_account_id > act_ad_account_id
   */
  getAuthData() {
    // Try fb_access_token first (from ConnectMetaAccount), fallback to fb_token
    const fbToken = localStorage.getItem("fb_access_token") || localStorage.getItem("fb_token");
    
    // Try fb_ad_account_id first (from ConnectMetaAccount), fallback to act_ad_account_id
    const actAdAccountId = localStorage.getItem("fb_ad_account_id") || localStorage.getItem("act_ad_account_id");
    
    if (!actAdAccountId || !fbToken) {
      throw new Error("Meta credentials not found. Please connect your Meta account.");
    }

    return {
      act_ad_account_id: actAdAccountId,
      fb_token: fbToken,
    };
  }

  /**
   * Create a campaign (Click to Call)
   */
  async createCallCampaign(campaignData) {
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-call/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...campaignData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-call/adsets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...adsetData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-call/adcreatives`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...creativeData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-call/ads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...adData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-whatsapp/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...campaignData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-whatsapp/adsets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...adsetData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-whatsapp/adcreatives`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...creativeData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-whatsapp/ads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...adData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-link/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...campaignData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-link/adsets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...adsetData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-link/adcreatives`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...creativeData }),
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
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-link/ads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...adData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create ad");
    }

    return await response.json();
  }

  // Click to Lead Form API Methods
  /**
   * Create a Lead Form campaign
   */
  async createLeadFormCampaign(campaignData) {
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-lead-form/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...campaignData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create Lead Form campaign");
    }

    return await response.json();
  }

  /**
   * Create a lead form
   * @param {string} pageId - Facebook Page ID
   * @param {Object} formData - Lead form data
   */
  async createLeadForm(pageId, formData) {
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-lead-form/leadforms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        page_id: pageId,
        fb_token: authData.fb_token,
        ...formData 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create lead form");
    }

    return await response.json();
  }

  /**
   * Create a Lead Form ad set
   */
  async createLeadFormAdSet(adsetData) {
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-lead-form/adsets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...adsetData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create Lead Form ad set");
    }

    return await response.json();
  }

  /**
   * Create a Lead Form ad creative
   */
  async createLeadFormAdCreative(creativeData) {
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-lead-form/adcreatives`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...creativeData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create Lead Form ad creative");
    }

    return await response.json();
  }

  /**
   * Create a Lead Form ad
   */
  async createLeadFormAd(adData) {
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-lead-form/ads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...authData, ...adData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to create Lead Form ad");
    }

    return await response.json();
  }

  /**
   * Subscribe a page to webhooks
   * @param {string} pageId - Facebook Page ID
   */
  async subscribePageToWebhooks(pageId) {
    const authData = this.getAuthData();
    const response = await fetch(`${API_BASE_URL}/click-to-lead-form/subscribe-page`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_id: pageId,
        fb_token: authData.fb_token,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to subscribe page to webhooks");
    }

    return await response.json();
  }
}

export default new MetaApiService();

