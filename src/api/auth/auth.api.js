import { request } from '../apiClient';

export const loginUser   = (data) => request('/auth/login',   { method: 'post', body: data });
export const register    = (data) => request('/auth/register', { method: 'post', body: data });
export const refreshToken = (data) => request('/auth/refresh', { method: 'post', body: data });
export const logout      = ()     => request('/auth/logout',  { method: 'post' });
