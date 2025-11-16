import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  experiences: [],
};

const jobSeekerExperienceSlice = createSlice({
  name: 'jobSeekerExperience',
  initialState,
  reducers: {
    addExperience: {
      reducer: (state, { payload }) => {
        state.experiences.unshift(payload);
      },
      prepare: (exp) => ({
        payload: {
          id: nanoid(),
          createdAt: new Date().toISOString(),
          references: Array.isArray(exp?.references) ? exp.references : [],
          slips: Array.isArray(exp?.slips) ? exp.slips : [],
          ...exp,
        },
      }),
    },
    updateExperience: (state, { payload }) => {
      const index = state.experiences.findIndex(e => e.id === payload.id);
      if (index !== -1) {
        state.experiences[index] = { ...state.experiences[index], ...payload };
      }
    },
    removeExperience: (state, { payload }) => {
      const id = typeof payload === 'object' ? payload.id : payload;
      state.experiences = state.experiences.filter(e => e.id !== id);
    },
    clearExperiences: (state) => {
      state.experiences = [];
    },
  },
});

export const {
  addExperience,
  updateExperience,
  removeExperience,
  clearExperiences,
} = jobSeekerExperienceSlice.actions;

export default jobSeekerExperienceSlice.reducer;


