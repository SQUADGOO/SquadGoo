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
      state.userInfo = payload.userInfo;
      state.role = payload.role;
    },
    logout: state => {
      state.token = null;
      state.userInfo = null;
      state.role = null;
    },
    setUserInfo: (state, {payload}) => {
      state.userInfo = payload;
    },
  },
});
export const {login, logout, setUserInfo} = authSlice.actions;

export default authSlice.reducer;
