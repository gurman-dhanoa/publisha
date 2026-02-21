import api from '@/lib/axios';

const AuthorService = {
  getTrending: async (limit = 3) => {
    const response = await api.get('/authors/trending', { params: { limit } });
    return response.data; // Array of author objects
  },
};

export default AuthorService;