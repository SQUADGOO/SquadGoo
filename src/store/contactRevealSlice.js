import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contactReveals: [], // Array of contact reveal records
};

const contactRevealSlice = createSlice({
  name: 'contactReveal',
  initialState,
  reducers: {
    // Reveal contacts between two users for a specific job
    revealContacts: (state, action) => {
      const { jobId, userId1, userId2, expiresInDays = 30 } = action.payload;
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      
      const reveal = {
        id: `reveal-${jobId}-${userId1}-${userId2}-${Date.now()}`,
        jobId,
        userId1,
        userId2,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true,
      };
      
      // Check if reveal already exists
      const existingReveal = state.contactReveals.find(
        r => r.jobId === jobId && 
        ((r.userId1 === userId1 && r.userId2 === userId2) ||
         (r.userId1 === userId2 && r.userId2 === userId1))
      );
      
      if (!existingReveal) {
        state.contactReveals.unshift(reveal);
      } else {
        // Update existing reveal if expired, reactivate it
        if (new Date(existingReveal.expiresAt) < new Date()) {
          existingReveal.expiresAt = expiresAt.toISOString();
          existingReveal.isActive = true;
          existingReveal.createdAt = new Date().toISOString();
        }
      }
    },

    // Deactivate contact reveal (when expired or job completed)
    deactivateContactReveal: (state, action) => {
      const { revealId } = action.payload;
      const reveal = state.contactReveals.find(r => r.id === revealId);
      if (reveal) {
        reveal.isActive = false;
      }
    },

    // Remove contact reveal
    removeContactReveal: (state, action) => {
      const { revealId } = action.payload;
      state.contactReveals = state.contactReveals.filter(r => r.id !== revealId);
    },

    // Check and expire old reveals
    expireContactReveals: (state) => {
      const now = new Date();
      state.contactReveals.forEach(reveal => {
        if (new Date(reveal.expiresAt) < now && reveal.isActive) {
          reveal.isActive = false;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase('persist/REHYDRATE', (state, action) => {
      if (action.payload?.contactReveal) {
        // Expire old reveals on rehydration
        const now = new Date();
        const reveals = (action.payload.contactReveal.contactReveals || []).map(reveal => {
          if (new Date(reveal.expiresAt) < now) {
            return { ...reveal, isActive: false };
          }
          return reveal;
        });
        return {
          ...state,
          contactReveals: reveals,
        };
      }
      return state;
    });
  },
});

// Selectors
export const selectContactRevealByJobId = (state, jobId, userId) =>
  state.contactReveal.contactReveals.find(
    r => r.jobId === jobId && 
    r.isActive && 
    (r.userId1 === userId || r.userId2 === userId) &&
    new Date(r.expiresAt) > new Date()
  );

export const selectCanSeeContacts = (state, jobId, userId1, userId2) => {
  const reveal = state.contactReveal.contactReveals.find(
    r => r.jobId === jobId && 
    r.isActive &&
    ((r.userId1 === userId1 && r.userId2 === userId2) ||
     (r.userId1 === userId2 && r.userId2 === userId1)) &&
    new Date(r.expiresAt) > new Date()
  );
  return !!reveal;
};

export const {
  revealContacts,
  deactivateContactReveal,
  removeContactReveal,
  expireContactReveals,
} = contactRevealSlice.actions;

export default contactRevealSlice.reducer;

