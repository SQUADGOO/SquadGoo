import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authSlice from './authSlice';
import marketplaceSlice from './marketplaceSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  marketplace: marketplaceSlice,
});

const presisConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'marketplace'],
};
const presisReducer = persistReducer(presisConfig, rootReducer);

export const store = configureStore({
  reducer: presisReducer,
  // middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware().concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
