import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  refreshToken: null,
  userId: null,
  role: null,
  userInfo: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // payload = full backend response: { accessToken, refreshToken, user: { id, userType, ... } }
    login: (state, { payload }) => {
      const user = payload?.user ?? {};
      state.token = payload?.accessToken ?? null;
      state.refreshToken = payload?.refreshToken ?? null;
      state.userId = user?.id ?? null;
      state.role = user?.userType ?? null;
      state.userInfo = {
        ...user,
        role: user?.userType ?? null,
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || null,
      };
    },

    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.userId = null;
      state.role = null;
      state.userInfo = null;
    },

    // Used by the refresh-token interceptor in apiClient.js
    setTokens: (state, { payload }) => {
      state.token = payload.token;
      if (payload.refreshToken) state.refreshToken = payload.refreshToken;
    },

    updateUserFields: (state, { payload }) => {
      if (!state.userInfo) return;
      state.userInfo = { ...state.userInfo, ...payload };
    },
  },
});

export const { login, logout, setTokens, updateUserFields } = authSlice.actions;

export default authSlice.reducer;
