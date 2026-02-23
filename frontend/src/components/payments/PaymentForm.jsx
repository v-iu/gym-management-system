import { useState } from 'react';

export default function PaymentForm({ defaultValues = {}, includeUser = false, onSubmit, submitLabel = 'Save' }) {
  const [values, setValues] = useState({
    payment_type: defaultValues.payment_type || 'one-time',
    amount: defaultValues.amount ?? '',
    method: defaultValues.method || 'cash',
    membership_id: defaultValues.membership_id || '',
    staff_id: defaultValues.staff_id || '',
    user_id: defaultValues.user_id || '',
    tendered: defaultValues.tendered ?? '',
    is_paid: !!defaultValues.is_paid
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues(v => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // validation logic remains unchanged...
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Payment Type</label>
        <select
          name="payment_type"
          value={values.payment_type}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all [&>option]:bg-zinc-900 [&>option]:text-white"
        >
          <option value="registration">Registration</option>
          <option value="renewal">Renewal</option>
          <option value="one-time">One-Time</option>
          <option value="service">Service</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Amount (₱)</label>
          {includeUser && values.payment_type === 'one-time' ? (
            <div className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">₱{(values.amount || 50).toFixed(2)}</div>
          ) : (
            <input
              name="amount"
              value={values.amount}
              onChange={handleChange}
              type="number"
              step="0.01"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Method</label>
          <select
            name="method"
            value={values.method}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all [&>option]:bg-zinc-900 [&>option]:text-white"
          >
            <option value="cash">Cash</option>
            <option value="gcash">GCash</option>
            <option value="card">Card</option>
          </select>
        </div>
      </div>

      {values.method === 'cash' && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Tendered (₱)</label>
          <input
            name="tendered"
            value={values.tendered}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
          />
          <div className="mt-2 text-sm text-gray-700">
            {(() => {
              const amt = parseFloat(values.amount) || 0;
              const t = parseFloat(values.tendered) || 0;
              const change = t - amt;
              if (Number.isNaN(change)) return 'Change: —';
              return `Change: ₱${change.toFixed(2)}`;
            })()}
          </div>
        </div>
      )}

      {includeUser && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">User ID</label>
          <input
            name="user_id"
            value={values.user_id}
            onChange={handleChange}
            type="number"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
            placeholder="Enter User ID"
          />
        </div>
      )}

      {(values.membership_id || values.staff_id) && (
        <div className="grid grid-cols-2 gap-4">
          {values.membership_id && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Membership ID (optional)</label>
              <input
                name="membership_id"
                value={values.membership_id}
                type="number"
                readOnly
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white cursor-not-allowed"
              />
            </div>
          )}
          {values.staff_id && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Staff ID</label>
              <input
                name="staff_id"
                value={values.staff_id}
                type="number"
                readOnly
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white cursor-not-allowed"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input id="is_paid" name="is_paid" type="checkbox" checked={values.is_paid} onChange={handleChange} className="rounded" />
        <label htmlFor="is_paid" className="text-sm text-gray-400">Mark as paid</label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
