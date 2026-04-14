import React from 'react';

const UsageCard = ({ usageCount, usageLimit, remaining, percentage, planName }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Usage Statistics</h3>
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Plan: <span className="font-semibold">{planName}</span></span>
          <span>{usageCount} / {usageLimit} uses</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-300 ${
              percentage > 90 ? 'bg-red-600' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-600'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">{remaining}</p>
        <p className="text-sm text-gray-500">remaining calls this month</p>
      </div>
    </div>
  );
};

export default UsageCard;