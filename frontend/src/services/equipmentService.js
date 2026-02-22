import { api } from '../api';

const BASE = 'Equipments';

const equipmentService = {
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

  records: async (id) => {
    const res = await api.get(`${BASE}/records/${id}`);
    return res.data;
  },
  
  createRecord: async (payload) => {
    return api.post(`${BASE}/addRecord`, payload);
  }
};

export default equipmentService;
