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
        <div className="animate-spin w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Members',       value: stats?.total_members ?? 0,       icon: Users,          color: 'green' },
    { label: 'Total Staff',         value: stats?.total_staff ?? 0,         icon: UserCog,        color: 'blue' },
    { label: 'Active Memberships',  value: stats?.active_memberships ?? 0,  icon: CreditCard,     color: 'purple' },
    { label: "Today's Attendance",  value: stats?.today_attendance ?? 0,    icon: ClipboardCheck, color: 'amber' },
    { label: 'Total Revenue',       value: `₱${(stats?.total_revenue ?? 0).toLocaleString()}`, icon: Receipt, color: 'cyan' },
    { label: 'Equipment',           value: stats?.total_equipment ?? 0,     icon: Dumbbell,       color: 'rose' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your gym operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
