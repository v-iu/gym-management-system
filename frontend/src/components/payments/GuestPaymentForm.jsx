import { useState } from 'react';

export default function GuestPaymentForm({ guest, staffList = [], onSubmit, onCancel }) {
  const [amount, setAmount] = useState(50.00);
  const [method, setMethod] = useState('cash');
  const [tendered, setTendered] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    setLoading(true);
    try {
      await onSubmit({
        payment_type: 'one-time',
        amount,
        method,
        user_id: guest.id,
        staff_id: staffList.length > 0 ? staffList[0].id : 1,
        is_paid: 1,
        tendered: method === 'cash' ? parseFloat(tendered) : null,
        change_amount: method === 'cash' && tendered ? parseFloat((parseFloat(tendered) - amount).toFixed(2)) : 0
      });
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const change = method === 'cash' && tendered ? (parseFloat(tendered) - amount).toFixed(2) : '0.00';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Guest</label>
        <div className="text-gray-900 font-medium">{guest?.first_name} {guest?.last_name}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₱)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
          <select 
            value={method} 
            onChange={e => setMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            step="0.01"
            placeholder="Amount received"
          />
          <div className="mt-1 text-sm text-gray-600">Change: ₱{change}</div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
          {loading ? 'Processing...' : 'Pay & Check In'}
        </button>
      </div>
    </form>
  );
}
