export default function DataTable({ columns, data, loading, onRowAction, actionLabel = 'View' }) {
  if (loading) {
    return (
      <div className="rounded-xl
                      bg-black/40 backdrop-blur-md
                      border border-green-500/20
                      p-12 text-center">
        <div className="animate-spin w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-green-400/70 text-sm">Loading...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl
                      bg-black/40 backdrop-blur-md
                      border border-green-500/20
                      p-12 text-center">
        <p className="text-green-400/60 text-sm">No records found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden
                    bg-black/40 backdrop-blur-md
                    border border-green-500/20
                    shadow-[0_0_25px_rgba(0,255,120,0.08)]">

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="bg-black/60 border-b border-green-500/20">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-6 py-4 text-xs font-semibold text-green-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {onRowAction && <th className="px-6 py-4" />}
            </tr>
          </thead>

          <tbody className="divide-y divide-green-500/10">
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="hover:bg-green-500/5 transition-all duration-200"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-gray-300 whitespace-nowrap"
                  >
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}

                {onRowAction && (
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onRowAction(row)}
                      className="text-green-400 hover:text-green-300 text-xs font-medium"
                    >
                      {actionLabel}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

