import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./Layout/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import UserDashboard from "./Pages/UserDashboard";
import MetaAdsPage from "./Pages/MetaAdsPage";
import MarketingPage from "./Pages/MarketingPage";
import CreativeWorkshopPage from "./Pages/CreativeWorkshopPage";
import CreativeWorkshopDetail from "./Pages/CreativeWorkshopDetail";
import SettingsPage from "./Pages/SettingsPage";
import SubscriptionPage from "./Pages/SubscriptionPage";
import ChatSupport from "./Pages/ChatSupport";
import IvrFormPage from "./Pages/IvrFormPage";
import WalletPage from "./Pages/WalletPage";
import ReferralPage from "./Pages/ReferralPage";

const UserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <UserLayout>
              <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/meta-ads" element={<MetaAdsPage />} />
                <Route path="/marketing" element={<MarketingPage />} />
                <Route path="/creative-workshop" element={<CreativeWorkshopPage />} />
                <Route path="/creative-workshop/:id" element={<CreativeWorkshopDetail />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/referral" element={<ReferralPage />} />
                <Route path="/chat-support" element={<ChatSupport />} />
                <Route path="/ivr" element={<IvrFormPage />} />
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

