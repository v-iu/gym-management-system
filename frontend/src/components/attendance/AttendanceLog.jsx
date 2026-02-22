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
    { key: 'id', label: 'ID', headerClass: 'text-black font-medium', rowClass: 'text-black' },
    { key: 'person', label: 'Person', render: (row) => row.user_first_name ? `${row.user_first_name} ${row.user_last_name}` : '—', headerClass: 'text-black font-medium', rowClass: 'text-black' },
    { key: 'user_role', label: 'Role', render: (row) => row.user_role || '—', headerClass: 'text-black font-medium', rowClass: 'text-black' },
    { key: 'check_in_time', label: 'Check In', render: (row) =>
      row.check_in_time ? new Date(row.check_in_time).toLocaleTimeString() : '—',
      headerClass: 'text-black font-medium', rowClass: 'text-black'
    },
    { key: 'check_out_time', label: 'Check Out', render: (row) =>
      row.check_out_time
        ? new Date(row.check_out_time).toLocaleTimeString()
        : <span className="text-green-700 text-xs font-medium">Currently In</span>,
      headerClass: 'text-black font-medium', rowClass: 'text-black'
    },
    { key: 'staff', label: 'Processed By', render: (row) =>
      row.staff_first_name ? `${row.staff_first_name} ${row.staff_last_name}` : '—',
      headerClass: 'text-black font-medium', rowClass: 'text-black'
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrevDate}
            disabled={availableDates.length === 0}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-black font-medium"
          >
            ← Prev
          </button>

          <div className="text-sm font-medium text-black">
            {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'No attendance selected'}
            {!isToday && <span className="ml-2 text-xs text-black/70">(read-only)</span>}
          </div>

          <button
            type="button"
            onClick={onNextDate}
            disabled={availableDates.length === 0}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-black font-medium"
          >
            Next →
          </button>
        </div>

        <div>
          <label className="sr-only">Select date</label>
          <select
            value={selectedDate || ''}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1 text-black font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

      <h3 className="text-sm font-semibold text-black mb-3">Attendance Log</h3>
      <DataTable
        columns={columns}
        data={attendance}
        loading={loading}
        onRowAction={(row) => !row.check_out_time && onCheckout(row)}
        actionLabel="Check Out"
        tableClassName="bg-white"
        headerTextClass="text-black font-medium"
        rowTextClass="text-black"
        actionButtonClass="px-2 py-1 text-sm rounded hover:bg-gray-100 text-black font-medium transition-colors"
      />
    </div>
  );
}
