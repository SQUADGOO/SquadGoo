import { createSlice } from '@reduxjs/toolkit';

// Generate dummy completed offers for job seekers
// These are jobs that the job seeker has completed
const generateDummyCompletedOffers = () => {
  const completedDate = new Date();
  
  const completedOffersData = [
    {
      title: 'Commercial Kitchen Deep Clean',
      type: 'Contract',
      industry: 'Cleaning Services',
      experience: '2 Years 0 Month',
      staffNumber: 2,
      location: 'Sydney CBD',
      rangeKm: 10,
      salaryRange: '$25/hr to $35/hr',
      salaryMin: 25,
      salaryMax: 35,
      salaryType: 'Hourly',
      searchType: 'quick',
      jobDescription: 'Deep cleaning of commercial kitchen facilities including equipment sanitization, floor cleaning, and vent maintenance. All equipment was thoroughly cleaned and sanitized.',
      description: 'Deep cleaning of commercial kitchen facilities including equipment sanitization, floor cleaning, and vent maintenance. All equipment was thoroughly cleaned and sanitized.',
      completedDate: new Date(completedDate.getTime() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      completedAt: new Date(completedDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(completedDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      offerDate: new Date(completedDate.getTime() - 20 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      expireDate: new Date(completedDate.getTime() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'completed',
      taxType: 'ABN',
      extraPay: {
        publicHolidays: true,
        weekend: false,
        shiftLoading: true,
        bonuses: false,
        overtime: false,
      },
    },
    {
      title: 'Warehouse Inventory Management',
      type: 'Full-time',
      industry: 'Logistics',
      experience: '3 Years 0 Month',
      staffNumber: 3,
      location: 'Melbourne',
      rangeKm: 20,
      salaryRange: '$22/hr to $30/hr',
      salaryMin: 22,
      salaryMax: 30,
      salaryType: 'Hourly',
      searchType: 'manual',
      jobDescription: 'Inventory tracking and warehouse organization for logistics company. Successfully organized warehouse layout and implemented new inventory system.',
      description: 'Inventory tracking and warehouse organization for logistics company. Successfully organized warehouse layout and implemented new inventory system.',
      completedDate: new Date(completedDate.getTime() - 12 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      completedAt: new Date(completedDate.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(completedDate.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
      offerDate: new Date(completedDate.getTime() - 27 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      expireDate: new Date(completedDate.getTime() - 17 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'completed',
      taxType: 'TFN',
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: true,
        bonuses: true,
        overtime: true,
      },
    },
    {
      title: 'Garden Landscaping Project',
      type: 'Contract',
      industry: 'Landscaping',
      experience: '1 Year 0 Month',
      staffNumber: 2,
      location: 'Brisbane',
      rangeKm: 25,
      salaryRange: '$20/hr to $28/hr',
      salaryMin: 20,
      salaryMax: 28,
      salaryType: 'Hourly',
      searchType: 'quick',
      jobDescription: 'Complete garden landscaping including planting, hardscaping, irrigation installation, and lawn maintenance. Project completed on time and within budget.',
      description: 'Complete garden landscaping including planting, hardscaping, irrigation installation, and lawn maintenance. Project completed on time and within budget.',
      completedDate: new Date(completedDate.getTime() - 8 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      completedAt: new Date(completedDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(completedDate.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      offerDate: new Date(completedDate.getTime() - 23 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      expireDate: new Date(completedDate.getTime() - 13 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'completed',
      taxType: 'ABN',
      extraPay: {
        publicHolidays: true,
        weekend: false,
        shiftLoading: false,
        bonuses: false,
        overtime: false,
      },
    },
    {
      title: 'Office Renovation',
      type: 'Full-time',
      industry: 'Construction',
      experience: '5 Years 0 Month',
      staffNumber: 4,
      location: 'Perth',
      rangeKm: 15,
      salaryRange: '$30/hr to $45/hr',
      salaryMin: 30,
      salaryMax: 45,
      salaryType: 'Hourly',
      searchType: 'manual',
      jobDescription: 'Complete office space renovation including painting, carpentry, electrical work, and flooring. Delivered high-quality finish that exceeded client expectations.',
      description: 'Complete office space renovation including painting, carpentry, electrical work, and flooring. Delivered high-quality finish that exceeded client expectations.',
      completedDate: new Date(completedDate.getTime() - 20 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      completedAt: new Date(completedDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(completedDate.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      offerDate: new Date(completedDate.getTime() - 35 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      expireDate: new Date(completedDate.getTime() - 25 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'completed',
      taxType: 'ABN',
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: true,
        bonuses: true,
        overtime: true,
      },
    },
    {
      title: 'Event Setup & Cleanup',
      type: 'Casual',
      industry: 'Events',
      experience: '0 Years 6 Month',
      staffNumber: 5,
      location: 'Gold Coast',
      rangeKm: 30,
      salaryRange: '$18/hr to $25/hr',
      salaryMin: 18,
      salaryMax: 25,
      salaryType: 'Hourly',
      searchType: 'quick',
      jobDescription: 'Setup and cleanup for corporate events and functions. Handled multiple events successfully with excellent client feedback.',
      description: 'Setup and cleanup for corporate events and functions. Handled multiple events successfully with excellent client feedback.',
      completedDate: new Date(completedDate.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      completedAt: new Date(completedDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(completedDate.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      offerDate: new Date(completedDate.getTime() - 18 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      expireDate: new Date(completedDate.getTime() - 8 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'completed',
      taxType: 'ABN',
      extraPay: {
        publicHolidays: true,
        weekend: true,
        shiftLoading: false,
        bonuses: true,
        overtime: true,
      },
    },
  ];

  return completedOffersData.map((data, index) => ({
    id: `completed-offer-${index}-${Date.now()}`,
    ...data,
  }));
};

const initialCompletedOffers = generateDummyCompletedOffers();

const initialState = {
  activeOffers: [],
  acceptedOffers: [],
  completedOffers: initialCompletedOffers,
};

const jobSeekerOffersSlice = createSlice({
  name: 'jobSeekerOffers',
  initialState,
  reducers: {
    applyToOffer: (state, { payload }) => {
      // Payload can be a job object or just an ID
      const job = typeof payload === 'object' ? payload : null;
      const offerId = typeof payload === 'object' ? payload.id : payload;
      
      // If we have the full job object, add it to accepted offers
      if (job) {
        state.acceptedOffers.unshift(job);
      } else {
        // If we only have ID, try to find it in activeOffers (for backward compatibility)
        const index = state.activeOffers.findIndex(o => o.id === offerId);
        if (index !== -1) {
          const [offer] = state.activeOffers.splice(index, 1);
          state.acceptedOffers.unshift(offer);
        }
      }
    },
    declineActiveOffer: (state, { payload }) => {
      const offerId = typeof payload === 'object' ? payload.id : payload;
      state.activeOffers = state.activeOffers.filter(o => o.id !== offerId);
    },
    removeAcceptedOffer: (state, { payload }) => {
      const offerId = typeof payload === 'object' ? payload.id : payload;
      state.acceptedOffers = state.acceptedOffers.filter(o => o.id !== offerId);
    },
    clearAllOffers: (state) => {
      state.activeOffers = [];
      state.acceptedOffers = [];
      state.completedOffers = [];
    },
    initializeDummyData: (state) => {
      // Initialize dummy data if completedOffers is empty
      if (state.completedOffers.length === 0) {
        state.completedOffers = initialCompletedOffers;
      }
    },
    addCompletedOffer: (state, { payload }) => {
      const job = typeof payload === 'object' ? payload : null;
      if (job) {
        const completedJob = {
          ...job,
          status: 'completed',
          completedAt: new Date().toISOString(),
          completedDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        };
        state.completedOffers.unshift(completedJob);
      }
    },
  },
  extraReducers: (builder) => {
    // Handle rehydration from redux-persist
    builder.addCase('persist/REHYDRATE', (state, action) => {
      if (action.payload) {
        // If completedOffers is empty after rehydration, populate with dummy data
        if (!action.payload.jobSeekerOffers?.completedOffers || action.payload.jobSeekerOffers.completedOffers.length === 0) {
          return {
            ...state,
            completedOffers: initialCompletedOffers,
            activeOffers: action.payload.jobSeekerOffers?.activeOffers || [],
            acceptedOffers: action.payload.jobSeekerOffers?.acceptedOffers || [],
          };
        }
        return {
          ...state,
          ...action.payload.jobSeekerOffers,
        };
      }
      return state;
    });
  },
});

export const {
  applyToOffer,
  declineActiveOffer,
  removeAcceptedOffer,
  clearAllOffers,
  addCompletedOffer,
  initializeDummyData,
} = jobSeekerOffersSlice.actions;

export default jobSeekerOffersSlice.reducer;


