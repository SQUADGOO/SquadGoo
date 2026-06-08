import axios from 'axios';
import { Platform } from 'react-native';
import { store } from '@/store/store';

// ─── Base URL ────────────────────────────────────────────────────────────────
// Local dev: Android emulator reaches the host via 10.0.2.2; iOS simulator via
// localhost. For a physical device, set LOCAL_HOST to your machine's LAN IP.
// (NOTE: port 5000 is used by macOS AirPlay Receiver — turn it off, or change the
//  port here and run the backend on the same port.)
// ─────────────────────────────────────────────────────────────────────────────
const LOCAL_HOST = "172.20.10.2";
const BASE_URL = `http://${LOCAL_HOST}:5001/api/mobile-app/`;
// ─────────────────────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: '*/*',
  },
});

// ── Attach access token to every request ────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = store?.getState()?.auth?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── 401 handler: refresh token then retry once ──────────────────────────────
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error?.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const { refreshToken, userId } = store.getState().auth;

      if (!refreshToken || !userId) {
        const { logout } = require('@/store/authSlice');
        store.dispatch(logout());
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}auth/refresh`, { refreshToken, userId });
        const { accessToken, refreshToken: newRefreshToken } = res.data;

        const { setTokens } = require('@/store/authSlice');
        store.dispatch(setTokens({ token: accessToken, refreshToken: newRefreshToken }));

        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        original.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return apiClient(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { logout } = require('@/store/authSlice');
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Universal request helper ─────────────────────────────────────────────────
export const request = async (endpoint, options = {}) => {
  const { method = 'get', body, headers = {}, params, timeout, ...rest } = options;
  const isFormData = body instanceof FormData;
  const response = await apiClient({
    url: endpoint,
    method,
    params,
    timeout,
    headers: {
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    ...(body && { data: body }),
    ...rest,
  });
  return response.data;
};
