import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./Layout/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import SubscriptionGuard from "../Components/SubscriptionGuard";
import UserDashboard from "./Pages/UserDashboard";
import MetaAdsPage from "./Pages/MetaAdsPage";
import MarketingPage from "./Pages/MarketingPage";
import CreativeWorkshopPage from "./Pages/CreativeWorkshopPage";
import CreativeWorkshopDetail from "./Pages/CreativeWorkshopDetail";
import SettingsPage from "./Pages/SettingsPage";
import SubscriptionPage from "./Pages/SubscriptionPage";
import ChatSupport from "./Pages/ChatSupport";
import IvrFormPage from "./Pages/IvrFormPage";
import ReferralPage from "./Pages/ReferralPage";
import PaymentHistoryPage from "./Pages/PaymentHistoryPage";
import UgcProVideoPage from "./Pages/UgcProVideoPage";

const UserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <UserLayout>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <SubscriptionGuard requireActiveSubscription={true}>
                      <UserDashboard />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/meta-ads" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <MetaAdsPage />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/marketing" 
                  element={
                    <SubscriptionGuard requireActiveSubscription={true}>
                      <MarketingPage />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/creative-workshop" 
                  element={
                    <SubscriptionGuard requiredFeature="creative-workshop" requireActiveSubscription={true}>
                      <CreativeWorkshopPage />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/creative-workshop/:id" 
                  element={
                    <SubscriptionGuard requiredFeature="creative-workshop" requireActiveSubscription={true}>
                      <CreativeWorkshopDetail />
                    </SubscriptionGuard>
                  } 
                />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/payment-history" element={<PaymentHistoryPage />} />
                <Route path="/referral" element={<ReferralPage />} />
                <Route 
                  path="/chat-support" 
                  element={
                    <SubscriptionGuard requireActiveSubscription={true}>
                      <ChatSupport />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/ivr" 
                  element={
                    <SubscriptionGuard requiredFeature="ivr-campaign" requireActiveSubscription={true}>
                      <IvrFormPage />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/ugc-pro-video" 
                  element={
                    <SubscriptionGuard requireActiveSubscription={true}>
                      <UgcProVideoPage />
                    </SubscriptionGuard>
                  } 
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/user" replace />} />
              </Routes>
            </UserLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default UserRoutes;

