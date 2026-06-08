import { createSlice, nanoid } from '@reduxjs/toolkit';

// Generate dummy experience data
const generateDummyExperiences = () => {
  const now = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return [
    {
      id: nanoid(),
      industry: { id: 1, title: 'Construction' },
      jobTitle: 'Foreman/Supervisor',
      companyName: 'ABC Construction Group',
      country: 'Australia',
      jobDescription: 'Worked as a construction foreman supervising teams on residential and commercial projects. Managed site operations, coordinated with contractors, and ensured safety compliance. Oversaw teams of 3-5 workers on large-scale projects.',
      expectedPayMin: 28,
      expectedPayMax: 38,
      startMonth: months[now.getMonth()],
      startYear: (now.getFullYear() - 2).toString(),
      endMonth: months[now.getMonth()],
      endYear: (now.getFullYear() - 1).toString(),
      references: [],
      slips: [],
      createdAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: nanoid(),
      industry: { id: 9, title: 'Logistics' },
      jobTitle: 'Warehousing/Storage & Distribution',
      companyName: 'Global Logistics Solutions',
      country: 'Australia',
      jobDescription: 'Managed warehouse operations including inventory management, staff supervision, and logistics coordination. Implemented new inventory tracking systems and improved efficiency by 30%. Oversaw storage, distribution, and fulfillment operations.',
      expectedPayMin: 32,
      expectedPayMax: 45,
      startMonth: months[now.getMonth()],
      startYear: (now.getFullYear() - 4).toString(),
      endMonth: months[now.getMonth()],
      endYear: (now.getFullYear() - 2).toString(),
      references: [],
      slips: [],
      createdAt: new Date(now.getTime() - 240 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: nanoid(),
      industry: { id: 4, title: 'Hospitality' },
      jobTitle: 'Management',
      companyName: 'Premier Events Management',
      country: 'Australia',
      jobDescription: 'Managed event operations for corporate events, weddings, and conferences. Coordinated event logistics, equipment setup, and team coordination. Ensured timely completion of all event requirements and maintained high service standards.',
      expectedPayMin: 25,
      expectedPayMax: 35,
      startMonth: months[now.getMonth()],
      startYear: (now.getFullYear() - 1).toString(),
      endMonth: months[Math.max(0, now.getMonth() - 3)],
      endYear: now.getFullYear().toString(),
      references: [],
      slips: [],
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

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
    initializeDummyExperiences: (state) => {
      // Only initialize if experiences array is empty
      if (state.experiences.length === 0) {
        state.experiences = generateDummyExperiences();
      }
    },
  },
  extraReducers: (builder) => {
    // Handle rehydration from redux-persist
    builder.addCase('persist/REHYDRATE', (state, action) => {
      if (action.payload) {
        // If experiences is empty after rehydration, populate with dummy data
        if (!action.payload.jobSeekerExperience?.experiences || action.payload.jobSeekerExperience.experiences.length === 0) {
          return {
            ...state,
            experiences: generateDummyExperiences(),
          };
        }
        return {
          ...state,
          ...action.payload.jobSeekerExperience,
        };
      }
      return state;
    });
  },
});

export const {
  addExperience,
  updateExperience,
  removeExperience,
  clearExperiences,
  initializeDummyExperiences,
} = jobSeekerExperienceSlice.actions;

export default jobSeekerExperienceSlice.reducer;


