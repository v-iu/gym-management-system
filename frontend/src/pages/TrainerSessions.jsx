import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';

export default function TrainerSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get('TrainerSessions/index');
      setSessions(res.data || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'member', label: 'Member', render: (row) =>
      row.member_first_name ? `${row.member_first_name} ${row.member_last_name}` : '—'
    },
    { key: 'trainer', label: 'Trainer', render: (row) =>
      row.staff_first_name ? `${row.staff_first_name} ${row.staff_last_name}` : '—'
    },
    { key: 'service_name', label: 'Service' },
    { key: 'session_date', label: 'Scheduled Date' },
    { key: 'status', label: 'Status', render: (row) => (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        row.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
        row.status === 'completed' ? 'bg-green-100 text-green-700' :
        'bg-red-100 text-red-700'
      }`}>
        {row.status}
      </span>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Trainer Sessions"
        subtitle="Schedule and manage training sessions"
        actionLabel="Schedule Session"
        onAction={() => setShowModal(true)}
      />

      <DataTable columns={columns} data={sessions} loading={loading} />
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Session">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Member ID</label>
          <input
            type="number"
            name="member_id"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Trainer (Staff ID)</label>
          <input
            type="number"
            name="staff_id"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Service ID</label>
          <input
            type="number"
            name="service_id"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Session Date &amp; Time</label>
          <input
            type="datetime-local"
            name="session_date"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
          >
            Schedule
          </button>
        </div>
      </form>
    </Modal>
    </div>
  );
}
