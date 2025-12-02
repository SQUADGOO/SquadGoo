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
    // Hold coins for an active job
    holdCoins: (state, action) => {
      const { amount, jobId, reason } = action.payload;
      
      if (state.coins < amount) {
        return; // Don't hold if insufficient balance
      }

      // Ensure heldCoins object exists
      if (!state.heldCoins) {
        state.heldCoins = {};
      }

      // Deduct from available coins
      state.coins -= amount;

      // Add to held coins
      state.heldCoins[jobId] = {
        amount,
        reason: reason || 'Quick search job payment',
        heldAt: new Date().toISOString(),
        jobId,
      };

      // Add transaction record
      if (!state.transactions) {
        state.transactions = [];
      }

      state.transactions.unshift({
        id: Date.now(),
        name: `Coins held for job ${jobId}`,
        type: 'Hold',
        amount: `AUD ${amount.toFixed(2)}`,
        status: 'Held',
        jobId,
      });
    },
    // Release held coins
    releaseCoins: (state, action) => {
      const { jobId } = action.payload;
      
      if (!state.heldCoins || !state.heldCoins[jobId]) {
        return;
      }

      const heldAmount = state.heldCoins[jobId].amount;
      
      // Return coins to available balance
      state.coins += heldAmount;

      // Add transaction record
      if (!state.transactions) {
        state.transactions = [];
      }

      state.transactions.unshift({
        id: Date.now(),
        name: `Coins released for job ${jobId}`,
        type: 'Release',
        amount: `AUD ${heldAmount.toFixed(2)}`,
        status: 'Released',
        jobId,
      });

      // Remove from held coins
      delete state.heldCoins[jobId];
    },
    // Transfer coins from one user to another (for job payment)
    transferCoins: (state, action) => {
      const { fromUserId, toUserId, amount, jobId, description } = action.payload;
      
      // This would typically be handled on the backend
      // For frontend, we'll just record the transaction
      if (!state.transactions) {
        state.transactions = [];
      }

      state.transactions.unshift({
        id: Date.now(),
        name: description || `Payment for job ${jobId}`,
        type: 'Transfer',
        amount: `AUD ${amount.toFixed(2)}`,
        status: 'Completed',
        jobId,
        fromUserId,
        toUserId,
        transferredAt: new Date().toISOString(),
      });
    },
    // Check if sufficient balance for job
    checkBalance: (state, action) => {
      const { requiredAmount } = action.payload;
      return {
        hasSufficientBalance: state.coins >= requiredAmount,
        availableBalance: state.coins,
        requiredAmount,
        shortfall: Math.max(0, requiredAmount - state.coins),
      };
    },
  },
})

export const { addCoins, withdrawCoins, holdCoins, releaseCoins, transferCoins, checkBalance } = walletSlice.actions
export default walletSlice.reducer
