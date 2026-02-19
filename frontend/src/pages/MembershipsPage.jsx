import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const res = await api.get('Memberships/index');
      setMemberships(res.data || []);
    } catch (err) {
      console.error('Failed to load memberships:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'membership_type', label: 'Type', render: (row) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        {row.membership_type}
      </span>
    )},
    { key: 'start_date', label: 'Start Date' },
    { key: 'total_days', label: 'Total Days' },
    { key: 'membership_status', label: 'Status', render: (row) => (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        row.membership_status === 'active' ? 'bg-green-100 text-green-700' :
        row.membership_status === 'paused' ? 'bg-amber-100 text-amber-700' :
        row.membership_status === 'expired' ? 'bg-gray-100 text-gray-600' :
        'bg-red-100 text-red-700'
      }`}>
        {row.membership_status}
      </span>
    )},
    { key: 'member', label: 'Member', render: (row) =>
      row.first_name ? `${row.first_name} ${row.last_name}` : '—'
    },
  ];

  return (
    <div>
      <PageHeader
        title="Memberships"
        subtitle="Manage membership plans"
        actionLabel="Add Membership"
        onAction={() => setShowModal(true)}
      />

      <DataTable columns={columns} data={memberships} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Membership">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
            <select name="membership_type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="30-day">30-Day</option>
              <option value="90-day">90-Day</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" name="start_date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Days</label>
            <input type="number" name="total_days" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
