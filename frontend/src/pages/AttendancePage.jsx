import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [members, setMembers] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check-in form state
  const [personType, setPersonType] = useState('member');
  const [personId, setPersonId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkinMsg, setCheckinMsg] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [attRes, memRes, guestRes] = await Promise.all([
        api.get('Attendances/today'),
        api.get('Members/index'),
        api.get('Guests/index'),
      ]);
      setAttendance(attRes.data || []);
      setMembers(memRes.data || []);
      setGuests(guestRes.data || []);
    } catch (err) {
      console.error('Failed to load attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter the people list based on search
  const peopleList = personType === 'member' ? members : guests;
  const filtered = searchQuery
    ? peopleList.filter((p) =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : peopleList;

  const handleCheckin = async (e) => {
    e.preventDefault();
    if (!personId) return;

    try {
      const res = await api.post('Attendances/checkin', {
        type: personType,
        person_id: personId,
      });
      setCheckinMsg({ type: 'success', text: res.message });
      setPersonId('');
      setSearchQuery('');
      fetchAll();
    } catch (err) {
      setCheckinMsg({ type: 'error', text: err.data?.error || 'Check-in failed' });
    }

    setTimeout(() => setCheckinMsg(null), 4000);
  };

  const handleCheckout = async (row) => {
    try {
      await api.post('Attendances/checkout', { attendance_id: row.id });
      fetchAll();
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'person', label: 'Person', render: (row) => {
      if (row.member_first_name) return `${row.member_first_name} ${row.member_last_name} (Member)`;
      if (row.guest_first_name) return `${row.guest_first_name} ${row.guest_last_name} (Guest)`;
      return '—';
    }},
    { key: 'check_in_time', label: 'Check In', render: (row) =>
      row.check_in_time ? new Date(row.check_in_time).toLocaleTimeString() : '—'
    },
    { key: 'check_out_time', label: 'Check Out', render: (row) =>
      row.check_out_time
        ? new Date(row.check_out_time).toLocaleTimeString()
        : <span className="text-green-600 text-xs font-medium">Currently In</span>
    },
    { key: 'staff', label: 'Processed By', render: (row) =>
      row.staff_first_name ? `${row.staff_first_name} ${row.staff_last_name}` : '—'
    },
  ];

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Check in members &amp; guests" />

      {/* Check-in Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Check-In</h3>

        {checkinMsg && (
          <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${
            checkinMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {checkinMsg.text}
          </div>
        )}

        <form onSubmit={handleCheckin} className="space-y-4">
          {/* Person type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setPersonType('member'); setPersonId(''); setSearchQuery(''); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                personType === 'member'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => { setPersonType('guest'); setPersonId(''); setSearchQuery(''); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                personType === 'guest'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Guest
            </button>
          </div>

          {/* Search & select person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search {personType === 'member' ? 'Member' : 'Guest'}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Type a name to search...`}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select {personType === 'member' ? 'Member' : 'Guest'}
            </label>
            <select
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">— Select —</option>
              {filtered.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name} {p.email ? `(${p.email})` : ''}
                </option>
              ))}
            </select>
            {filtered.length === 0 && searchQuery && (
              <p className="text-xs text-gray-400 mt-1">No {personType}s found matching "{searchQuery}"</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!personId}
            className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Check In
          </button>
        </form>
      </div>

      {/* Today's Attendance Table */}
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Today's Attendance</h3>
      <DataTable
        columns={columns}
        data={attendance}
        loading={loading}
        onRowAction={(row) => !row.check_out_time && handleCheckout(row)}
        actionLabel="Check Out"
      />
    </div>
  );
}
