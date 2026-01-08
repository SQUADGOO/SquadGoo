import { createSlice, nanoid } from '@reduxjs/toolkit';
import { DUMMY_JOB_SEEKERS } from '@/utilities/dummyJobSeekers';
import { DUMMY_CONTRACTORS } from '@/utilities/dummyContractors';
import { DUMMY_EMPLOYEES } from '@/utilities/dummyEmployees';

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

// Compute match score for quick search (similar to manual but optimized for quick matching)
const computeQuickMatchScore = (job, candidate) => {
  let score = 45; // Base score

  // Industry match (20 points)
  if (job?.industry && candidate.industries?.includes(job.industry)) {
    score += 20;
  }

  // Job title match (10 points)
  if (candidate.preferredRoles?.some(role => 
    role?.toLowerCase().includes((job?.jobTitle || job?.title || '').toLowerCase())
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

  // Random variation (0-5 points)
  score += Math.floor(Math.random() * 6);

  return clamp(score, 40, 100);
};

// Build candidate snapshot for quick search
const buildQuickCandidateSnapshot = (candidate, matchPercentage, currentRating) => ({
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

// Build acceptance rating map
const getAllCandidates = () => [...DUMMY_JOB_SEEKERS, ...DUMMY_CONTRACTORS, ...DUMMY_EMPLOYEES];

const buildAcceptanceRatingMap = () =>
  getAllCandidates().reduce((acc, seeker) => {
    acc[seeker.id] = seeker.acceptanceRating;
    return acc;
  }, {});

const findCandidateById = (candidateId) => getAllCandidates().find(c => c.id === candidateId) || null;

// Generate dummy accepted offers for quick search
const generateDummyAcceptedOffers = () => {
  const now = new Date();
  const acceptedDate1 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
  const acceptedDate2 = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
  
  // Use js-001 (Jane Jobseeker), js-002 (Michael Torres), js-003 (Aisha Khan), js-004 (Liam Chen), js-005 (Sofia Romero)
  const candidate1 = DUMMY_JOB_SEEKERS.find(js => js.id === 'js-001');
  const candidate2 = DUMMY_JOB_SEEKERS.find(js => js.id === 'js-002');
  const candidate3 = DUMMY_JOB_SEEKERS.find(js => js.id === 'js-003');
  const candidate4 = DUMMY_JOB_SEEKERS.find(js => js.id === 'js-004');
  const candidate5 = DUMMY_JOB_SEEKERS.find(js => js.id === 'js-005');
  
  if (!candidate1 || !candidate2 || !candidate3 || !candidate4 || !candidate5) return [];
  
  const acceptedDate3 = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
  const acceptedDate4 = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000); // 4 days ago
  const acceptedDate5 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
  
  return [
    {
      id: 'quick-offer-accepted-001',
      jobId: 'quick-job-dummy-001',
      candidateId: candidate1.id,
      candidateName: candidate1.name,
      jobTitle: 'Commercial Painting Project',
      matchPercentage: 92,
      acceptanceRating: candidate1.acceptanceRating,
      status: 'accepted',
      expiresAt: new Date(acceptedDate1.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'You have been matched with a great opportunity!',
      autoSent: false,
      createdAt: new Date(acceptedDate1.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: acceptedDate1.toISOString(),
      response: {
        type: 'accepted',
        acceptedAt: acceptedDate1.toISOString(),
      },
    },
    {
      id: 'quick-offer-accepted-002',
      jobId: 'quick-job-dummy-002',
      candidateId: candidate2.id,
      candidateName: candidate2.name,
      jobTitle: 'Warehouse Inventory Management',
      matchPercentage: 88,
      acceptanceRating: candidate2.acceptanceRating,
      status: 'accepted',
      expiresAt: new Date(acceptedDate2.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'High match opportunity available!',
      autoSent: true,
      createdAt: new Date(acceptedDate2.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: acceptedDate2.toISOString(),
      response: {
        type: 'accepted',
        acceptedAt: acceptedDate2.toISOString(),
      },
    },
    {
      id: 'quick-offer-accepted-003',
      jobId: 'quick-job-dummy-003',
      candidateId: candidate3.id,
      candidateName: candidate3.name,
      jobTitle: 'Event Setup and Management',
      matchPercentage: 82,
      acceptanceRating: candidate3.acceptanceRating,
      status: 'accepted',
      expiresAt: new Date(acceptedDate3.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Great opportunity for event professionals!',
      autoSent: false,
      createdAt: new Date(acceptedDate3.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: acceptedDate3.toISOString(),
      response: {
        type: 'accepted',
        acceptedAt: acceptedDate3.toISOString(),
      },
    },
    {
      id: 'quick-offer-accepted-004',
      jobId: 'quick-job-dummy-004',
      candidateId: candidate4.id,
      candidateName: candidate4.name,
      jobTitle: 'Commercial Deep Cleaning Service',
      matchPercentage: 86,
      acceptanceRating: candidate4.acceptanceRating,
      status: 'accepted',
      expiresAt: new Date(acceptedDate4.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Perfect match for cleaning supervisor role!',
      autoSent: true,
      createdAt: new Date(acceptedDate4.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: acceptedDate4.toISOString(),
      response: {
        type: 'accepted',
        acceptedAt: acceptedDate4.toISOString(),
      },
    },
    {
      id: 'quick-offer-accepted-005',
      jobId: 'quick-job-dummy-005',
      candidateId: candidate5.id,
      candidateName: candidate5.name,
      jobTitle: 'Landscape Design and Installation',
      matchPercentage: 94,
      acceptanceRating: candidate5.acceptanceRating,
      status: 'accepted',
      expiresAt: new Date(acceptedDate5.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Excellent match for landscape design project!',
      autoSent: false,
      createdAt: new Date(acceptedDate5.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: acceptedDate5.toISOString(),
      response: {
        type: 'accepted',
        acceptedAt: acceptedDate5.toISOString(),
      },
    },
  ];
};

// Generate dummy quick jobs for accepted offers
const generateDummyQuickJobs = () => {
  const now = new Date();
  return [
    {
      id: 'quick-job-dummy-001',
      jobTitle: 'Commercial Painting Project',
      title: 'Commercial Painting Project',
      description: 'Large-scale commercial painting project requiring skilled painters. Experience with industrial equipment preferred.',
      industry: 'Construction',
      experienceYear: 4,
      staffCount: 2,
      location: 'Sydney CBD',
      rangeKm: 25,
      salaryMin: 30,
      salaryMax: 40,
      salaryType: 'Hourly',
      taxType: 'ABN',
      searchType: 'quick',
      status: 'active',
      recruiterId: 'recruiter-001',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'quick-job-dummy-002',
      jobTitle: 'Warehouse Inventory Management',
      title: 'Warehouse Inventory Management',
      description: 'Warehouse operations role focusing on inventory management and team coordination.',
      industry: 'Logistics',
      experienceYear: 5,
      staffCount: 1,
      location: 'Melbourne CBD',
      rangeKm: 30,
      salaryMin: 35,
      salaryMax: 45,
      salaryType: 'Hourly',
      taxType: 'ABN',
      searchType: 'quick',
      status: 'active',
      recruiterId: 'recruiter-001',
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'quick-job-dummy-003',
      jobTitle: 'Event Setup and Management',
      title: 'Event Setup and Management',
      description: 'Event crew role for corporate events and functions. Setup and packdown experience required.',
      industry: 'Events',
      experienceYear: 2,
      staffCount: 3,
      location: 'Brisbane CBD',
      rangeKm: 20,
      salaryMin: 25,
      salaryMax: 32,
      salaryType: 'Hourly',
      taxType: 'ABN',
      searchType: 'quick',
      status: 'active',
      recruiterId: 'recruiter-001',
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'quick-job-dummy-004',
      jobTitle: 'Commercial Deep Cleaning Service',
      title: 'Commercial Deep Cleaning Service',
      description: 'Deep cleaning supervisor role for large commercial facilities. Experience with commercial kitchens preferred.',
      industry: 'Cleaning Services',
      experienceYear: 5,
      staffCount: 2,
      location: 'Perth CBD',
      rangeKm: 35,
      salaryMin: 28,
      salaryMax: 36,
      salaryType: 'Hourly',
      taxType: 'TFN',
      searchType: 'quick',
      status: 'active',
      recruiterId: 'recruiter-001',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'quick-job-dummy-005',
      jobTitle: 'Landscape Design and Installation',
      title: 'Landscape Design and Installation',
      description: 'Landscape design project requiring experienced landscape professional for bespoke outdoor projects.',
      industry: 'Landscaping',
      experienceYear: 7,
      staffCount: 1,
      location: 'Adelaide CBD',
      rangeKm: 40,
      salaryMin: 38,
      salaryMax: 55,
      salaryType: 'Hourly',
      taxType: 'ABN',
      searchType: 'quick',
      status: 'active',
      recruiterId: 'recruiter-001',
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

const initialState = {
  quickJobs: generateDummyQuickJobs(), // Posted quick search jobs (includes dummy jobs for accepted offers)
  activeOffers: generateDummyAcceptedOffers(), // Offers sent to job seekers (includes dummy accepted offers)
  activeJobs: [], // Jobs with accepted offers (in progress)
  locationTracking: {}, // Real-time location data: { jobId: { stage, location, distance, etc } }
  timerStates: {}, // Timer states: { jobId: { isRunning, startTime, elapsedTime, etc } }
  paymentRequests: [], // Payment method selection requests
  completedJobs: [], // Completed quick search jobs
  acceptanceRatings: buildAcceptanceRatingMap(),
  matchesByJobId: {}, // Cached matches for each job
};

const quickSearchSlice = createSlice({
  name: 'quickSearch',
  initialState,
  reducers: {
    // Create a new quick search job
    createQuickJob: (state, { payload }) => {
      const jobId = payload.id ?? `quick-job-${Date.now()}`;
      const job = {
        ...payload,
        id: jobId,
        searchType: 'quick',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.quickJobs.unshift(job);
    },

    // Auto-match candidates for a quick search job
    autoMatchCandidates: (state, { payload }) => {
      const { jobId, settings = {} } = payload;
      const job = state.quickJobs.find(j => j.id === jobId);
      if (!job) return;

      // Filter candidates based on job seeker settings
      let candidates = getAllCandidates().filter(candidate => {
        // Check if candidate has quick offers enabled (would come from settings in real app)
        // For now, we'll include all candidates
        
        // Filter by badge requirements if set
        if (settings.minBadge) {
          const badgeOrder = { 'Bronze': 1, 'Silver': 2, 'Platinum': 3, 'Gold': 4 };
          const candidateBadgeLevel = badgeOrder[candidate.badge] || 0;
          const minBadgeLevel = badgeOrder[settings.minBadge] || 0;
          if (candidateBadgeLevel < minBadgeLevel) return false;
        }

        // Filter by PRO badge requirement
        if (settings.proOnly && candidate.badge !== 'PRO') {
          return false;
        }

        // Filter by payment preference (would need to check candidate settings)
        // This would be handled in real implementation

        return true;
      });

      // Calculate match scores
      const matches = candidates.map(candidate => {
        const score = computeQuickMatchScore(job, candidate);
        const currentRating = state.acceptanceRatings[candidate.id];
        
        // Combined score: 70% match + 30% acceptance rating
        const combinedScore = (score * 0.7) + (currentRating * 0.3);
        
        return {
          ...buildQuickCandidateSnapshot(candidate, score, currentRating),
          combinedScore,
        };
      })
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, 20); // Top 20 matches

      state.matchesByJobId[jobId] = matches;
    },

    // Send quick offer to a job seeker
    sendQuickOffer: (state, { payload }) => {
      const { jobId, candidateId, expiresAt, message, autoSent = false } = payload;
      const job = state.quickJobs.find(j => j.id === jobId);
      let candidate = state.matchesByJobId[jobId]?.find(m => m.id === candidateId);

      if (!job) return;

      // If the candidate isn't in the current match list, fall back to lookup + compute a snapshot.
      // This enables sending offers from pools (Employees/Contractors/Squads) without requiring prior matching.
      if (!candidate) {
        const baseCandidate = findCandidateById(candidateId);
        if (!baseCandidate) return;

        const score = computeQuickMatchScore(job, baseCandidate);
        const currentRating = state.acceptanceRatings[candidateId] ?? baseCandidate.acceptanceRating;
        candidate = buildQuickCandidateSnapshot(baseCandidate, score, currentRating);

        if (!state.matchesByJobId[jobId]) state.matchesByJobId[jobId] = [];
        // Avoid duplicates
        const exists = state.matchesByJobId[jobId].some(m => m.id === candidateId);
        if (!exists) state.matchesByJobId[jobId].unshift(candidate);
      }

      const offerId = nanoid();
      const offer = {
        id: offerId,
        jobId,
        candidateId,
        candidateName: candidate.name,
        jobTitle: job.jobTitle || job.title,
        matchPercentage: candidate.matchPercentage,
        acceptanceRating: candidate.acceptanceRating,
        status: 'pending',
        expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
        message: message || 'You have a new quick search job offer!',
        autoSent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        response: null,
      };

      state.activeOffers.unshift(offer);
    },

    // Job seeker accepts quick offer
    acceptQuickOffer: (state, { payload }) => {
      const { offerId } = payload;
      const offer = state.activeOffers.find(o => o.id === offerId);
      if (!offer) return;

      offer.status = 'accepted';
      offer.response = {
        type: 'accepted',
        acceptedAt: new Date().toISOString(),
      };
      offer.updatedAt = new Date().toISOString();

      // Create active job
      const job = state.quickJobs.find(j => j.id === offer.jobId);
      if (job) {
        const activeJobId = nanoid();
        const activeJob = {
          id: activeJobId,
          offerId: offer.id,
          jobId: job.id,
          candidateId: offer.candidateId,
          candidateName: offer.candidateName,
          jobTitle: offer.jobTitle,
          recruiterId: job.recruiterId || 'recruiter-001', // Would come from auth in real app
          status: 'in_progress',
          currentStage: 'accepted', // accepted, preparing, en_route, approaching, arrived
          locationTracking: {
            enabled: false,
            stage: 'accepted',
            homeLocation: null,
            workplaceLocation: job.workLocation || job.location,
            currentLocation: null,
            distanceFromHome: 0,
            distanceFromWorkplace: 0,
          },
          payment: {
            method: null, // 'platform' or 'direct'
            requested: false,
            codeGenerated: false,
            code: null,
            balanceHeld: 0,
            balanceRequired: 0,
          },
          timer: {
            isRunning: false,
            startTime: null,
            stopTime: null,
            elapsedTime: 0, // in seconds
            hourlyRate: job.salaryMin || 0,
            totalCost: 0,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        state.activeJobs.unshift(activeJob);
        state.locationTracking[activeJobId] = activeJob.locationTracking;
        state.timerStates[activeJobId] = activeJob.timer;
      }

      // Update acceptance rating (slight increase)
      if (offer.candidateId) {
        const current = state.acceptanceRatings[offer.candidateId] ?? 80;
        state.acceptanceRatings[offer.candidateId] = clamp(current + 2, 0, 100);
      }
    },

    // Job seeker declines quick offer
    declineQuickOffer: (state, { payload }) => {
      const { offerId, reason } = payload;
      const offer = state.activeOffers.find(o => o.id === offerId);
      if (!offer) return;

      offer.status = 'declined';
      offer.response = {
        type: 'declined',
        reason: reason || 'No reason provided',
        declinedAt: new Date().toISOString(),
      };
      offer.updatedAt = new Date().toISOString();

      // Update acceptance rating if match was high and reason is invalid
      if (offer.matchPercentage >= 70 && reason && !reason.isValid) {
        if (offer.candidateId) {
          const current = state.acceptanceRatings[offer.candidateId] ?? 80;
          state.acceptanceRatings[offer.candidateId] = clamp(current - 5, 40, 100);
        }
      }
    },

    // Update location tracking
    updateLocationTracking: (state, { payload }) => {
      const { jobId, location, stage, distanceFromHome, distanceFromWorkplace } = payload;
      const activeJob = state.activeJobs.find(j => j.id === jobId);
      if (!activeJob) return;

      activeJob.currentStage = stage;
      activeJob.locationTracking = {
        ...activeJob.locationTracking,
        enabled: true,
        stage,
        currentLocation: location,
        distanceFromHome: distanceFromHome || 0,
        distanceFromWorkplace: distanceFromWorkplace || 0,
        lastUpdated: new Date().toISOString(),
      };

      state.locationTracking[jobId] = activeJob.locationTracking;
      activeJob.updatedAt = new Date().toISOString();
    },

    // Request platform payment
    requestPlatformPayment: (state, { payload }) => {
      const { jobId, requestedBy } = payload; // 'jobseeker' or 'recruiter'
      const activeJob = state.activeJobs.find(j => j.id === jobId);
      if (!activeJob) return;

      // Generate code
      const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      activeJob.payment = {
        ...activeJob.payment,
        method: 'platform',
        requested: true,
        requestedBy,
        codeGenerated: true,
        code,
        codeExpiry: codeExpiry.toISOString(),
        codeShared: false,
      };

      activeJob.updatedAt = new Date().toISOString();

      // Add to payment requests
      state.paymentRequests.unshift({
        id: nanoid(),
        jobId,
        requestedBy,
        code,
        codeExpiry: codeExpiry.toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    },

    // Verify payment code
    verifyPaymentCode: (state, { payload }) => {
      const { jobId, code } = payload;
      const activeJob = state.activeJobs.find(j => j.id === jobId);
      if (!activeJob || !activeJob.payment.codeGenerated) return false;

      if (activeJob.payment.code === code && 
          new Date(activeJob.payment.codeExpiry) > new Date()) {
        activeJob.payment.codeShared = true;
        activeJob.payment.codeVerified = true;
        activeJob.updatedAt = new Date().toISOString();
        return true;
      }
      return false;
    },

    // Start timer
    startTimer: (state, { payload }) => {
      const { jobId, hourlyRate, expectedHours } = payload;
      const activeJob = state.activeJobs.find(j => j.id === jobId);
      if (!activeJob) return;

      activeJob.timer = {
        isRunning: true,
        startTime: new Date().toISOString(),
        stopTime: null,
        elapsedTime: 0,
        hourlyRate: hourlyRate || activeJob.timer.hourlyRate || 0,
        expectedHours: expectedHours || 8,
        totalCost: 0,
      };

      state.timerStates[jobId] = activeJob.timer;
      activeJob.updatedAt = new Date().toISOString();
    },

    // Stop timer
    stopTimer: (state, { payload }) => {
      const { jobId, stoppedBy, requiresCode = false } = payload;
      const activeJob = state.activeJobs.find(j => j.id === jobId);
      if (!activeJob || !activeJob.timer.isRunning) return;

      const startTime = new Date(activeJob.timer.startTime);
      const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
      const elapsedHours = elapsedSeconds / 3600;
      const totalCost = elapsedHours * activeJob.timer.hourlyRate;

      activeJob.timer = {
        ...activeJob.timer,
        isRunning: false,
        stopTime: new Date().toISOString(),
        elapsedTime: elapsedSeconds,
        totalCost,
        stoppedBy,
        requiresCode,
      };

      state.timerStates[jobId] = activeJob.timer;
      activeJob.updatedAt = new Date().toISOString();
    },

    // Resume timer
    resumeTimer: (state, { payload }) => {
      const { jobId, hourlyRate, expectedEndTime, requiresCode = false } = payload;
      const activeJob = state.activeJobs.find(j => j.id === jobId);
      if (!activeJob) return;

      const previousElapsed = activeJob.timer.elapsedTime || 0;

      activeJob.timer = {
        ...activeJob.timer,
        isRunning: true,
        startTime: new Date().toISOString(),
        stopTime: null,
        elapsedTime: previousElapsed,
        hourlyRate: hourlyRate || activeJob.timer.hourlyRate,
        expectedEndTime: expectedEndTime || null,
        requiresCode,
      };

      state.timerStates[jobId] = activeJob.timer;
      activeJob.updatedAt = new Date().toISOString();
    },

    // Update timer (for real-time updates)
    updateTimer: (state, { payload }) => {
      const { jobId } = payload;
      const activeJob = state.activeJobs.find(j => j.id === jobId);
      if (!activeJob || !activeJob.timer.isRunning) return;

      const startTime = new Date(activeJob.timer.startTime);
      const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000) + (activeJob.timer.elapsedTime || 0);
      const elapsedHours = elapsedSeconds / 3600;
      const totalCost = elapsedHours * activeJob.timer.hourlyRate;

      activeJob.timer = {
        ...activeJob.timer,
        elapsedTime: elapsedSeconds,
        totalCost,
      };

      state.timerStates[jobId] = activeJob.timer;
    },

    // Cancel offer (by recruiter)
    cancelOffer: (state, { payload }) => {
      const { offerId } = payload;
      const offer = state.activeOffers.find(o => o.id === offerId);
      if (!offer) return;

      offer.status = 'cancelled';
      offer.response = {
        type: 'cancelled',
        cancelledAt: new Date().toISOString(),
      };
      offer.updatedAt = new Date().toISOString();
    },

    // Complete job
    completeJob: (state, { payload }) => {
      const { jobId, completedBy } = payload;
      const activeJob = state.activeJobs.find(j => j.id === jobId);
      if (!activeJob) return;

      // Stop timer if running
      if (activeJob.timer.isRunning) {
        const startTime = new Date(activeJob.timer.startTime);
        const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000) + (activeJob.timer.elapsedTime || 0);
        const elapsedHours = elapsedSeconds / 3600;
        const totalCost = elapsedHours * activeJob.timer.hourlyRate;

        activeJob.timer = {
          ...activeJob.timer,
          isRunning: false,
          stopTime: new Date().toISOString(),
          elapsedTime: elapsedSeconds,
          totalCost,
        };
      }

      activeJob.status = 'completed';
      activeJob.completedBy = completedBy;
      activeJob.completedAt = new Date().toISOString();
      activeJob.updatedAt = new Date().toISOString();

      // Move to completed jobs
      state.completedJobs.unshift(activeJob);
      
      // Remove from active jobs
      state.activeJobs = state.activeJobs.filter(j => j.id !== jobId);
      
      // Clean up tracking
      delete state.locationTracking[jobId];
      delete state.timerStates[jobId];
    },

    // Expire offers
    expireQuickOffers: (state) => {
      const now = Date.now();
      state.activeOffers.forEach(offer => {
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
  extraReducers: (builder) => {
    // Handle rehydration from redux-persist
    builder.addCase('persist/REHYDRATE', (state, action) => {
      if (action.payload) {
        const persistedState = action.payload.quickSearch;
        
        if (persistedState) {
          // Get dummy data
          const dummyOffers = generateDummyAcceptedOffers();
          const dummyJobs = generateDummyQuickJobs();
          
          // Merge dummy offers with persisted offers (avoid duplicates by ID)
          const existingOfferIds = new Set((persistedState.activeOffers || []).map(o => o.id));
          const newDummyOffers = dummyOffers.filter(o => !existingOfferIds.has(o.id));
          const mergedOffers = [...(persistedState.activeOffers || []), ...newDummyOffers];
          
          // Merge dummy jobs with persisted jobs (avoid duplicates by ID)
          const existingJobIds = new Set((persistedState.quickJobs || []).map(j => j.id));
          const newDummyJobs = dummyJobs.filter(j => !existingJobIds.has(j.id));
          const mergedJobs = [...(persistedState.quickJobs || []), ...newDummyJobs];
          
          // Return merged state
          return {
            ...state,
            activeOffers: mergedOffers,
            quickJobs: mergedJobs,
            activeJobs: persistedState.activeJobs || state.activeJobs,
            locationTracking: persistedState.locationTracking || state.locationTracking,
            timerStates: persistedState.timerStates || state.timerStates,
            paymentRequests: persistedState.paymentRequests || state.paymentRequests,
            completedJobs: persistedState.completedJobs || state.completedJobs,
            acceptanceRatings: persistedState.acceptanceRatings || state.acceptanceRatings,
            matchesByJobId: persistedState.matchesByJobId || state.matchesByJobId,
          };
        }
      }
      return state;
    });
  },
});

export const {
  createQuickJob,
  autoMatchCandidates,
  sendQuickOffer,
  acceptQuickOffer,
  declineQuickOffer,
  updateLocationTracking,
  requestPlatformPayment,
  verifyPaymentCode,
  startTimer,
  stopTimer,
  resumeTimer,
  updateTimer,
  cancelOffer,
  completeJob,
  expireQuickOffers,
} = quickSearchSlice.actions;

export default quickSearchSlice.reducer;

// Selectors
export const selectQuickJobById = (state, jobId) =>
  state.quickSearch.quickJobs.find(job => job.id === jobId);

export const selectQuickMatchesByJobId = (state, jobId) =>
  state.quickSearch.matchesByJobId[jobId] || [];

export const selectQuickOffers = (state) => state.quickSearch.activeOffers;

export const selectActiveQuickJobs = (state) => state.quickSearch.activeJobs;

export const selectActiveQuickJobById = (state, jobId) =>
  state.quickSearch.activeJobs.find(
    (job) => job.id === jobId || job.jobId === jobId
  );

export const selectLocationTracking = (state, jobId) =>
  state.quickSearch.locationTracking[jobId];

export const selectTimerState = (state, jobId) =>
  state.quickSearch.timerStates[jobId];

export const selectCompletedQuickJobs = (state) => state.quickSearch.completedJobs;

