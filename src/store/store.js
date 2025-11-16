import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authSlice from './authSlice';
import marketplaceSlice from './marketplaceSlice';
import jobsSlice from './jobsSlice';

import jobSeekerOffersReducer from './jobSeekerOffersSlice';
import jobSeekerExperienceReducer from './jobSeekerExperienceSlice';
import jobSeekerPreferredReducer from './jobSeekerPreferredSlice';
import walletReducer from './walletSlice'
import bankReducer from './bankSlice'

const rootReducer = combineReducers({
  auth: authSlice,
  marketplace: marketplaceSlice,
  jobs: jobsSlice,

  jobSeekerOffers: jobSeekerOffersReducer,
  jobSeekerExperience: jobSeekerExperienceReducer,
  jobSeekerPreferred: jobSeekerPreferredReducer,
  wallet: walletReducer,
  bank: bankReducer,
});

const presisConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'marketplace', 'jobs', 'jobSeekerOffers', 'jobSeekerExperience', 'jobSeekerPreferred', 'wallet', 'bank'],
};
const presisReducer = persistReducer(presisConfig, rootReducer);

export const store = configureStore({
  reducer: presisReducer,
  // middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware().concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
