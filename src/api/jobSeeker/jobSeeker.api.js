import { request } from "../apiClient";


export const addWorkExperience = (data) => request('/app/JobSeeker/updateExperience', { method: 'POST', body: data });
export const addFullAddress = (data) => request('/app/JobSeeker/updateAddress', { method: 'POST', body: data });
export const addTaxInfo = (data) => request('/app/JobSeeker/updateTaxInfo', { method: 'POST', body: data });
export const addSocialLinks = (data) => request('/app/JobSeeker/updateSocialLinks', { method: 'POST', body: data });
export const addJobPreferences = (data) => request('/app/JobSeeker/updatePreferences', { method: 'POST', body: data });

