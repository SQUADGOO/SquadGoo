import { createSlice, nanoid } from '@reduxjs/toolkit';

// Generate dummy preferred jobs data
const generateDummyPreferredJobs = () => {
  const now = new Date();
  return [
    {
      id: nanoid(),
      preferredIndustry: { id: 1, title: 'Construction' },
      preferredJobTitle: { category: 'Construction', subCategory: 'Foreman/Supervisor' },
      expectedPayMin: 28,
      expectedPayMax: 38,
      receiveWithinKm: '25',
      manualOffers: true,
      quickOffers: true,
      daysAvailable: 'Monday,Tuesday,Wednesday,Thursday,Friday',
      startTime: '08:00',
      endTime: '17:00',
      taxType: 'ABN',
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: nanoid(),
      preferredIndustry: { id: 9, title: 'Logistics' },
      preferredJobTitle: { category: 'Manufacturing, Transport & Logistics', subCategory: 'Warehousing/Storage & Distribution' },
      expectedPayMin: 32,
      expectedPayMax: 45,
      receiveWithinKm: '30',
      manualOffers: true,
      quickOffers: false,
      daysAvailable: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      startTime: '07:00',
      endTime: '16:00',
      taxType: 'both',
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: nanoid(),
      preferredIndustry: { id: 4, title: 'Hospitality' },
      preferredJobTitle: { category: 'Hospitality & Tourism', subCategory: 'Management' },
      expectedPayMin: 25,
      expectedPayMax: 35,
      receiveWithinKm: '20',
      manualOffers: false,
      quickOffers: true,
      daysAvailable: 'Friday,Saturday,Sunday',
      startTime: '09:00',
      endTime: '18:00',
      taxType: 'ABN',
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

const initialState = {
  preferredJobs: [],
};

const jobSeekerPreferredSlice = createSlice({
  name: 'jobSeekerPreferred',
  initialState,
  reducers: {
    addPreferredJob: {
      reducer: (state, { payload }) => {
        state.preferredJobs.unshift(payload);
      },
      prepare: (job) => ({
        payload: {
          id: nanoid(),
          createdAt: new Date().toISOString(),
          ...job,
        },
      }),
    },
    updatePreferredJob: (state, { payload }) => {
      const index = state.preferredJobs.findIndex(j => j.id === payload.id);
      if (index !== -1) {
        state.preferredJobs[index] = { ...state.preferredJobs[index], ...payload };
      }
    },
    removePreferredJob: (state, { payload }) => {
      const id = typeof payload === 'object' ? payload.id : payload;
      state.preferredJobs = state.preferredJobs.filter(j => j.id !== id);
    },
    clearPreferredJobs: (state) => {
      state.preferredJobs = [];
    },
    initializeDummyPreferredJobs: (state) => {
      // Only initialize if preferredJobs array is empty
      if (state.preferredJobs.length === 0) {
        state.preferredJobs = generateDummyPreferredJobs();
      }
    },
  },
  extraReducers: (builder) => {
    // Handle rehydration from redux-persist
    builder.addCase('persist/REHYDRATE', (state, action) => {
      if (action.payload) {
        // If preferredJobs is empty after rehydration, populate with dummy data
        if (!action.payload.jobSeekerPreferred?.preferredJobs || action.payload.jobSeekerPreferred.preferredJobs.length === 0) {
          return {
            ...state,
            preferredJobs: generateDummyPreferredJobs(),
          };
        }
        return {
          ...state,
          ...action.payload.jobSeekerPreferred,
        };
      }
      return state;
    });
  },
});

export const {
  addPreferredJob,
  updatePreferredJob,
  removePreferredJob,
  clearPreferredJobs,
  initializeDummyPreferredJobs,
} = jobSeekerPreferredSlice.actions;

export default jobSeekerPreferredSlice.reducer;


