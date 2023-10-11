import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';

const rootReducer = {
  user: userReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
