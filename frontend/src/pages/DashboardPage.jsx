import { useState, useEffect } from 'react';
import { api } from '../api';
import StatCard from '../components/StatCard';
import { Users, UserCog, CreditCard, ClipboardCheck, Receipt, Dumbbell } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('Dashboard/index');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Members',       value: stats?.total_members ?? 0,       icon: Users,          color: 'green' },
    { label: 'Total Staff',         value: stats?.total_staff ?? 0,         icon: UserCog,        color: 'green' },
    { label: 'Active Memberships',  value: stats?.active_memberships ?? 0,  icon: CreditCard,     color: 'green' },
    { label: "Today's Attendance",  value: stats?.today_attendance ?? 0,    icon: ClipboardCheck, color: 'green' },
    { label: 'Total Revenue',       value: `₱${(stats?.total_revenue ?? 0).toLocaleString()}`, icon: Receipt, color: 'green' },
    { label: 'Equipment',           value: stats?.total_equipment ?? 0,     icon: Dumbbell,       color: 'green' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">Dashboard</h1>
        <div className="inline-block mt-3
                        px-4 py-2 rounded-xl
                        bg-black/40 backdrop-blur-sm
                        border border-green-400/20
                        shadow-[0_0_15px_rgba(0,255,120,0.08)]">
        <p className="text-base text-green-300 tracking-wide">
        Overview of your gym operations
        </p>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            {...card}
            glass
          />
        ))}
      </div>
    </div>
  );
}

