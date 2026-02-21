import { useState } from 'react';
import DataTable from '../common/DataTable';
import useUsers from '../../hooks/useUsers';

export default function UserDirectory({ onSelect }) {
  const [userListRole, setUserListRole] = useState('member');
  const { users: usersList, loading: usersLoading } = useUsers(userListRole);

  const userColumns = [
    { key: 'id', label: 'ID' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' },
    { key: 'created_at', label: 'Registered' }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Users Directory</h3>

      <div className="flex gap-2 mb-3">
        {[null, 'member', 'guest', 'staff'].map((r) => (
          <button 
            key={r || 'all'} 
            type="button" 
            onClick={() => setUserListRole(r)}
            className={`px-3 py-1 text-sm rounded capitalize ${userListRole === r ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {r || 'All'}
          </button>
        ))}
      </div>

      <div className="h-64 overflow-y-auto bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={userColumns}
          data={usersList}
          loading={usersLoading}
          onRowAction={onSelect}
          actionLabel="Select"
        />
      </div>

      <div className="mt-2 text-sm text-gray-600">Click <span className="px-2 py-0.5 bg-gray-50 rounded">Select</span> to choose a user for check-in.</div>
    </div>
  );
}