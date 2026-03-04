"use client";

import RequireAuth from "../components/RequireAuth";

export default function AdminDashboard() {
  return (
    <RequireAuth>
      <div className="space-y-6">

        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Projects */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Total Projects</div>
            <div className="text-3xl font-bold mt-2">—</div>
          </div>

          {/* Visitors */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Visitors</div>
            <div className="text-3xl font-bold mt-2">—</div>
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">System Status</div>
            <div className="text-lg font-semibold mt-2 text-green-400">
              OK
            </div>
          </div>

        </div>

      </div>
    </RequireAuth>
  );
}