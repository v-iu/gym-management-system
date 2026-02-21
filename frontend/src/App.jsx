import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Memberships from './pages/Memberships';
import Users from './pages/UsersPage';
import Attendance from './pages/Attendance';
import Equipment from './pages/Equipment';
import Payments from './pages/Payments';
import TrainerServices from './pages/TrainerServices';
import TrainerSessions from './pages/TrainerSessions';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/memberships" element={<Memberships/>} />
        <Route path="/users" element={<ErrorBoundary><Users/></ErrorBoundary>} />
        <Route path="/attendance" element={<Attendance/>} />
        <Route path="/equipment" element={<Equipment/>} />
        <Route path="/payments" element={<ErrorBoundary><Payments/></ErrorBoundary>} />
        <Route path="/trainer-services" element={<TrainerServices/>} />
        <Route path="/trainer-sessions" element={<TrainerSessions/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
