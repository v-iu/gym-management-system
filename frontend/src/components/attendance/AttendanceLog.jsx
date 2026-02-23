import DataTable from '../common/DataTable';

export default function AttendanceLog({ 
    attendance, 
    loading, 
    selectedDate, 
    availableDates, 
    isToday, 
    onDateChange, 
    onPrevDate, 
    onNextDate,
    onCheckout 
}) {
  const columns = [
    { key: 'id', label: 'ID', headerClass: 'text-gray-400 font-medium', rowClass: 'text-white' },
    { key: 'person', label: 'Person', render: (row) => row.user_first_name ? `${row.user_first_name} ${row.user_last_name}` : '—', headerClass: 'text-gray-400 font-medium', rowClass: 'text-white' },
    { key: 'user_role', label: 'Role', render: (row) => row.user_role || '—', headerClass: 'text-gray-400 font-medium', rowClass: 'text-white' },
    { key: 'check_in_time', label: 'Check In', render: (row) =>
      row.check_in_time ? new Date(row.check_in_time).toLocaleTimeString() : '—',
      headerClass: 'text-gray-400 font-medium', rowClass: 'text-white'
    },
    { key: 'check_out_time', label: 'Check Out', render: (row) =>
      row.check_out_time
        ? new Date(row.check_out_time).toLocaleTimeString()
        : <span className="text-green-400 text-xs font-medium">Currently In</span>,
      headerClass: 'text-gray-400 font-medium', rowClass: 'text-white'
    },
    { key: 'staff', label: 'Processed By', render: (row) =>
      row.staff_first_name ? `${row.staff_first_name} ${row.staff_last_name}` : '—',
      headerClass: 'text-gray-400 font-medium', rowClass: 'text-white'
    },
  ];

  return (
    <div className="bg-black/60 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-[0_0_20px_rgba(0,255,120,0.05)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrevDate}
            disabled={availableDates.length === 0}
            className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-medium transition-colors"
          >
            ← Prev
          </button>

          <div className="text-sm font-medium text-white">
            {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'No attendance selected'}
            {!isToday && <span className="ml-2 text-xs text-gray-400">(read-only)</span>}
          </div>

          <button
            type="button"
            onClick={onNextDate}
            disabled={availableDates.length === 0}
            className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-medium transition-colors"
          >
            Next →
          </button>
        </div>

        <div>
          <label className="sr-only">Select date</label>
          <select
            value={selectedDate || ''}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-sm bg-white/5 border border-white/10 rounded px-3 py-1 text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all [&>option]:bg-zinc-900 [&>option]:text-white"
          >
            {!availableDates.includes(new Date().toISOString().slice(0,10)) && (
              <option value={new Date().toISOString().slice(0,10)}>- Today -</option>
            )}
            {availableDates.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white mb-3">Attendance Log</h3>
      <DataTable
        columns={columns}
        data={attendance}
        loading={loading}
        onRowAction={(row) => !row.check_out_time && onCheckout(row)}
        actionLabel="Check Out"
        tableClassName="bg-transparent"
        headerTextClass="text-gray-400 font-medium"
        rowTextClass="text-white"
        actionButtonClass="px-2 py-1 text-sm rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 font-medium transition-colors"
      />
    </div>
  );
}
