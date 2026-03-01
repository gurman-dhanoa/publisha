// hooks/useAuth.js
"use client";
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout, setLoading } from '@/store/slices/authSlice';
import AuthService from '@/services/auth.service';
import Cookies from 'js-cookie';
import { AuthConstants } from '@/constants/auth.constants';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  // Get token directly from cookies for initial check
  const token = Cookies.get(AuthConstants.ACCESS_TOKEN);

  const fetchUser = useCallback(async () => {
    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await AuthService.me();
      dispatch(setCredentials(response.data));
    } catch (error) {
      // If 401/403, token is invalid
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  }, [token, dispatch]);

  useEffect(() => {
    // If we have a token but no user in Redux, fetch the user
    if (token && !user) {
      fetchUser();
    } 
    // If no token exists, we are definitely done loading
    else if (!token) {
      dispatch(setLoading(false));
    }
  }, [token, user, fetchUser, dispatch]);

  return {
    user,
    isAuthenticated, // This is the key value we will watch
    isLoading,
    logout: () => dispatch(logout()),
    refreshUser: fetchUser
  };
};