import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userInfo: null,
  role: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, {payload}) => {
      state.token = payload.token;
      state.userInfo = payload.user;
      state.role = payload?.user?.role;
    },
    logout: state => {
      state.token = null;
      state.userInfo = null;
      state.role = null;
    },
    setUserInfo: (state, {payload}) => {
      state.userInfo = payload;
    },
    updateUserFields: (state, {payload}) => {
      console.log('payload', payload)
      const roleKey =
    state.userInfo?.role === 'recruiter' ? 'recruiter' : 'job_seeker';


      state.userInfo = {
        ...state.userInfo,
      [roleKey]: {
      ...state.userInfo[roleKey],
      ...payload, // merge only updated fields (like bio, address, etc.)
    },
      }
    },
  },
});
export const {login, logout, setUserInfo, updateUserFields} = authSlice.actions;

export default authSlice.reducer;
