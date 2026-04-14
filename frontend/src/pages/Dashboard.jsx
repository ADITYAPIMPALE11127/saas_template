import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '../services/subscription';
import { authService } from '../services/auth';
import UsageCard from '../components/UsageCard';
import SubscriptionCard from '../components/SubscriptionCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [usage, setUsage] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Get user info from token
    const userInfo = authService.getUserFromToken();
    setUser(userInfo);
    
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usageData, subData] = await Promise.all([
        subscriptionService.getMyUsage(),
        subscriptionService.getMySubscription()
      ]);
      
      setUsage(usageData);
      setSubscription(subData);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      
      // Handle 401 Unauthorized
      if (err.response?.status === 401) {
        authService.logout();
        navigate('/login');
        return;
      }
      
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    // Will implement Razorpay integration later
    alert('Upgrade to Pro - ₹499/month\n\nGet 1000 API calls per month!');
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={handleRefresh}
            className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Track your usage and subscription.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usage Card */}
        {usage && (
          <UsageCard
            usageCount={usage.usage_count}
            usageLimit={usage.usage_limit}
            remaining={usage.remaining_usage}
            percentage={usage.percentage_used}
            planName={usage.plan_name}
          />
        )}
        
        {/* Subscription Card */}
        <SubscriptionCard
          hasSubscription={subscription?.has_subscription || false}
          planName={usage?.plan_name}
          expiryDate={subscription?.ENDDAT}
          onUpgrade={handleUpgrade}
        />
      </div>

      {/* Additional Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Reset Month</p>
          <p className="text-lg font-semibold text-gray-800">{usage?.reset_month || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Plan Limit</p>
          <p className="text-lg font-semibold text-gray-800">{usage?.usage_limit || 0} calls/month</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Current Status</p>
          <p className="text-lg font-semibold text-green-600">
            {usage?.remaining_usage > 0 ? 'Active' : 'Quota Exceeded'}
          </p>
        </div>
      </div>

      {/* Warning when usage is high */}
      {usage && usage.percentage_used >= 80 && usage.remaining_usage > 0 && (
        <div className="mt-6 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">⚠️ Usage Alert</p>
          <p className="text-sm">
            You've used {usage.percentage_used}% of your monthly quota. 
            Consider upgrading to Pro for more API calls.
          </p>
        </div>
      )}

      {/* Warning when quota is exhausted */}
      {usage && usage.remaining_usage === 0 && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">🚫 Quota Exceeded</p>
          <p className="text-sm">
            You've used all {usage.usage_limit} calls for this month. 
            Please upgrade to Pro plan to continue using the service.
          </p>
          <button
            onClick={handleUpgrade}
            className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition text-sm"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;