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
  EyeOff,
  AlertTriangle,
} from "lucide-react";

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";

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
      <>
        <style>{`
          @keyframes ap-spin { to { transform: rotate(360deg); } }
          .ap-spin { animation: ap-spin 0.8s linear infinite; }
        `}</style>

        <div className="flex flex-col gap-4 font-sans">
          {/* ── HEADER ── */}
          <div className="relative overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[20px] py-[18px] md:px-[24px] md:py-[20px]">
            <div
              className="absolute left-0 right-0 top-0 h-px opacity-70"
              style={{
                background:
                  "linear-gradient(90deg,transparent,#1e40af,#0ea5e9,transparent)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-[10px] font-mono text-[10px] tracking-[0.18em] text-[#3a5570]">
                  ADMIN / PROJECTS
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[7px] border border-[#1d4ed850] bg-[#0c1e3a] shadow-[0_0_16px_#1d4ed825]">
                    <FolderKanban size={17} color="#60a5fa" />
                  </div>

                  <div>
                    <h1 className="m-0 text-[20px] font-bold leading-[1.2] text-[#e2e8f0]">
                      Projects
                    </h1>
                    <p className="mt-[3px] text-[13px] text-[#4a6680]">
                      Manage visibility, featured state, and custom project
                      details
                    </p>
                  </div>
                </div>
              </div>

              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-[#3b82f680] bg-[linear-gradient(135deg,#1e3a8a,#1d4ed8_55%,#0369a1)] px-[18px] py-[9px] text-[13px] font-semibold text-[#dbeafe] shadow-[0_0_24px_#1d4ed830,inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_0_36px_#1d4ed850] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none md:px-[22px]"
                onClick={doSync}
                disabled={syncing}
              >
                <RefreshCcw size={14} className={syncing ? "ap-spin" : ""} />
                {syncing ? "Syncing…" : "Sync GitHub"}
              </button>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid gap-[10px] [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
            {[
              {
                label: "total_projects",
                value: items.length,
                icon: <FolderKanban size={15} />,
                accent: "#38bdf8",
                iconBg: "#0c1f30",
                iconBorder: "#0ea5e940",
              },
              {
                label: "visible_public",
                value: visibleCount,
                icon: <Eye size={15} />,
                accent: "#4ade80",
                iconBg: "#061510",
                iconBorder: "#22c55e40",
              },
              {
                label: "featured",
                value: featuredCount,
                icon: <Star size={15} />,
                accent: "#fbbf24",
                iconBg: "#141008",
                iconBorder: "#f59e0b40",
              },
              {
                label: "hidden",
                value: hiddenCount,
                icon: <EyeOff size={15} />,
                accent: "#fb923c",
                iconBg: "#140d05",
                iconBorder: "#f9731640",
              },
            ].map(({ label, value, icon, accent, iconBg, iconBorder }) => (
              <div
                key={label}
                className="relative overflow-hidden rounded-[7px] border border-[#1a2d46] bg-[#040c1a] px-[18px] py-[16px] transition-[border-color,box-shadow] duration-200 hover:border-[#2a4060] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              >
                <div
                  className="absolute left-0 right-0 top-0 h-px"
                  style={{
                    background: `linear-gradient(90deg,transparent,${accent}70,transparent)`,
                  }}
                />

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="mb-[12px] font-mono text-[10px] tracking-[0.14em] text-[#3a5570]">
                      {label}
                    </div>
                    <div className="font-mono text-[28px] font-semibold leading-[1] text-[#e2e8f0]">
                      {value}
                    </div>
                  </div>

                  <div
                    className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px]"
                    style={{
                      background: iconBg,
                      border: `1px solid ${iconBorder}`,
                      color: accent,
                    }}
                  >
                    {icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── ERROR ── */}
          {error && (
            <div className="flex items-center gap-[10px] rounded-[6px] border border-[#7f1d1d60] bg-[#1a0808] px-[16px] py-[11px]">
              <AlertTriangle size={15} color="#f87171" className="shrink-0" />
              <span className="text-[13px] text-[#fca5a5]">{error}</span>
            </div>
          )}

          {/* ── DESKTOP TABLE ── */}
          <div className="hidden overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a] md:block">
            <div className="flex items-center justify-between gap-3 border-b border-[#0e1a2e] bg-[#050d1c] px-[20px] py-[14px]">
              <div>
                <div className="mb-1 font-mono text-[10px] tracking-[0.16em] text-[#3a5570]">
                  RECORDS
                </div>
                <h2 className="m-0 text-[15px] font-semibold text-[#94a3b8]">
                  Project Records
                </h2>
              </div>

              <div className="flex items-center gap-[7px] rounded-[5px] border border-[#1a2d46] bg-[#07111f] px-[12px] py-[5px]">
                <ArrowUpDown size={11} color="#3a5570" />
                <span className="font-mono text-[10px] tracking-[0.1em] text-[#3a5570]">
                  ORDERED BY PRIORITY
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center gap-3">
                <div className="ap-spin h-[18px] w-[18px] rounded-full border-[2px] border-[#1d4ed8] border-t-transparent" />
                <span className="font-mono text-[12px] tracking-[0.1em] text-[#3a5570]">
                  LOADING PROJECTS…
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-[#1a2d46] [&::-webkit-scrollbar-track]:bg-transparent">
                <table className="w-full min-w-[740px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#0e1a2e] bg-[#050d1c]">
                      {["Project", "Featured", "Visibility", "Actions"].map((h) => (
                        <th key={h} className="px-[18px] py-[10px] text-left">
                          <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#3a5570]">
                            {h.toUpperCase()}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b border-[#090f1c] transition-colors duration-[120ms] hover:bg-[#060f1e]"
                      >
                        <td className="px-[18px] py-[13px]">
                          <div className="flex items-center gap-[13px]">
                            <div className="relative h-[56px] w-[84px] shrink-0 overflow-hidden rounded-[6px] border border-[#1a2d46] bg-[#06101f]">
                              <Image
                                src={p.imageUrl || DEFAULT_IMG}
                                alt={p.customTitle || p.name}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="84px"
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold text-[#cbd5e1]">
                                  {p.customTitle || p.name}
                                </span>

                                {p.featured && (
                                  <span className="rounded-[3px] border border-[#92400e60] bg-[#140f03] px-[8px] py-[2px] font-mono text-[10px] font-semibold leading-[1.7] tracking-[0.08em] text-[#fbbf24]">
                                    FEATURED
                                  </span>
                                )}
                              </div>

                              <div className="mt-1 break-all font-mono text-[11px] text-[#3a5570]">
                                {p.fullName}
                              </div>

                              <div className="mt-[7px] flex flex-wrap gap-[5px]">
                                {p.type && (
                                  <span className="rounded-[3px] border border-[#1d4ed850] bg-[#0c1e38] px-[9px] py-[2px] font-mono text-[10px] font-medium leading-[1.6] tracking-[0.04em] text-[#7cb9f8]">
                                    {p.type}
                                  </span>
                                )}
                                {p.platform && (
                                  <span className="rounded-[3px] border border-[#7c3aed50] bg-[#140f2a] px-[9px] py-[2px] font-mono text-[10px] font-medium leading-[1.6] tracking-[0.04em] text-[#b49ef8]">
                                    {p.platform}
                                  </span>
                                )}
                                {p.liveUrl && (
                                  <span className="rounded-[3px] border border-[#15803d50] bg-[#071510] px-[9px] py-[2px] font-mono text-[10px] font-medium leading-[1.6] tracking-[0.04em] text-[#5de88a]">
                                    live
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-[18px] py-[13px]">
                          <button
                            className={`inline-flex items-center gap-[7px] whitespace-nowrap rounded-[5px] border px-[13px] py-[6px] text-[12px] font-medium leading-[1.4] transition-all duration-150 ${
                              p.featured
                                ? "border-[#92400e70] bg-[#140f03] text-[#fbbf24]"
                                : "border-[#1a2d46] bg-[#07111f] text-[#5a7090] hover:border-[#2a4060] hover:text-[#7a90b0]"
                            }`}
                            onClick={() =>
                              quickToggle(p._id, { featured: !p.featured })
                            }
                          >
                            <Star size={12} />
                            {p.featured ? "Yes" : "No"}
                          </button>
                        </td>

                        <td className="px-[18px] py-[13px]">
                          <button
                            className={`inline-flex items-center gap-[7px] whitespace-nowrap rounded-[5px] border px-[13px] py-[6px] text-[12px] font-medium leading-[1.4] transition-all duration-150 ${
                              p.isHidden
                                ? "border-[#78350f70] bg-[#130e07] text-[#fb923c]"
                                : "border-[#14532d70] bg-[#071510] text-[#4ade80]"
                            }`}
                            onClick={() =>
                              quickToggle(p._id, { isHidden: !p.isHidden })
                            }
                          >
                            {p.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                            {p.isHidden ? "Hidden" : "Visible"}
                          </button>
                        </td>

                        <td className="px-[18px] py-[13px]">
                          <button
                            className="inline-flex items-center gap-[7px] rounded-[5px] border border-[#1a2d46] bg-[#07111f] px-[13px] py-[6px] text-[12px] font-medium leading-[1.4] text-[#5a7090] transition-all duration-150 hover:border-[#1d4ed880] hover:bg-[#0a1628] hover:text-[#93c5fd]"
                            onClick={() => setEditing({ ...p })}
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}

                    {items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-[18px] py-[56px] text-center">
                          <div className="flex flex-col items-center gap-[14px]">
                            <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] border border-[#1a2d46] bg-[#07111f]">
                              <FolderKanban size={20} color="#3a5570" />
                            </div>
                            <span className="font-mono text-[11px] tracking-[0.12em] text-[#3a5570]">
                              NO PROJECTS FOUND
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="flex flex-col gap-[10px] md:hidden">
            <div className="flex items-center justify-between gap-[10px] overflow-visible rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[16px] py-[13px]">
              <div>
                <div className="mb-1 font-mono text-[10px] tracking-[0.16em] text-[#3a5570]">
                  RECORDS
                </div>
                <h2 className="m-0 text-[14px] font-semibold text-[#94a3b8]">
                  Project Records
                </h2>
              </div>

              <div className="flex items-center gap-[6px] rounded-[5px] border border-[#1a2d46] bg-[#07111f] px-[10px] py-[5px]">
                <ArrowUpDown size={11} color="#3a5570" />
                <span className="font-mono text-[10px] tracking-[0.1em] text-[#3a5570]">
                  PRIORITY
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[160px] items-center justify-center gap-3 overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a]">
                <div className="ap-spin h-[16px] w-[16px] rounded-full border-[2px] border-[#1d4ed8] border-t-transparent" />
                <span className="font-mono text-[11px] tracking-[0.1em] text-[#3a5570]">
                  LOADING…
                </span>
              </div>
            ) : (
              <>
                {items.map((p) => (
                  <div
                    key={p._id}
                    className="rounded-[7px] border border-[#1a2d46] bg-[#050d1c] p-[14px] transition-colors duration-150 hover:border-[#2a4060]"
                  >
                    <div className="flex gap-[13px]">
                      <div className="relative h-[54px] w-[76px] shrink-0 overflow-hidden rounded-[6px] border border-[#1a2d46] bg-[#06101f]">
                        <Image
                          src={p.imageUrl || DEFAULT_IMG}
                          alt={p.customTitle || p.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="76px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-[7px]">
                          <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold text-[#cbd5e1]">
                            {p.customTitle || p.name}
                          </span>

                          {p.featured && (
                            <span className="rounded-[3px] border border-[#92400e60] bg-[#140f03] px-[8px] py-[2px] font-mono text-[10px] font-semibold leading-[1.7] tracking-[0.08em] text-[#fbbf24]">
                              FEATURED
                            </span>
                          )}
                        </div>

                        <div className="mt-1 break-all font-mono text-[10px] text-[#3a5570]">
                          {p.fullName}
                        </div>

                        <div className="mt-[6px] flex flex-wrap gap-[5px]">
                          {p.type && (
                            <span className="rounded-[3px] border border-[#1d4ed850] bg-[#0c1e38] px-[9px] py-[2px] font-mono text-[10px] font-medium leading-[1.6] tracking-[0.04em] text-[#7cb9f8]">
                              {p.type}
                            </span>
                          )}
                          {p.platform && (
                            <span className="rounded-[3px] border border-[#7c3aed50] bg-[#140f2a] px-[9px] py-[2px] font-mono text-[10px] font-medium leading-[1.6] tracking-[0.04em] text-[#b49ef8]">
                              {p.platform}
                            </span>
                          )}
                          {p.liveUrl && (
                            <span className="rounded-[3px] border border-[#15803d50] bg-[#071510] px-[9px] py-[2px] font-mono text-[10px] font-medium leading-[1.6] tracking-[0.04em] text-[#5de88a]">
                              live
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-[12px] grid grid-cols-3 gap-[7px]">
                      <button
                        className={`inline-flex w-full items-center justify-center gap-[7px] whitespace-nowrap rounded-[5px] border px-[13px] py-[6px] text-[12px] font-medium leading-[1.4] transition-all duration-150 ${
                          p.featured
                            ? "border-[#92400e70] bg-[#140f03] text-[#fbbf24]"
                            : "border-[#1a2d46] bg-[#07111f] text-[#5a7090] hover:border-[#2a4060] hover:text-[#7a90b0]"
                        }`}
                        onClick={() =>
                          quickToggle(p._id, { featured: !p.featured })
                        }
                      >
                        <Star size={12} />
                        {p.featured ? "Featured" : "Feature"}
                      </button>

                      <button
                        className={`inline-flex w-full items-center justify-center gap-[7px] whitespace-nowrap rounded-[5px] border px-[13px] py-[6px] text-[12px] font-medium leading-[1.4] transition-all duration-150 ${
                          p.isHidden
                            ? "border-[#78350f70] bg-[#130e07] text-[#fb923c]"
                            : "border-[#14532d70] bg-[#071510] text-[#4ade80]"
                        }`}
                        onClick={() =>
                          quickToggle(p._id, { isHidden: !p.isHidden })
                        }
                      >
                        {p.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                        {p.isHidden ? "Hidden" : "Visible"}
                      </button>

                      <button
                        className="inline-flex w-full items-center justify-center gap-[7px] rounded-[5px] border border-[#1a2d46] bg-[#07111f] px-[13px] py-[6px] text-[12px] font-medium leading-[1.4] text-[#5a7090] transition-all duration-150 hover:border-[#1d4ed880] hover:bg-[#0a1628] hover:text-[#93c5fd]"
                        onClick={() => setEditing({ ...p })}
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="overflow-visible rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[16px] py-[44px] text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[7px] border border-[#1a2d46] bg-[#07111f]">
                        <FolderKanban size={18} color="#3a5570" />
                      </div>
                      <span className="font-mono text-[11px] tracking-[0.12em] text-[#3a5570]">
                        NO PROJECTS FOUND
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── MODAL ── */}
          <ProjectUpdate
            editing={editing}
            setEditing={setEditing}
            saveEdit={saveEdit}
            saving={saving}
            handleImageUpload={handleImageUpload}
            handleImageRemove={handleImageRemove}
          />
        </div>
      </>
    </RequireAuth>
  );
}