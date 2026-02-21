import { AuthConstants } from '@/constants/auth.constants';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(AuthConstants.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE Interceptor: Handle Errors Globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || 'Something went wrong';

    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove(AuthConstants.ACCESS_TOKEN);
      toast.error('Session expired. Please login again.');
      
      // Only redirect if we are on the client side
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;