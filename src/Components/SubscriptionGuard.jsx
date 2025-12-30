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
    const isPremiumFeature = requiredFeature === "sms-marketing" || requiredFeature === "ivr-campaign";
    
    return (
      <UpgradePrompt 
        message={`This feature is only available in Premium Plan. Your current plan: ${planName}`}
        isPremiumFeature={isPremiumFeature}
      />
    );
  }

  return children;
};

export default SubscriptionGuard;

