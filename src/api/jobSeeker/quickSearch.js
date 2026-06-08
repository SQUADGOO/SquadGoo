import { request } from '../apiClient';

/**
 * Get received quick search offers
 * @returns {Promise<Array>} Offers
 */
export const getOffers = async () => {
  return request('/job-seeker/quick-search/offers', {
    method: 'GET',
  });
};

/**
 * Accept a quick search offer
 * @param {string} offerId - Offer ID
 * @returns {Promise<Object>} Accepted offer
 */
export const acceptOffer = async (offerId) => {
  return request(`/job-seeker/quick-search/offers/${offerId}/accept`, {
    method: 'POST',
  });
};

/**
 * Decline a quick search offer
 * @param {string} offerId - Offer ID
 * @param {Object} reason - Decline reason
 * @returns {Promise<Object>} Declined offer
 */
export const declineOffer = async (offerId, reason) => {
  return request(`/job-seeker/quick-search/offers/${offerId}/decline`, {
    method: 'POST',
    body: { reason },
  });
};

/**
 * Get active quick search jobs
 * @returns {Promise<Array>} Active jobs
 */
export const getActiveJobs = async () => {
  return request('/job-seeker/quick-search/active-jobs', {
    method: 'GET',
  });
};

/**
 * Get completed quick search jobs
 * @returns {Promise<Array>} Completed jobs
 */
export const getCompletedJobs = async () => {
  return request('/job-seeker/quick-search/completed-jobs', {
    method: 'GET',
  });
};

