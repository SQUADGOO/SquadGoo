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

// Generate dummy modification offers
const generateDummyModificationOffers = () => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  
  return [
    {
      id: 'mod-offer-001',
      jobId: 'dummy-job-001',
      candidateId: 'js-001',
      candidateName: 'Jane Jobseeker',
      jobTitle: 'Commercial Painter',
      matchPercentage: 85,
      acceptanceRating: 92,
      status: 'modification_requested',
      expiresAt: expiresAt.toISOString(),
      message: 'We are pleased to offer you this position. Please review the terms and let us know if you have any questions.',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      response: {
        type: 'modification',
        modification: {
          payRate: '$35/hr',
          message: 'I would like to request a higher rate of $35/hr instead of the offered $30/hr, as I have extensive experience in commercial painting projects.',
        },
      },
    },
    {
      id: 'mod-offer-002',
      jobId: 'dummy-job-002',
      candidateId: 'js-002',
      candidateName: 'Michael Torres',
      jobTitle: 'Warehouse Manager',
      matchPercentage: 78,
      acceptanceRating: 88,
      status: 'modification_requested',
      expiresAt: expiresAt.toISOString(),
      message: 'We believe you would be a great fit for this role. Looking forward to your response.',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      response: {
        type: 'modification',
        modification: {
          payRate: '$42/hr',
          message: 'Could we discuss the pay rate? I was hoping for $42/hr considering my 6 years of warehouse management experience and the responsibilities involved.',
        },
      },
    },
    {
      id: 'mod-offer-003',
      jobId: 'dummy-job-003',
      candidateId: 'js-004',
      candidateName: 'Liam Chen',
      jobTitle: 'Office Cleaner',
      matchPercentage: 88,
      acceptanceRating: 84,
      status: 'modification_requested',
      expiresAt: expiresAt.toISOString(),
      message: 'We are excited to offer you this position. Please review the details.',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      response: {
        type: 'modification',
        modification: {
          payRate: '$28/hr',
          message: 'I would appreciate if we could adjust the rate to $28/hr. I have excellent references and can start immediately.',
        },
      },
    },
  ];
};

// Generate dummy jobs for modification offers
const generateDummyJobs = () => {
  const now = new Date();
  const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  return [
    {
      id: 'dummy-job-001',
      title: 'Commercial Painter',
      type: 'Full-time',
      industry: 'Construction',
      location: 'Sydney CBD',
      rangeKm: 20,
      staffNumber: '2',
      experience: '3 Years 0 Month',
      salaryRange: '$28/hr to $32/hr',
      salaryMin: 28,
      salaryMax: 32,
      salaryType: 'Hourly',
      taxType: 'ABN',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: false,
        shiftLoading: true,
        bonuses: false,
        overtime: false,
      },
      availability: 'Mon - Fri, 8 AM - 5 PM',
      freshersCanApply: false,
      educationalQualification: 'Certificate III in Painting',
      extraQualification: 'Commercial painting experience preferred',
      preferredLanguages: ['English'],
      jobEndDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      jobDescription: 'We are looking for an experienced commercial painter to join our team. The role involves painting and decorating commercial buildings.',
      searchType: 'manual',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'dummy-job-002',
      title: 'Warehouse Manager',
      type: 'Full-time',
      industry: 'Logistics',
      location: 'Melbourne',
      rangeKm: 25,
      staffNumber: '1',
      experience: '5 Years 0 Month',
      salaryRange: '$35/hr to $40/hr',
      salaryMin: 35,
      salaryMax: 40,
      salaryType: 'Hourly',
      taxType: 'ABN',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: true,
        bonuses: true,
        overtime: true,
      },
      availability: 'Mon - Sat, Day shifts',
      freshersCanApply: false,
      educationalQualification: 'Diploma in Logistics',
      extraQualification: 'Warehouse management experience required',
      preferredLanguages: ['English'],
      jobEndDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      jobDescription: 'We need an experienced warehouse manager to oversee daily operations, inventory management, and team coordination.',
      searchType: 'manual',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'dummy-job-003',
      title: 'Office Cleaner',
      type: 'Part-time',
      industry: 'Cleaning Services',
      location: 'Brisbane',
      rangeKm: 15,
      staffNumber: '1',
      experience: '1 Year 0 Month',
      salaryRange: '$25/hr to $27/hr',
      salaryMin: 25,
      salaryMax: 27,
      salaryType: 'Hourly',
      taxType: 'TFN',
      expireDate: expiryDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      extraPay: {
        publicHolidays: false,
        weekend: false,
        shiftLoading: false,
        bonuses: false,
        overtime: false,
      },
      availability: 'Mon - Fri, Evening shifts',
      freshersCanApply: true,
      educationalQualification: 'High School',
      extraQualification: 'Previous cleaning experience preferred',
      preferredLanguages: ['English'],
      jobEndDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      jobDescription: 'We are looking for a reliable office cleaner to maintain our office facilities. Evening shifts available.',
      searchType: 'manual',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

const initialState = {
  jobs: generateDummyJobs(),
  matchesByJobId: {},
  offers: generateDummyModificationOffers(),
  acceptanceRatings: buildAcceptanceRatingMap(),
};

const manualOffersSlice = createSlice({
  name: 'manualOffers',
  initialState,
  reducers: {
    initializeDummyData: (state) => {
      // Initialize dummy jobs if empty
      if (state.jobs.length === 0) {
        state.jobs = generateDummyJobs();
      }
      // Initialize dummy modification offers if no modification_requested offers exist
      const hasModificationOffers = state.offers.some(offer => offer.status === 'modification_requested');
      if (!hasModificationOffers) {
        // Add dummy modification offers to existing offers
        const dummyOffers = generateDummyModificationOffers();
        // Check if any of the dummy offer IDs already exist to avoid duplicates
        const existingIds = new Set(state.offers.map(o => o.id));
        const newOffers = dummyOffers.filter(o => !existingIds.has(o.id));
        state.offers = [...state.offers, ...newOffers];
      }
    },
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
  initializeDummyData,
} = manualOffersSlice.actions;

export default manualOffersSlice.reducer;

export const selectManualJobById = (state, jobId) =>
  state.manualOffers.jobs.find(job => job.id === jobId);

export const selectManualMatchesByJobId = (state, jobId) =>
  state.manualOffers.matchesByJobId[jobId] || [];

export const selectManualOffers = (state) => state.manualOffers.offers;

