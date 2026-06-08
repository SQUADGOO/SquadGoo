import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatSessions: [], // Array of chat sessions with job context
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Create a new chat session when match is made
    createChatSession: (state, action) => {
      const { jobId, userId, otherUserId, jobTitle, searchType, expiresInDays = 30 } = action.payload;
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      
      const session = {
        id: `chat-${jobId}-${userId}-${Date.now()}`,
        jobId,
        userId,
        otherUserId,
        jobTitle,
        searchType: searchType || 'manual',
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true,
      };
      
      // Check if session already exists
      const existingSession = state.chatSessions.find(
        s => s.jobId === jobId && 
        ((s.userId === userId && s.otherUserId === otherUserId) ||
         (s.userId === otherUserId && s.otherUserId === userId))
      );
      
      if (!existingSession) {
        state.chatSessions.unshift(session);
      } else {
        // Update existing session if expired, reactivate it
        if (new Date(existingSession.expiresAt) < new Date()) {
          existingSession.expiresAt = expiresAt.toISOString();
          existingSession.isActive = true;
          existingSession.createdAt = new Date().toISOString();
        }
      }
    },

    // Deactivate chat session (when expired or job completed)
    deactivateChatSession: (state, action) => {
      const { sessionId } = action.payload;
      const session = state.chatSessions.find(s => s.id === sessionId);
      if (session) {
        session.isActive = false;
      }
    },

    // Remove chat session
    removeChatSession: (state, action) => {
      const { sessionId } = action.payload;
      state.chatSessions = state.chatSessions.filter(s => s.id !== sessionId);
    },

    // Check and expire old sessions
    expireChatSessions: (state) => {
      const now = new Date();
      state.chatSessions.forEach(session => {
        if (new Date(session.expiresAt) < now && session.isActive) {
          session.isActive = false;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase('persist/REHYDRATE', (state, action) => {
      if (action.payload?.chat) {
        // Expire old sessions on rehydration
        const now = new Date();
        const sessions = (action.payload.chat.chatSessions || []).map(session => {
          if (new Date(session.expiresAt) < now) {
            return { ...session, isActive: false };
          }
          return session;
        });
        return {
          ...state,
          chatSessions: sessions,
        };
      }
      return state;
    });
  },
});

// Selectors
export const selectChatSessionByJobId = (state, jobId, userId) =>
  state.chat.chatSessions.find(
    s => s.jobId === jobId && 
    s.isActive && 
    (s.userId === userId || s.otherUserId === userId) &&
    new Date(s.expiresAt) > new Date()
  );

export const selectActiveChatSessions = (state, userId) =>
  state.chat.chatSessions.filter(
    s => s.isActive && 
    (s.userId === userId || s.otherUserId === userId) &&
    new Date(s.expiresAt) > new Date()
  );

export const selectCanChat = (state, jobId, userId) => {
  const session = selectChatSessionByJobId(state, jobId, userId);
  return !!session;
};

export const {
  createChatSession,
  deactivateChatSession,
  removeChatSession,
  expireChatSessions,
} = chatSlice.actions;

export default chatSlice.reducer;

