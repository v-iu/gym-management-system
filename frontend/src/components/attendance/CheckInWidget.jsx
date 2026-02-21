import { useState, useEffect, useRef } from 'react';

export default function CheckInWidget({ 
  members, 
  guests, 
  staff, 
  isToday, 
  onCheckIn, 
  selectedUser, 
  checkinMsg 
}) {
  const [role, setRole] = useState('member');
  const [userId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef(null);

  // Sync with external selection from UserDirectory
  useEffect(() => {
    if (selectedUser) {
      setRole(selectedUser.role);
      setUserId(String(selectedUser.id));
      setSearchQuery(`${selectedUser.first_name} ${selectedUser.last_name}`);
      setTimeout(() => selectRef.current?.focus(), 0);
    }
  }, [selectedUser]);

  const peopleList = role === 'member' ? members : role === 'guest' ? guests : staff;
  const filtered = searchQuery
    ? peopleList.filter((p) =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : peopleList;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) return;
    
    // Pass the intent to the parent controller
    onCheckIn(role, userId);
    
    // Reset local state if needed, though parent might trigger a refresh
    if (role !== 'guest') {
        setUserId('');
        setSearchQuery('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Check-In</h3>

      {checkinMsg && (
        <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${
          checkinMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {checkinMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Person type toggle */}
        <div className="flex gap-2">
          {['member', 'guest', 'staff'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); setUserId(''); setSearchQuery(''); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                role === r
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Search & select person */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search {role.charAt(0).toUpperCase() + role.slice(1)}
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Type a name to search...`}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select {role.charAt(0).toUpperCase() + role.slice(1)}
          </label>
          <select
            ref={selectRef}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">— Select —</option>
            {filtered.map((p) => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name} {p.email ? `(${p.email})` : ''}
              </option>
            ))}
          </select>
          {filtered.length === 0 && searchQuery && (
            <p className="text-xs text-gray-400 mt-1">No users found matching "{searchQuery}"</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!userId || !isToday}
          className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {role === 'guest' ? 'Pay & Check In' : 'Check In'}
        </button>
        {!isToday && (
          <div className="mt-2 text-xs text-gray-500">Viewing past attendance — check-in is disabled for this date.</div>
        )}
      </form>
    </div>
  );
}