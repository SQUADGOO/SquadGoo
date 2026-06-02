import { request } from '../apiClient';

// Submit identity (KYC) + business (KYB) data for manual admin review.
// Body: { personal, business?, documents }. Document files are not sent yet.
export const submitKycKyb = (data) => request('/users/kyc-kyb', { method: 'post', body: data });

// Latest submission for the signed-in user → { ok, submission }.
export const getKycKyb = () => request('/users/kyc-kyb', { method: 'get' });
