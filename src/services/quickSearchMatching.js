import { DUMMY_JOB_SEEKERS } from '@/utilities/dummyJobSeekers';

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - { latitude, longitude }
 * @param {Object} coord2 - { latitude, longitude }
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
  if (!coord1 || !coord2 || !coord1.latitude || !coord2.latitude) {
    return Infinity; // Return large number if coordinates not available
  }

  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Compute match score for quick search
 * @param {Object} job - Job requirements
 * @param {Object} candidate - Job seeker profile
 * @returns {number} Match percentage (0-100)
 */
export const computeQuickMatchScore = (job, candidate) => {
  let score = 45; // Base score

  // Industry match (20 points)
  if (job?.industry && candidate.industries?.includes(job.industry)) {
    score += 20;
  }

  // Job title match (10 points)
  const jobTitle = (job?.jobTitle || job?.title || '').toLowerCase();
  if (candidate.preferredRoles?.some(role => 
    role?.toLowerCase().includes(jobTitle)
  )) {
    score += 10;
  }

  // Tax type match (10 points)
  if (job?.taxType && candidate.taxTypes?.includes(job.taxType)) {
    score += 10;
  }

  // Location within range (5 points)
  if (job?.rangeKm && candidate.radiusKm) {
    score += job.rangeKm <= candidate.radiusKm ? 5 : 0;
  }

  // Salary range match (5 points)
  if (job?.salaryMin && candidate.payPreference?.min) {
    const withinRange =
      candidate.payPreference.min <= (job.salaryMax || job.salaryMin) &&
      candidate.payPreference.max >= job.salaryMin;
    score += withinRange ? 5 : 0;
  }

  // Experience match (5 points)
  if (job?.experienceYear || job?.experience) {
    const jobYears = parseInt(job.experienceYear || job.experience || '0');
    if (!Number.isNaN(jobYears) && candidate.experienceYears) {
      const diff = Math.abs(candidate.experienceYears - jobYears);
      score += diff <= 1 ? 5 : diff <= 3 ? 3 : 0;
    }
  }

  // Random variation (0-5 points) for diversity
  score += Math.floor(Math.random() * 6);

  return clamp(score, 40, 100);
};

/**
 * Filter candidates based on job seeker settings
 * @param {Object} candidate - Job seeker profile
 * @param {Object} settings - Job seeker quick search settings
 * @returns {boolean} Whether candidate passes filters
 */
export const filterCandidateBySettings = (candidate, settings = {}) => {
  // Check if candidate has quick offers enabled
  // In real implementation, this would come from candidate's settings
  // For now, we'll assume all candidates have it enabled

  // Filter by badge requirements
  if (settings.minBadge) {
    const badgeOrder = { 'Bronze': 1, 'Silver': 2, 'Platinum': 3, 'Gold': 4, 'PRO': 5 };
    const candidateBadgeLevel = badgeOrder[candidate.badge] || 0;
    const minBadgeLevel = badgeOrder[settings.minBadge] || 0;
    if (candidateBadgeLevel < minBadgeLevel) return false;
  }

  // Filter by PRO badge requirement
  if (settings.proOnly && candidate.badge !== 'PRO') {
    return false;
  }

  // Filter by payment preference (would need candidate settings)
  // This would be handled in real implementation

  // Filter by availability (would need to match job timing)
  // This would be handled in real implementation

  return true;
};

/**
 * Match candidates for a quick search job
 * @param {Object} job - Job requirements
 * @param {Object} settings - Recruiter/job seeker settings
 * @param {Object} acceptanceRatings - Map of candidate acceptance ratings
 * @returns {Array} Sorted array of matched candidates
 */
export const matchQuickSearchCandidates = (job, settings = {}, acceptanceRatings = {}) => {
  // Filter candidates
  let candidates = DUMMY_JOB_SEEKERS.filter(candidate => 
    filterCandidateBySettings(candidate, settings)
  );

  // Calculate match scores
  const matches = candidates.map(candidate => {
    const matchPercentage = computeQuickMatchScore(job, candidate);
    const currentRating = acceptanceRatings[candidate.id] ?? candidate.acceptanceRating;
    
    // Combined score: 70% match + 30% acceptance rating
    const combinedScore = (matchPercentage * 0.7) + (currentRating * 0.3);
    
    return {
      id: candidate.id,
      name: candidate.name,
      badge: candidate.badge,
      avatar: candidate.avatar,
      acceptanceRating: currentRating,
      matchPercentage,
      combinedScore,
      location: candidate.location,
      suburb: candidate.suburb,
      radiusKm: candidate.radiusKm,
      taxTypes: candidate.taxTypes,
      languages: candidate.languages,
      qualifications: candidate.qualifications,
      education: candidate.education,
      availability: candidate.availability,
      payPreference: candidate.payPreference,
      industries: candidate.industries,
      preferredRoles: candidate.preferredRoles,
      experienceYears: candidate.experienceYears,
      bio: candidate.bio,
      skills: candidate.skills,
    };
  })
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, 20); // Top 20 matches

  return matches;
};

/**
 * Check if candidate meets balance requirements
 * @param {Object} candidate - Job seeker profile
 * @param {Object} job - Job requirements
 * @param {number} recruiterBalance - Recruiter's wallet balance
 * @returns {Object} Balance check result
 */
export const checkBalanceRequirement = (candidate, job, recruiterBalance) => {
  // Calculate required balance
  const hourlyRate = job.salaryMin || 0;
  const expectedHours = job.expectedHours || 8;
  const requiredBalance = hourlyRate * expectedHours;

  return {
    hasSufficientBalance: recruiterBalance >= requiredBalance,
    availableBalance: recruiterBalance,
    requiredBalance,
    shortfall: Math.max(0, requiredBalance - recruiterBalance),
  };
};

