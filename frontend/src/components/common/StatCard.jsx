export default function StatCard({ label, value, icon: Icon, color = 'green' }) {
  // Map neon colors (subtle green glow effect)
  const colorMap = {
    green:  'bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(0,255,120,0.2)]',
    blue:   'bg-blue-500/10 text-blue-400 shadow-[0_0_10px_rgba(0,150,255,0.2)]',
    amber:  'bg-amber-500/10 text-amber-400 shadow-[0_0_10px_rgba(255,200,0,0.2)]',
    purple: 'bg-purple-500/10 text-purple-400 shadow-[0_0_10px_rgba(180,0,255,0.2)]',
    rose:   'bg-rose-500/10 text-rose-400 shadow-[0_0_10px_rgba(255,100,120,0.2)]',
    cyan:   'bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.2)]',
  };

  return (
    <div className="
      p-5 rounded-xl flex items-center gap-4
      bg-black/60 backdrop-blur-xl border border-green-500/20
      shadow-[0_0_15px_rgba(0,255,120,0.15)]
    ">
      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.green}`}>
        <Icon className="w-6 h-6" />
      </div>

      {/* Text */}
      <div>
        <p className="text-sm text-green-400/70">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
