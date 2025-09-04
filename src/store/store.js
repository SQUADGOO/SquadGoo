import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authSlice from './authSlice';

const rootReducer = combineReducers({
  auth: authSlice,
});

const presisConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};
const presisReducer = persistReducer(presisConfig, rootReducer);

export const store = configureStore({
  reducer: presisReducer,
  // middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware().concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
