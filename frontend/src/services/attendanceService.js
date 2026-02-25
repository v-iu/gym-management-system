import { api } from '../api';

const BASE = 'Attendances';

const attendanceService = {
  today: async () => {
    const res = await api.get(`${BASE}/today`);
    return res.data || [];
  },

  getByDate: async (date) => {
    const res = await api.get(`${BASE}/byDate/${date}`);
    return res.data || [];
  },

  listDates: async () => {
    const res = await api.get(`${BASE}/dates`);
    return res.data || [];
  },

  checkin: async (payload) => {
    return api.post(`${BASE}/checkin`, payload);
  },

  checkout: async (attendanceId) => {
    return api.post(`${BASE}/checkout`, { attendance_id: attendanceId });
  },

  // helper lists used by the attendance page
  // Backend does not expose separate Members/Guests controllers — reuse Users endpoint and filter by role
  listAllUsersByRole: async () => {
    const res = await api.get('Users/index');
    const all = res.data || [];
    return {
      members: all.filter(u => u.role === 'member'),
      guests: all.filter(u => u.role === 'guest'),
      staff: all.filter(u => u.role === 'staff')
    };
  }
};

export default attendanceService;
