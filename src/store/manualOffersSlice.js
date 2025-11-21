import { createSlice, nanoid } from '@reduxjs/toolkit';
import { DUMMY_JOB_SEEKERS } from '@/utilities/dummyJobSeekers';

const buildAcceptanceRatingMap = () =>
  DUMMY_JOB_SEEKERS.reduce((acc, seeker) => {
    acc[seeker.id] = seeker.acceptanceRating;
    return acc;
  }, {});

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const computeMatchScore = (job, candidate) => {
  let score = 45;

  if (job?.industry && candidate.industries?.includes(job.industry)) {
    score += 20;
  }

  if (candidate.preferredRoles?.some(role => role?.toLowerCase().includes((job?.title || '').toLowerCase()))) {
    score += 10;
  }

  if (job?.taxType && candidate.taxTypes?.includes(job.taxType)) {
    score += 10;
  }

  if (job?.rangeKm && candidate.radiusKm) {
    score += job.rangeKm <= candidate.radiusKm ? 5 : 0;
  }

  if (job?.salaryMin && candidate.payPreference?.min) {
    const withinRange =
      candidate.payPreference.min <= job.salaryMax &&
      candidate.payPreference.max >= job.salaryMin;
    score += withinRange ? 5 : 0;
  }

  if (job?.experience) {
    const jobYears = parseInt(job.experience);
    if (!Number.isNaN(jobYears) && candidate.experienceYears) {
      const diff = Math.abs(candidate.experienceYears - jobYears);
      score += diff <= 1 ? 5 : diff <= 3 ? 3 : 0;
    }
  }

  score += Math.floor(Math.random() * 6); // small variation

  return clamp(score, 40, 100);
};

const buildCandidateSnapshot = (candidate, matchPercentage, currentRating) => ({
  id: candidate.id,
  name: candidate.name,
  badge: candidate.badge,
  avatar: candidate.avatar,
  acceptanceRating: currentRating ?? candidate.acceptanceRating,
  matchPercentage,
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
});

const initialState = {
  jobs: [],
  matchesByJobId: {},
  offers: [],
  acceptanceRatings: buildAcceptanceRatingMap(),
};

const manualOffersSlice = createSlice({
  name: 'manualOffers',
  initialState,
  reducers: {
    createManualJob: (state, { payload }) => {
      const jobId = payload.id ?? `manual-job-${Date.now()}`;
      const job = {
        ...payload,
        id: jobId,
        createdAt: new Date().toISOString(),
      };
      state.jobs.unshift(job);
    },
    generateManualMatches: (state, { payload }) => {
      const { jobId } = payload;
      const job = state.jobs.find(j => j.id === jobId);
      if (!job) return;

      const candidates = DUMMY_JOB_SEEKERS.map(candidate => {
        const score = computeMatchScore(job, candidate);
        const currentRating = state.acceptanceRatings[candidate.id];
        return buildCandidateSnapshot(candidate, score, currentRating);
      })
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 10);

      state.matchesByJobId[jobId] = candidates;
    },
    sendManualOffer: (state, { payload }) => {
      const { jobId, candidateId, expiresAt, message } = payload;
      const job = state.jobs.find(j => j.id === jobId);
      const candidate =
        state.matchesByJobId[jobId]?.find(match => match.id === candidateId) ??
        null;

      if (!job || !candidate) return;

      const offerId = nanoid();
      state.offers.unshift({
        id: offerId,
        jobId,
        candidateId,
        candidateName: candidate.name,
        jobTitle: job.title,
        matchPercentage: candidate.matchPercentage,
        status: 'pending',
        expiresAt,
        message,
        createdAt: new Date().toISOString(),
        response: null,
      });
    },
    updateManualOfferStatus: (state, { payload }) => {
      const { offerId, status, response } = payload;
      const offer = state.offers.find(o => o.id === offerId);
      if (!offer) return;

      offer.status = status;
      offer.response = response ?? null;
      offer.updatedAt = new Date().toISOString();

      if (offer.candidateId) {
        const current = state.acceptanceRatings[offer.candidateId] ?? 80;
        let updatedRating = current;

        if (status === 'declined') {
          const requiresReason =
            offer.matchPercentage >= 70 && !(response?.reason?.isValid ?? true);
          if (requiresReason) {
            updatedRating = clamp(current - 5, 40, 100);
          }
        }

        if (status === 'accepted') {
          updatedRating = clamp(current + 2, 0, 100);
        }

        state.acceptanceRatings[offer.candidateId] = updatedRating;

        // Update match list snapshot rating if exists
        Object.keys(state.matchesByJobId).forEach(jobId => {
          state.matchesByJobId[jobId] = state.matchesByJobId[jobId].map(
            match =>
              match.id === offer.candidateId
                ? { ...match, acceptanceRating: updatedRating }
                : match,
          );
        });
      }
    },
    expireManualOffers: (state) => {
      const now = Date.now();
      state.offers.forEach(offer => {
        if (
          offer.status === 'pending' &&
          offer.expiresAt &&
          new Date(offer.expiresAt).getTime() < now
        ) {
          offer.status = 'expired';
          offer.response = {
            type: 'expired',
            message: 'Offer expired without a response.',
          };
          offer.updatedAt = new Date().toISOString();
        }
      });
    },
  },
});

export const {
  createManualJob,
  generateManualMatches,
  sendManualOffer,
  updateManualOfferStatus,
  expireManualOffers,
} = manualOffersSlice.actions;

export default manualOffersSlice.reducer;

export const selectManualJobById = (state, jobId) =>
  state.manualOffers.jobs.find(job => job.id === jobId);

export const selectManualMatchesByJobId = (state, jobId) =>
  state.manualOffers.matchesByJobId[jobId] || [];

export const selectManualOffers = (state) => state.manualOffers.offers;

