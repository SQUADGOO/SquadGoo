import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accounts: [
    {
      id: 1,
      bankName: 'ING Bank Pvt. Ltd.',
      accountNumber: '11112501',
      bsbCode: '63001',
      branch: 'Finders Street',
      city: 'Sydney',
      isVerified: false,
      isSelected: false
    },
    {
      id: 2,
      bankName: 'Westpac Banking Corporation',
      accountNumber: '11112502',
      bsbCode: '63002',
      branch: 'Collins Street',
      city: 'Melbourne',
      isVerified: true,
      isSelected: true
    }
  ]
}

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    selectAccount: (state, action) => {
      const selectedId = action.payload
      state.accounts = state.accounts.map(acc => ({
        ...acc,
        isSelected: acc.id === selectedId
      }))
    },
    addAccount: (state, action) => {
      const newAccount = {
        ...action.payload,
        id: Date.now(),
        isVerified: false,
        isSelected: false
      }
      state.accounts.push(newAccount)
    },
    editAccount: (state, action) => {
      const { id, updatedData } = action.payload
      state.accounts = state.accounts.map(acc =>
        acc.id === id ? { ...acc, ...updatedData } : acc
      )
    },
    deleteAccount: (state, action) => {
      const id = action.payload
      const remaining = state.accounts.filter(acc => acc.id !== id)

      // Ensure at least one account remains
      if (remaining.length === 0) return

      // If deleted was selected, select first remaining
      const wasSelected = state.accounts.find(acc => acc.id === id)?.isSelected
      if (wasSelected) remaining[0].isSelected = true

      state.accounts = remaining
    },
    verifyAccount: (state, action) => {
      const id = action.payload
      state.accounts = state.accounts.map(acc =>
        acc.id === id ? { ...acc, isVerified: true } : acc
      )
    },
  },
})

export const { selectAccount, addAccount, editAccount, deleteAccount, verifyAccount } = bankSlice.actions
export default bankSlice.reducer
