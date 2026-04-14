import api from './api';

export const subscriptionService = {
  // Get all plans (Free & Pro)
  getPlans: async () => {
    const response = await api.get('/plans/');
    return response.data;
  },

  // Get user's current subscription
  getMySubscription: async () => {
    const response = await api.get('/my-subscription/');
    return response.data;
  },

  // Get usage stats with progress
  getMyUsage: async () => {
    const response = await api.get('/my-usage/');
    return response.data;
  }
};