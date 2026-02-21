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
    { key: 'id', label: 'ID' },
    { key: 'person', label: 'Person', render: (row) => row.user_first_name ? `${row.user_first_name} ${row.user_last_name}` : '—' },
    { key: 'user_role', label: 'Role', render: (row) => row.user_role || '—' },
    { key: 'check_in_time', label: 'Check In', render: (row) =>
      row.check_in_time ? new Date(row.check_in_time).toLocaleTimeString() : '—'
    },
    { key: 'check_out_time', label: 'Check Out', render: (row) =>
      row.check_out_time
        ? new Date(row.check_out_time).toLocaleTimeString()
        : <span className="text-green-600 text-xs font-medium">Currently In</span>
    },
    { key: 'staff', label: 'Processed By', render: (row) =>
      row.staff_first_name ? `${row.staff_first_name} ${row.staff_last_name}` : '—'
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrevDate}
            disabled={availableDates.length === 0}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            ← Prev
          </button>

          <div className="text-sm font-medium">
            {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'No attendance selected'}
            {!isToday && <span className="ml-2 text-xs text-gray-500">(read-only)</span>}
          </div>

          <button
            type="button"
            onClick={onNextDate}
            disabled={availableDates.length === 0}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next →
          </button>
        </div>

        <div>
          <label className="sr-only">Select date</label>
          <select
            value={selectedDate || ''}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-sm border rounded px-3 py-1"
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

      <h3 className="text-sm font-semibold text-gray-800 mb-3">Attendance Log</h3>
      <DataTable
        columns={columns}
        data={attendance}
        loading={loading}
        onRowAction={(row) => !row.check_out_time && onCheckout(row)}
        actionLabel="Check Out"
      />
    </div>
  );
}