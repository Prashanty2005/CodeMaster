import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slices/authSlice"
import problemReducer from "../slices/authSlice1"
import chatReducer from "../slices/chatSlice"
//store will match slice name with its reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemReducer,
    chat:chatReducer
  }
});

export default store;

