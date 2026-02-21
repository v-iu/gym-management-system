import { api } from '../api';

const BASE = 'Payments';

const paymentService = {
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

  report: async (params = {}) => {
    // params: { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
    const q = new URLSearchParams(params).toString();
    const res = await api.get(`${BASE}/report${q ? `?${q}` : ''}`);
    return res.data || null;
  },

  // check if a particular user (guest) has paid for today
  hasPaidToday: async (userId) => {
    const res = await api.get(`${BASE}/paidToday/${userId}`);
    // returns { success: true, paid: boolean }
    return res.paid;
  }
};

export default paymentService;