import api from '@/lib/axios';

const ArticleService = {
  getArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },
};

export default ArticleService;