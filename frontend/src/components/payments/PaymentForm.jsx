import { useState } from 'react';

export default function PaymentForm({ defaultValues = {}, includeUser = false, onSubmit, submitLabel = 'Save' }) {
  const [values, setValues] = useState({
    payment_type: defaultValues.payment_type || 'one-time',
    amount: defaultValues.amount ?? '',
    method: defaultValues.method || 'cash',
    membership_id: defaultValues.membership_id || '',
    staff_id: defaultValues.staff_id || '',
    user_id: defaultValues.user_id || '',
    // tendered: cash the guest handed over (optional) — used only for UI/change calc
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

    // basic validation
    if (!values.payment_type) return setError('Payment type is required');
    if (!values.method) return setError('Payment method is required');
    // when the parent asks us to include a user, make sure we actually have one
    if (includeUser) {
      const uid = parseInt(values.user_id, 10);
      if (!uid || Number.isNaN(uid)) {
        return setError('No guest/member selected for payment');
      }
    }
    // compute effective amount: if omitted but this is a guest one-time (includeUser), default to fixed ₱50
    let amount = parseFloat(values.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      if (includeUser && values.payment_type === 'one-time') {
        amount = 50.00;
      } else {
        return setError('Enter a valid amount');
      }
    }

    // if cash, require a tendered amount >= amount so we can calculate change
    let tendered = null;
    if (values.method === 'cash') {
      tendered = values.tendered === '' ? NaN : parseFloat(values.tendered);
      if (Number.isNaN(tendered) || tendered < amount) {
        return setError('Enter a valid tendered amount (cash) that is at least the required amount');
      }
    }

    const payload = {
      payment_type: values.payment_type,
      amount: amount,
      method: values.method,
      membership_id: values.membership_id || null,
      staff_id: values.staff_id || undefined,
      user_id: values.user_id || undefined,
      is_paid: values.is_paid ? 1 : 0,
      tendered: tendered ?? null,
      change_amount: tendered ? parseFloat((tendered - amount).toFixed(2)) : 0
    };

    Object.keys(payload).forEach(k => {
      if (
        payload[k] === undefined ||
        payload[k] === '' ||
        (typeof payload[k] === 'number' && Number.isNaN(payload[k]))
      ) {
        delete payload[k];
      }
    });

    // debug: log payload before sending so we can inspect it
    console.debug('PaymentForm submitting payload', payload);

    setLoading(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      // log full error for debugging
      console.error('PaymentForm submission error', err);
      const msg = err?.data?.message || err?.message || 'Failed to save payment';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
        <select name="payment_type" value={values.payment_type} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
          <option value="registration">Registration</option>
          <option value="renewal">Renewal</option>
          <option value="one-time">One-Time</option>
          <option value="service">Service</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₱)</label>

          {/* For on-the-spot guest check-in (includeUser + one-time) the amount is fixed at ₱50 — show read-only. */}
          {includeUser && values.payment_type === 'one-time' ? (
            <div className="w-full border rounded px-3 py-2 text-sm bg-gray-50 text-gray-800">₱{(values.amount || 50).toFixed(2)}</div>
          ) : (
            <input name="amount" value={values.amount} onChange={handleChange} type="number" step="0.01" className="w-full border rounded px-3 py-2 text-sm" />
          )}

        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
          <select name="method" value={values.method} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
            <option value="cash">Cash</option>
            <option value="gcash">GCash</option>
            <option value="card">Card</option>
          </select>
        </div>
      </div>

      {/* Cash-specific: show tendered amount and calculated change */}
      {values.method === 'cash' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tendered (₱)</label>
          <input name="tendered" value={values.tendered} onChange={handleChange} type="number" step="0.01" className="w-full border rounded px-3 py-2 text-sm" />
          <div className="mt-2 text-sm text-gray-600">{
            (() => {
              const amt = parseFloat(values.amount) || 0;
              const t = parseFloat(values.tendered) || 0;
              const change = t - amt;
              if (Number.isNaN(change)) return 'Change: —';
              return `Change: ₱${change.toFixed(2)}`;
            })()
          }</div>
        </div>
      )}

      {includeUser && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
          <input
            name="user_id"
            value={values.user_id}
            onChange={handleChange}
            type="number"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enter User ID"
          />
        </div>
      )}

      {(values.membership_id || values.staff_id) && (
        <div className="grid grid-cols-2 gap-4">
          {values.membership_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Membership ID (optional)</label>
              {/* membership is inferred from the selected user; prevent typing arbitrary values */}
              <input
                name="membership_id"
                value={values.membership_id}
                onChange={handleChange}
                type="number"
                readOnly
                className="w-full border rounded px-3 py-2 text-sm bg-gray-50 cursor-not-allowed"
              />
            </div>
          )}
          {values.staff_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
              {/* processed-by should normally be set by the parent (e.g. check-in flow) and not
                  typed manually. the field remains visible/read-only for review or editing. */}
              <input
                name="staff_id"
                value={values.staff_id}
                onChange={handleChange}
                type="number"
                readOnly
                className="w-full border rounded px-3 py-2 text-sm bg-gray-50 cursor-not-allowed"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input id="is_paid" name="is_paid" type="checkbox" checked={values.is_paid} onChange={handleChange} className="rounded" />
        <label htmlFor="is_paid" className="text-sm text-gray-700">Mark as paid</label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded text-sm">{submitLabel}</button>
      </div>
    </form>
  );
}
