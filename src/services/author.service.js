import api from '@/lib/axios';

const AuthorService = {
  getTrending: async (limit = 3) => {
    const response = await api.get('/authors/trending', { params: { limit } });
    return response.data; // Array of author objects
  },
  getAll: async () => {
    const response = await api.get('/authors');
    return response.data; // Array of author objects
  },
  getById: async (id) => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },
  getStats: async (id) => {
    const response = await api.get(`/authors/${id}/stats`);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/authors/profile/me');
    return response.data;
  },
  updateProfile: async (id, data) => {
    const response = await api.put(`/authors/${id}`, data);
    return response.data;
  }
};

export default AuthorService;