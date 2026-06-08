import {
  BASE_URL as ENV_BASE_URL,
  DEV_URL as ENV_DEV_URL,
  STRIPE_PUBLISHABLE_KEY as ENV_STRIPE,
} from '@env';

// Production API base URL
export const BASE_URL = ENV_BASE_URL || '';

// Local / dev API base URL
export const DEV_URL = ENV_DEV_URL || 'http://localhost:5001/api/mobile-app/';

// Stripe publishable key
export const STRIPE_PUBLISHABLE_KEY = ENV_STRIPE || '';
