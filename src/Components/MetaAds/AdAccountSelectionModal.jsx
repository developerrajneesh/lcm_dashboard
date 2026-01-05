import React from "react";
import { FiX, FiCheck } from "react-icons/fi";

const AdAccountSelectionModal = ({ accounts, onSelect, onClose }) => {
  const handleSelect = (accountId) => {
    localStorage.setItem("fb_ad_account_id", accountId);
    onSelect(accountId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Select Ad Account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600 mb-4">
            You have multiple ad accounts. Please select the one you want to use:
          </p>

          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleSelect(account.id)}
                className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {account.name || "Unnamed Account"}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">ID:</span> {account.id}
                      </div>
                      {account.currency && (
                        <div>
                          <span className="font-medium">Currency:</span> {account.currency}
                        </div>
                      )}
                      {account.account_status !== undefined && (
                        <div>
                          <span className="font-medium">Status:</span>{" "}
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              account.account_status === 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {account.account_status === 1 ? "Active" : "Inactive"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <FiCheck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            You can change your selected ad account later from the settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdAccountSelectionModal;

