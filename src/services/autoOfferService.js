import { matchQuickSearchCandidates } from './quickSearchMatching';

/**
 * Auto-send offers to matched candidates
 * @param {Object} job - Quick search job
 * @param {Object} settings - Recruiter settings
 * @param {Object} acceptanceRatings - Candidate acceptance ratings
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} sendOfferAction - Action to send offer
 * @returns {Array} Array of offers sent
 */
export const autoSendOffers = (
  job,
  settings = {},
  acceptanceRatings = {},
  dispatch,
  sendOfferAction
) => {
  // Check if auto-matching is enabled
  if (!settings.autoMatchingEnabled) {
    return [];
  }

  // Get matched candidates
  const matches = matchQuickSearchCandidates(job, settings, acceptanceRatings);
  
  // Limit to number of staff required
  const staffCount = parseInt(job.staffCount || job.staffNumber || '1');
  const topMatches = matches.slice(0, staffCount);

  // Calculate expiry date
  const expiryDays = job.offerExpiryTimer || 30;
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

  // Send offers
  const offers = topMatches.map(candidate => {
    const offer = {
      jobId: job.id,
      candidateId: candidate.id,
      expiresAt: expiresAt.toISOString(),
      message: `You have a new quick search job offer! Match: ${Math.round(candidate.matchPercentage)}%`,
      autoSent: true,
    };

    // Dispatch offer
    if (dispatch && sendOfferAction) {
      dispatch(sendOfferAction(offer));
    }

    return offer;
  });

  return offers;
};

/**
 * Re-send offer to next match if previous offer was declined/expired
 * @param {Object} job - Quick search job
 * @param {Object} declinedOffer - The declined/expired offer
 * @param {Object} settings - Recruiter settings
 * @param {Object} acceptanceRatings - Candidate acceptance ratings
 * @param {Array} existingOffers - Already sent offers
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} sendOfferAction - Action to send offer
 * @returns {Object|null} New offer or null
 */
export const resendOfferToNextMatch = (
  job,
  declinedOffer,
  settings = {},
  acceptanceRatings = {},
  existingOffers = [],
  dispatch,
  sendOfferAction
) => {
  // Get all matches
  const matches = matchQuickSearchCandidates(job, settings, acceptanceRatings);
  
  // Get IDs of candidates who already received offers
  const offeredCandidateIds = new Set(
    existingOffers
      .filter(o => o.jobId === job.id && o.status === 'pending')
      .map(o => o.candidateId)
  );

  // Find next available match
  const nextMatch = matches.find(
    match => !offeredCandidateIds.has(match.id) && match.id !== declinedOffer.candidateId
  );

  if (!nextMatch) {
    return null; // No more matches available
  }

  // Calculate expiry date
  const expiryDays = job.offerExpiryTimer || 30;
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

  const offer = {
    jobId: job.id,
    candidateId: nextMatch.id,
    expiresAt: expiresAt.toISOString(),
    message: `You have a new quick search job offer! Match: ${Math.round(nextMatch.matchPercentage)}%`,
    autoSent: settings.autoMatchingEnabled || false,
  };

  // Dispatch offer
  if (dispatch && sendOfferAction) {
    dispatch(sendOfferAction(offer));
  }

  return offer;
};

/**
 * Check if offer should be auto-sent based on settings
 * @param {Object} settings - Recruiter settings
 * @returns {boolean} Whether to auto-send
 */
export const shouldAutoSendOffer = (settings = {}) => {
  return settings.autoMatchingEnabled === true;
};

/**
 * Get candidates eligible for auto-offer
 * @param {Object} job - Quick search job
 * @param {Object} settings - Recruiter settings
 * @param {Object} acceptanceRatings - Candidate acceptance ratings
 * @param {Array} existingOffers - Already sent offers
 * @returns {Array} Eligible candidates
 */
export const getEligibleCandidatesForAutoOffer = (
  job,
  settings = {},
  acceptanceRatings = {},
  existingOffers = []
) => {
  // Get all matches
  const matches = matchQuickSearchCandidates(job, settings, acceptanceRatings);
  
  // Get IDs of candidates who already received offers
  const offeredCandidateIds = new Set(
    existingOffers
      .filter(o => o.jobId === job.id && ['pending', 'accepted'].includes(o.status))
      .map(o => o.candidateId)
  );

  // Filter out already offered candidates
  return matches.filter(match => !offeredCandidateIds.has(match.id));
};

