import { request } from "../apiClient";


export const getUserData = (data) => request('/app/auth/me', { method: 'get'});

