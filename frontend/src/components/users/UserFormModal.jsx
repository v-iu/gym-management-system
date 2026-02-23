// frontend/src/components/users/UserFormModal.jsx
import { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const initialForm = { first_name: '', last_name: '', email: '', phone: '', role: 'guest' };

export default function UserFormModal({ isOpen, onClose, userToEdit, onSubmit }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setFormData({
          first_name: userToEdit.first_name || '',
          last_name: userToEdit.last_name || '',
          email: userToEdit.email || '',
          phone: userToEdit.phone || '',
          role: userToEdit.role || 'guest'
        });
      } else {
        setFormData(initialForm);
      }
      setError('');
    }
  }, [isOpen, userToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      const msg = err.data?.errors 
        ? Object.values(err.data.errors)[0] 
        : (err.data?.message || 'Failed to save');
      setError(msg);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={userToEdit ? 'Edit User' : 'Register User'}
    >
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded text-sm mb-4">{error}</div>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
            <input 
              type="text" 
              name="first_name" 
              required 
              value={formData.first_name} 
              onChange={handleChange} 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
            <input 
              type="text" 
              name="last_name" 
              required 
              value={formData.last_name} 
              onChange={handleChange} 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            required 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
          <input 
            type="tel" 
            name="phone" 
            required 
            value={formData.phone} 
            onChange={handleChange} 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all [&>option]:bg-zinc-900 [&>option]:text-white"
          >
            <option value="guest">Guest</option>
            <option value="member">Member</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black text-sm font-bold rounded-lg shadow-[0_0_10px_rgba(0,255,120,0.2)] transition-all"
          >
            {userToEdit ? 'Save changes' : 'Register'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
