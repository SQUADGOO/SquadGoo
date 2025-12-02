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
      state.userInfo = {...payload, name: payload?.firstName + ' ' + payload?.lastName};
      state.role = payload?.role;
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
      state.userInfo = {
        ...state.userInfo,
        ...payload,
      } 
      // console.log('payload', payload)
      return
      const roleKey =
    state.userInfo?.role === 'recruiter' ? 'recruiter' : 'jobseeker';


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
