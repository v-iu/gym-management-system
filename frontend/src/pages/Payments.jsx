import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import PaymentForm from '../components/payments/PaymentForm';
import usePayments from '../hooks/usePayments';

export default function PaymentsPage() {
  const { payments, loading, refresh, create, update, remove } = usePayments();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

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

  const filteredPayments = payments.filter(p => {
    const name = `${p.user_first_name || ''} ${p.user_last_name || ''}`.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || p.payment_type === typeFilter;
    return matchesSearch && matchesType;
  });
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'payment_type', label: 'Type', render: (row) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
        {row.payment_type}
      </span>
    )},
    { key: 'amount', label: 'Amount', render: (row) => `₱${parseFloat(row.amount).toLocaleString('en-PH', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}` },
    { key: 'tendered', label: 'Tendered', render: (row) => row.tendered != null ? `₱${parseFloat(row.tendered).toLocaleString('en-PH', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}` : '—' },
    { key: 'change_amount', label: 'Change', render: (row) => row.change_amount != null ? `₱${parseFloat(row.change_amount).toLocaleString('en-PH', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}` : '—' },
    { key: 'method', label: 'Method', render: (row) => (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
        row.method === 'cash' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
        row.method === 'gcash' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
        'bg-purple-500/20 text-purple-400 border-purple-500/30'
      }`}>
        {row.method}
      </span>
    )},
    { key: 'is_paid', label: 'Status', render: (row) => (
      <button onClick={() => togglePaid(row)} className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${row.is_paid ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
        {row.is_paid ? 'Paid' : 'Pending'}
      </button>
    )},
    { key: 'payment_date', label: 'Date' },
    { key: 'processed_by', label: 'Processed By', render: (row) =>
      row.staff_first_name ? `${row.staff_first_name} ${row.staff_last_name}` : '—'
    },
    { key: 'actions', label: '', render: (row) => (
      <div className="flex gap-3 justify-end">
        <button 
          onClick={() => { setEditing(row); setShowModal(true); }} 
          className="px-2 py-1 text-xs bg-green-600/20 text-green-500 font-medium rounded border border-green-600/30 hover:bg-green-600/30 transition-colors"
        >
          Edit
        </button>
        <button 
          onClick={() => handleDelete(row.id)} 
          className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    )}
  ];

  const exportCSV = () => {
    if (!payments || payments.length === 0) return alert('No payments to export');
    const header = ['id','payment_type','amount','tendered','change_amount','method','is_paid','payment_date','user','staff'];
    const rows = payments.map(p => [p.id,p.payment_type,p.amount,p.tendered ?? '',p.change_amount ?? '',p.method,p.is_paid,p.payment_date,`${p.user_first_name||''} ${p.user_last_name||''}`,`${p.staff_first_name||''} ${p.staff_last_name||''}`]);
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
        onAction={() => { setEditing(null); setShowModal(true); }}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <input
            type="text"
            placeholder="Search by user name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-black/40 border border-green-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-green-500/20 rounded-xl text-white focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all [&>option]:bg-zinc-900"
          >
            <option value="all">All Types</option>
            <option value="registration">Registration</option>
            <option value="renewal">Renewal</option>
            <option value="one-time">One-Time</option>
            <option value="service">Service</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="px-3 py-2 text-sm bg-white/5 text-white border border-white/10 rounded hover:bg-white/10 transition-colors">Export CSV</button>
          <button onClick={refresh} className="px-3 py-2 text-sm bg-white/5 text-white border border-white/10 rounded hover:bg-white/10 transition-colors">Refresh</button>
        </div>
      </div>

      <DataTable columns={columns} data={filteredPayments} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={'Edit Payment'}>
        <PaymentForm
          includeUser={true}
          defaultValues={editing || { payment_type: 'one-time', method: 'cash', is_paid: true }}
          submitLabel={'Save'}
          onSubmit={async (values) => {
            const payload = {
              ...values,
              membership_id: values.membership_id || null,
              staff_id: values.staff_id || null,
              user_id: values.user_id || null,
              amount: parseFloat(values.amount),
              tendered: values.tendered ? parseFloat(values.tendered) : null,
              is_paid: values.is_paid ? 1 : 0
            };

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
