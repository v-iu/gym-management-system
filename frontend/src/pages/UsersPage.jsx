import { useState, useEffect } from 'react';
import userService from '../services/userService';
import membershipService from '../services/membershipService';
import useUsers from '../hooks/useUsers';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import UserFormModal from '../components/users/UserFormModal';
import MembershipApplicationForm from '../components/memberships/MembershipApplicationForm';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // State for immediate membership application flow
  const [newMemberId, setNewMemberId] = useState(null);
  const { users: staff } = useUsers('staff');

  // editing state for CRUD
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const list = await userService.list();
      setUsers(list || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditingUserId(user.id); // Keep for now if needed by logic, but user object is better
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await userService.remove(id);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
      alert(err.data?.message || 'Failed to delete user');
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingUser) {
      await userService.update(editingUser.id, formData);
    } else {
      const res = await userService.create(formData);
      // If the new user is a member, trigger the membership application flow
      if (formData.role === 'member' && res.user_id) {
        setNewMemberId(res.user_id);
      }
    }
    setEditingUser(null);
    fetchUsers();
    setShowModal(false);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role', render: (row) => (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
        row.role === 'member' ? 'bg-green-100 text-green-700' :
        row.role === 'staff' ? 'bg-blue-100 text-blue-700' :
        'bg-gray-100 text-gray-800'
      }`}>
        {row.role}
      </span>
    )},
    { key: 'created_at', label: 'Registered' },
    { key: 'actions', label: 'Actions', render: (row) => (
<div className="flex gap-2 justify-end">
  <button 
    onClick={() => handleEdit(row)} 
    className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200 font-medium transition-colors"
  >
    Edit
  </button>
  <button 
    onClick={() => handleDelete(row.id)} 
    className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200 font-medium transition-colors"
  >
    Delete
  </button>
</div>
    )}
  ];

  return (
    <div>
      <PageHeader 
        title="User Management" 
        subtitle="Manage guests, members, and staff"
        actionLabel="Register User"
        onAction={() => { setEditingUser(null); setShowModal(true); }}
      />

      <DataTable columns={columns} data={users} loading={loading} />

      <UserFormModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        userToEdit={editingUser} 
        onSubmit={handleFormSubmit} 
      />

      {/* Immediate Membership Application Modal */}
      <Modal isOpen={!!newMemberId} onClose={() => setNewMemberId(null)} title="Complete Membership Application">
        {newMemberId && (
          <MembershipApplicationForm
            // Pass a single-item list containing the new user so the form pre-selects them
            membersList={users.filter(u => u.id === parseInt(newMemberId))}
            staffList={staff}
            onCancel={() => setNewMemberId(null)}
            onSubmit={async (payload) => {
              await membershipService.create(payload);
              setNewMemberId(null);
              fetchUsers(); // Refresh to see updated status/membership details if any
            }}
          />
        )}
      </Modal>
    </div>
  );
}
