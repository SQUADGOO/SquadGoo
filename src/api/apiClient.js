// api/client.js
import axios from 'axios';
import { store } from '@/store/store';

export const apiClient = axios.create({
  baseURL: 'https://apis.squadgoo.com/',
  headers: {
    'Content-Type': 'application/json',
    accept: '*/*',
  },
});

// 🔐 Auto-attach auth token
apiClient.interceptors.request.use((config) => {
  const token = store?.getState()?.auth?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🚨 Global error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      'API Error:',
      error?.response?.data?.message || error.message,
      '\nEndpoint:',
      error?.config?.url
    );
    return Promise.reject(error);
  }
);

// 🌐 One universal request helper
export const request = async (endpoint, options = {}) => {
  const {
    method = 'get',
    body,
    headers = {},
    params,
    timeout,
    ...rest
  } = options;

  const isFormData = body instanceof FormData;

  const config = {
    url: endpoint,
    method,
    params,
    timeout,
    headers: {
      ...(isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    ...(body && { data: isFormData ? body : body }), // no need to stringify, Axios does it
    ...rest,
  };

  const response = await apiClient(config);
  return response.data;
};
