"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "../components/RequireAuth";
import Image from "next/image";
import ProjectUpdate from "./ProjectUpdate";

import {
  adminGetProjects,
  adminSyncGitHub,
  adminUpdateProject,
  adminLogout,
  adminUploadProjectImage,
  adminRemoveProjectImage,
  type AdminGitHubProject,
} from "../lib/adminApi";

import {
  FolderKanban,
  Eye,
  Star,
  RefreshCcw,
  Pencil,
  ArrowUpDown,
  Monitor,
  Layers3,
} from "lucide-react";

export default function AdminProjectsPage() {
  const router = useRouter();

  const [items, setItems] = useState<AdminGitHubProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<AdminGitHubProject | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    load();
  }, []);

  const visibleCount = useMemo(
    () => items.filter((p) => !p.isHidden && !p.isPrivate).length,
    [items]
  );

  const featuredCount = useMemo(
    () => items.filter((p) => p.featured).length,
    [items]
  );

  const hiddenCount = useMemo(
    () => items.filter((p) => p.isHidden).length,
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

    try {
      const updated = await adminUpdateProject(editing._id, {
        customTitle: editing.customTitle || "",
        customDescription: editing.customDescription || "",
      });

      setItems((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      setEditing(null);
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(projectId: string, file: File) {
    setUploadingImage(true);
    setError(null);

    try {
      const updated = await adminUploadProjectImage(projectId, file);
      setItems((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setEditing((prev) => (prev && prev._id === updated._id ? updated : prev));
    } catch {
      setError("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleImageRemove(projectId: string) {
    setUploadingImage(true);
    setError(null);

    try {
      const updated = await adminRemoveProjectImage(projectId);
      setItems((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setEditing((prev) => (prev && prev._id === updated._id ? updated : prev));
    } catch {
      setError("Image remove failed");
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <RequireAuth>
      <div className="relative space-y-4 px-3 sm:space-y-6 sm:px-0">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 left-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl sm:-top-20 sm:h-64 sm:w-64 md:h-72 md:w-72" />
          <div className="absolute right-0 top-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />
          <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-sky-500/5 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />
        </div>

        {/* top hero */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-3xl sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

          <div className="relative flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 min-w-0">
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
                  Projects
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                  Manage visibility, featured state, display order, and custom
                  project details.
                </p>
              </div>
            </div>

            <div className="flex w-full lg:w-auto">
              <button
                onClick={doSync}
                disabled={syncing}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/90 to-blue-500/90 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 lg:w-auto"
              >
                <RefreshCcw
                  className={`h-4 w-4 transition-transform duration-500 ${
                    syncing ? "animate-spin" : "group-hover:rotate-180"
                  }`}
                />
                {syncing ? "Syncing..." : "Sync GitHub"}
              </button>
            </div>
          </div>
        </section>

        {/* stats cards */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.06] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
                  Total Projects
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {items.length}
                </h3>
              </div>
              <div className="shrink-0 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                <FolderKanban className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.06] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
                  Visible Public
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {visibleCount}
                </h3>
              </div>
              <div className="shrink-0 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300">
                <Eye className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/20 hover:bg-white/[0.06] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
                  Featured
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {featuredCount}
                </h3>
              </div>
              <div className="shrink-0 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-amber-300">
                <Star className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/20 hover:bg-white/[0.06] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
                  Hidden
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {hiddenCount}
                </h3>
              </div>
              <div className="shrink-0 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-3 text-yellow-300">
                <Layers3 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="animate-in fade-in slide-in-from-top-1 rounded-2xl border border-red-900/40 bg-red-950/30 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* desktop/table */}
        <section className="hidden overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl md:block">
          <div className="border-b border-white/10 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  Project Records
                </h2>
                <p className="text-sm text-slate-400">
                  Review and control all synced GitHub projects.
                </p>
              </div>

              <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 sm:w-auto">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Ordered by display priority
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center px-4 text-center">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                Loading projects...
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-[0.15em] text-slate-400">
                  <tr className="border-b border-white/10">
                    <th className="p-4 font-medium">Project</th>
                    <th className="p-4 font-medium">Featured</th>
                    <th className="p-4 font-medium">Visibility</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-slate-200">
                  {items.map((p) => (
                    <tr
                      key={p._id}
                      className="group border-b border-white/5 transition-colors duration-300 hover:bg-white/[0.03]"
                    >
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="relative h-16 w-24 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                            <Image
                              src={
                                p.imageUrl ||
                                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                              }
                              alt={p.customTitle || p.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="truncate font-semibold text-white">
                                {p.customTitle || p.name}
                              </div>
                              {p.featured && (
                                <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                                  Featured
                                </span>
                              )}
                            </div>

                            <div className="mt-1 break-all text-xs text-slate-400">
                              {p.fullName}
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                              {p.type && (
                                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-blue-200">
                                  {p.type}
                                </span>
                              )}
                              {p.platform && (
                                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-violet-200">
                                  {p.platform}
                                </span>
                              )}
                              {p.liveUrl && (
                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-200">
                                  Live URL
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => quickToggle(p._id, { featured: !p.featured })}
                          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                            p.featured
                              ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/20"
                              : "border-slate-800 bg-slate-900/50 text-slate-200 hover:bg-slate-800/70"
                          }`}
                        >
                          <Star className="h-3.5 w-3.5" />
                          {p.featured ? "Yes" : "No"}
                        </button>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => quickToggle(p._id, { isHidden: !p.isHidden })}
                          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                            p.isHidden
                              ? "border-yellow-500/30 bg-yellow-500/15 text-yellow-200 hover:bg-yellow-500/20"
                              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15"
                          }`}
                        >
                          <Monitor className="h-3.5 w-3.5" />
                          {p.isHidden ? "Hidden" : "Visible"}
                        </button>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setEditing({ ...p })}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-slate-800/80"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <FolderKanban className="h-6 w-6 text-slate-300" />
                          </div>
                          <p className="text-sm">No projects yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* mobile/cards */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl md:hidden">
          <div className="border-b border-white/10 px-4 py-4">
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Project Records
                </h2>
                <p className="text-sm text-slate-400">
                  Review and control all synced GitHub projects.
                </p>
              </div>

              <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Ordered by display priority
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center px-4 text-center">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                Loading projects...
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-3">
              {items.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                      <Image
                        src={
                          p.imageUrl ||
                          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                        }
                        alt={p.customTitle || p.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="min-w-0 truncate font-semibold text-white">
                          {p.customTitle || p.name}
                        </div>
                        {p.featured && (
                          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="mt-1 break-all text-xs text-slate-400">
                        {p.fullName}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                        {p.type && (
                          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-blue-200">
                            {p.type}
                          </span>
                        )}
                        {p.platform && (
                          <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-violet-200">
                            {p.platform}
                          </span>
                        )}
                        {p.liveUrl && (
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-200">
                            Live URL
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <button
                      onClick={() => quickToggle(p._id, { featured: !p.featured })}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-300 ${
                        p.featured
                          ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/20"
                          : "border-slate-800 bg-slate-900/50 text-slate-200 hover:bg-slate-800/70"
                      }`}
                    >
                      <Star className="h-3.5 w-3.5" />
                      {p.featured ? "Yes" : "No"}
                    </button>

                    <button
                      onClick={() => quickToggle(p._id, { isHidden: !p.isHidden })}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-300 ${
                        p.isHidden
                          ? "border-yellow-500/30 bg-yellow-500/15 text-yellow-200 hover:bg-yellow-500/20"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15"
                      }`}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                      {p.isHidden ? "Hidden" : "Visible"}
                    </button>

                    <button
                      onClick={() => setEditing({ ...p })}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:border-cyan-400/30 hover:bg-slate-800/80"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="p-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <FolderKanban className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-sm">No projects yet.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <ProjectUpdate
          editing={editing}
          setEditing={setEditing}
          saveEdit={saveEdit}
          saving={saving}
          handleImageUpload={handleImageUpload}
          handleImageRemove={handleImageRemove}
        />
      </div>
    </RequireAuth>
  );
}