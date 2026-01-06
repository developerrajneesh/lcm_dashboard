import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./Layout/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import SubscriptionGuard from "../Components/SubscriptionGuard";
import UserDashboard from "./Pages/UserDashboard";
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
import MetaManagementPage from "./Pages/MetaManagementPage";
import CallCampaign from "./Pages/MetaManagement/CallCampaign";
import CallAdSet from "./Pages/MetaManagement/CallAdSet";
import CallAdCreative from "./Pages/MetaManagement/CallAdCreative";
import CallLaunch from "./Pages/MetaManagement/CallLaunch";
import WhatsAppCampaign from "./Pages/MetaManagement/WhatsAppCampaign";
import WhatsAppAdSet from "./Pages/MetaManagement/WhatsAppAdSet";
import WhatsAppAdCreative from "./Pages/MetaManagement/WhatsAppAdCreative";
import WhatsAppLaunch from "./Pages/MetaManagement/WhatsAppLaunch";
import LinkCampaign from "./Pages/MetaManagement/LinkCampaign";
import LinkAdSet from "./Pages/MetaManagement/LinkAdSet";
import LinkAdCreative from "./Pages/MetaManagement/LinkAdCreative";
import LinkLaunch from "./Pages/MetaManagement/LinkLaunch";

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
                  path="/meta-management" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <MetaManagementPage />
                    </SubscriptionGuard>
                  } 
                />
                {/* Click to Call Routes */}
                <Route 
                  path="/meta-management/call/campaign" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <CallCampaign />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/meta-management/call/adset" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <CallAdSet />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/meta-management/call/creative" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <CallAdCreative />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/meta-management/call/launch" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <CallLaunch />
                    </SubscriptionGuard>
                  } 
                />
                {/* Click to WhatsApp Routes */}
                <Route 
                  path="/meta-management/whatsapp/campaign" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <WhatsAppCampaign />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/meta-management/whatsapp/adset" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <WhatsAppAdSet />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/meta-management/whatsapp/creative" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <WhatsAppAdCreative />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/meta-management/whatsapp/launch" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <WhatsAppLaunch />
                    </SubscriptionGuard>
                  } 
                />
                {/* Click to Link Routes */}
                <Route 
                  path="/meta-management/link/campaign" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <LinkCampaign />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/meta-management/link/adset" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <LinkAdSet />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/meta-management/link/creative" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <LinkAdCreative />
                    </SubscriptionGuard>
                  } 
                />
                <Route 
                  path="/meta-management/link/launch" 
                  element={
                    <SubscriptionGuard requiredFeature="meta-ads" requireActiveSubscription={true}>
                      <LinkLaunch />
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

