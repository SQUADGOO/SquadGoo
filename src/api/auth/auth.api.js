import { request } from "../apiClient";


export const loginUser = (data) => request('/app/auth/login', { method: 'post', body: data });
export const register = (data) => request('/app/auth/register', { method: 'post', body: data });
export const verifyEmail = (data) => request('/app/auth/verify-email', { method: 'post', body: data });

export const updateProfile = (data) => request('/app/JobSeeker/updateBasicDetails', { method: 'post', body: data });

//job seeker
export const updateJobSeekerProfile = (data) => request('/app/jobseeker/profile', { method: 'post', body: data });
export const logout = () => request('/app/logout', { method: 'post' });
export const getCurrentUser = () => request('/app/me', { method: 'get' });
