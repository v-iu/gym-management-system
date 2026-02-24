import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';

export default function TrainerServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // This will hold either a new service or an existing service being edited
  const [formData, setFormData] = useState({
    id: null,
    service_name: '',
    price: '',
    duration_minutes: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('TrainerServices/index');
      setServices(res.data || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for editing a service
  const openEditModal = (service) => {
    setFormData({
      id: service.id,
      service_name: service.service_name,
      price: service.price,
      duration_minutes: service.duration_minutes,
    });
    setShowModal(true);
  };

  // Handle Add or Edit form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (formData.id) {
        // Editing existing service
        await api.put(`TrainerServices/update/${formData.id}`, {
          id: formData.id,
          service_name: formData.service_name,
          price: parseFloat(formData.price),
          duration_minutes: parseInt(formData.duration_minutes, 10),
        });
        alert('Service updated successfully!');
      } else {
        // Adding new service
        await api.post('TrainerServices/store', {
          service_name: formData.service_name,
          price: parseFloat(formData.price),
          duration_minutes: parseInt(formData.duration_minutes, 10),
        });
        alert('Service added successfully!');
      }

      // Reset form and close modal
      setFormData({ id: null, service_name: '', price: '', duration_minutes: '' });
      setShowModal(false);
      fetchServices(); // refresh table
    } catch (err) {
      console.error('Failed to submit service:', err);
      alert('Failed to submit service. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDeleteService = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await api.delete(`TrainerServices/destroy/${id}`);
      fetchServices();
      alert('Service deleted successfully!');
    } catch (err) {
      console.error('Failed to delete service:', err);
      alert('Failed to delete service.');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'service_name', label: 'Service Name' },
    { key: 'price', label: 'Price', render: (row) => `₱${parseFloat(row.price).toLocaleString()}` },
    { key: 'duration_minutes', label: 'Duration', render: (row) => `${row.duration_minutes} min` },
    { key: 'created_at', label: 'Created' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="px-2 py-1 text-xs bg-green-600/20 text-green-500 font-medium rounded border border-green-600/30 hover:bg-green-600/30 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteService(row.id)}
            className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={formData.id ? 'Edit Trainer Service' : 'Add Trainer Service'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Service Name</label>
            <input
              type="text"
              name="service_name"
              placeholder="e.g., Personal Training"
              value={formData.service_name}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Price (₱)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                placeholder="e.g., 500.00"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Duration (minutes)</label>
              <input
                type="number"
                name="duration_minutes"
                placeholder="e.g., 60"
                value={formData.duration_minutes}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? (formData.id ? 'Updating...' : 'Adding...') : (formData.id ? 'Update Service' : 'Add Service')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
