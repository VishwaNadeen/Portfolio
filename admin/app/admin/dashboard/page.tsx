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

  const loadDashboard = useCallback(
    async (isRefresh = false) => {
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

        if (!healthRes.ok) throw new Error("Failed to load system health");
        if (!statsRes.ok) throw new Error("Failed to load dashboard stats");

        setHealth(await healthRes.json());
        setStats(await statsRes.json());
      } catch {
        setHealth({ backend: false, database: false });
        setStats({ visits: 0, lastSync: null });
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <RequireAuth>
      <>
        <style>{`
          @keyframes db-spin { to { transform: rotate(360deg); } }

          @keyframes db-fadein {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          @keyframes db-pulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
            50% { opacity: 0.7; box-shadow: 0 0 0 4px transparent; }
          }
        `}</style>

        <div
          className="flex flex-col gap-4 font-sans"
          style={{ animation: "db-fadein 0.22s ease" }}
        >
          {/* ── HEADER ── */}
          <div className="relative overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[24px] py-[20px] transition-[border-color,box-shadow] duration-200 hover:border-[#2a4060] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            {/* top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,#1e40af,#0ea5e9,transparent)",
                opacity: 0.7,
              }}
            />
            {/* dot grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.025,
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                pointerEvents: "none",
              }}
            />

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-[10px] font-mono text-[10px] tracking-[0.18em] text-[#3a5570]">
                  ADMIN / DASHBOARD
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[7px] border border-[#1d4ed850] bg-[#0c1e3a] shadow-[0_0_16px_#1d4ed825]">
                    <Activity size={17} color="#60a5fa" />
                  </div>
                  <div>
                    <h1 className="m-0 text-[20px] font-bold leading-[1.2] text-[#e2e8f0]">
                      Dashboard
                    </h1>
                    <p className="mt-[3px] text-[13px] text-[#4a6680]">
                      System overview and site metrics
                    </p>
                  </div>
                </div>
              </div>

              <button
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-[6px] border border-[#1a2d46] bg-[#07111f] px-[18px] py-[8px] text-[13px] font-medium text-[#5a7090] transition-all duration-150 hover:border-[#2a4060] hover:bg-[#0a1628] hover:text-[#94a3b8] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => loadDashboard(true)}
                disabled={refreshing}
              >
                <RefreshCcw
                  size={14}
                  style={refreshing ? { animation: "db-spin 0.8s linear infinite" } : undefined}
                />
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          {/* ── ERROR ── */}
          {error && (
            <div className="flex items-center gap-[10px] rounded-[6px] border border-[#7f1d1d60] bg-[#1a0808] px-[16px] py-[11px]">
              <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#ef4444]" />
              <span className="text-[13px] text-[#fca5a5]">{error}</span>
            </div>
          )}

          {/* ── METRIC CARDS ROW ── */}
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {/* — System Health — */}
            <div className="relative overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[20px] py-[18px] transition-[border-color,box-shadow] duration-200 hover:border-[#2a4060] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              {/* cyan top shimmer */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background:
                    "linear-gradient(90deg,transparent,#38bdf870,transparent)",
                }}
              />

              <div className="mb-4 flex items-center gap-[9px]">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] border border-[#0ea5e940] bg-[#0c1f30]">
                  <Activity size={14} color="#38bdf8" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#3a5570]">
                    SYSTEM_HEALTH
                  </div>
                  <div className="mt-[1px] text-[14px] font-semibold text-[#94a3b8]">
                    System Health
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {/* Backend */}
                <div className="flex items-center justify-between rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[13px] py-[9px]">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: loading
                          ? "#334155"
                          : health?.backend
                          ? "#4ade80"
                          : "#ef4444",
                        animation: "db-pulse 2.4s ease-in-out infinite",
                      }}
                    />
                    <span className="text-[13px] text-[#94a3b8]">Backend</span>
                  </div>
                  <span
                    className={`font-mono text-[11px] font-medium ${
                      loading
                        ? "text-[#3a5570]"
                        : health?.backend
                        ? "text-[#4ade80]"
                        : "text-[#f87171]"
                    }`}
                  >
                    {loading ? "checking…" : health?.backend ? "CONNECTED" : "OFFLINE"}
                  </span>
                </div>

                {/* Database */}
                <div className="flex items-center justify-between rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[13px] py-[9px]">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: loading
                          ? "#334155"
                          : health?.database
                          ? "#4ade80"
                          : "#ef4444",
                        animation: "db-pulse 2.4s ease-in-out infinite",
                      }}
                    />
                    <span className="text-[13px] text-[#94a3b8]">Database</span>
                  </div>
                  <span
                    className={`font-mono text-[11px] font-medium ${
                      loading
                        ? "text-[#3a5570]"
                        : health?.database
                        ? "text-[#4ade80]"
                        : "text-[#f87171]"
                    }`}
                  >
                    {loading ? "checking…" : health?.database ? "CONNECTED" : "OFFLINE"}
                  </span>
                </div>
              </div>
            </div>

            {/* — Site Visits — */}
            <div className="relative overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[20px] py-[18px] transition-[border-color,box-shadow] duration-200 hover:border-[#2a4060] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              {/* green top shimmer */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background:
                    "linear-gradient(90deg,transparent,#4ade8070,transparent)",
                }}
              />

              <div className="mb-4 flex items-center gap-[9px]">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] border border-[#22c55e40] bg-[#061510]">
                  <Database size={14} color="#4ade80" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#3a5570]">
                    SITE_VISITS
                  </div>
                  <div className="mt-[1px] text-[14px] font-semibold text-[#94a3b8]">
                    Site Visits
                  </div>
                </div>
              </div>

              <div className="mb-2 font-mono text-[36px] font-semibold leading-[1] text-[#e2e8f0]">
                {loading ? (
                  <span className="text-[#2a4060]">—</span>
                ) : (
                  (stats?.visits ?? 0).toLocaleString()
                )}
              </div>

              <div className="text-[12px] text-[#4a6680]">
                Total portfolio visitors
              </div>
            </div>

            {/* — Last Sync — */}
            <div className="relative overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[20px] py-[18px] transition-[border-color,box-shadow] duration-200 hover:border-[#2a4060] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              {/* amber top shimmer */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background:
                    "linear-gradient(90deg,transparent,#fbbf2470,transparent)",
                }}
              />

              <div className="mb-4 flex items-center gap-[9px]">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] border border-[#f59e0b40] bg-[#141008]">
                  <RefreshCcw size={14} color="#fbbf24" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#3a5570]">
                    LAST_SYNC
                  </div>
                  <div className="mt-[1px] text-[14px] font-semibold text-[#94a3b8]">
                    Last Sync
                  </div>
                </div>
              </div>

              <div className="mb-2 text-[14px] font-medium leading-[1.5] text-[#cbd5e1]">
                {loading ? (
                  <span className="text-[#3a5570]">Loading…</span>
                ) : stats?.lastSync ? (
                  new Date(stats.lastSync).toLocaleString()
                ) : (
                  <span className="text-[#3a5570]">Not synced yet</span>
                )}
              </div>

              <div className="text-[12px] text-[#4a6680]">
                Latest GitHub data sync time
              </div>
            </div>
          </div>

          {/* ── PREVIEW PANEL ── */}
          <div className="relative overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[24px] py-[20px] transition-[border-color,box-shadow] duration-200 hover:border-[#2a4060] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            {/* blue top shimmer */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,#3b82f670,transparent)",
              }}
            />

            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <div className="mb-[10px] flex items-center gap-[9px]">
                  <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] border border-[#3b82f640] bg-[#0c1e3a]">
                    <Globe size={14} color="#60a5fa" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] text-[#3a5570]">
                      PORTFOLIO_PREVIEW
                    </div>
                    <div className="mt-[1px] text-[14px] font-semibold text-[#94a3b8]">
                      Preview
                    </div>
                  </div>
                </div>

                <p className="m-0 max-w-[400px] text-[13px] leading-[1.6] text-[#4a6680]">
                  Open your public portfolio website in a new tab to review live
                  changes.
                </p>
              </div>

              <Link
                href="https://vishwanadeen.lk"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-[6px] border border-[#3b82f680] bg-[linear-gradient(135deg,#1e3a8a,#1d4ed8_55%,#0369a1)] px-[22px] py-[9px] text-[13px] font-semibold text-[#dbeafe] no-underline shadow-[0_0_24px_#1d4ed830,inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_0_36px_#1d4ed850]"
              >
                <Globe size={14} />
                View Website
              </Link>
            </div>
          </div>
        </div>
      </>
    </RequireAuth>
  );
}