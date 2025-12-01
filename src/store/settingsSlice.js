import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobSeeker: {
    // Job offer preferences
    jobOfferType: 'both', // 'manual', 'quick', 'both'
    offersFromUserType: 'both', // 'recruiter', 'individual', 'both'
    
    // Quick offer settings
    quickOffers: {
      enabled: true,
      onlyPlatformPayment: false,
      onlySufficientBalance: false,
      onlyProBadgeOrAbove: false,
      availability: {}, // Calendar/time selection
    },
    
    // Manual offer settings
    manualOffers: {
      enabled: true,
      onlyProBadgeOrAbove: false,
      availability: {}, // Calendar/time selection
    },
    
    // Individual offers settings
    individualOffers: {
      enabled: true,
      onlyProBadgeOrAbove: false,
      onlyPlatformPayment: false,
      selectedIndustries: [],
      availability: {},
    },
  },
  
  recruiter: {
    // Quick offer settings
    quickOffers: {
      autoMatchingEnabled: true,
      minBadge: null, // 'Bronze', 'Platinum', 'Gold', etc.
      proOnly: false,
      onlyInAppPayment: false,
      squadMatchingEnabled: true,
    },
    
    // Manual offer settings
    manualOffers: {
      minBadge: null,
      proOnly: false,
      squadMatchingEnabled: true,
    },
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Update job seeker quick search settings
    updateJobSeekerQuickSettings: (state, { payload }) => {
      const { onlyPlatformPayment, onlySufficientBalance, onlyProBadgeOrAbove, availability } = payload;
      
      if (onlyPlatformPayment !== undefined) {
        state.jobSeeker.quickOffers.onlyPlatformPayment = onlyPlatformPayment;
      }
      if (onlySufficientBalance !== undefined) {
        state.jobSeeker.quickOffers.onlySufficientBalance = onlySufficientBalance;
      }
      if (onlyProBadgeOrAbove !== undefined) {
        state.jobSeeker.quickOffers.onlyProBadgeOrAbove = onlyProBadgeOrAbove;
      }
      if (availability !== undefined) {
        state.jobSeeker.quickOffers.availability = availability;
      }
    },
    
    // Update job seeker job offer type preference
    updateJobOfferType: (state, { payload }) => {
      const { jobOfferType, offersFromUserType } = payload;
      if (jobOfferType !== undefined) {
        state.jobSeeker.jobOfferType = jobOfferType;
      }
      if (offersFromUserType !== undefined) {
        state.jobSeeker.offersFromUserType = offersFromUserType;
      }
    },
    
    // Update recruiter quick search settings
    updateRecruiterQuickSettings: (state, { payload }) => {
      const { autoMatchingEnabled, minBadge, proOnly, onlyInAppPayment, squadMatchingEnabled } = payload;
      
      if (autoMatchingEnabled !== undefined) {
        state.recruiter.quickOffers.autoMatchingEnabled = autoMatchingEnabled;
      }
      if (minBadge !== undefined) {
        state.recruiter.quickOffers.minBadge = minBadge;
      }
      if (proOnly !== undefined) {
        state.recruiter.quickOffers.proOnly = proOnly;
      }
      if (onlyInAppPayment !== undefined) {
        state.recruiter.quickOffers.onlyInAppPayment = onlyInAppPayment;
      }
      if (squadMatchingEnabled !== undefined) {
        state.recruiter.quickOffers.squadMatchingEnabled = squadMatchingEnabled;
      }
    },
  },
});

export const {
  updateJobSeekerQuickSettings,
  updateJobOfferType,
  updateRecruiterQuickSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;

// Selectors
export const selectJobSeekerQuickSettings = (state) => state.settings?.jobSeeker?.quickOffers || {};
export const selectRecruiterQuickSettings = (state) => state.settings?.recruiter?.quickOffers || {};
export const selectJobOfferType = (state) => state.settings?.jobSeeker?.jobOfferType || 'both';

