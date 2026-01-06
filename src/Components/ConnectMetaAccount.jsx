import React, { useEffect, useState } from "react";
import { FiFacebook, FiCheck } from "react-icons/fi";
import { campaignAPI } from "../utils/api";

const ConnectMetaAccount = ({ onSuccess }) => {
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if SDK is already loaded and initialized
    const checkSDK = () => {
      if (window.FB && typeof window.FB.getLoginStatus === 'function') {
        console.log("✅ Facebook SDK is ready");
        setSdkReady(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkSDK()) {
      return;
    }

    // Wait for SDK to load (it's initialized in App.jsx)
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkInterval = setInterval(() => {
      attempts++;
      if (checkSDK()) {
        clearInterval(checkInterval);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.error("❌ Facebook SDK failed to load after 5 seconds");
        alert("Facebook SDK is taking too long to load. Please refresh the page.");
      }
    }, 100);

    // Cleanup
    return () => clearInterval(checkInterval);
  }, []);

  const handleFacebookLogin = () => {
    // Check if SDK is ready
    if (!window.FB || typeof window.FB.login !== 'function') {
      console.error("Facebook SDK not ready:", { FB: window.FB, login: window.FB?.login });
      alert("Facebook SDK is not ready. Please wait a moment and try again, or refresh the page.");
      return;
    }

    // Note: Facebook requires HTTPS for login, but allows localhost for development
    console.log("Current protocol:", window.location.protocol);
    console.log("Current hostname:", window.location.hostname);
    
    // Check if we're on localhost (Facebook allows this)
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '0.0.0.0';
    
    if (!isLocalhost && window.location.protocol !== 'https:') {
      alert("Facebook login requires HTTPS. For localhost development, please ensure your Facebook App is configured to allow localhost.");
      return;
    }

    console.log("🚀 Starting Facebook login...");
    setLoading(true);

    // FB.login callback cannot be async - use regular function
    window.FB.login(
      function (response) {
        setLoading(false);
        
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          console.log("✅ Facebook login successful, access token received");
          
          // Store token immediately
          localStorage.setItem("fb_access_token", accessToken);
          
          // Get user info
          window.FB.api(
            "/me",
            { fields: "id,name,email" },
            function (userInfo) {
              if (userInfo.error) {
                console.error("❌ Error getting user info:", userInfo.error);
                alert("Error getting user information: " + userInfo.error.message);
                return;
              }
              
              console.log("✅ User Info:", userInfo);
              
              // Fetch ad accounts from backend API (async operation)
              campaignAPI.getAdAccounts()
                .then((apiResponse) => {
                  if (apiResponse.data.success && apiResponse.data.adAccounts?.data) {
                    // Filter out empty objects and invalid accounts (accounts without id)
                    const accounts = apiResponse.data.adAccounts.data.filter(
                      account => account && account.id && typeof account.id === 'string' && account.id.trim() !== ''
                    );
                    console.log("✅ Ad accounts from backend (filtered):", accounts);
                    console.log(`   Valid accounts: ${accounts.length}`);
                    
                    if (accounts.length > 0) {
                      // If only one account, auto-select it
                      if (accounts.length === 1) {
                        const accountId = accounts[0].id;
                        console.log("✅ Auto-selecting single account:", accountId);
                        localStorage.setItem("fb_ad_account_id", accountId);
                        onSuccess(accessToken, accountId, accounts);
                      } else {
                        // Multiple accounts - let user choose
                        console.log(`✅ Multiple accounts found (${accounts.length}), will show selection modal`);
                        console.log("📋 Accounts being passed to onSuccess:", accounts);
                        // Ensure we pass the filtered accounts
                        onSuccess(accessToken, null, accounts);
                      }
                    } else {
                      console.warn("⚠️ No valid ad accounts found after filtering");
                      // Clear the token since user has no ad accounts
                      localStorage.removeItem("fb_access_token");
                      localStorage.removeItem("fb_token");
                      alert(
                        "No Ad Account Found\n\n" +
                        "You don't have any Meta ad accounts. Please create an ad account in Meta Business Manager first, then reconnect with LCM.\n\n" +
                        "Steps:\n" +
                        "1. Go to Meta Business Manager (business.facebook.com)\n" +
                        "2. Create an ad account\n" +
                        "3. Come back here and reconnect your Meta account"
                      );
                      // Don't call onSuccess - connection failed
                      return;
                    }
                  } else {
                    console.warn("⚠️ API response indicates no accounts:", apiResponse.data);
                    onSuccess(accessToken, null, []);
                  }
                })
                .catch((error) => {
                  console.error("❌ Error fetching ad accounts from backend:", error);
                  // Fallback to direct FB API call
                  window.FB.api(
                    "/me/adaccounts",
                    { fields: "id,name,account_status,currency" },
                    function (accountsResponse) {
                      if (accountsResponse.error) {
                        console.error("❌ Error getting ad accounts:", accountsResponse.error);
                        alert("Error getting ad accounts: " + accountsResponse.error.message);
                        return;
                      }
                      
                      console.log("✅ Ad accounts from Facebook API:", accountsResponse.data);
                      
                      if (accountsResponse.data && accountsResponse.data.length > 0) {
                        const accountId = accountsResponse.data[0].id;
                        localStorage.setItem("fb_ad_account_id", accountId);
                        onSuccess(accessToken, accountId, accountsResponse.data);
                      } else {
                        // No ad accounts found - clear token and show message
                        localStorage.removeItem("fb_access_token");
                        localStorage.removeItem("fb_token");
                        alert(
                          "No Ad Account Found\n\n" +
                          "You don't have any Meta ad accounts. Please create an ad account in Meta Business Manager first, then reconnect with LCM.\n\n" +
                          "Steps:\n" +
                          "1. Go to Meta Business Manager (business.facebook.com)\n" +
                          "2. Create an ad account\n" +
                          "3. Come back here and reconnect your Meta account"
                        );
                        // Don't call onSuccess - connection failed
                        return;
                      }
                    }
                  );
                });
            }
          );
        } else {
          console.log("⚠️ User cancelled login or did not fully authorize");
          alert("User cancelled login or did not fully authorize.");
        }
      },
      {
        // scope: "ads_management", // ✅ ONLY THIS
        // return_scopes: true
        // scope: "public_profile,email,",
        scope: "ads_management,pages_read_engagement,ads_read,business_management,pages_manage_cta,pages_manage_instant_articles,pages_show_list,page_events,pages_manage_metadata,pages_read_user_content,pages_manage_ads,pages_manage_engagement,pages_manage_posts,pages_messaging_phone_number,pages_messaging,pages_messaging_subscriptions,pages_read_engagement,pages_utility_messaging,read_page_mailboxes,whatsapp_business_manage_events,whatsapp_business_management,whatsapp_business_messaging",
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFacebook className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Your Meta Account
          </h2>
          <p className="text-gray-600 mb-6">
            Connect your Facebook account to start creating and managing Meta ads campaigns.
          </p>
          
          <button
            onClick={handleFacebookLogin}
            disabled={!sdkReady || loading}
            className={`w-full ${
              sdkReady && !loading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <FiFacebook className="w-5 h-5" />
                <span>{sdkReady ? "Connect with Facebook" : "Loading Facebook SDK..."}</span>
              </>
            )}
          </button>
          
          {!sdkReady && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Please wait for Facebook SDK to load...
            </p>
          )}

          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-start gap-3">
              <FiCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Create and manage advertising campaigns
              </p>
            </div>
            <div className="flex items-start gap-3">
              <FiCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Access campaign analytics and insights
              </p>
            </div>
            <div className="flex items-start gap-3">
              <FiCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Manage ad sets and creative assets
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectMetaAccount;

