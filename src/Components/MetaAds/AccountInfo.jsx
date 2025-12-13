import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { campaignAPI } from "../../utils/api";

const AccountInfo = ({ adAccountId, accessToken }) => {
  const [accountDetails, setAccountDetails] = useState(null);
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (adAccountId && accessToken) {
      fetchAccountData();
    }
  }, [adAccountId, accessToken]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      
      // Fetch campaigns count
      const campaignsResponse = await campaignAPI.getAll(adAccountId);
      if (campaignsResponse.data.success && campaignsResponse.data.campaigns?.data) {
        setCampaignsCount(campaignsResponse.data.campaigns.data.length);
      }

      // Fetch account details
      const accountsResponse = await campaignAPI.getAdAccounts();
      if (accountsResponse.data.success && accountsResponse.data.adAccounts?.data) {
        const account = accountsResponse.data.adAccounts.data.find(
          acc => acc.id === adAccountId
        );
        if (account) {
          setAccountDetails(account);
        }
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    } finally {
      setLoading(false);
    }
  };

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
              onClick={fetchAccountData}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Refresh"
            >
              <FiRefreshCw className="w-4 h-4 text-gray-600" />
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
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaignsCount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Account ID</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {adAccountId}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Status</p>
              <p className="text-sm font-medium text-green-600">Connected</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;

