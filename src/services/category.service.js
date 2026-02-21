import api from '@/lib/axios';

const CategoryService = {

  getTrending: async () => {
    const response = await api.get('/categories/trending');
    return response.data; 
  },
};

export default CategoryService;