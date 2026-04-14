import React from 'react';

const SubscriptionCard = ({ hasSubscription, planName, expiryDate, onUpgrade }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Plan</h3>
      
      {hasSubscription ? (
        <>
          <div className="mb-3">
            <p className="text-3xl font-bold text-blue-600">{planName}</p>
            {expiryDate && (
              <p className="text-sm text-gray-500 mt-1">
                Expires: {new Date(expiryDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={onUpgrade}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Upgrade Plan
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-3">You are on Free plan</p>
          <button
            onClick={onUpgrade}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Upgrade to Pro - ₹499
          </button>
        </>
      )}
    </div>
  );
};

export default SubscriptionCard;