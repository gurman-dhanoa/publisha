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
  const token = Cookies.get(AuthConstants.ACCESS_TOKEN);

  const fetchUser = useCallback(async () => {
    // If no token exists, we aren't loading a user
    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    try {
      dispatch(setLoading(true)); // Start loading
      const response = await AuthService.me();
      dispatch(setCredentials(response.data));
    } catch (error) {
      dispatch(logout());
    } finally {
      dispatch(setLoading(false)); // End loading regardless of outcome
    }
  }, [token, dispatch]);

  useEffect(() => {
    // Only fetch if we have a token but no user data yet
    if (token && !user) {
      fetchUser();
    } else if (!token) {
      dispatch(setLoading(false));
    }
  }, [token, user, fetchUser, dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading, // Return this for components to use
    logout: () => dispatch(logout()),
    refreshUser: fetchUser
  };
};