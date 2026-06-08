import { request } from '../apiClient';

/**
 * Create a new quick search job
 * @param {Object} jobData - Job data
 * @returns {Promise<Object>} Created job
 */
export const createQuickJob = async (jobData) => {
  return request('/recruiter/quick-search/jobs', {
    method: 'POST',
    body: jobData,
  });
};

/**
 * Get matched candidates for a quick search job
 * @param {string} jobId - Job ID
 * @returns {Promise<Array>} Matched candidates
 */
export const getMatchedCandidates = async (jobId) => {
  return request(`/recruiter/quick-search/jobs/${jobId}/matches`, {
    method: 'GET',
  });
};

/**
 * Send offer to a job seeker
 * @param {Object} offerData - Offer data
 * @returns {Promise<Object>} Sent offer
 */
export const sendOffer = async (offerData) => {
  return request('/recruiter/quick-search/offers', {
    method: 'POST',
    body: offerData,
  });
};

/**
 * Cancel an offer
 * @param {string} offerId - Offer ID
 * @returns {Promise<Object>} Cancelled offer
 */
export const cancelOffer = async (offerId) => {
  return request(`/recruiter/quick-search/offers/${offerId}`, {
    method: 'DELETE',
  });
};

/**
 * Get active quick search jobs
 * @returns {Promise<Array>} Active jobs
 */
export const getActiveJobs = async () => {
  return request('/recruiter/quick-search/active-jobs', {
    method: 'GET',
  });
};

/**
 * Get completed quick search jobs
 * @returns {Promise<Array>} Completed jobs
 */
export const getCompletedJobs = async () => {
  return request('/recruiter/quick-search/completed-jobs', {
    method: 'GET',
  });
};

