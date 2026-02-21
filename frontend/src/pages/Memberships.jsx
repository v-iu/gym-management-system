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
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        row.membership_status === 'active' ? 'bg-green-100 text-green-700' :
        row.membership_status === 'paused' ? 'bg-amber-100 text-amber-700' :
        row.membership_status === 'expired' ? 'bg-gray-100 text-gray-600' :
        'bg-red-100 text-red-700'
      }`}>
        {row.membership_status}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: (row) => (
      <div className="flex gap-2 justify-end">
        {(row.membership_status === 'active' || row.membership_status === 'paused') && (
          <button 
            onClick={() => handlePauseResume(row)}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium"
          >
            {row.membership_status === 'active' ? 'Pause' : 'Resume'}
          </button>
        )}
        <button 
          onClick={() => setRenewingMembership(row)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Pay Early / Renew
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Memberships"
        subtitle="Manage membership plans"
        actionLabel="Add Membership"
        onAction={() => setShowModal(true)}
      />

      <DataTable columns={columns} data={memberships} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Membership">
        <MembershipApplicationForm 
          membersList={potentialMembers}
          staffList={staff}
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
            staffList={staff}
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
