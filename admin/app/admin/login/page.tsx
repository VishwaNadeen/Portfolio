"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "../lib/adminApi";

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
      await adminLogin(username, password);
      router.push("/admin/dashboard");
    } catch (error: any) {
      if (error?.message === "INVALID_CREDENTIALS") {
        setErr("Invalid username or password");
      } else {
        setErr(error?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[18%] h-52 w-52 -translate-x-1/2 animate-pulse rounded-full bg-cyan-500/10 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />
        <div className="absolute bottom-[12%] left-[18%] h-44 w-44 animate-pulse rounded-full bg-blue-500/10 blur-3xl sm:h-56 sm:w-56 md:h-64 md:w-64" />
        <div className="absolute right-[14%] top-[22%] h-40 w-40 animate-pulse rounded-full bg-sky-400/10 blur-3xl sm:h-48 sm:w-48 md:h-56 md:w-56" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative w-full max-w-md animate-[fadeUp_.7s_ease-out]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-6 md:p-8">
          <div className="mb-5 flex justify-center sm:mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-medium tracking-wide text-cyan-300 sm:text-xs">
              Portfolio Admin
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to manage projects
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4 sm:mt-8">
            <div className="group">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.08)] sm:text-base"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="group">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.08)] sm:text-base"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {err && (
              <div className="animate-[shake_.3s_ease-in-out] rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {err}
              </div>
            )}

            <button
              disabled={loading}
              className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(34,211,238,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">
                {loading ? "Signing in..." : "Login"}
              </span>
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(4px);
          }
          75% {
            transform: translateX(-3px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </main>
  );
}