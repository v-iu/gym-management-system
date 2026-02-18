/**
 * ============================================================
 *  Sidebar — Admin Panel Navigation (Reference Component)
 * ============================================================
 *
 *  A persistent sidebar that uses React Router's <NavLink>
 *  for active-link highlighting. Fully stateless — just
 *  renders the nav items and lets the router handle the rest.
 *
 *  <NavLink> vs <Link>:
 *    <Link>    — basic navigation, no active styling
 *    <NavLink> — same as Link, but adds an "active" class/callback
 *               when the current URL matches. Perfect for sidebars.
 *
 *  Props:
 *    collapsed — boolean, toggles between wide and icon-only mode
 *    onToggle  — callback to toggle collapsed state
 * ============================================================
 */

import { NavLink } from "react-router-dom";

// ─── Sidebar nav items config ──────────────────────────────
// Add new pages here — the sidebar renders them automatically.
const NAV_ITEMS = [
  { to: "/sample",          label: "Dashboard",  icon: "📊" },
  { to: "/sample/crud",     label: "CRUD Demo",  icon: "🧪" },
  { to: "/sample/members",  label: "Members",    icon: "👥" },
  { to: "/sample/staff",    label: "Staff",      icon: "🧑‍💼" },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`
        ${collapsed ? "w-16" : "w-56"}
        bg-gray-900/80 backdrop-blur-sm border-r border-gray-800
        flex flex-col transition-all duration-300 shrink-0
      `}
    >
      {/* ── Header / Toggle ───────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-gray-800">
        {!collapsed && (
          <span className="text-sm font-bold text-green-400 tracking-wider">
            CONTROL PANEL
          </span>
        )}
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors p-1"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* ── Nav Links ─────────────────────────────────────── */}
      <nav className="flex-1 py-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/sample"} // "end" = exact match for dashboard only
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-sm transition-colors
              ${
                isActive
                  ? "text-green-400 bg-green-400/10 border-r-2 border-green-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ────────────────────────────────────────── */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-gray-800 text-xs text-gray-600">
          Gym Management v1.0
        </div>
      )}
    </aside>
  );
}
