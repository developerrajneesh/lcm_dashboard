import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhone, FiLink, FiFileText, FiPlus, FiList, FiBarChart2, FiFacebook, FiChevronDown, FiUser, FiRefreshCw, FiLogOut } from "react-icons/fi";
import MetaAdsManage from "../../Components/MetaAds/MetaAdsManage";
import MetaAdsAnalytics from "../../Components/MetaAds/MetaAdsAnalytics";
import ConnectMetaAccount from "../../Components/ConnectMetaAccount";
import AccountInfo from "../../Components/MetaAds/AccountInfo";
import AdAccountSelectionModal from "../../Components/MetaAds/AdAccountSelectionModal";
import { campaignAPI } from "../../utils/api";

const MetaManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [adAccountId, setAdAccountId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountFunds, setAccountFunds] = useState({}); // Store funds for each account: { accountId: { amount, currency } }
  const [fundsLoading, setFundsLoading] = useState({}); // Track loading state for each account: { accountId: true/false }

  useEffect(() => {
    checkConnection();
  }, []);

  // Fetch funds when adAccountId changes
  useEffect(() => {
    if (adAccountId && accessToken) {
      fetchAccountFunds(adAccountId, false);
    }
  }, [adAccountId, accessToken]);

  // Set up interval to refresh funds every 30 seconds
  useEffect(() => {
    if (isConnected && accessToken && adAccountId) {
      // Initial fetch
      fetchAccountFunds(adAccountId, false);
      
      // Set up interval to refresh funds every 30 seconds
      const fundsInterval = setInterval(() => {
        if (adAccountId) {
          fetchAccountFunds(adAccountId, false);
        }
      }, 30000); // 30 seconds
      
      return () => clearInterval(fundsInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, accessToken, adAccountId]);

  const checkConnection = async () => {
    try {
      setLoading(true);
      // Check for fb_access_token (from ConnectMetaAccount) or fb_token (from manual entry)
      const token = localStorage.getItem("fb_access_token") || localStorage.getItem("fb_token");
      const accountId = localStorage.getItem("fb_ad_account_id") || localStorage.getItem("act_ad_account_id");
      
      if (token) {
        setAccessToken(token);
        setIsConnected(true);
        
        if (accountId) {
          setAdAccountId(accountId);
        }
        
        // Fetch and store available ad accounts - wait for it to complete
        await fetchAdAccounts(accountId);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectSuccess = async (token, accountId, accounts = []) => {
    console.log("🚀 handleConnectSuccess called with:", { 
      hasToken: !!token, 
      accountId, 
      accountsCount: accounts?.length,
      accounts: accounts 
    });
    
    // Set state and localStorage FIRST
    setAccessToken(token);
    setIsConnected(true);
    localStorage.setItem("fb_access_token", token);
    
    // If accounts are provided from login, set them immediately for quick UI update
    if (accounts && accounts.length > 0) {
      const filteredAccounts = accounts.filter(
        account => account && account.id && typeof account.id === 'string' && account.id.trim() !== ''
      );
      console.log("📋 Setting accounts from login:", filteredAccounts.length);
      setAvailableAccounts(filteredAccounts);
      
      // Auto-select if single account
      if (filteredAccounts.length === 1) {
        const singleAccountId = filteredAccounts[0].id;
        setAdAccountId(singleAccountId);
        localStorage.setItem("fb_ad_account_id", singleAccountId);
        accountId = singleAccountId;
      } else if (filteredAccounts.length > 1) {
        // Multiple accounts - show selection modal ONLY if no account is already selected
        const existingAccountId = localStorage.getItem("fb_ad_account_id") || localStorage.getItem("act_ad_account_id");
        if (!existingAccountId) {
          console.log("📋 Showing account selection modal (multiple accounts from login, none selected)");
          setShowAccountModal(true);
        } else {
          console.log("✅ Account already selected, not showing modal:", existingAccountId);
          setShowAccountModal(false);
          setAdAccountId(existingAccountId);
        }
      }
    }
    
    // ALWAYS fetch accounts from API to ensure we have complete and latest data
    // This will overwrite the temporary accounts from login with full API data
    const accountIdToUse = accountId || localStorage.getItem("fb_ad_account_id") || localStorage.getItem("act_ad_account_id");
    console.log("🔄 Fetching ad accounts from API with accountId:", accountIdToUse);
    
    try {
      // Wait for fetchAdAccounts to complete - this is critical
      await fetchAdAccounts(accountIdToUse);
      console.log("✅ fetchAdAccounts completed successfully");
    } catch (error) {
      console.error("❌ Error in fetchAdAccounts during connect:", error);
      // Even if it fails, we might have accounts from login
    }
  };

  const handleAccountSelect = (selectedAccountId) => {
    console.log("✅ Account selected:", selectedAccountId);
    setAdAccountId(selectedAccountId);
    localStorage.setItem("fb_ad_account_id", selectedAccountId);
    setShowAccountModal(false);
    // Don't clear availableAccounts - we need them for the dropdown
    // setAvailableAccounts([]);
    
    // Fetch funds for the selected account
    const token = accessToken || localStorage.getItem("fb_access_token") || localStorage.getItem("fb_token");
    if (token && selectedAccountId) {
      fetchAccountFunds(selectedAccountId, false);
    }
  };

  const handleCloseModal = () => {
    // If user closes modal without selecting, use first account as default
    if (availableAccounts.length > 0) {
      const firstAccountId = availableAccounts[0].id;
      handleAccountSelect(firstAccountId);
    } else {
      setShowAccountModal(false);
      setAvailableAccounts([]);
    }
  };

  // Parse available funds from display_string
  const parseAvailableFunds = (displayString) => {
    if (!displayString) return null;
    const match = displayString.match(/[₹$]?\s*([\d,]+\.?\d*)\s*([A-Z]{3})?/i);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      const currency = match[2] || 'INR';
      if (!isNaN(amount)) {
        return { amount, currency };
      }
    }
    return null;
  };

  // Fetch available funds for a specific account
  const fetchAccountFunds = async (accountId, showLoading = true) => {
    if (!accountId) return;
    // Get accessToken from state or localStorage
    const token = accessToken || localStorage.getItem("fb_access_token") || localStorage.getItem("fb_token");
    if (!token) return;
    
    if (showLoading) {
      setFundsLoading(prev => ({ ...prev, [accountId]: true }));
    }
    
    try {
      // Use token from parameter or get from localStorage
      const response = await campaignAPI.getAdAccountFunds(accountId);
      if (response.data.success && response.data.fundingSourceDetails) {
        const parsedFunds = parseAvailableFunds(response.data.fundingSourceDetails.display_string);
        if (parsedFunds !== null) {
          setAccountFunds(prev => ({
            ...prev,
            [accountId]: parsedFunds
          }));
        }
      }
    } catch (error) {
      console.error(`Error fetching funds for account ${accountId}:`, error);
      // Don't show error to user, just keep previous value
    } finally {
      if (showLoading) {
        setFundsLoading(prev => ({ ...prev, [accountId]: false }));
      }
    }
  };

  // Fetch funds for all accounts
  const fetchAllAccountFunds = async (accounts, showLoading = false) => {
    if (!accounts || accounts.length === 0) return;
    // Get accessToken from state or localStorage
    const token = accessToken || localStorage.getItem("fb_access_token") || localStorage.getItem("fb_token");
    if (!token) return;
    
    // Fetch funds for all accounts in parallel
    await Promise.all(
      accounts.map(account => account.id && fetchAccountFunds(account.id, showLoading))
    );
  };

  const fetchAdAccounts = async (currentAccountId = null) => {
    try {
      console.log("🔍 fetchAdAccounts called with currentAccountId:", currentAccountId);
      setLoadingAccounts(true);
      
      // Get accessToken from state or localStorage - CRITICAL for login flow
      const token = accessToken || localStorage.getItem("fb_access_token") || localStorage.getItem("fb_token");
      if (!token) {
        console.error("❌ No access token available for fetchAdAccounts");
        setLoadingAccounts(false);
        return;
      }
      
      console.log("✅ Token available, calling campaignAPI.getAdAccounts()");
      const response = await campaignAPI.getAdAccounts();
      console.log("📦 getAdAccounts response:", response.data);
      
      if (response.data.success && response.data.adAccounts?.data) {
        const accounts = response.data.adAccounts.data.filter(
          account => account && account.id && typeof account.id === 'string' && account.id.trim() !== ''
        );
        
        console.log(`✅ Filtered ${accounts.length} valid accounts:`, accounts);
        setAvailableAccounts(accounts);
        
        // If we have a current account ID, make sure it's set in state
        if (currentAccountId) {
          console.log("✅ Setting adAccountId from currentAccountId:", currentAccountId);
          setAdAccountId(currentAccountId);
          localStorage.setItem("fb_ad_account_id", currentAccountId);
        } else if (accounts.length === 1) {
          // Single account and none selected - auto-select it
          const singleAccountId = accounts[0].id;
          console.log("✅ Auto-selecting single account:", singleAccountId);
          setAdAccountId(singleAccountId);
          localStorage.setItem("fb_ad_account_id", singleAccountId);
          currentAccountId = singleAccountId;
        }
        
        // Fetch funds for all accounts (don't show loading for initial fetch)
        if (token) {
          await fetchAllAccountFunds(accounts, false);
          
          // If we have a current account ID, fetch its funds immediately
          if (currentAccountId) {
            await fetchAccountFunds(currentAccountId, false);
          }
        }
        
        if (accounts.length > 1) {
          // Multiple accounts found - show modal ONLY if no account is selected
          const existingAccountId = adAccountId || localStorage.getItem("fb_ad_account_id") || localStorage.getItem("act_ad_account_id");
          if (!existingAccountId && !currentAccountId) {
            console.log("📋 Showing account selection modal (multiple accounts, none selected)");
            setShowAccountModal(true);
          } else {
            console.log("✅ Account already selected, not showing modal:", existingAccountId || currentAccountId);
            setShowAccountModal(false);
          }
        } else {
          // Single account or no accounts - don't show modal
          setShowAccountModal(false);
        }
      } else {
        console.warn("⚠️ No accounts in response or response not successful:", response.data);
        // Don't clear accounts if API fails - keep whatever we have from login
        // Only clear if we're sure there are no accounts
        // (We'll keep the accounts that were set from login in handleConnectSuccess)
      }
    } catch (error) {
      console.error("❌ Error fetching ad accounts:", error);
      console.error("Error details:", error.response?.data || error.message);
      // If we have a currentAccountId but fetch failed, still show it
      if (currentAccountId) {
        setAdAccountId(currentAccountId);
        // Create a temporary account object to show in the dropdown
        setAvailableAccounts([{ id: currentAccountId, name: currentAccountId, currency: 'INR' }]);
      } else {
        setAvailableAccounts([]);
      }
      // Don't block the UI if this fails
    } finally {
      setLoadingAccounts(false);
      console.log("✅ fetchAdAccounts completed");
    }
  };

  const handleAccountSwitch = async (e) => {
    const selectedAccountId = e.target.value;
    if (selectedAccountId) {
      setAdAccountId(selectedAccountId);
      localStorage.setItem("fb_ad_account_id", selectedAccountId);
      // Fetch funds for the newly selected account (don't show loading on switch)
      if (accessToken) {
        await fetchAccountFunds(selectedAccountId, false);
      }
      // Optionally refresh the page or reload data
      window.location.reload();
    }
  };

  const handleDisconnect = () => {
    // Clear all Meta-related data from localStorage
    localStorage.removeItem("fb_access_token");
    localStorage.removeItem("fb_token");
    localStorage.removeItem("fb_ad_account_id");
    localStorage.removeItem("act_ad_account_id");
    
    // Reset state
    setIsConnected(false);
    setAccessToken("");
    setAdAccountId("");
    setAvailableAccounts([]);
    setAccountFunds({});
    
    // Optionally show a message or redirect
    alert("Meta account disconnected successfully!");
  };

  const metaOptions = [
    {
      id: 1,
      title: "Click to WhatsApp",
      icon: FaWhatsapp,
      color: "#7C3AED", // Purple
      bgColor: "bg-purple-600",
      route: "/user/meta-management/whatsapp/campaign",
    },
    {
      id: 2,
      title: "Click to Call",
      icon: FiPhone,
      color: "#F97316", // Orange
      bgColor: "bg-orange-500",
      route: "/user/meta-management/call/campaign",
    },
    {
      id: 3,
      title: "Click to Link",
      icon: FiLink,
      color: "#EC4899", // Pink
      bgColor: "bg-pink-500",
      route: "/user/meta-management/link/campaign",
    },
    {
      id: 4,
      title: "Lead Form Ads",
      icon: FiFileText,
      color: "#3B82F6", // Blue
      bgColor: "bg-blue-500",
      route: "/user/meta-management/lead-form/campaign",
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  const tabs = [
    { id: "overview", label: "Account Overview", icon: FiUser },
    { id: "create", label: "Create", icon: FiPlus },
    { id: "manage", label: "Manage", icon: FiList },
    { id: "analytics", label: "Analytics", icon: FiBarChart2 },
  ];

  // Show connect screen if not connected and not loading
  if (!loading && !isConnected) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meta Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your Meta advertising campaigns and lead generation
          </p>
        </div>

        {/* Connect to Facebook - Component handles its own styling */}
        <ConnectMetaAccount onSuccess={handleConnectSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ad Account Selection Modal */}
      {showAccountModal && (
        <AdAccountSelectionModal
          accounts={availableAccounts}
          onSelect={handleAccountSelect}
          onClose={handleCloseModal}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meta Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your Meta advertising campaigns and lead generation
          </p>
        </div>
        
        {/* Ad Account Selector */}
        {isConnected && (
          <div className="flex items-center gap-3">
            {/* Always show Ad Account selector when connected */}
            <div className="relative">
              <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-medium text-blue-600 pointer-events-none">
                Ad Account:
              </label>
              <select
                value={adAccountId || ""}
                onChange={handleAccountSwitch}
                disabled={loadingAccounts}
                className="appearance-none bg-white border-2 border-blue-500 rounded-lg px-3 pt-3 pb-2 pr-8 text-sm font-medium text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 cursor-pointer hover:border-blue-600 transition-colors w-[280px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                    {loadingAccounts ? (
                      <option value="">Loading...</option>
                    ) : availableAccounts.length === 0 ? (
                      adAccountId ? (
                        <option value={adAccountId}>{adAccountId}</option>
                      ) : (
                        <option value="">No accounts</option>
                      )
                    ) : (
                      <>
                        <option value="">Select Account</option>
                        {availableAccounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name || account.id} {account.currency ? `(${account.currency})` : ''} - {account.id}
                          </option>
                        ))}
                      </>
                    )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            {/* Meta Disconnect Button */}
           
            {/* Available Funds Box - Green border and green text */}
            {adAccountId && (
              <div className="border-2 border-green-500 rounded-lg px-4 py-2.5 bg-green-50 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-green-700">Available Funds:</span>
                  {fundsLoading[adAccountId] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  ) : accountFunds[adAccountId] ? (
                    <span className="text-base font-bold text-green-600">
                      {accountFunds[adAccountId].currency} {accountFunds[adAccountId].amount.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-sm text-green-600">Loading...</span>
                  )}
                  <button
                    onClick={() => fetchAccountFunds(adAccountId, true)}
                    className="ml-1 p-1 hover:bg-green-100 rounded transition-colors"
                    title="Refresh Available Funds"
                    disabled={fundsLoading[adAccountId]}
                  >
                    <FiRefreshCw className={`w-3.5 h-3.5 text-green-600 ${fundsLoading[adAccountId] ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            )}
             <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
              title="Disconnect Meta Account"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div>
            {!isConnected ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center py-12">
                  <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Meta Account</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your Meta account to view account overview
                  </p>
                  <ConnectMetaAccount onSuccess={handleConnectSuccess} />
                </div>
              </div>
            ) : (
              <div>
                {isConnected && accessToken && (
                  <AccountInfo 
                    accessToken={accessToken} 
                    adAccountId={adAccountId || localStorage.getItem("fb_ad_account_id") || localStorage.getItem("act_ad_account_id")} 
                  />
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "create" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {metaOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.id}
                  onClick={() => handleCardClick(option.route)}
                  className={`${option.bgColor} rounded-2xl p-8 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl relative overflow-hidden`}
                  style={{
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  {/* Background Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Icon className="w-32 h-32 text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex items-center justify-center h-full min-h-[200px]">
                    <h3 className="text-2xl font-bold text-white text-center">
                      {option.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "manage" && (
          <div>
            {!isConnected ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center py-12">
                  <FiList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Meta Account</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your Meta account to view and manage campaigns
                  </p>
                  <ConnectMetaAccount onSuccess={handleConnectSuccess} />
                </div>
              </div>
            ) : (
              <MetaAdsManage
                accessToken={accessToken}
                adAccountId={adAccountId}
                onCreateCampaign={() => setActiveTab("create")}
                onCreateAdSet={() => {}}
                onCreateAd={() => {}}
              />
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            {!isConnected ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center py-12">
                  <FiBarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Meta Account</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your Meta account to view analytics
                  </p>
                  <ConnectMetaAccount onSuccess={handleConnectSuccess} />
                </div>
              </div>
            ) : (
              <MetaAdsAnalytics
                accessToken={accessToken}
                adAccountId={adAccountId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaManagementPage;

