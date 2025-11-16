import { createSlice } from '@reduxjs/toolkit';

// Dummy candidates generator
const generateDummyCandidates = (jobId) => {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Jennifer'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const locations = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra'];
  const experiences = ['2 years', '3 years', '5 years', '1 year', '4 years', '6+ years', 'Fresh graduate'];
  const statuses = ['pending', 'pending', 'pending', 'accepted', 'rejected']; // More pending for variety
  
  const candidatesCount = Math.floor(Math.random() * 6) + 3; // 3-8 candidates
  const candidates = [];
  
  for (let i = 0; i < candidatesCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    candidates.push({
      id: `candidate-${jobId}-${Date.now()}-${i}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+61 4${Math.floor(Math.random() * 90000000 + 10000000)}`,
      experience: experiences[Math.floor(Math.random() * experiences.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      status: status,
      appliedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random within last 7 days
      skills: ['Communication', 'Teamwork', 'Problem Solving'].slice(0, Math.floor(Math.random() * 3) + 1),
    });
  }
  
  return candidates;
};

// Generate dummy completed and expired jobs
const generateDummyJobs = () => {
  const completedJobsData = [
    {
      title: 'Commercial Kitchen Deep Clean',
      type: 'Contract',
      location: 'Sydney CBD',
      salaryRange: '$25/hr to $35/hr',
      experience: '2+ years',
      staffNumber: 2,
      searchType: 'quick',
      daysAgo: 5,
      description: 'Deep cleaning of commercial kitchen facilities including equipment sanitization.',
    },
    {
      title: 'Warehouse Inventory Management',
      type: 'Full-time',
      location: 'Melbourne',
      salaryRange: '$22/hr to $30/hr',
      experience: '3+ years',
      staffNumber: 3,
      searchType: 'manual',
      daysAgo: 12,
      description: 'Inventory tracking and warehouse organization for logistics company.',
    },
    {
      title: 'Garden Landscaping Project',
      type: 'Contract',
      location: 'Brisbane',
      salaryRange: '$20/hr to $28/hr',
      experience: '1+ years',
      staffNumber: 2,
      searchType: 'quick',
      daysAgo: 8,
      description: 'Complete garden landscaping including planting and hardscaping.',
    },
    {
      title: 'Office Renovation',
      type: 'Full-time',
      location: 'Perth',
      salaryRange: '$30/hr to $45/hr',
      experience: '5+ years',
      staffNumber: 4,
      searchType: 'manual',
      daysAgo: 20,
      description: 'Complete office space renovation including painting and carpentry.',
    },
    {
      title: 'Event Setup & Cleanup',
      type: 'Casual',
      location: 'Gold Coast',
      salaryRange: '$18/hr to $25/hr',
      experience: '0.5+ years',
      staffNumber: 5,
      searchType: 'quick',
      daysAgo: 3,
      description: 'Setup and cleanup for corporate events and functions.',
    },
  ];

  const expiredJobsData = [
    {
      title: 'Construction Site Laborer',
      type: 'Full-time',
      location: 'Sydney',
      salaryRange: '$28/hr to $38/hr',
      experience: '2+ years',
      staffNumber: 3,
      searchType: 'manual',
      daysAgo: 35,
      description: 'General construction labor for residential building project.',
    },
    {
      title: 'Retail Store Assistant',
      type: 'Part-time',
      location: 'Melbourne CBD',
      salaryRange: '$20/hr to $26/hr',
      experience: '1+ years',
      staffNumber: 2,
      searchType: 'quick',
      daysAgo: 42,
      description: 'Customer service and stock management for busy retail store.',
    },
    {
      title: 'Delivery Driver',
      type: 'Casual',
      location: 'Brisbane',
      salaryRange: '$22/hr to $30/hr',
      experience: '1+ years',
      staffNumber: 1,
      searchType: 'quick',
      daysAgo: 50,
      description: 'Local delivery services for food and packages.',
    },
    {
      title: 'Hotel Housekeeping',
      type: 'Part-time',
      location: 'Adelaide',
      salaryRange: '$19/hr to $24/hr',
      experience: '0.5+ years',
      staffNumber: 4,
      searchType: 'manual',
      daysAgo: 38,
      description: 'Housekeeping and room maintenance for boutique hotel.',
    },
  ];

  const completedJobs = completedJobsData.map((data, index) => {
    const completedDate = new Date(Date.now() - data.daysAgo * 24 * 60 * 60 * 1000);
    const jobId = `completed-job-${index}-${Date.now()}`;
    
    return {
      id: jobId,
      title: data.title,
      type: data.type,
      location: data.location,
      salaryRange: data.salaryRange,
      experience: data.experience,
      salaryType: 'Hourly',
      offerDate: new Date(completedDate.getTime() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      completedAt: completedDate.toISOString(),
      completedDate: completedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'completed',
      searchType: data.searchType,
      staffNumber: data.staffNumber,
      jobDescription: data.description,
      industry: 'General Services',
      rangeKm: 15,
      taxType: 'ABN',
      freshersCanApply: false,
    };
  });

  const expiredJobs = expiredJobsData.map((data, index) => {
    const expiredDate = new Date(Date.now() - data.daysAgo * 24 * 60 * 60 * 1000);
    const jobId = `expired-job-${index}-${Date.now()}`;
    
    return {
      id: jobId,
      title: data.title,
      type: data.type,
      location: data.location,
      salaryRange: data.salaryRange,
      experience: data.experience,
      salaryType: 'Hourly',
      offerDate: new Date(expiredDate.getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      expireDate: expiredDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'expired',
      searchType: data.searchType,
      staffNumber: data.staffNumber,
      jobDescription: data.description,
      industry: 'General Services',
      rangeKm: 15,
      taxType: 'ABN',
      freshersCanApply: false,
    };
  });
  
  return { completedJobs, expiredJobs };
};

const { completedJobs: initialCompletedJobs, expiredJobs: initialExpiredJobs } = generateDummyJobs();

// Generate candidates for initial jobs
const initialJobCandidates = {};
const initialCompletedByCandidates = {};

// Add candidates to completed jobs
initialCompletedJobs.forEach(job => {
  const candidates = generateDummyCandidates(job.id);
  // Mark some candidates as accepted (completed the job)
  const acceptedCandidates = candidates.filter((_, index) => index < job.staffNumber);
  acceptedCandidates.forEach(candidate => {
    candidate.status = 'accepted';
  });
  initialJobCandidates[job.id] = candidates;
  initialCompletedByCandidates[job.id] = acceptedCandidates.map(c => c.id);
});

// Add candidates to expired jobs
initialExpiredJobs.forEach(job => {
  initialJobCandidates[job.id] = generateDummyCandidates(job.id);
});

const initialState = {
  activeJobs: [],
  completedJobs: initialCompletedJobs,
  expiredJobs: initialExpiredJobs,
  jobCandidates: initialJobCandidates,
  completedByCandidates: initialCompletedByCandidates,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Add a new job (from Quick Search or Manual Search)
    addJob: (state, action) => {
      const jobId = action.payload.id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newJob = {
        ...action.payload,
        id: jobId,
        status: 'active',
        createdAt: new Date().toISOString(),
        offerDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };
      state.activeJobs.unshift(newJob); // Add to beginning of array
      
      // Generate dummy candidates for the job
      state.jobCandidates[jobId] = generateDummyCandidates(jobId);
    },

    // Update an existing job
    updateJob: (state, action) => {
      const { jobId, updates } = action.payload;
      const jobIndex = state.activeJobs.findIndex(job => job.id === jobId);
      
      if (jobIndex !== -1) {
        state.activeJobs[jobIndex] = {
          ...state.activeJobs[jobIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    // Close/Delete a job
    closeJob: (state, action) => {
      const jobId = action.payload;
      state.activeJobs = state.activeJobs.filter(job => job.id !== jobId);
      // Optionally move to expiredJobs
      const closedJob = state.activeJobs.find(job => job.id === jobId);
      if (closedJob) {
        state.expiredJobs.push({
          ...closedJob,
          status: 'closed',
          closedAt: new Date().toISOString(),
        });
      }
    },

    // Mark job as completed
    completeJob: (state, action) => {
      const { jobId, completedByCandidates } = action.payload;
      const jobIndex = state.activeJobs.findIndex(job => job.id === jobId);
      
      if (jobIndex !== -1) {
        const completedJob = {
          ...state.activeJobs[jobIndex],
          status: 'completed',
          completedAt: new Date().toISOString(),
          completedDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        };
        state.completedJobs.unshift(completedJob);
        state.activeJobs.splice(jobIndex, 1);
        
        // Store which candidates completed the job
        if (completedByCandidates) {
          state.completedByCandidates[jobId] = completedByCandidates;
        }
      }
    },

    // Add candidate to a job
    addCandidateToJob: (state, action) => {
      const { jobId, candidate } = action.payload;
      if (!state.jobCandidates[jobId]) {
        state.jobCandidates[jobId] = [];
      }
      state.jobCandidates[jobId].push({
        ...candidate,
        appliedAt: new Date().toISOString(),
      });
    },

    // Update candidate status
    updateCandidateStatus: (state, action) => {
      const { jobId, candidateId, status } = action.payload;
      const candidates = state.jobCandidates[jobId];
      
      if (candidates) {
        const candidateIndex = candidates.findIndex(c => c.id === candidateId);
        if (candidateIndex !== -1) {
          candidates[candidateIndex].status = status;
          candidates[candidateIndex].updatedAt = new Date().toISOString();
        }
      }
    },

    // Mark job as expired
    expireJob: (state, action) => {
      const jobId = action.payload;
      const jobIndex = state.activeJobs.findIndex(job => job.id === jobId);
      
      if (jobIndex !== -1) {
        const expiredJob = {
          ...state.activeJobs[jobIndex],
          status: 'expired',
          expiredAt: new Date().toISOString(),
        };
        state.expiredJobs.unshift(expiredJob);
        state.activeJobs.splice(jobIndex, 1);
      }
    },

    // Seed dummy data (only if empty)
    seedDummyData: (state) => {
      // Ensure objects are initialized
      if (!state.jobCandidates) {
        state.jobCandidates = {};
      }
      if (!state.completedByCandidates) {
        state.completedByCandidates = {};
      }
      if (!state.completedJobs) {
        state.completedJobs = [];
      }
      if (!state.expiredJobs) {
        state.expiredJobs = [];
      }

      const { completedJobs, expiredJobs } = generateDummyJobs();
      
      // Only seed if empty
      if (state.completedJobs.length === 0) {
        state.completedJobs = completedJobs;
        
        // Add candidates to completed jobs
        completedJobs.forEach(job => {
          const candidates = generateDummyCandidates(job.id);
          const acceptedCandidates = candidates.filter((_, index) => index < job.staffNumber);
          acceptedCandidates.forEach(candidate => {
            candidate.status = 'accepted';
          });
          state.jobCandidates[job.id] = candidates;
          state.completedByCandidates[job.id] = acceptedCandidates.map(c => c.id);
        });
      }
      
      if (state.expiredJobs.length === 0) {
        state.expiredJobs = expiredJobs;
        
        // Add candidates to expired jobs
        expiredJobs.forEach(job => {
          state.jobCandidates[job.id] = generateDummyCandidates(job.id);
        });
      }
    },

    // Clear all jobs (for logout or reset)
    clearJobs: (state) => {
      state.activeJobs = [];
      state.completedJobs = [];
      state.expiredJobs = [];
      state.jobCandidates = {};
      state.completedByCandidates = {};
    },
  },
});

export const {
  addJob,
  updateJob,
  closeJob,
  completeJob,
  expireJob,
  addCandidateToJob,
  updateCandidateStatus,
  seedDummyData,
  clearJobs,
} = jobsSlice.actions;

export default jobsSlice.reducer;

