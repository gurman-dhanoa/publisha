import { AuthConstants } from '@/constants/auth.constants';
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove(AuthConstants.ACCESS_TOKEN);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;