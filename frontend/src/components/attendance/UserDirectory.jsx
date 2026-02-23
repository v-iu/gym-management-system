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
      <h3 className="text-sm font-semibold text-white mb-3">Users Directory</h3>

      <div className="flex gap-2 mb-3">
        {[null, 'member', 'guest', 'staff'].map((r) => (
          <button 
            key={r || 'all'} 
            type="button" 
            onClick={() => setUserListRole(r)}
            className={`px-3 py-1 text-sm rounded capitalize ${userListRole === r ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(0,255,120,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            {r || 'All'}
          </button>
        ))}
      </div>

      <DataTable
        columns={userColumns}
        data={usersList}
        loading={usersLoading}
        onRowAction={onSelect}
        actionLabel="Select"
        maxHeight="max-h-64"
        tableClassName="bg-black/60 backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,120,0.05)]"
        headerTextClass="text-gray-400 font-medium"
        rowTextClass="text-white"
        actionButtonClass="px-2 py-1 text-sm rounded bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors"
      />
    </div>
  );
}
