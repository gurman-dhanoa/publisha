import api from '@/lib/axios';

const ReviewService = {
  getByArticle: async (articleId, params = {}) => {
    const response = await api.get(`/reviews/article/${articleId}`, { params });
    return response;
  },

  create: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }
};

export default ReviewService;