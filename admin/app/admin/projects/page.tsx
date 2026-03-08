"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RequireAuth from "../components/RequireAuth";
import {
  adminGetProjects,
  adminLogout,
  adminSyncGitHub,
  adminUpdateProject,
  type AdminGitHubProject,
} from "../lib/adminApi";

export default function AdminProjectsPage() {
  const router = useRouter();

  const [items, setItems] = useState<AdminGitHubProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<AdminGitHubProject | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const data = await adminGetProjects();
      setItems(data);
    } catch (e: any) {
      if (String(e?.message).toUpperCase().includes("UNAUTHORIZED")) {
        adminLogout();
        router.replace("/admin/login");
        return;
      }
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    load();
  }, []);

  const visibleCount = useMemo(
    () => items.filter((p) => !p.isHidden && !p.isPrivate).length,
    [items]
  );

  async function doSync() {
    setSyncing(true);
    setError(null);

    try {
      await adminSyncGitHub();
      await load();
    } catch {
      setError("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function quickToggle(id: string, patch: Partial<AdminGitHubProject>) {
    setItems((prev) => prev.map((p) => (p._id === id ? { ...p, ...patch } : p)));

    try {
      await adminUpdateProject(id, patch);
    } catch {
      setError("Update failed");
      await load();
    }
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    setSaving(true);
    setError(null);

    try {
      const updated = await adminUpdateProject(editing._id, {
        featured: editing.featured,
        isHidden: editing.isHidden,
        displayOrder: editing.displayOrder,
        customTitle: editing.customTitle || "",
        customDescription: editing.customDescription || "",
        liveUrl: editing.liveUrl || "",
        type: editing.type || "",
        platform: editing.platform || "",
      });

      setItems((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setEditing(null);
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    adminLogout();
    router.replace("/admin/login");
  }

  return (
    <RequireAuth>
      <div className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">Projects</h1>
            <p className="text-sm text-slate-400">
              Total: {items.length} • Visible (public): {visibleCount}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={doSync}
              disabled={syncing}
              className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800/60 disabled:opacity-60"
            >
              {syncing ? "Syncing..." : "Sync GitHub"}
            </button>

            <Link
              href="/admin/projects/new"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              + New Project
            </Link>

            <button
              onClick={logout}
              className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800/60"
            >
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-2">
          {loading ? (
            <div className="p-6 text-slate-300">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-400">
                  <tr className="border-b border-slate-800">
                    <th className="p-3">Project</th>
                    <th className="p-3">Stars</th>
                    <th className="p-3">Featured</th>
                    <th className="p-3">Hidden</th>
                    <th className="p-3">Order</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-slate-200">
                  {items.map((p) => (
                    <tr key={p._id} className="border-b border-slate-900/60">
                      <td className="p-3">
                        <div className="font-semibold text-white">
                          {p.customTitle || p.name}
                        </div>
                        <div className="text-xs text-slate-400">{p.fullName}</div>
                      </td>

                      <td className="p-3">{p.stars}</td>

                      <td className="p-3">
                        <button
                          onClick={() => quickToggle(p._id, { featured: !p.featured })}
                          className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                            p.featured
                              ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/30"
                              : "bg-slate-900/40 text-slate-200 border border-slate-800"
                          }`}
                        >
                          {p.featured ? "Yes" : "No"}
                        </button>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => quickToggle(p._id, { isHidden: !p.isHidden })}
                          className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                            p.isHidden
                              ? "bg-yellow-500/15 text-yellow-200 border border-yellow-500/30"
                              : "bg-slate-900/40 text-slate-200 border border-slate-800"
                          }`}
                        >
                          {p.isHidden ? "Hidden" : "Visible"}
                        </button>
                      </td>

                      <td className="p-3">{p.displayOrder}</td>

                      <td className="p-3">
                        <button
                          onClick={() => setEditing({ ...p })}
                          className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800/60"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td className="p-6 text-slate-400" colSpan={6}>
                        No projects yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
            <form
              onSubmit={saveEdit}
              className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Edit Project</h2>
                  <p className="text-xs text-slate-400">{editing.fullName}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-1 text-xs text-white"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 space-y-3">

                {/* NEW FIELD */}
                <label className="block text-xs text-slate-400">
                  Project Type
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-white"
                    value={editing.type || ""}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, type: e.target.value } : prev
                      )
                    }
                  />
                </label>

                {/* NEW FIELD */}
                <label className="block text-xs text-slate-400">
                  Platform
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-white"
                    value={editing.platform || ""}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, platform: e.target.value } : prev
                      )
                    }
                  />
                </label>

                <label className="block text-xs text-slate-400">
                  Custom Title
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-white"
                    value={editing.customTitle || ""}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, customTitle: e.target.value } : prev
                      )
                    }
                  />
                </label>

                <label className="block text-xs text-slate-400">
                  Custom Description
                  <textarea
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-white"
                    rows={4}
                    value={editing.customDescription || ""}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, customDescription: e.target.value } : prev
                      )
                    }
                  />
                </label>

                <label className="block text-xs text-slate-400">
                  Live URL
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-white"
                    value={editing.liveUrl || ""}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, liveUrl: e.target.value } : prev
                      )
                    }
                  />
                </label>

                <label className="block text-xs text-slate-400">
                  Display Order
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-white"
                    value={editing.displayOrder}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, displayOrder: Number(e.target.value) } : prev
                      )
                    }
                  />
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-white"
                >
                  Cancel
                </button>

                <button
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}