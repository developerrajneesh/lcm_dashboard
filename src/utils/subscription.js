// Subscription Plan Access Rules
export const PLAN_FEATURES = {
  1: { // BASIC PLAN
    name: "BASIC PLAN",
    features: [
      "email-marketing",
      "sms-marketing",
      "creative-workshop",
      "basic-support",
    ],
  },
  2: { // PREMIUM PLAN
    name: "PREMIUM PLAN",
    features: [
      "meta-ads",
      "whatsapp-marketing",
      "email-marketing",
      "sms-marketing",
      "ivr-campaign",
      "creative-workshop",
      "priority-support",
    ],
  },
};

// Feature to route mapping
export const FEATURE_ROUTES = {
  "meta-ads": "/user/meta-ads",
  "whatsapp-marketing": "/user/marketing",
  "email-marketing": "/user/marketing",
  "sms-marketing": "/user/marketing",
  "ivr-campaign": "/user/ivr",
  "creative-workshop": "/user/creative-workshop",
  "basic-support": "/user/chat-support",
  "priority-support": "/user/chat-support",
};

// Check if user has access to a feature
export const hasFeatureAccess = (subscription, feature) => {
  if (!subscription || subscription.subscriptionStatus !== "active") {
    return false;
  }

  // Check if subscription is expired
  if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
    return false;
  }

  const planId = subscription.planId;
  const planFeatures = PLAN_FEATURES[planId]?.features || [];
  
  return planFeatures.includes(feature);
};

// Check if user has active subscription
export const hasActiveSubscription = (subscription) => {
  if (!subscription) return false;
  
  if (subscription.subscriptionStatus !== "active") return false;
  
  // Check if expired
  if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
    return false;
  }
  
  return true;
};

// Get plan name
export const getPlanName = (planId) => {
  return PLAN_FEATURES[planId]?.name || "No Plan";
};

