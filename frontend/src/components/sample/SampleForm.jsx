/**
 * ============================================================
 *  SampleForm — Reusable Create/Edit Form Component
 * ============================================================
 *
 *  Props:
 *    form       — { first_name, last_name, email, phone }
 *    errors     — { name?, email?, phone? } from backend validation
 *    editId     — null (creating) or number (editing)
 *    onChange   — called when any input changes
 *    onSubmit   — called on form submit
 *    onCancel   — called to cancel editing
 *
 *  This component owns ZERO state — it's fully controlled by
 *  its parent, making it reusable across different pages.
 * ============================================================
 */

export default function SampleForm({
  form,
  errors = {},
  editId,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 p-4 rounded-lg bg-gray-800/40 backdrop-blur-sm border border-gray-700"
    >
      <h2 className="text-lg font-semibold mb-4 text-white">
        {editId ? `Editing Item #${editId}` : "Create New Item"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={onChange}
            className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={onChange}
            className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
        >
          {editId ? "Update" : "Create"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
