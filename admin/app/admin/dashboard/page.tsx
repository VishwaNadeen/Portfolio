"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "../components/RequireAuth";
import Link from "next/link";
import { Activity, Database, Globe, RefreshCcw } from "lucide-react";
import { adminLogout } from "../lib/adminApi";

type Health = {
  backend: boolean;
  database: boolean;
};

type Stats = {
  visits: number;
  lastSync: string | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function AdminDashboard() {
  const router = useRouter();
  const [health, setHealth] = useState<Health | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      setError(null);

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [healthRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/health`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }),
        fetch(`${API_BASE}/api/admin/stats`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      if (healthRes.status === 401 || statsRes.status === 401) {
        await adminLogout();
        router.replace("/admin/login");
        return;
      }

      if (!healthRes.ok) {
        throw new Error("Failed to load system health");
      }

      if (!statsRes.ok) {
        throw new Error("Failed to load dashboard stats");
      }

      const healthData: Health = await healthRes.json();
      const statsData: Stats = await statsRes.json();

      setHealth(healthData);
      setStats(statsData);
    } catch {
      setHealth({
        backend: false,
        database: false,
      });
      setStats({
        visits: 0,
        lastSync: null,
      });
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>

          <button
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500/30 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-cyan-500/30">
            <div className="flex items-center gap-2 text-slate-300">
              <Activity size={18} className="text-cyan-300" />
              <span className="font-medium">System Health</span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2">
                <span className="text-slate-300">Backend</span>
                <span
                  className={
                    loading
                      ? "text-slate-500"
                      : health?.backend
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {loading ? "Loading..." : health?.backend ? "Connected" : "Offline"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2">
                <span className="text-slate-300">Database</span>
                <span
                  className={
                    loading
                      ? "text-slate-500"
                      : health?.database
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {loading ? "Loading..." : health?.database ? "Connected" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-cyan-500/30">
            <div className="flex items-center gap-2 text-slate-300">
              <Database size={18} className="text-cyan-300" />
              <span className="font-medium">Site Visits</span>
            </div>

            <div className="mt-4 text-3xl font-bold text-white">
              {loading ? "..." : (stats?.visits ?? 0).toLocaleString()}
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Total portfolio visitors
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-cyan-500/30">
            <div className="flex items-center gap-2 text-slate-300">
              <RefreshCcw size={18} className="text-cyan-300" />
              <span className="font-medium">Last Sync</span>
            </div>

            <div className="mt-4 min-h-[40px] text-sm text-slate-200">
              {loading
                ? "Loading..."
                : stats?.lastSync
                ? new Date(stats.lastSync).toLocaleString()
                : "Not synced yet"}
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Latest GitHub data sync time
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 shadow-sm transition duration-300 hover:border-cyan-500/30">
          <div className="flex items-center gap-2 text-slate-300">
            <Globe size={18} className="text-cyan-300" />
            <span className="font-medium">Preview</span>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Open your public website in a new tab.
          </p>

          <Link
            href={"https://vishwanadeen.lk"}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 hover:shadow-[0_8px_25px_rgba(34,211,238,0.18)]"
          >
            View Website
          </Link>
        </div>
      </div>
    </RequireAuth>
  );
}