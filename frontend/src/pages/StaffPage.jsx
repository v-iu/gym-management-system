import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get('Staffs/index');
      setStaff(res.data || []);
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (row) => `${row.first_name} ${row.last_name}` },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role', render: (row) => (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        row.role === 'admin' ? 'bg-purple-100 text-purple-700' :
        row.role === 'trainer' ? 'bg-green-100 text-green-700' :
        row.role === 'receptionist' ? 'bg-blue-100 text-blue-700' :
        'bg-gray-100 text-gray-600'
      }`}>
        {row.role}
      </span>
    )},
    { key: 'date_of_birth', label: 'Birthday' },
  ];

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Manage gym staff"
        actionLabel="Add Staff"
        onAction={() => setShowModal(true)}
      />

      <DataTable columns={columns} data={staff} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Staff">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" name="date_of_birth" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="trainer">Trainer</option>
              <option value="receptionist">Receptionist</option>
              <option value="admin">Admin</option>
              <option value="janitor">Janitor</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">Save Staff</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
