import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Quick Fill (Quick Search) settings
  quickFillSendMode: 'auto', // 'auto' | 'manual'
  allowModificationRequests: true,
}

const recruiterSettingsSlice = createSlice({
  name: 'recruiterSettings',
  initialState,
  reducers: {
    setQuickFillSendMode: (state, action) => {
      const v = action.payload
      state.quickFillSendMode = v === 'manual' ? 'manual' : 'auto'
    },
    setAllowModificationRequests: (state, action) => {
      state.allowModificationRequests = !!action.payload
    },
  },
})

export const { setQuickFillSendMode, setAllowModificationRequests } =
  recruiterSettingsSlice.actions

export default recruiterSettingsSlice.reducer

