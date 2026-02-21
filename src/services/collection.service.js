import api from '@/lib/axios';

const CollectionService = {
  getPopular: async (limit = 5) => {
    const response = await api.get('/collections/popular', { params: { limit } });
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/collections/slug/${slug}`);
    return response.data;
  },
};

export default CollectionService;