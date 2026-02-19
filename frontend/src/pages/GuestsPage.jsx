import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const res = await api.get('Guests/index');
      setGuests(res.data || []);
    } catch (err) {
      console.error('Failed to load guests:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'created_at', label: 'Registered' },
  ];

  return (
    <div>
      <PageHeader
        title="Guests"
        subtitle="Register walk-in guests for attendance reference"
        actionLabel="Register Guest"
        onAction={() => setShowModal(true)}
      />

      <DataTable columns={columns} data={guests} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register Guest">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" name="first_name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" name="last_name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" name="phone" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">Register</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
