"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "../../../lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const data = await adminLogin(username, password);
      localStorage.setItem("admin_token", data.token);
      router.push("/admin/dashboard");
    } catch {
      setErr("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950/50 p-6 backdrop-blur"
      >
        <h1 className="text-xl font-semibold text-white">Admin Login</h1>
        <p className="text-sm text-slate-400 mt-1">Sign in to manage projects</p>

        <div className="mt-5 space-y-3">
          <input
            className="w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-white outline-none focus:border-cyan-500/50"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            className="w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-white outline-none focus:border-cyan-500/50"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {err && <div className="text-sm text-red-400">{err}</div>}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </form>
    </main>
  );
}