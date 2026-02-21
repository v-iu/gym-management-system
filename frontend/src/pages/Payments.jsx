import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import PaymentForm from '../components/payments/PaymentForm';
import usePayments from '../hooks/usePayments';

export default function PaymentsPage() {
  const { payments, loading, refresh, create, update, remove } = usePayments();
  const [showModal, setShowModal] = useState(false);
  // formError is no longer needed; PaymentForm manages its own validation messages

  // form state for create/edit
  const [editing, setEditing] = useState(null);

  // PaymentForm handles its own submission and validation; we no longer use
  // a separate handler here. keep `editing` state for passing into the modal.

  const togglePaid = async (row) => {
    try {
      await update(row.id, { is_paid: row.is_paid ? 0 : 1 });
    } catch (err) {
      console.error('Toggle paid failed', err);
      alert('Failed to toggle paid status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment?')) return;
    try {
      await remove(id);
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete payment');
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
    { key: 'tendered', label: 'Tendered', render: (row) => row.tendered != null ? `₱${parseFloat(row.tendered).toLocaleString()}` : '—' },
    { key: 'change_amount', label: 'Change', render: (row) => row.change_amount != null ? `₱${parseFloat(row.change_amount).toLocaleString()}` : '—' },
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
      <button onClick={() => togglePaid(row)} className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${row.is_paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
        {row.is_paid ? 'Paid' : 'Pending'}
      </button>
    )},
    { key: 'payment_date', label: 'Date' },
    { key: 'processed_by', label: 'Processed By', render: (row) =>
      row.staff_first_name ? `${row.staff_first_name} ${row.staff_last_name}` : '—'
    },
    { key: 'actions', label: '', render: (row) => (
      <div className="flex gap-3 justify-end">
        <button onClick={() => { setEditing(row); setShowModal(true); }} className="text-xs text-blue-600 hover:text-blue-700">Edit</button>
        <button onClick={() => handleDelete(row.id)} className="text-xs text-red-600 hover:text-red-700">Delete</button>
      </div>
    )}
  ];

  const exportCSV = () => {
    if (!payments || payments.length === 0) return alert('No payments to export');
    const header = ['id','payment_type','amount','tendered','change_amount','method','is_paid','payment_date','user','staff'];
    const rows = payments.map(p => [p.id,p.payment_type,p.amount,p.tendered ?? '',p.change_amount ?? '',p.method,p.is_paid,p.payment_date,`${p.user_fname||''} ${p.user_lname||''}`,`${p.staff_fname||''} ${p.staff_lname||''}`]);
    const csv = [header, ...rows].map(r => r.map(String).map(v => `"${v.replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `payments_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Track payments and receipts"
        actionLabel="Record Payment"
        onAction={() => { setEditing(null); setShowModal(true); }}
      />

      <div className="flex gap-3 items-center mb-4">
        <button onClick={exportCSV} className="px-3 py-2 text-sm bg-gray-100 rounded">Export CSV</button>
        <button onClick={refresh} className="px-3 py-2 text-sm bg-gray-100 rounded">Refresh</button>
      </div>

      <DataTable columns={columns} data={payments} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Payment' : 'Record Payment'}>
        <PaymentForm
          includeUser={true}
          defaultValues={editing || { payment_type: 'one-time', method: 'cash', is_paid: true }}
          submitLabel={editing ? 'Save' : 'Record'}
          onSubmit={async (payload) => {
            if (editing) {
              await update(editing.id, payload);
            } else {
              await create(payload);
            }
            setShowModal(false);
          }}
        />
      </Modal>
    </div>
  );
}
