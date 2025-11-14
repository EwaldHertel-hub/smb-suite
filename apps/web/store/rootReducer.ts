import { combineReducers } from '@reduxjs/toolkit';
import api from './api/baseApi';
import authReducer from './slices/authSlice';
import layoutReducer from './slices/layoutSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  theme: themeReducer,
  layout: layoutReducer,
  [api.reducerPath]: api.reducer,
});