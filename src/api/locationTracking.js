import { request } from './apiClient';

/**
 * Update location for a job
 * @param {string} jobId - Job ID
 * @param {Object} locationData - Location data
 * @returns {Promise<Object>} Updated location
 */
export const updateLocation = async (jobId, locationData) => {
  return request('/location-tracking/update', {
    method: 'POST',
    body: {
      jobId,
      ...locationData,
    },
  });
};

/**
 * Get location for a job
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} Location data
 */
export const getLocation = async (jobId) => {
  return request(`/location-tracking/job/${jobId}`, {
    method: 'GET',
  });
};

