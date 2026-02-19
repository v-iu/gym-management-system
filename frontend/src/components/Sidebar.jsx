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
  { to: '/members',         icon: Users,           label: 'Members' },
  { to: '/memberships',     icon: CreditCard,      label: 'Memberships' },
  { to: '/staff',           icon: UserCog,         label: 'Staff' },
  { to: '/guests',          icon: UserPlus,        label: 'Guests' },
  { to: '/attendance',      icon: ClipboardCheck,  label: 'Attendance' },
  { to: '/equipment',       icon: Dumbbell,        label: 'Equipment' },
  { to: '/payments',        icon: Receipt,         label: 'Payments' },
  { to: '/trainer-services', icon: BookOpen,       label: 'Trainer Services' },
  { to: '/trainer-sessions', icon: CalendarDays,   label: 'Trainer Sessions' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-black/60 backdrop-blur-xl
          border-r border-green-500/20
          shadow-[0_0_30px_rgba(0,255,100,0.08)]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-green-500/20">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-400/30 shadow-[0_0_15px_rgba(0,255,120,0.3)]">
            <Dumbbell className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">
              GymFlow
            </h1>
            <p className="text-xs text-green-400/70">
              Management System
            </p>
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
    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-green-500/20 text-green-400 border-l-4 border-green-400 shadow-[0_0_10px_rgba(0,255,100,0.4)]'
        : 'text-gray-300 hover:bg-green-500/10 hover:text-green-400'
    }`
  }
>
  <Icon className="w-5 h-5 flex-shrink-0 transition-colors duration-200 group-hover:text-green-400" />
  <span>{label}</span>
</NavLink>

          ))}
        </nav>
      </aside>
    </>
  );
}

