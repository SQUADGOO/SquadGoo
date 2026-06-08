import {Platform} from 'react-native';
import {
  API_SCHEME,
  API_HOST,
  API_PORT,
  STRIPE_PUBLISHABLE_KEY,
} from '@env';

// ─── App configuration ───────────────────────────────────────────────────────
// Single source of truth for environment-specific values. Each reads from `.env`
// (via react-native-dotenv) and falls back to a sensible default, so the app works
// even without a .env. To change a value: edit `.env` and restart Metro
// (`npm start -- --reset-cache`), or edit the fallback default below (Fast Refresh).
//
// Local-dev backend host changes per network/IP:
//   • iOS simulator      → localhost  (default)
//   • Android emulator   → 10.0.2.2   (default)
//   • Physical device    → your Mac's LAN IP — set API_HOST in .env
// ──────────────────────────────────────────────────────────────────────────────

// 👇 QUICK DAILY OVERRIDE: for a physical device whose IP changes, just paste your
//    Mac's current LAN IP here (e.g. '192.168.1.50') and save — Fast Refresh picks it up,
//    no Metro restart needed. Leave '' to use .env / the platform default below.
const LOCAL_HOST_OVERRIDE = '';

const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

// Precedence: in-file override > .env (API_HOST) > platform default.
export const API_CONFIG = {
  scheme: API_SCHEME || 'http',
  host: LOCAL_HOST_OVERRIDE || API_HOST || defaultHost,
  port: API_PORT || '5001',
};

export const API_BASE_URL = `${API_CONFIG.scheme}://${API_CONFIG.host}:${API_CONFIG.port}/api/mobile-app/`;

// Stripe publishable key (NON-secret, safe to ship). Set STRIPE_PUBLISHABLE_KEY in .env.
export const STRIPE_PK = STRIPE_PUBLISHABLE_KEY || '';
