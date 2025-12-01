import { request } from './apiClient';

/**
 * Start timer for a job
 * @param {string} jobId - Job ID
 * @param {Object} timerData - Timer data
 * @returns {Promise<Object>} Timer state
 */
export const startTimer = async (jobId, timerData) => {
  return request('/timer/start', {
    method: 'POST',
    body: {
      jobId,
      ...timerData,
    },
  });
};

/**
 * Stop timer for a job
 * @param {string} jobId - Job ID
 * @param {Object} stopData - Stop data
 * @returns {Promise<Object>} Timer state
 */
export const stopTimer = async (jobId, stopData) => {
  return request('/timer/stop', {
    method: 'POST',
    body: {
      jobId,
      ...stopData,
    },
  });
};

/**
 * Resume timer for a job
 * @param {string} jobId - Job ID
 * @param {Object} resumeData - Resume data
 * @returns {Promise<Object>} Timer state
 */
export const resumeTimer = async (jobId, resumeData) => {
  return request('/timer/resume', {
    method: 'POST',
    body: {
      jobId,
      ...resumeData,
    },
  });
};

/**
 * Get timer status for a job
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} Timer state
 */
export const getTimerStatus = async (jobId) => {
  return request(`/timer/job/${jobId}`, {
    method: 'GET',
  });
};

