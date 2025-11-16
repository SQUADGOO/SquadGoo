import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  coins: 0,
  transactions: [],
  withdrawRequests: [],
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    addCoins: (state, action) => {
      state.coins += action.payload.amount

      // Ensure transactions array exists
      if (!state.transactions) {
        state.transactions = []
      }

      // Add a transaction record
      state.transactions.unshift({
        id: Date.now(),
        name: 'Coin Purchased',
        type: 'Credit',
        amount: `AUD ${action.payload.amount.toFixed(2)}`,
      })
    },
    withdrawCoins: (state, action) => {
      const { amount, accountId, transactionFees, totalUsdAmount } = action.payload
      
      if (state.coins < amount) {
        return // Don't process if insufficient coins
      }

      // Ensure arrays exist
      if (!state.transactions) {
        state.transactions = []
      }
      if (!state.withdrawRequests) {
        state.withdrawRequests = []
      }

      // Deduct coins
      state.coins -= amount

      // Add withdrawal transaction
      state.transactions.unshift({
        id: Date.now(),
        name: 'Withdraw Funds',
        type: 'Debit',
        amount: `AUD ${totalUsdAmount.toFixed(2)}`,
        status: 'Pending',
        accountId,
      })

      // Add withdrawal request
      state.withdrawRequests.unshift({
        id: Date.now(),
        amount,
        transactionFees,
        totalUsdAmount,
        accountId,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      })
    },
  },
})

export const { addCoins, withdrawCoins } = walletSlice.actions
export default walletSlice.reducer
