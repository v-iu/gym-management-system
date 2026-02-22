import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';

export default function TopBar({ onMenuClick }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('users/logout');
    } catch (e) { /* ignore */ }
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
<header className="sticky top-0 z-30 bg-black/60 backdrop-blur-xl border-b border-green-500/20 shadow-[0_0_20px_rgba(0,255,120,0.15)] px-4 lg:px-6 py-3">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="
              lg:hidden p-2 rounded-xl
              text-gray-300
              hover:bg-green-500/10
              hover:text-green-400
              transition-all duration-200
            "
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Admin Panel
            </h2>
            <p className="text-xs text-green-400/70">
              Gym Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
          
          {/* Avatar */}
        <div className="
          w-9 h-9
          bg-green-500/15
          text-green-400
          rounded-full
          flex items-center justify-center
          text-sm font-semibold
          border border-green-400/30
          shadow-[0_0_12px_rgba(0,255,120,0.25)]
        ">
          A
        </div>
        </div>
      </div>
    </header>
  );
}
