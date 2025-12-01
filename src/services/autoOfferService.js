import { matchQuickSearchCandidates, checkBalanceRequirement } from './quickSearchMatching';
import { calculateRequiredBalance } from './paymentService';

/**
 * Filter candidates based on job seeker settings
 * @param {Object} candidate - Candidate profile
 * @param {Object} jobSeekerSettings - Job seeker's quick search settings
 * @param {Object} job - Job requirements
 * @param {number} recruiterBalance - Recruiter's wallet balance
 * @returns {boolean} Whether candidate should receive offer
 */
const filterCandidateByJobSeekerSettings = (candidate, jobSeekerSettings = {}, job, recruiterBalance) => {
  // Check if candidate has quick offers enabled
  if (jobSeekerSettings.quickOffersEnabled === false) {
    return false;
  }

  // Filter: Only receive offers with platform-handled payments
  if (jobSeekerSettings.onlyPlatformPayment && job.paymentMethod !== 'platform') {
    return false;
  }

  // Filter: Only from recruiters with sufficient balance
  if (jobSeekerSettings.onlySufficientBalance) {
    const hourlyRate = job.salaryMin || 0;
    const expectedHours = job.expectedHours || 8;
    const requiredBalance = calculateRequiredBalance(hourlyRate, expectedHours);
    
    if (recruiterBalance < requiredBalance) {
      return false;
    }
  }

  // Filter: Only from PRO badge or above
  if (jobSeekerSettings.onlyProBadgeOrAbove) {
    const badgeOrder = { 'Bronze': 1, 'Silver': 2, 'Platinum': 3, 'Gold': 4, 'PRO': 5 };
    const recruiterBadgeLevel = badgeOrder[job.recruiterBadge] || 0;
    const proBadgeLevel = badgeOrder['PRO'] || 0;
    
    if (recruiterBadgeLevel < proBadgeLevel) {
      return false;
    }
  }

  return true;
};

/**
 * Auto-send offers to matched candidates
 * @param {Object} job - Quick search job
 * @param {Object} settings - Recruiter settings
 * @param {Object} acceptanceRatings - Candidate acceptance ratings
 * @param {Object} jobSeekerSettingsMap - Map of candidateId -> job seeker settings
 * @param {number} recruiterBalance - Recruiter's wallet balance
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} sendOfferAction - Action to send offer
 * @returns {Array} Array of offers sent
 */
export const autoSendOffers = (
  job,
  settings = {},
  acceptanceRatings = {},
  jobSeekerSettingsMap = {},
  recruiterBalance = 0,
  dispatch,
  sendOfferAction
) => {
  // Check if auto-matching is enabled
  if (!settings.autoMatchingEnabled) {
    return [];
  }

  // Get matched candidates
  const matches = matchQuickSearchCandidates(job, settings, acceptanceRatings);
  
  // Filter candidates based on their individual settings
  const filteredMatches = matches.filter(candidate => {
    const candidateSettings = jobSeekerSettingsMap[candidate.id] || {};
    return filterCandidateByJobSeekerSettings(candidate, candidateSettings, job, recruiterBalance);
  });
  
  // Limit to number of staff required
  const staffCount = parseInt(job.staffCount || job.staffNumber || '1');
  const topMatches = filteredMatches.slice(0, staffCount);

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
 * @param {Object} jobSeekerSettingsMap - Map of candidateId -> job seeker settings
 * @param {number} recruiterBalance - Recruiter's wallet balance
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
  jobSeekerSettingsMap = {},
  recruiterBalance = 0,
  dispatch,
  sendOfferAction
) => {
  // Get all matches
  const matches = matchQuickSearchCandidates(job, settings, acceptanceRatings);
  
  // Filter by job seeker settings
  const filteredMatches = matches.filter(candidate => {
    const candidateSettings = jobSeekerSettingsMap[candidate.id] || {};
    return filterCandidateByJobSeekerSettings(candidate, candidateSettings, job, recruiterBalance);
  });
  
  // Get IDs of candidates who already received offers
  const offeredCandidateIds = new Set(
    existingOffers
      .filter(o => o.jobId === job.id && o.status === 'pending')
      .map(o => o.candidateId)
  );

  // Find next available match (filtered and not already offered)
  const nextMatch = filteredMatches.find(
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
 * @param {Object} jobSeekerSettingsMap - Map of candidateId -> job seeker settings
 * @param {number} recruiterBalance - Recruiter's wallet balance
 * @returns {Array} Eligible candidates
 */
export const getEligibleCandidatesForAutoOffer = (
  job,
  settings = {},
  acceptanceRatings = {},
  existingOffers = [],
  jobSeekerSettingsMap = {},
  recruiterBalance = 0
) => {
  // Get all matches
  const matches = matchQuickSearchCandidates(job, settings, acceptanceRatings);
  
  // Filter by job seeker settings
  const filteredMatches = matches.filter(candidate => {
    const candidateSettings = jobSeekerSettingsMap[candidate.id] || {};
    return filterCandidateByJobSeekerSettings(candidate, candidateSettings, job, recruiterBalance);
  });
  
  // Get IDs of candidates who already received offers
  const offeredCandidateIds = new Set(
    existingOffers
      .filter(o => o.jobId === job.id && ['pending', 'accepted'].includes(o.status))
      .map(o => o.candidateId)
  );

  // Filter out already offered candidates
  return filteredMatches.filter(match => !offeredCandidateIds.has(match.id));
};

