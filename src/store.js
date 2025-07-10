import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import reposReducer from './reposSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    repos: reposReducer,
  },
});

export default store; 