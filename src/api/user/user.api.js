import { request } from '../apiClient';

export const getMe   = ()     => request('/users/me', { method: 'get' });
export const updateMe = (data) => request('/users/me', { method: 'put', body: data });
