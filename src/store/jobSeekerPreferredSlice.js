import { createSlice, nanoid } from '@reduxjs/toolkit';

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
  },
});

export const {
  addPreferredJob,
  updatePreferredJob,
  removePreferredJob,
  clearPreferredJobs,
} = jobSeekerPreferredSlice.actions;

export default jobSeekerPreferredSlice.reducer;


