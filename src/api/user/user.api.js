import { request, apiClient } from '../apiClient';
import { store } from '@/store/store';

export const getMe   = ()     => request('/users/me', { method: 'get' });
export const updateMe = (data) => request('/users/me', { method: 'put', body: data });

// Profile-photo upload uses native fetch (not axios) for reliable Android multipart.
// `image` is a react-native-image-picker asset: { uri, type, fileName }.
// Returns the backend response { ok, url, user }.
export const uploadProfilePicture = async (image) => {
  const token = store?.getState()?.auth?.token;
  const base = (apiClient.defaults.baseURL || '').replace(/\/+$/, '');

  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    type: image.type || 'image/jpeg',
    name: image.fileName || `profile-${Date.now()}.jpg`,
  });

  // Do NOT set Content-Type — fetch adds the multipart boundary automatically.
  const res = await fetch(`${base}/users/profile-picture`, {
    method: 'POST',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    body: formData,
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.error?.message || 'Failed to upload profile picture');
  }
  return body;
};
