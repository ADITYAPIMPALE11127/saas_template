import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscription';

const Billing = () => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const [plansData, subData] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getMySubscription()
      ]);
      setPlans(plansData);
      setCurrentSubscription(subData);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan) => {
    alert(`Upgrading to ${plan.PLNNME} plan - ₹${plan.PLNPRI}`);
    // Razorpay integration will go here
  };

  if (loading) {
    return <div className="text-center py-10">Loading plans...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Billing & Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div key={plan.PLNUID} className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">{plan.PLNNME}</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{plan.PLNPRI}</p>
            <p className="text-gray-500">per month</p>
            
            <div className="mt-4">
              <p className="text-gray-600">
                <span className="font-semibold">{plan.USGLIM}</span> API calls per month
              </p>
              <p className="text-gray-600 mt-1">
                {plan.DURATN} days duration
              </p>
            </div>
            
            <button
              onClick={() => handleUpgrade(plan)}
              disabled={currentSubscription?.plan_details?.PLNNME === plan.PLNNME}
              className={`mt-6 w-full py-2 rounded-lg transition ${
                currentSubscription?.plan_details?.PLNNME === plan.PLNNME
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentSubscription?.plan_details?.PLNNME === plan.PLNNME
                ? 'Current Plan'
                : `Upgrade to ${plan.PLNNME}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Billing;