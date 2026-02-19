import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('Payments/index');
      setPayments(res.data || []);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'payment_type', label: 'Type', render: (row) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
        {row.payment_type}
      </span>
    )},
    { key: 'amount', label: 'Amount', render: (row) => `₱${parseFloat(row.amount).toLocaleString()}` },
    { key: 'method', label: 'Method', render: (row) => (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        row.method === 'cash' ? 'bg-green-100 text-green-700' :
        row.method === 'gcash' ? 'bg-blue-100 text-blue-700' :
        'bg-purple-100 text-purple-700'
      }`}>
        {row.method}
      </span>
    )},
    { key: 'is_paid', label: 'Status', render: (row) => (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        row.is_paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {row.is_paid ? 'Paid' : 'Pending'}
      </span>
    )},
    { key: 'payment_date', label: 'Date' },
    { key: 'processed_by', label: 'Processed By', render: (row) =>
      row.staff_first_name ? `${row.staff_first_name} ${row.staff_last_name}` : '—'
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Track payments and receipts"
        actionLabel="Record Payment"
        onAction={() => setShowModal(true)}
      />

      <DataTable columns={columns} data={payments} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record Payment">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
            <select name="payment_type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="registration">Registration</option>
              <option value="renewal">Renewal</option>
              <option value="one-time">One-Time</option>
              <option value="service">Service</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₱)</label>
              <input type="number" step="0.01" name="amount" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select name="method" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="cash">Cash</option>
                <option value="gcash">GCash</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Membership ID</label>
              <input type="number" name="membership_id" placeholder="Optional" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
              <input type="number" name="staff_id" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_paid" id="is_paid" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
            <label htmlFor="is_paid" className="text-sm text-gray-700">Mark as paid</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">Record</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
