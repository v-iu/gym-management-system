import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import MembershipsPage from './pages/MembershipsPage';
import StaffPage from './pages/StaffPage';
import GuestsPage from './pages/GuestsPage';
import AttendancePage from './pages/AttendancePage';
import EquipmentPage from './pages/EquipmentPage';
import PaymentsPage from './pages/PaymentsPage';
import TrainerServicesPage from './pages/TrainerServicesPage';
import TrainerSessionsPage from './pages/TrainerSessionsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/memberships" element={<MembershipsPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/guests" element={<GuestsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/trainer-services" element={<TrainerServicesPage />} />
        <Route path="/trainer-sessions" element={<TrainerSessionsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
