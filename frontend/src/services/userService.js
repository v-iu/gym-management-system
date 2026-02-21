import { api } from '../api';

const BASE = 'Users';

const userService = {
  list: async () => {
    const res = await api.get(`${BASE}/index`);
    return res.data || [];
  },

  listByRole: async (role) => {
    const res = await api.get(`${BASE}/byRole/${role}`);
    return res.data || [];
  },

  get: async (id) => {
    const res = await api.get(`${BASE}/show/${id}`);
    return res.data;
  },

  create: async (payload) => {
    return api.post(`${BASE}/register`, payload);
  },

  update: async (id, payload) => {
    return api.put(`${BASE}/update/${id}`, payload);
  },

  remove: async (id) => {
    return api.delete(`${BASE}/destroy/${id}`);
  }
};

export default userService;
