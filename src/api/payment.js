import { request } from './apiClient';

/**
 * Request platform payment for a job
 * @param {string} jobId - Job ID
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Payment request
 */
export const requestPlatformPayment = async (jobId, paymentData) => {
  return request('/payment/request-platform', {
    method: 'POST',
    body: {
      jobId,
      ...paymentData,
    },
  });
};

/**
 * Hold coins for a job
 * @param {string} jobId - Job ID
 * @param {number} amount - Amount to hold
 * @returns {Promise<Object>} Hold result
 */
export const holdCoins = async (jobId, amount) => {
  return request('/payment/hold-coins', {
    method: 'POST',
    body: {
      jobId,
      amount,
    },
  });
};

/**
 * Transfer coins from recruiter to job seeker
 * @param {string} jobId - Job ID
 * @param {Object} transferData - Transfer data
 * @returns {Promise<Object>} Transfer result
 */
export const transferCoins = async (jobId, transferData) => {
  return request('/payment/transfer', {
    method: 'POST',
    body: {
      jobId,
      ...transferData,
    },
  });
};

/**
 * Check balance for a job
 * @param {string} userId - User ID
 * @param {number} requiredAmount - Required amount
 * @returns {Promise<Object>} Balance check result
 */
export const checkBalance = async (userId, requiredAmount) => {
  return request('/payment/check-balance', {
    method: 'GET',
    params: {
      userId,
      requiredAmount,
    },
  });
};

