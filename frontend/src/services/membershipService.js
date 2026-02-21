import { api } from '../api';

const BASE = 'Memberships';

const membershipService = {
  list: async () => {
    const res = await api.get(`${BASE}/index`);
    return res.data || [];
  },

  get: async (id) => {
    const res = await api.get(`${BASE}/show/${id}`);
    return res.data;
  },

  create: async (payload) => {
    return api.post(`${BASE}/store`, payload);
  },

  update: async (id, payload) => {
    return api.put(`${BASE}/update/${id}`, payload);
  },

  remove: async (id) => {
    return api.delete(`${BASE}/destroy/${id}`);
  },

  renew: async (id, payload) => {
    return api.post(`${BASE}/renew/${id}`, payload);
  },

  pause: async (id) => {
    return api.post(`${BASE}/pause/${id}`);
  },

  resume: async (id) => {
    return api.post(`${BASE}/resume/${id}`);
  }
};

export default membershipService;
