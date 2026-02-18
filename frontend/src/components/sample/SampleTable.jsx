/**
 * ============================================================
 *  SampleTable — Reusable Data Table Component
 * ============================================================
 *
 *  Props:
 *    items    — Array of objects to display
 *    loading  — Boolean, show loading state
 *    onEdit   — (item) => void, called when Edit is clicked
 *    onDelete — (id) => void, called when Delete is clicked
 *
 *  Stateless — just renders whatever data it receives.
 * ============================================================
 */

import { Link } from "react-router-dom";

export default function SampleTable({ items, loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="text-gray-400">Loading…</p>;
  }

  return (
    <table className="min-w-full rounded-lg overflow-hidden bg-gray-800/30 backdrop-blur-sm shadow-lg">
      <thead className="bg-gray-900/50 text-gray-300 text-left">
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Phone</th>
          <th className="px-4 py-2">Created</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
              No items found. Create one above.
            </td>
          </tr>
        ) : (
          items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-2 text-gray-400">{item.id}</td>
              <td className="px-4 py-2 text-white">
                {/* Link to the detail/view page — demonstrates React Router <Link> */}
                <Link
                  to={`/sample/${item.id}`}
                  className="hover:text-green-400 underline transition-colors"
                >
                  {item.first_name} {item.last_name}
                </Link>
              </td>
              <td className="px-4 py-2 text-gray-300">{item.email}</td>
              <td className="px-4 py-2 text-gray-300">{item.phone}</td>
              <td className="px-4 py-2 text-gray-400 text-sm">
                {item.created_at}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
