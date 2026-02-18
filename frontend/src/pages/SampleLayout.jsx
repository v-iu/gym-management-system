/**
 * ============================================================
 *  SAMPLE PAGE — REFERENCE (Sidebar Layout)
 * ============================================================
 *
 *  This is a layout component that renders a sidebar + content
 *  area using React Router's <Outlet />.
 *
 *  Everything lives under /sample:
 *    /sample          → SampleDashboard  (dashboard overview)
 *    /sample/crud     → SampleListPage   (CRUD list + form)
 *    /sample/crud/:id → SampleDetailPage (single item view)
 *    /sample/members  → placeholder
 *    /sample/staff    → placeholder
 *
 *  Visual layout:
 *    ┌──────────┬──────────────────────────────────────┐
 *    │          │                                      │
 *    │ Sidebar  │   <Outlet />  (child route content)  │
 *    │          │                                      │
 *    │ Dashboard│   Swaps based on URL                 │
 *    │ CRUD Demo│                                      │
 *    │ Members  │                                      │
 *    │ Staff    │                                      │
 *    │          │                                      │
 *    └──────────┴──────────────────────────────────────┘
 *
 *  File map:
 *    components/Sidebar.jsx               — collapsible sidebar nav
 *    services/CrudService.js              — OOP API wrapper
 *    components/sample/SampleForm.jsx     — stateless form
 *    components/sample/SampleTable.jsx    — stateless table
 *    components/sample/MessageBanner.jsx  — auto-hiding banner
 *    pages/sample/SampleDashboard.jsx     — dashboard with stat cards
 *    pages/sample/SampleListPage.jsx      — CRUD list + logic
 *    pages/sample/SampleDetailPage.jsx    — single-item view
 *    pages/SampleCrudPage.jsx             — THIS FILE (sidebar layout)
 * ============================================================
 */

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function SampleLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B0F0C] text-white">
      {/* ── Sidebar (persistent across all /sample/* routes) ── */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
