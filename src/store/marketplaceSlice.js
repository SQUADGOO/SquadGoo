import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  favorites: [],
  heldItems: [],
  orders: [],
  products: [],
  disputes: [],
};

export const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    // Cart actions
    addToCart: (state, {payload}) => {
      const existingItem = state.cart.find(item => item.id === payload.id);
      if (!existingItem) {
        state.cart.push({...payload, quantity: 1});
      }
    },
    removeFromCart: (state, {payload}) => {
      state.cart = state.cart.filter(item => item.id !== payload.id);
    },
    updateCartQuantity: (state, {payload}) => {
      const item = state.cart.find(item => item.id === payload.id);
      if (item) {
        item.quantity = payload.quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },

    // Favorites actions
    addToFavorites: (state, {payload}) => {
      const exists = state.favorites.find(item => item.id === payload.id);
      if (!exists) {
        state.favorites.push(payload);
      }
    },
    removeFromFavorites: (state, {payload}) => {
      state.favorites = state.favorites.filter(item => item.id !== payload.id);
    },
    toggleFavorite: (state, {payload}) => {
      const index = state.favorites.findIndex(item => item.id === payload.id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(payload);
      }
    },

    // Held items actions
    addToHeldItems: (state, {payload}) => {
      const exists = state.heldItems.find(item => item.id === payload.id);
      if (!exists) {
        state.heldItems.push(payload);
      }
    },
    removeFromHeldItems: (state, {payload}) => {
      state.heldItems = state.heldItems.filter(item => item.id !== payload.id);
    },
    toggleHeldItem: (state, {payload}) => {
      const index = state.heldItems.findIndex(item => item.id === payload.id);
      if (index >= 0) {
        state.heldItems.splice(index, 1);
      } else {
        state.heldItems.push(payload);
      }
    },

    // Orders actions
    addOrder: (state, {payload}) => {
      // Ensure orders array exists and add new order to the beginning
      if (!state.orders) {
        state.orders = [];
      }
      state.orders = [payload, ...state.orders]; // Add to beginning of array
    },
    updateOrderStatus: (state, {payload}) => {
      const {orderId, status} = payload;
      if (!state.orders) {
        state.orders = [];
        return;
      }
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
      }
    },
    cancelOrder: (state, {payload}) => {
      if (!state.orders) {
        state.orders = [];
        return;
      }
      const order = state.orders.find(order => order.id === payload);
      if (order) {
        order.status = 'cancelled';
        order.updatedAt = new Date().toISOString();
      }
    },

    // Products actions
    addProduct: (state, {payload}) => {
      if (!state.products) {
        state.products = [];
      }
      // Add new product to the beginning of the array (most recent first)
      state.products = [payload, ...state.products];
    },
    removeProduct: (state, {payload}) => {
      if (!state.products) {
        state.products = [];
        return;
      }
      state.products = state.products.filter(product => product.id !== payload);
    },
    updateProduct: (state, {payload}) => {
      if (!state.products) {
        state.products = [];
        return;
      }
      const index = state.products.findIndex(product => product.id === payload.id);
      if (index >= 0) {
        state.products[index] = {...state.products[index], ...payload};
      }
    },

    // Dispute actions
    addDispute: (state, {payload}) => {
      if (!state.disputes) {
        state.disputes = [];
      }
      state.disputes = [payload, ...state.disputes];
    },
    updateDisputeStatus: (state, {payload}) => {
      const {disputeId, status} = payload;
      if (!state.disputes) {
        state.disputes = [];
        return;
      }
      const dispute = state.disputes.find(d => d.id === disputeId);
      if (dispute) {
        dispute.status = status;
        dispute.updatedAt = new Date().toISOString();
      }
    },
    addDisputeMessage: (state, {payload}) => {
      const {disputeId, message} = payload;
      if (!state.disputes) {
        state.disputes = [];
        return;
      }
      const dispute = state.disputes.find(d => d.id === disputeId);
      if (dispute) {
        if (!dispute.messages) {
          dispute.messages = [];
        }
        dispute.messages.push(message);
        dispute.updatedAt = new Date().toISOString();
      }
    },
    incrementDisputeAppeal: (state, {payload}) => {
      const {disputeId} = payload;
      if (!state.disputes) {
        state.disputes = [];
        return;
      }
      const dispute = state.disputes.find(d => d.id === disputeId);
      if (dispute && dispute.appeals < dispute.maxAppeals) {
        dispute.appeals += 1;
        dispute.status = 'in_progress';
        dispute.updatedAt = new Date().toISOString();
      }
    },
    resolveDispute: (state, {payload}) => {
      const {disputeId, resolution, refundAmount} = payload;
      if (!state.disputes) {
        state.disputes = [];
        return;
      }
      const dispute = state.disputes.find(d => d.id === disputeId);
      if (dispute) {
        dispute.status = 'resolved';
        dispute.resolution = resolution;
        dispute.refundAmount = refundAmount || 0;
        dispute.resolvedAt = new Date().toISOString();
        dispute.updatedAt = new Date().toISOString();
        // Release held coins logic would be handled here or in a saga
      }
    },
    closeDispute: (state, {payload}) => {
      const {disputeId} = payload;
      if (!state.disputes) {
        state.disputes = [];
        return;
      }
      const dispute = state.disputes.find(d => d.id === disputeId);
      if (dispute) {
        dispute.status = 'closed';
        dispute.closedAt = new Date().toISOString();
        dispute.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  addToHeldItems,
  removeFromHeldItems,
  toggleHeldItem,
  addOrder,
  updateOrderStatus,
  cancelOrder,
  addProduct,
  removeProduct,
  updateProduct,
  // Dispute actions
  addDispute,
  updateDisputeStatus,
  addDisputeMessage,
  incrementDisputeAppeal,
  resolveDispute,
  closeDispute,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;

