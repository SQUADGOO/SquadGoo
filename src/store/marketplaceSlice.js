import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  favorites: [],
  heldItems: [],
  orders: [],
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
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;

