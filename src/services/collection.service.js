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
  getById: async (id) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
  },
  getByAuthor: async (authorId) => {
    const response = await api.get(`/collections/author/${authorId}`);
    return response.data;
  },
  removeArticle: async (collectionId,articleId) => {
    const response = await api.delete(`/collections/${collectionId}/articles/${articleId}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/collections/${id}`, data);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post(`/collections`, data);
    return response.data;
  },
};

export default CollectionService;