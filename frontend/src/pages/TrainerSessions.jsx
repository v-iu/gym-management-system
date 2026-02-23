import { useState, useEffect } from 'react';
import { api } from '../api';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';

export default function TrainerSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchSessions();
    fetchDropdownData();
  }, []);

  // Fetch existing trainer sessions
  const fetchSessions = async () => {
    try {
      const res = await api.get('TrainerSessions/index');
      setSessions(res.data || []); // extract the `data` array
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members, trainers, and services for dropdowns
  const fetchDropdownData = async () => {
    try {
      const membersRes = await api.get('Users/byRole/member');
      const staffRes = await api.get('Users/byRole/staff');
      const servicesRes = await api.get('TrainerServices/index');

      setMembers((membersRes && membersRes.data) || []);

      // Only staff users with staff_role = 'trainer'
      setTrainers(
        ((staffRes && staffRes.data) || []).filter(
          (user) => user.staff_role === 'trainer'
        )
      );

      setServices((servicesRes && servicesRes.data) || []);
    } catch (err) {
      console.error('Failed to load dropdown data:', err);
    }
  };

  // Handle form submission for creating/updating sessions
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (editingSession) {
        await api.put(`TrainerSessions/update/${editingSession.id}`, data);
      } else {
        await api.post('TrainerSessions/store', data);
      }

      setShowModal(false);
      setEditingSession(null);
      fetchSessions();
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    try {
      await api.delete(`TrainerSessions/destroy/${id}`);
      fetchSessions();
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  // Table columns definition
  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'member',
      label: 'Member',
      render: (row) =>
        row.member_first_name
          ? `${row.member_first_name} ${row.member_last_name}`
          : '—',
    },
    {
      key: 'trainer',
      label: 'Trainer',
      render: (row) =>
        row.staff_first_name
          ? `${row.staff_first_name} ${row.staff_last_name}`
          : '—',
    },
    { key: 'service_name', label: 'Service' },
    { key: 'session_date', label: 'Scheduled Date' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
            row.status === 'scheduled'
              ? 'bg-blue-100 text-blue-700'
              : row.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
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
        title="Trainer Sessions"
        subtitle="Schedule and manage training sessions"
        actionLabel="Schedule Session"
        onAction={() => {
          setEditingSession(null);
          setShowModal(true);
        }}
      />

      <DataTable columns={columns} data={sessions} loading={loading} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSession(null);
        }}
        title={editingSession ? 'Edit Session' : 'Schedule Session'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Member dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Member
            </label>
            <select
              name="member_id"
              required
              defaultValue={editingSession?.member_id || ''}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none"
            >
              <option value="">Select Member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.first_name} {member.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Trainer dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Trainer
            </label>
            <select
              name="staff_id"
              required
              defaultValue={editingSession?.staff_id || ''}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none"
            >
              <option value="">Select Trainer</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.first_name} {trainer.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Service dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Service
            </label>
            <select
              name="service_id"
              required
              defaultValue={editingSession?.service_id || ''}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none"
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.service_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Status */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Session Date & Time
            </label>
            <input
              type="datetime-local"
              name="session_date"
              required
              defaultValue={
                editingSession?.session_date
                  ? editingSession.session_date.replace(' ', 'T')
                  : ''
              }
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue={editingSession?.status || 'scheduled'}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingSession(null);
              }}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
            >
              {editingSession ? 'Update' : 'Schedule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
