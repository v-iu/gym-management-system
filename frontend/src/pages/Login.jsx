import { useState } from "react";
import { testStaff } from "../data/staff";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const user = testStaff.find((u) => u.email === email && u.password === password);
    if (user) setLoginMessage(`Welcome ${user.role} ${user.email}`);
    else setLoginMessage("Invalid email or password");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Staff Login</h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 rounded-lg p-6 bg-gray-800/30 backdrop-blur-sm shadow-lg border border-gray-700/40"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800/50 border border-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800/50 border border-gray-700/30 text-white placeholder-gray-400 backdrop-blur-sm"
          required
        />
        <button
          type="submit"
          className="bg-[#39FF14] text-black font-bold py-2 px-4 rounded hover:bg-green-400 transition-colors"
        >
          Login
        </button>
      </form>

      {loginMessage && (
        <p className="mt-4 text-center text-gray-400">{loginMessage}</p>
      )}
    </div>
  );
}

