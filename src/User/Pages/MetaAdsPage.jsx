import React, { useState, useEffect } from "react";
import { FiFacebook, FiBell, FiX, FiLogOut } from "react-icons/fi";
import { campaignAPI } from "../../utils/api";
import ConnectMetaAccount from "../../Components/ConnectMetaAccount";
import MetaAdsCreate from "../../Components/MetaAds/MetaAdsCreate";
import MetaAdsManage from "../../Components/MetaAds/MetaAdsManage";
import MetaAdsAnalytics from "../../Components/MetaAds/MetaAdsAnalytics";
import AccountInfo from "../../Components/MetaAds/AccountInfo";

const MetaAdsPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [adAccountId, setAdAccountId] = useState("");
  const [adAccounts, setAdAccounts] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preselectedCampaignId, setPreselectedCampaignId] = useState(null);
  const [preselectedCampaignName, setPreselectedCampaignName] = useState(null);
  const [preselectedAdSetId, setPreselectedAdSetId] = useState(null);
  const [preselectedAdSetName, setPreselectedAdSetName] = useState(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const token = localStorage.getItem("fb_access_token");
      const accountId = localStorage.getItem("fb_ad_account_id");
      
      console.log("🔍 Checking connection:", { 
        hasToken: !!token, 
        hasAccountId: !!accountId,
        accountId 
      });
      
      if (token && accountId) {
        console.log("✅ Found stored token and account ID");
        setAccessToken(token);
        setAdAccountId(accountId);
        setIsConnected(true);
      } else if (token) {
        console.log("⚠️ Found token but no account ID, fetching accounts...");
        setAccessToken(token);
        await fetchAdAccounts(token);
      } else {
        console.log("ℹ️ No stored token found");
      }
    } catch (error) {
      console.error("❌ Error checking connection:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdAccounts = async (token) => {
    try {
      const response = await campaignAPI.getAdAccounts();
      if (response.data.success && response.data.adAccounts?.data) {
        setAdAccounts(response.data.adAccounts.data);
        if (response.data.adAccounts.data.length === 1) {
          const accountId = response.data.adAccounts.data[0].id;
          setAdAccountId(accountId);
          localStorage.setItem("fb_ad_account_id", accountId);
          setIsConnected(true);
        } else if (response.data.adAccounts.data.length > 1) {
          // Multiple accounts - show selection modal
          // IMPORTANT: Set isConnected to true so dashboard shows (modal will overlay on top)
          setIsConnected(true);
          setShowAccountModal(true);
        } else {
          // No accounts found but token exists - still show dashboard
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error("Error fetching ad accounts:", error);
    }
  };

  const handleConnectSuccess = async (token, accountId, accounts = []) => {
    console.log("🔗 handleConnectSuccess called:", { token: token ? "PRESENT" : "MISSING", accountId, accountsCount: accounts?.length });
    
    if (token) {
      setAccessToken(token);
      localStorage.setItem("fb_access_token", token);
      
      if (accountId) {
        // Single account provided directly
        console.log("✅ Single account provided:", accountId);
        setAdAccountId(accountId);
        localStorage.setItem("fb_ad_account_id", accountId);
        setIsConnected(true);
      } else if (accounts && accounts.length > 0) {
        // Accounts array provided
        console.log(`✅ ${accounts.length} accounts found`);
        setAdAccounts(accounts);
        
        if (accounts.length === 1) {
          // Only one account - auto-select it
          const singleAccountId = accounts[0].id;
          console.log("✅ Auto-selecting single account:", singleAccountId);
          setAdAccountId(singleAccountId);
          localStorage.setItem("fb_ad_account_id", singleAccountId);
          setIsConnected(true);
        } else {
          // Multiple accounts - show selection modal
          console.log("✅ Showing account selection modal for", accounts.length, "accounts");
          setShowAccountModal(true);
          // IMPORTANT: Set isConnected to true so the main dashboard shows (modal will overlay)
          setIsConnected(true);
        }
      } else {
        // No accounts provided - try to fetch them
        console.log("⚠️ No accounts provided, fetching from API...");
        await fetchAdAccounts(token);
      }
    } else {
      console.error("❌ No access token provided to handleConnectSuccess");
    }
  };

  const handleAccountSelect = (accountId) => {
    setAdAccountId(accountId);
    localStorage.setItem("fb_ad_account_id", accountId);
    setShowAccountModal(false);
    setIsConnected(true);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to disconnect your Facebook account? This will clear all stored Facebook data.")) {
      // Clear all Facebook-related data from localStorage
      localStorage.removeItem("fb_access_token");
      localStorage.removeItem("fb_ad_account_id");
      
      // Reset all state
      setAccessToken("");
      setAdAccountId("");
      setAdAccounts([]);
      setIsConnected(false);
      setShowAccountModal(false);
      setPreselectedCampaignId(null);
      setPreselectedCampaignName(null);
      
      console.log("✅ Facebook account disconnected and data cleared");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <ConnectMetaAccount onSuccess={handleConnectSuccess} />
    );
  }

  const tabs = [
    { id: "create", label: "Create" },
    { id: "manage", label: "Manage" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiFacebook className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meta Ads</h1>
            <p className="text-sm text-gray-600">
              Manage your Facebook advertising campaigns
              {adAccountId && (
                <span className="ml-2 text-xs text-gray-500">
                  • Account: {adAccountId}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
              title="Disconnect Facebook account"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <FiBell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Account Info */}
      {isConnected && adAccountId && (
        <AccountInfo adAccountId={adAccountId} accessToken={accessToken} />
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "create" && (
            <MetaAdsCreate
              accessToken={accessToken}
              adAccountId={adAccountId}
              preselectedCampaignId={preselectedCampaignId}
              preselectedCampaignName={preselectedCampaignName}
              preselectedAdSetId={preselectedAdSetId}
              preselectedAdSetName={preselectedAdSetName}
              onCampaignCreated={() => {
                setActiveTab("manage");
                setPreselectedCampaignId(null);
                setPreselectedCampaignName(null);
                setPreselectedAdSetId(null);
                setPreselectedAdSetName(null);
              }}
            />
          )}
          {activeTab === "manage" && (
            <MetaAdsManage
              accessToken={accessToken}
              adAccountId={adAccountId}
              onCreateAdSet={(campaignId, campaignName) => {
                setPreselectedCampaignId(campaignId);
                setPreselectedCampaignName(campaignName);
                setPreselectedAdSetId(null);
                setPreselectedAdSetName(null);
                setActiveTab("create");
              }}
              onCreateCampaign={() => {
                // Reset preselected campaign and go to create tab
                setPreselectedCampaignId(null);
                setPreselectedCampaignName(null);
                setPreselectedAdSetId(null);
                setPreselectedAdSetName(null);
                setActiveTab("create");
              }}
              onCreateAd={(adSetId, adSetName, campaignId, campaignName) => {
                setPreselectedAdSetId(adSetId);
                setPreselectedAdSetName(adSetName);
                setPreselectedCampaignId(campaignId);
                setPreselectedCampaignName(campaignName);
                setActiveTab("create");
              }}
            />
          )}
          {activeTab === "analytics" && (
            <MetaAdsAnalytics
              accessToken={accessToken}
              adAccountId={adAccountId}
            />
          )}
        </div>
      </div>

      {/* Account Selection Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Select Ad Account</h2>
              <button
                onClick={() => setShowAccountModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {adAccounts
                .filter(account => account && account.id) // Filter out empty/invalid accounts
                .map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleAccountSelect(account.id)}
                    className="w-full text-left p-4 rounded-lg hover:bg-gray-50 border border-gray-200 mb-2 transition-colors"
                  >
                    <p className="font-medium text-gray-900">
                      {account.name || account.id || "Unnamed Account"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">ID: {account.id}</p>
                    {account.currency && (
                      <p className="text-xs text-gray-400 mt-1">Currency: {account.currency}</p>
                    )}
                  </button>
                ))}
              {adAccounts.filter(account => account && account.id).length === 0 && (
                <p className="text-center text-gray-500 py-4">No valid ad accounts found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaAdsPage;

