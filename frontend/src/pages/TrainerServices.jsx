// FILE: frontend/src/pages/TrainerServices.jsx
import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';

export default function TrainerServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('TrainerServices/index');
      setServices(res.data || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'service_name', label: 'Service Name' },
    { key: 'price', label: 'Price', render: (row) => `₱${parseFloat(row.price).toLocaleString()}` },
    { key: 'duration_minutes', label: 'Duration', render: (row) => `${row.duration_minutes} min` },
    { key: 'created_at', label: 'Created' },
  ];

  return (
    <div>
      <PageHeader
        title="Trainer Services"
        subtitle="Manage available training services"
        actionLabel="Add Service"
        onAction={() => setShowModal(true)}
      />

      <DataTable columns={columns} data={services} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Trainer Service">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
            <input
              type="text"
              name="service_name"
              placeholder="e.g., Personal Training"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                placeholder="e.g., 500.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                name="duration_minutes"
                placeholder="e.g., 60"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
            >
              Add Service
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
