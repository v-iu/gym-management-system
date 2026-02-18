import { testMembers } from "../data/members";

export default function MembersPage() {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-600 text-green-100";
      case "paused":
        return "bg-yellow-500 text-yellow-900";
      case "inactive":
      case "suspended":
        return "bg-red-600 text-red-100";
      default:
        return "bg-gray-500 text-gray-100";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Gym Members</h1>

      <table className="min-w-full rounded-lg overflow-hidden bg-gray-800/30 backdrop-blur-sm shadow-lg">
        <thead className="bg-gray-900/50 text-gray-300 text-left">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Membership</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {testMembers.map((member) => (
            <tr
              key={member.id}
              className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-2 text-white">
                {member.firstName} {member.lastName}
              </td>
              <td className="px-4 py-2 text-gray-300">{member.email}</td>
              <td className="px-4 py-2 text-gray-300">{member.phone}</td>
              <td className="px-4 py-2 text-gray-300">{member.membershipType}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(
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
  );
}

