// @/store/slices/authSlice.ts
import { AuthConstants } from '@/constants/auth.constants';
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as true to prevent flicker on initial load
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      Cookies.remove(AuthConstants.ACCESS_TOKEN);
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setLoading, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;