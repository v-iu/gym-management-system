import { useState, useEffect, useRef } from 'react';

export default function CheckInWidget({ 
  members, guests, staff, isToday, onCheckIn, selectedUser, checkinMsg
}) {
  const [role, setRole] = useState('member');
  const [userId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      setRole(selectedUser.role);
      setUserId(String(selectedUser.id));
      setSearchQuery(`${selectedUser.first_name} ${selectedUser.last_name}`);
      setTimeout(() => searchRef.current?.focus(), 0);
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
    onCheckIn(role, userId);
    if (role !== 'guest') { setUserId(''); setSearchQuery(''); }
  };

  return (
    <div className="bg-black/60 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-[0_0_20px_rgba(0,255,120,0.05)] p-5 mb-6">
      <h3 className="text-sm font-semibold text-white mb-4">Quick Check-In</h3>

      {checkinMsg && (
        <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm border ${
          checkinMsg.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'
        }`}>
          {checkinMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {['member','guest','staff'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); setUserId(''); setSearchQuery(''); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                role === r ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(0,255,120,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >{r}</button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Search {role.charAt(0).toUpperCase() + role.slice(1)}</label>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Type a name to search...`}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Select {role.charAt(0).toUpperCase() + role.slice(1)}</label>
          <div className="w-full bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <div className="max-h-48 overflow-y-auto">
              {filtered.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {filtered.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setUserId(String(p.id))}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex justify-between items-center ${
                        String(userId) === String(p.id)
                          ? 'bg-green-500/20 text-green-400'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{p.first_name} {p.last_name}</span>
                      {p.email && <span className="text-xs text-gray-500 ml-2 truncate max-w-[120px]">{p.email}</span>}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  {searchQuery ? 'No users found' : 'No users available'}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!userId || !isToday}
          className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black text-sm font-bold rounded-lg shadow-[0_0_10px_rgba(0,255,120,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {role === 'guest' ? 'Pay & Check In' : 'Check In'}
        </button>

        {!isToday && (
          <div className="mt-2 text-xs text-gray-400">Viewing past attendance — check-in is disabled for this date.</div>
        )}
      </form>
    </div>
  );
}