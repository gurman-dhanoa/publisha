import api from '@/lib/axios';

export const SearchService = {
  globalSearch: async (query, limit = 5) => {
    if (!query) return [];
    const response = await api.get(`/articles/search`, { 
      params: { q: query, limit } 
    });
    return response.data;
  }
};