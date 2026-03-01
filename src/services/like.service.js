import api from '@/lib/axios';

const LikeService = {
  /**
   * Toggle like status for an article
   * @param {number} articleId 
   */
  toggle: async (articleId) => {
    // POST /likes/article/:articleId/toggle
    const response = await api.post(`/likes/article/${articleId}/toggle`);
    return response.data; // { success: true, liked: boolean, count: number }
  },

  /**
   * Check if current user liked specific article
   * @param {number} articleId 
   */
  checkStatus: async (articleId) => {
    try {
        const response = await api.get(`/likes/article/${articleId}/check`);
        return response.data; // { liked: boolean }
    } catch (error) {
        return { liked: false };
    }
  }
};

export default LikeService;