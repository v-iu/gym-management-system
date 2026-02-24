import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    staff_id: null,
    name: '',
    type: '',
    amount: '',
    brand: '',
    serial_num: '',
    warranty_expiry: '',
    purchased_on: '',
    purchase_cost: '',
  });
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const res = await api.get('Equipments/index');
      setEquipment(res.data || []);
    } catch (err) {
      console.error('Failed to load equipment:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for editing a service
  const openEditModal = (equipment) => {
    setFormData({
      id: equipment.id,
      staff_id: equipment.staff_id ?? null,
      name: equipment.name ?? '',
      type: equipment.type ?? '',
      amount: equipment.amount ?? '',
      brand: equipment.brand ?? '',
      serial_num: equipment.serial_num ?? '',
      warranty_expiry: equipment.warranty_expiry ?? '',
      purchased_on: equipment.purchased_on ?? '',
      purchase_cost: equipment.purchase_cost ?? '',
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
       await api.put(`Equipments/update/${formData.id}`, {
          id: formData.id,
          staff_id: formData.staff_id ? parseInt(formData.staff_id, 10) : null,
          name: formData.name,
          type: formData.type,
          amount: formData.amount ? parseInt(formData.amount, 10) : 1,
          brand: formData.brand,
          serial_num: formData.serial_num,
          warranty_expiry: formData.warranty_expiry || null,
          purchased_on: formData.purchased_on,
          purchase_cost: formData.purchase_cost
            ? parseFloat(formData.purchase_cost)
            : 0,
        });
        alert('Equipment updated successfully!');
      } else {
        // Adding new service
        await api.post('Equipments/store', {
          staff_id: formData.staff_id ? parseInt(formData.staff_id, 10) : null,
          name: formData.name,
          type: formData.type,
          amount: formData.amount ? parseInt(formData.amount, 10) : 1,
          brand: formData.brand,
          serial_num: formData.serial_num,
          warranty_expiry: formData.warranty_expiry || null,
          purchased_on: formData.purchased_on,
          purchase_cost: formData.purchase_cost
            ? parseFloat(formData.purchase_cost)
            : 0,        });
        alert('Equipment added successfully!');
      }

      // Reset form and close modal
      setFormData({
        id: 0,
        staff_id: null,
        name: '',
        type: '',
        amount: '',
        brand: '',
        serial_num: '',
        warranty_expiry: '',
        purchased_on: '',
        purchase_cost: '',});
      setShowModal(false);
      fetchEquipment(); // refresh table
    } catch (err) {
      console.error('Failed to submit equipment:', err);
      alert('Failed to submit equipment. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDeleteService = async (id) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    try {
      await api.delete(`Equipments/destroy/${id}`);
      fetchEquipment();
      alert('Equipment deleted successfully!');
    } catch (err) {
      console.error('Failed to delete equipment:', err);
      alert('Failed to delete equipment.');
    }
  };
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Equipment Name' },
    { key: 'type', label: 'Type', render: (row) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
        {row.type}
      </span>
    )},
    { key: 'brand', label: 'Brand' },
    { key: 'amount', label: 'Qty' },
    { key: 'serial_num', label: 'Serial #' },
    { key: 'warranty_expiry', label: 'Warranty Exp.' },
    { key: 'assigned_to', label: 'Assigned To', render: (row) =>
      row.staff_first_name ? `${row.staff_first_name} ${row.staff_last_name}` : '—'
    },
    {key: 'actions', label: 'Actions', render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => openEditModal(row)} className="px-2 py-1 text-xs bg-green-600/20 text-green-500 font-medium rounded border border-green-600/30 hover:bg-green-600/30 transition-colors">
            Edit
          </button>
          <button onClick={() => handleDeleteService(row.id)}className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-medium transition-colors">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Equipment"
        subtitle="Manage gym equipment and maintenance"
        actionLabel="Add Equipment"
        onAction={() => setShowModal(true)}
      />

      <DataTable columns={columns} data={equipment} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={formData.id ? "Edit Equipment" : "Add Equipment"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Equipment Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all [&>option]:bg-zinc-900 [&>option]:text-white">
                <option value="Machine">Machine</option>
                <option value="Free Weight">Free Weight</option>
                <option value="Cardio">Cardio</option>
                <option value="Accessory">Accessory</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
              <input type="number" name="amount" defaultValue={1} value={formData.amount} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Serial Number</label>
              <input type="text" name="serial_num" value={formData.serial_num} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Purchased On</label>
              <input type="date" name="purchased_on" value={formData.purchased_on} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Purchase Cost (₱)</label>
              <input type="number" step="0.01" name="purchase_cost" value={formData.purchase_cost} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Warranty Expiry</label>
            <input type="date" name="warranty_expiry" value={formData.warranty_expiry} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Assigned Staff ID</label>
            <input type="number" name="staff_id" value={formData.staff_id} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"> {submitting ? (formData.id ? 'Updating...' : 'Adding...') : (formData.id ? 'Update Equipment' : 'Add Equipment')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}