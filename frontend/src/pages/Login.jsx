import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { Dumbbell } from "lucide-react";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("users/login", { email, password });
      if (res.success) {
        localStorage.setItem("user", JSON.stringify(res.user));
        navigate("/");
      }
    } catch (err) {
      setError(err.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-2xl shadow-[0_0_40px_rgba(0,255,120,0.1)] p-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl border border-green-400/30 shadow-[0_0_15px_rgba(0,255,120,0.3)] mb-4">
            <Dumbbell className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">GymFlow</h1>
          <p className="text-green-400/70 text-sm">Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                placeholder="admin@gym.com"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold shadow-[0_0_20px_rgba(0,255,120,0.3)] hover:shadow-[0_0_30px_rgba(0,255,120,0.5)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
