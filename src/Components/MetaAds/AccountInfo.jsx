import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiRefreshCw, FiChevronDown, FiChevronUp, FiClock, FiGlobe, FiTrendingUp, FiLayers, FiTarget } from "react-icons/fi";
import { campaignAPI, adsetAPI, adAPI } from "../../utils/api";

const AccountInfo = ({ adAccountId, accessToken }) => {
  const [accountDetails, setAccountDetails] = useState(null);
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [adsetsCount, setAdsetsCount] = useState(0);
  const [adsCount, setAdsCount] = useState(0);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true); // Default to expanded
  const [availableFunds, setAvailableFunds] = useState(null);
  const [fundsLoading, setFundsLoading] = useState(false);
  const isFetchingRef = useRef(false); // Prevent multiple simultaneous fetches
  const hasFetchedRef = useRef(false); // Track if we've already fetched for this account

  // Parse available funds from display_string
  // Example: "Available balance (₹760.37 INR)" -> { amount: 760.37, currency: 'INR' }
  const parseAvailableFunds = (displayString) => {
    if (!displayString) return null;
    
    // Extract amount and currency from display_string
    // Pattern: "Available balance (₹760.37 INR)" or "Available balance ($100.50 USD)"
    const match = displayString.match(/[₹$]?\s*([\d,]+\.?\d*)\s*([A-Z]{3})?/i);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      const currency = match[2] || 'INR'; // Default to INR if not found
      if (!isNaN(amount)) {
        return { amount, currency };
      }
    }
    return null;
  };

  // Fetch available funds from funding_source_details
  const fetchAvailableFunds = async () => {
    if (!adAccountId) return;
    
    try {
      setFundsLoading(true);
      const response = await campaignAPI.getAdAccountFunds(adAccountId);
      if (response.data.success && response.data.fundingSourceDetails) {
        const parsedFunds = parseAvailableFunds(response.data.fundingSourceDetails.display_string);
        if (parsedFunds !== null) {
          setAvailableFunds({
            amount: parsedFunds.amount,
            currency: parsedFunds.currency,
            displayString: response.data.fundingSourceDetails.display_string,
            type: response.data.fundingSourceDetails.type,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching available funds:", error);
      // Don't show error to user, just keep previous value
    } finally {
      setFundsLoading(false);
    }
  };

  // Memoize fetchAccountData to prevent unnecessary re-creations
  const fetchAccountData = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) {
      console.log("Already fetching account data, skipping...");
      return;
    }
    
    if (!adAccountId || !accessToken) return;
    
    // Check if we've already fetched for this account
    if (hasFetchedRef.current) {
      console.log("Already fetched data for this account, skipping...");
      return;
    }
    
    isFetchingRef.current = true;
    hasFetchedRef.current = true;
    
    try {
      setLoading(true);
      
      // Fetch ALL campaigns with pagination
      try {
        let allCampaigns = [];
        let campaignsAfter = null;
        let hasMoreCampaigns = true;
        
        while (hasMoreCampaigns) {
          const campaignsResponse = await campaignAPI.getAll(adAccountId, 100, campaignsAfter);
          if (campaignsResponse.data.success && campaignsResponse.data.campaigns) {
            const campaignsData = campaignsResponse.data.campaigns;
            const campaigns = Array.isArray(campaignsData.data) ? campaignsData.data : (Array.isArray(campaignsData) ? campaignsData : []);
            allCampaigns = [...allCampaigns, ...campaigns];
            
            // Check for next page
            const paging = campaignsData.paging;
            if (paging && paging.cursors?.after) {
              campaignsAfter = paging.cursors.after;
              hasMoreCampaigns = true;
            } else {
              hasMoreCampaigns = false;
            }
          } else {
            hasMoreCampaigns = false;
          }
        }
        
        setCampaignsCount(allCampaigns.length);
        
        // Don't fetch ad sets for all campaigns - this causes excessive API calls
        // Set ad sets and ads count to 0 - users can see actual counts in the Manage tab
        setAdsetsCount(0);
        setAdsCount(0);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        // If rate limited, just show account details without counts
        if (err.response?.data?.error?.code === 17) {
          console.warn("Rate limit reached, showing account details only");
        }
      }

      // Fetch detailed account information directly from the ad account endpoint
      // This gives us the most accurate balance/available funds
      try {
        const accountDetailsResponse = await campaignAPI.getAdAccountDetails(adAccountId);
        if (accountDetailsResponse.data.success && accountDetailsResponse.data.account) {
          setAccountDetails(accountDetailsResponse.data.account);
        } else {
          // Fallback to fetching from accounts list
          const accountsResponse = await campaignAPI.getAdAccounts();
          if (accountsResponse.data.success && accountsResponse.data.adAccounts?.data) {
            const account = accountsResponse.data.adAccounts.data.find(
              acc => acc.id === adAccountId
            );
            if (account) {
              setAccountDetails(account);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching account details:", err);
        
        // Check if it's a rate limit error
        if (err.response?.data?.error?.code === 17) {
          console.warn("Rate limit reached for account details, using cached or fallback data");
        }
        
        // Fallback to fetching from accounts list
        try {
          const accountsResponse = await campaignAPI.getAdAccounts();
          if (accountsResponse.data.success && accountsResponse.data.adAccounts?.data) {
            const account = accountsResponse.data.adAccounts.data.find(
              acc => acc.id === adAccountId
            );
            if (account) {
              setAccountDetails(account);
            }
          }
        } catch (fallbackErr) {
          console.error("Error in fallback account fetch:", fallbackErr);
        }
      }

      // Insights are already part of account details, no need for separate call
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [adAccountId, accessToken]);

  useEffect(() => {
    // Reset fetch flag when account changes
    hasFetchedRef.current = false;
    isFetchingRef.current = false;
    
    if (adAccountId && accessToken) {
      fetchAccountData();
      fetchAvailableFunds(); // Initial fetch
      
      // Set up interval to fetch funds every 30 seconds
      const fundsInterval = setInterval(() => {
        fetchAvailableFunds();
      }, 30000); // 30 seconds
      
      return () => {
        clearInterval(fundsInterval);
        // Don't reset hasFetchedRef here, let it reset when account changes
      };
    }
  }, [adAccountId, accessToken, fetchAccountData]);

  if (loading && !accountDetails) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">Account Overview</h3>
            <button
              onClick={() => {
                hasFetchedRef.current = false; // Reset to allow refresh
                fetchAccountData();
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Refresh"
              disabled={isFetchingRef.current}
            >
              <FiRefreshCw className={`w-4 h-4 text-gray-600 ${isFetchingRef.current ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {accountDetails && (
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {accountDetails.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    accountDetails.account_status === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {accountDetails.account_status === 1 ? "Active" : "Inactive"}
                </span>
              </p>
              {accountDetails.currency && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Currency:</span> {accountDetails.currency}
                </p>
              )}
              <p className="text-sm text-gray-600">
                <span className="font-medium">Available Funds:</span>{" "}
                {fundsLoading ? (
                  <span className="inline-flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    <span>Loading...</span>
                  </span>
                ) : availableFunds ? (
                  <span className="font-semibold text-gray-900">
                    {availableFunds.currency} {availableFunds.amount.toFixed(2)}
                  </span>
                ) : accountDetails?.balance !== undefined && accountDetails.balance !== null ? (
                  <span className="font-semibold text-gray-900">
                    {accountDetails.currency || 'INR'} {parseFloat(accountDetails.balance / 100).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
                <button
                  onClick={fetchAvailableFunds}
                  className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors inline-flex items-center"
                  title="Refresh Available Funds"
                  disabled={fundsLoading}
                >
                  <FiRefreshCw className={`w-3 h-3 text-gray-600 ${fundsLoading ? 'animate-spin' : ''}`} />
                </button>
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
        >
          {expanded ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-6">
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <FiTarget className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-gray-600">Campaigns</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{campaignsCount}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <FiLayers className="w-4 h-4 text-purple-600" />
                <p className="text-xs text-gray-600">Ad Sets</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{adsetsCount}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <FiTrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-xs text-gray-600">Ads</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{adsCount}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-600 font-bold text-lg">₹</span>
                <p className="text-xs text-gray-600">Amount Spent</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {accountDetails?.amount_spent 
                  ? `${accountDetails.currency || ''} ${parseFloat(accountDetails.amount_spent / 100).toFixed(2)}`
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Account Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Account Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account ID:</span>
                  <span className="font-medium text-gray-900 font-mono text-xs">{accountDetails?.id || adAccountId}</span>
                </div>
                {accountDetails?.account_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium text-gray-900">{accountDetails.account_id}</span>
                  </div>
                )}
                {accountDetails?.business_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business:</span>
                    <span className="font-medium text-gray-900">{accountDetails.business_name}</span>
                  </div>
                )}
                {accountDetails?.timezone_name && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      Timezone:
                    </span>
                    <span className="font-medium text-gray-900">{accountDetails.timezone_name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Financial Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available Funds:</span>
                  <div className="flex items-center gap-2">
                    {fundsLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : availableFunds ? (
                      <span className="font-medium text-gray-900">
                        {availableFunds.currency} {availableFunds.amount.toFixed(2)}
                      </span>
                    ) : accountDetails?.balance !== undefined && accountDetails.balance !== null ? (
                      <span className="font-medium text-gray-900">
                        {accountDetails.currency || 'INR'} {parseFloat(accountDetails.balance / 100).toFixed(2)}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-500">N/A</span>
                    )}
                    <button
                      onClick={fetchAvailableFunds}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Refresh Available Funds"
                      disabled={fundsLoading}
                    >
                      <FiRefreshCw className={`w-3 h-3 text-gray-600 ${fundsLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                {accountDetails?.spend_cap && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Spend Cap:</span>
                    <span className="font-medium text-gray-900">
                      {accountDetails.currency || ''} {parseFloat(accountDetails.spend_cap / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                {accountDetails?.funding_source && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Funding Source:</span>
                    <span className="font-medium text-gray-900">{accountDetails.funding_source}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-medium text-gray-900">{accountDetails?.currency || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AccountInfo;

