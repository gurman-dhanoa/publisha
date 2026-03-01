import api from "@/lib/axios";

const ArticleService = {
  getArticles: async (params = {}) => {
    const response = await api.get("/articles", { params });
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await api.get(`/articles/slug/${slug}`);
    return response.data;
  },
  getByAuthor: async (authorId, params = {}) => {
    const response = await api.get(`/articles/author/${authorId}`, { params });
    return response.data; // Expects { data: [...], pagination: {...} }
  },

  create: async (formData) => {
    // Headers are auto-set by axios for FormData, but explicit content-type can ensure boundaries are correct
    const response = await api.post("/articles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/articles/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export default ArticleService;
