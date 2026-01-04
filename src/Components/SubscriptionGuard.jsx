import React from "react";
import { Navigate } from "react-router-dom";
import { useSubscription } from "../hooks/useSubscription";
import { hasActiveSubscription, hasFeatureAccess } from "../utils/subscription";
import UpgradePrompt from "./UpgradePrompt";

const SubscriptionGuard = ({ 
  children, 
  requiredFeature = null,
  requireActiveSubscription = true 
}) => {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if active subscription is required
  if (requireActiveSubscription && !hasActiveSubscription(subscription)) {
    return <UpgradePrompt message="You need an active subscription to access this feature." />;
  }

  // Check if specific feature access is required
  if (requiredFeature && !hasFeatureAccess(subscription, requiredFeature)) {
    const planName = subscription?.planName || "No Plan";
    const planId = subscription?.planId;
    
    // Premium-only features: meta-ads, whatsapp-marketing, ivr-campaign, priority-support
    // Basic features: email-marketing, sms-marketing, creative-workshop, basic-support
    // Note: Premium Plan includes all Basic features
    const isPremiumOnlyFeature = requiredFeature === "meta-ads" || 
                                  requiredFeature === "whatsapp-marketing" || 
                                  requiredFeature === "ivr-campaign" ||
                                  requiredFeature === "priority-support";
    
    let message = `This feature is not available in your current plan. Your current plan: ${planName}`;
    if (isPremiumOnlyFeature) {
      message = `This feature is only available in Premium Plan. Upgrade to unlock Meta Ads, WhatsApp Marketing, IVR Campaigns, and more.`;
    } else if (planId === 2) {
      // Premium user trying to access a feature they should have
      message = `This feature should be available in your Premium Plan. Please contact support if you're seeing this error.`;
    }
    
    return (
      <UpgradePrompt 
        message={message}
        isPremiumFeature={isPremiumOnlyFeature}
      />
    );
  }

  return children;
};

export default SubscriptionGuard;

