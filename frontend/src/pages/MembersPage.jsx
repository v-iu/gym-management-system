const testMembers = []; 

export default function MembersPage() {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border border-green-400/40 shadow-[0_0_8px_rgba(0,255,120,0.3)]";
      case "paused":
        return "bg-amber-500/20 text-amber-400 border border-amber-400/40 shadow-[0_0_8px_rgba(255,200,0,0.3)]";
      case "inactive":
      case "suspended":
        return "bg-rose-500/20 text-rose-400 border border-rose-400/40 shadow-[0_0_8px_rgba(255,100,120,0.3)]";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-400/40";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Members
        </h1>
        <div className="inline-block mt-3
                        px-4 py-2 rounded-xl
                        bg-black/40 backdrop-blur-sm
                        border border-green-400/20
                        shadow-[0_0_15px_rgba(0,255,120,0.08)]">
        <p className="text-base text-green-300 tracking-wide">
        Manage and monitor all registered gym members
        </p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden
                      bg-black/40 backdrop-blur-md
                      border border-green-500/20
                      shadow-[0_0_25px_rgba(0,255,120,0.08)]">

        <table className="min-w-full text-sm">

          {/* Table Head */}
          <thead className="bg-black/60 text-green-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Membership</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-green-500/10">
            {testMembers.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-green-500/5 transition-all duration-200"
              >
                <td className="px-6 py-4 text-white font-medium">
                  {member.firstName} {member.lastName}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {member.email}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {member.phone}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {member.membershipType}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      member.membershipStatus
                    )}`}
                  >
                    {member.membershipStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

