import { useState, useEffect } from 'react';
import { api } from '../api';
import StatCard from '../components/common/StatCard';
import { Users, UserCog, CreditCard, ClipboardCheck, Receipt, Dumbbell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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
                        px-4 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-green-500/20 shadow-sm">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-green-500/20 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue (Last 6 Months)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.revenue_chart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#22c55e', color: '#fff' }} />
                <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-green-500/20 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Attendance (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.attendance_chart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#22c55e', color: '#fff' }} />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
