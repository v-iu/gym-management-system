import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCog,
  ClipboardCheck,
  Dumbbell,
  Receipt,
  BookOpen,
  CalendarDays,
  UserPlus,
} from 'lucide-react';

const navItems = [
  { to: '/',                icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/memberships',    icon: CreditCard,      label: 'Memberships' },
  { to: '/users',         icon: UserPlus,        label: 'Users' },
  { to: '/attendance',     icon: ClipboardCheck,  label: 'Attendance' },
  { to: '/equipment',      icon: Dumbbell,        label: 'Equipment' },
  { to: '/payments',       icon: Receipt,         label: 'Payments' },
  { to: '/trainer-services', icon: BookOpen,      label: 'Trainer Services' },
  { to: '/trainer-sessions', icon: CalendarDays,  label: 'Trainer Sessions' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">GymFlow</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-l-3 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
