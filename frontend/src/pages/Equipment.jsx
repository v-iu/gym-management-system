import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await api.get('Equipments/index');
      setEquipment(res.data || []);
    } catch (err) {
      console.error('Failed to load equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Equipment Name' },
    { key: 'type', label: 'Type', render: (row) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Equipment">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Equipment Name</label>
            <input type="text" name="name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Type</label>
              <select name="type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="Machine">Machine</option>
                <option value="Free Weight">Free Weight</option>
                <option value="Cardio">Cardio</option>
                <option value="Accessory">Accessory</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Quantity</label>
              <input type="number" name="amount" defaultValue={1} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Brand</label>
              <input type="text" name="brand" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Serial Number</label>
              <input type="text" name="serial_num" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Purchased On</label>
              <input type="date" name="purchased_on" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Purchase Cost (₱)</label>
              <input type="number" step="0.01" name="purchase_cost" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Warranty Expiry</label>
            <input type="date" name="warranty_expiry" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Assigned Staff ID</label>
            <input type="number" name="staff_id" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">Add Equipment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
