import { request } from "../apiClient";


export const loginUser = (data) => request('/api/login', { method: 'post', body: data });
export const register = (data) => request('/api/register', { method: 'post', body: data });
export const logout = () => request('/api/logout', { method: 'post' });
export const getCurrentUser = () => request('/api/me', { method: 'get' });
