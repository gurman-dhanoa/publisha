import api from '@/lib/axios';

const AuthService = {
  me: async () => {
    return await api.get('/authors/profile/me'); 
  },

  login: async (credentials) => {
    return await api.post('/authors/login', credentials);
  },

  register: async (userData) => {
    return await api.post('/authors/register', userData);
  },
};

export default AuthService;