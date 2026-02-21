import { useState, useEffect } from 'react';

export default function MembershipApplicationForm({ member, membersList = [], staffList = [], onSubmit, onCancel }) {
  const [selectedMemberId, setSelectedMemberId] = useState(member?.id || '');
  const [type, setType] = useState('30-day');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState(1500.00);
  const [method, setMethod] = useState('cash');
  const [staffId, setStaffId] = useState('');
  const [tendered, setTendered] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) setSelectedMemberId(member.id);
  }, [member]);

  useEffect(() => {
    if (staffList.length > 0 && !staffId) {
      setStaffId(staffList[0].id);
    }
  }, [staffList, staffId]);

  // Auto-update amount based on selected plan
  useEffect(() => {
    if (type === '30-day') setAmount(1500.00);
    else if (type === '90-day') setAmount(4000.00);
    else if (type === 'annual') setAmount(15000.00);
  }, [type]);

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
        user_id: selectedMemberId,
        membership_type: type,
        start_date: startDate,
        amount,
        method,
        staff_id: staffId,
        is_paid: 1,
        tendered: method === 'cash' ? parseFloat(tendered) : null,
        change_amount: method === 'cash' && tendered ? parseFloat((parseFloat(tendered) - amount).toFixed(2)) : 0
      });
    } catch (err) {
      setError(err.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  const change = method === 'cash' && tendered ? (parseFloat(tendered) - amount).toFixed(2) : '0.00';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Member</label>
        {member ? (
          <div className="text-gray-900 font-medium">{member.first_name} {member.last_name}</div>
        ) : (
          <select 
            value={selectedMemberId} 
            onChange={e => setSelectedMemberId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">— Select User —</option>
            {membersList.map(m => (
              <option key={m.id} value={m.id}>{m.first_name} {m.last_name} ({m.role})</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
          <select 
            value={type} 
            onChange={e => setType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="30-day">30-Day (₱1,500)</option>
            <option value="90-day">90-Day (₱4,000)</option>
            <option value="annual">Annual (₱15,000)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
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
          {loading ? 'Processing...' : 'Apply Membership'}
        </button>
      </div>
    </form>
  );
}
