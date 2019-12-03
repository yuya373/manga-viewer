import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { load } from '../actions/store';

const isProduction = process.env.NODE_ENV === 'production';

export default configureStore({
  reducer: rootReducer,
  devTools: !isProduction,
  preloadedState: load(),
});
