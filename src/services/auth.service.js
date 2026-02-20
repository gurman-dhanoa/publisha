import api from '@/lib/axios';

const AuthService = {
  // Get current user details using the token in cookies
  me: async () => {
    const response = await api.get('/auth/me'); // Adjust endpoint as needed
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    // Optional: Call backend to invalidate session
    return await api.post('/auth/logout');
  }
};

export default AuthService;