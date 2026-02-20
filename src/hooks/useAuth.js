"use client";
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout } from '@/store/slices/authSlice';
import AuthService from '@/services/auth.service';
import Cookies from 'js-cookie';
import { AuthConstants } from '@/constants/auth.constants';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const token = Cookies.get(AuthConstants.ACCESS_TOKEN);

  const fetchUser = useCallback(async () => {
    if (!token) return;

    try {
      const userData = await AuthService.me();
      dispatch(setCredentials(userData));
    } catch (error) {
      dispatch(logout());
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  return {
    user,
    isAuthenticated,
    logout: () => dispatch(logout()),
    refreshUser: fetchUser
  };
};