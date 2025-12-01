/**
 * Payment Service for Quick Search Jobs
 * Handles payment calculations, balance checks, and payment flows
 */

/**
 * Calculate required balance for a job
 * @param {number} hourlyRate - Hourly rate in SG coins
 * @param {number} expectedHours - Expected hours to work
 * @returns {number} Required balance
 */
export const calculateRequiredBalance = (hourlyRate, expectedHours) => {
  return hourlyRate * expectedHours;
};

/**
 * Calculate hours that can be covered with available balance
 * @param {number} availableBalance - Available balance in wallet
 * @param {number} hourlyRate - Hourly rate
 * @returns {number} Hours that can be covered
 */
export const calculateCoverableHours = (availableBalance, hourlyRate) => {
  if (hourlyRate <= 0) return 0;
  return Math.floor(availableBalance / hourlyRate);
};

/**
 * Calculate incremental hold amount based on elapsed time
 * @param {number} elapsedSeconds - Elapsed time in seconds
 * @param {number} hourlyRate - Hourly rate
 * @returns {number} Amount to hold
 */
export const calculateIncrementalHold = (elapsedSeconds, hourlyRate) => {
  const elapsedHours = elapsedSeconds / 3600;
  return elapsedHours * hourlyRate;
};

/**
 * Check if balance is sufficient for job
 * @param {number} availableBalance - Available balance
 * @param {number} requiredBalance - Required balance
 * @param {number} hourlyRate - Hourly rate (optional, for calculating coverable hours)
 * @returns {Object} Balance check result
 */
export const checkBalanceSufficiency = (availableBalance, requiredBalance, hourlyRate = null) => {
  const hasSufficientBalance = availableBalance >= requiredBalance;
  const shortfall = Math.max(0, requiredBalance - availableBalance);
  let coverableHours = 0;
  
  if (hourlyRate && hourlyRate > 0) {
    coverableHours = calculateCoverableHours(availableBalance, hourlyRate);
  }
  
  return {
    hasSufficientBalance,
    availableBalance,
    requiredBalance,
    shortfall,
    coverableHours,
  };
};

/**
 * Calculate payment amount after timer stops
 * @param {number} elapsedSeconds - Total elapsed time in seconds
 * @param {number} hourlyRate - Hourly rate
 * @returns {number} Total payment amount
 */
export const calculatePaymentAmount = (elapsedSeconds, hourlyRate) => {
  const hours = elapsedSeconds / 3600;
  return hours * hourlyRate;
};

/**
 * Validate payment method selection
 * @param {string} paymentMethod - 'platform' or 'direct'
 * @returns {boolean} Whether payment method is valid
 */
export const validatePaymentMethod = (paymentMethod) => {
  return paymentMethod === 'platform' || paymentMethod === 'direct';
};

/**
 * Check if TFN employees can use platform payment
 * @param {string} taxType - Tax type (TFN, ABN, or both)
 * @returns {boolean} Whether platform payment is allowed
 */
export const canUsePlatformPayment = (taxType) => {
  // According to requirements: TFN employees cannot use platform payment
  // Only ABN contractors can use platform payment
  return taxType === 'ABN' || taxType === 'both';
};

