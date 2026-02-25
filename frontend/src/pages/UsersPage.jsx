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
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // State for immediate membership application flow
  const [newMemberId, setNewMemberId] = useState(null);
  const [newlyCreatedUser, setNewlyCreatedUser] = useState(null);
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

  const handleSuspend = async (id) => {
    if (!window.confirm('Suspend this user? They will not be able to access services.')) return;
    try {
      await userService.suspend(id);
      fetchUsers();
    } catch (err) {
      console.error('Failed to suspend user', err);
      alert(err.data?.message || 'Failed to suspend user');
    }
  };

  const handleActivate = async (id) => {
    try {
      await userService.activate(id);
      fetchUsers();
    } catch (err) {
      console.error('Failed to activate user', err);
      alert(err.data?.message || 'Failed to activate user');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        const isBecomingMember = editingUser.role !== 'member' && formData.role === 'member';
        await userService.update(editingUser.id, formData);
        if (isBecomingMember) {
          setNewlyCreatedUser({
            id: editingUser.id,
            first_name: formData.first_name,
            last_name: formData.last_name
          });
          setNewMemberId(editingUser.id);
        }
      } else {
        const res = await userService.create(formData);
        if (formData.role === 'member' && res.user_id) {
          setNewlyCreatedUser({
            id: res.user_id,
            first_name: formData.first_name,
            last_name: formData.last_name
          });
          setNewMemberId(res.user_id);
        }
      }
      setEditingUser(null);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to save user.");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     u.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activeUsers = filteredUsers.filter(u => u.is_suspended != 1);
  const suspendedUsers = filteredUsers.filter(u => u.is_suspended == 1);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role', render: (row) => (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${
        row.role === 'member' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
        row.role === 'staff' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
        'bg-gray-500/20 text-gray-400 border-gray-500/30'
      }`}>
        {row.role}
      </span>
    )},
    { key: 'created_at', label: 'Registered' },
    { key: 'actions', label: 'Actions', render: (row) => (
<div className="flex gap-2 justify-end">
  <button 
    onClick={() => handleEdit(row)} 
    className="px-2 py-1 text-xs bg-green-600/20 text-green-500 font-medium rounded border border-green-600/30 hover:bg-green-600/30 transition-colors"
  >
    Edit
  </button>
  <button 
    onClick={() => handleSuspend(row.id)} 
    className="px-2 py-1 text-xs text-amber-400 bg-amber-500/20 border border-amber-500/30 rounded hover:bg-amber-500/30 font-medium transition-colors"
  >
    Suspend
  </button>
</div>
    )}
  ];

  const suspendedColumns = [
    ...columns.slice(0, -1), // All columns except actions
    { key: 'actions', label: 'Actions', render: (row) => (
      <div className="flex gap-2 justify-end">
        <button 
          onClick={() => handleActivate(row.id)} 
          className="px-2 py-1 text-xs text-green-400 bg-green-500/20 border border-green-500/30 rounded hover:bg-green-500/30 font-medium transition-colors"
        >
          Reactivate
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

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-black/40 border border-green-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-black/40 border border-green-500/20 rounded-xl text-white focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all [&>option]:bg-zinc-900"
        >
          <option value="all">All Roles</option>
          <option value="member">Member</option>
          <option value="staff">Staff</option>
          <option value="guest">Guest</option>
        </select>
      </div>

      <DataTable columns={columns} data={activeUsers} loading={loading} />

      {suspendedUsers.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-white mb-4">Suspended Users</h3>
          <DataTable columns={suspendedColumns} data={suspendedUsers} loading={loading} />
        </div>
      )}

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
            member={newlyCreatedUser}
            membersList={users.filter(u => u.id === parseInt(newMemberId))}
            onCancel={() => { setNewMemberId(null); setNewlyCreatedUser(null); }}
            onSubmit={async (payload) => {
              await membershipService.create(payload);
              setNewMemberId(null);
              setNewlyCreatedUser(null);
              fetchUsers(); // Refresh to see updated status/membership details if any
            }}
          />
        )}
      </Modal>
    </div>
  );
}
