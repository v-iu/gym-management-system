import { useState, useEffect } from 'react';

export default function MembershipRenewalForm({ membership, member, staffList = [], onSubmit, onCancel }) {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('cash');
  const [staffId, setStaffId] = useState('');
  const [tendered, setTendered] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (staffList.length > 0 && !staffId) {
      setStaffId(staffList[0].id);
    }
  }, [staffList, staffId]);

  useEffect(() => {
    if (membership) {
      if (membership.membership_type === '30-day') setAmount(1500.00);
      else if (membership.membership_type === '90-day') setAmount(4000.00);
      else if (membership.membership_type === 'annual') setAmount(15000.00);
    }
  }, [membership]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (method === 'cash') {
      const t = parseFloat(tendered);
      if (isNaN(t) || t < amount) {
        setError('Tendered amount must be greater than or equal to the amount due.');
        return;
      }
    }

    if (!staffId) {
      setError('Please select a staff member.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        amount,
        method,
        staff_id: staffId,
        tendered: method === 'cash' ? parseFloat(tendered) : null,
        change_amount: method === 'cash' && tendered ? parseFloat((parseFloat(tendered) - amount).toFixed(2)) : 0
      });
    } catch (err) {
      setError(err.message || 'Renewal failed');
    } finally {
      setLoading(false);
    }
  };

  const change = method === 'cash' && tendered ? (parseFloat(tendered) - amount).toFixed(2) : '0.00';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Renewing for</label>
        <div className="text-gray-900 font-medium">{member?.first_name} {member?.last_name}</div>
        <div className="text-xs text-gray-500">Current Plan: {membership?.membership_type} (Ends: {membership?.end_date})</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₱)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select 
            value={method} 
            onChange={e => setMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="cash">Cash</option>
            <option value="gcash">GCash</option>
            <option value="card">Card</option>
          </select>
        </div>
      </div>

      {method === 'cash' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tendered (₱)</label>
          <input 
            type="number" 
            value={tendered} 
            onChange={e => setTendered(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            step="0.01"
            placeholder="Amount received"
          />
          <div className="mt-1 text-sm text-gray-600">Change: ₱{change}</div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Processed By</label>
        <select 
          value={staffId} 
          onChange={e => setStaffId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          {staffList.map(s => (
            <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
          {loading ? 'Processing...' : 'Renew Membership'}
        </button>
      </div>
    </form>
  );
}

