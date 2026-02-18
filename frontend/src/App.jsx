/**
 * ============================================================
 *  Sample Router — Reference for React Router Setup
 * ============================================================
 *
 *  This file shows how to set up React Router for the app.
 *
 *  HOW TO INTEGRATE INTO YOUR APP:
 *  ───────────────────────────────
 *
 *  1. Install react-router-dom:
 *       npm install react-router-dom
 *
 *  2. In main.jsx, wrap <App /> with <BrowserRouter>:
 *
 *       import { BrowserRouter } from "react-router-dom";
 *       createRoot(document.getElementById('root')).render(
 *         <StrictMode>
 *           <BrowserRouter>
 *             <App />
 *           </BrowserRouter>
 *         </StrictMode>
 *       );
 *
 *  3. In App.jsx, replace the manual switch/case routing with
 *     React Router's <Routes> and <Route>, as shown below.
 *
 *  ROUTE STRUCTURE:
 *  ────────────────
 *    /                → HomePage
 *    /members         → MembersPage
 *    /staff           → StaffLoginPage
 *    /sample          → SampleCrudPage (sidebar layout) → SampleDashboard
 *    /sample/crud     → SampleCrudPage → SampleListPage
 *    /sample/crud/:id → SampleCrudPage → SampleDetailPage
 *    *                → NotFoundPage
 *
 *  KEY CONCEPTS:
 *  ─────────────
 *  <Route>     — maps a URL path to a component
 *  <Outlet />  — renders the matched child route inside a layout
 *  <Link to>   — navigates without page reload (replaces <a href>)
 *  useParams() — reads URL params like :id
 *  useNavigate() — programmatic navigation (like redirect)
 *
 * ============================================================
 */

import { Routes, Route, Navigate } from "react-router-dom";

// ─── Sample Reference (sidebar layout + nested pages) ──────
import SampleLayout from "./pages/SampleLayout";
import SampleDashboard from "./pages/sample/SampleDashboard";
import SampleListPage from "./pages/sample/SampleListPage";
import SampleDetailPage from "./pages/sample/SampleDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sample" replace />} />

      {/* ── Sample Reference (sidebar layout) ───────────────── */}

      {/*
        SampleLayout renders:  Sidebar  +  <Outlet />
        The sidebar stays mounted while child pages swap.

        /sample          → SampleDashboard  (dashboard with stat cards)
        /sample/crud     → SampleListPage   (CRUD list + form)
        /sample/crud/5   → SampleDetailPage (single item view)
      */}

      <Route path="/sample" element={<SampleLayout />}>
        <Route index element={<SampleDashboard />} />
        <Route path="crud" element={<SampleListPage />} />
        <Route path="crud/:id" element={<SampleDetailPage />} />
      </Route>

      {/* ── Catch-all (404) — TODO: create NotFoundPage ──── */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}
