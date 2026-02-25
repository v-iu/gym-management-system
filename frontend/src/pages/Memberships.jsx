import { useState } from 'react';
import membershipService from '../services/membershipService';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import useMemberships from '../hooks/useMemberships';
import useUsers from '../hooks/useUsers';
import MembershipApplicationForm from '../components/memberships/MembershipApplicationForm';
import MembershipRenewalForm from '../components/memberships/MembershipRenewalForm';

export default function MembershipsPage() {
  const { memberships, loading, refresh, create, update } = useMemberships();
  const { users: staff } = useUsers('staff');
  const { users: allUsers } = useUsers(); // Fetch all to filter for potential members
  
  const [showModal, setShowModal] = useState(false);
  const [renewingMembership, setRenewingMembership] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Users who can be assigned a membership (guests or existing members).
  // This covers "Add new member (Query:Guests)" use case.
  const potentialMembers = allUsers ? allUsers.filter(u => u.role === 'guest' || u.role === 'member') : [];

  const handlePauseResume = async (membership) => {
    try {
      if (membership.membership_status === 'active') {
        await membershipService.pause(membership.id);
      } else if (membership.membership_status === 'paused') {
        await membershipService.resume(membership.id);
      }
      refresh();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update membership status');
    }
  };

  const filteredMemberships = memberships.filter(m => {
    const matchesSearch = m.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.membership_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'member', label: 'Member', render: (row) => row.first_name ? `${row.first_name} ${row.last_name}` : '—' },
    { key: 'start_date', label: 'Date Joined' },
    { key: 'end_date', label: 'Due Date' },
    { key: 'days_left', label: 'Days Left', render: (row) => {
        if (!row.end_date) return '—';
        const end = new Date(row.end_date);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `${diffDays} days` : 'Expired';
    }},
    { key: 'membership_status', label: 'Status', render: (row) => (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
        row.membership_status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
        row.membership_status === 'paused' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
        row.membership_status === 'expired' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
        'bg-red-500/20 text-red-400 border-red-500/30'
      }`}>
        {row.membership_status}
      </span>
    )},
    { key: 'actions', label: 'Actions', align: 'right', render: (row) => {
      //gets the days left
      const end = row.end_date ? new Date(row.end_date) : null;
      const now = new Date();
      const diffDays = end ? Math.ceil((end - now) / (1000 * 60 * 60 * 24)) : 0;
      //decides if pay/renew should show
      const shouldShowRenew = diffDays < 30 || row.membership_status === 'expired';
      return (
      <div className="flex gap-2 justify-end">
        {(row.membership_status === 'active' || row.membership_status === 'paused') && (
          <button 
            onClick={() => handlePauseResume(row)}
            className="px-2 py-1 text-xs rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 font-medium transition-colors"
          >
            {row.membership_status === 'active' ? 'Pause' : 'Resume'}
          </button>
        )}

        {shouldShowRenew && (
          <button 
            onClick={() => setRenewingMembership(row)}
            className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 font-medium transition-colors"
          >
            Pay Early / Renew
          </button>
        )}
      </div>
    );
  }
},
];

  return (
    <div>
      <PageHeader
        title="Memberships"
        subtitle="Manage membership plans"
        actionLabel="Add Membership"
        onAction={() => setShowModal(true)}
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search memberships by member name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-black/40 border border-green-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-black/40 border border-green-500/20 rounded-xl text-white focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all [&>option]:bg-zinc-900"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <DataTable columns={columns} data={filteredMemberships} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Membership">
        <MembershipApplicationForm 
          membersList={potentialMembers}
          onCancel={() => setShowModal(false)}
          onSubmit={async (payload) => {
            await create(payload);
            setShowModal(false);
            refresh();
          }}
        />
      </Modal>

      <Modal isOpen={!!renewingMembership} onClose={() => setRenewingMembership(null)} title="Renew Membership">
        {renewingMembership && (
          <MembershipRenewalForm
            membership={renewingMembership}
            member={{ first_name: renewingMembership.first_name, last_name: renewingMembership.last_name }}
            onCancel={() => setRenewingMembership(null)}
            onSubmit={async (payload) => {
              await membershipService.renew(renewingMembership.id, payload);
              setRenewingMembership(null);
              refresh();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
