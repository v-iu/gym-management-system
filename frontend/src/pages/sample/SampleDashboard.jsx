/**
 * ============================================================
 *  SampleDashboard — Dashboard Overview (Reference)
 * ============================================================
 *
 *  Route: /sample (index route)
 *
 *  A placeholder dashboard with stat cards.
 *  In a real app, these would fetch from the backend.
 * ============================================================
 */

export default function SampleDashboard() {
  // Placeholder stats — replace with real API calls later
  const stats = [
    { label: "Total Members",    value: "—", icon: "👥" },
    { label: "Active Today",     value: "—", icon: "🏃" },
    { label: "Staff On Duty",    value: "—", icon: "🧑‍💼" },
    { label: "Revenue (Month)",  value: "—", icon: "💰" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-6">
        Sample dashboard — reference for how to build a control panel page.
      </p>

      {/* ── Stat Cards Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-sm">
        Connect these cards to your backend services to populate real data.
      </p>
    </div>
  );
}
