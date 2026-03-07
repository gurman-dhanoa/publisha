import api from '@/lib/axios';

const AuthService = {
  me: async () => {
    return await api.get('/authors/profile/me'); 
  },

  sendOTP: async (data) => {
    return await api.post('/authors/request-otp', data);
  },
  
  verifyOTP: async (data) => {
    return await api.post('/authors/verify-otp', data);
  },

  loginWithGoogle: async (data) => {
    return await api.post('/authors/google-auth', data);
  },
};

export default AuthService;