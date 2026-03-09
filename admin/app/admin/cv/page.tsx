"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "../components/RequireAuth";
import { logout } from "../utils/auth";
import {
  CvItem,
  deleteCv,
  getAdminCv,
  getPublicCvDownloadUrl,
  getPublicCvViewUrl,
  updateCv,
  uploadCv,
} from "../lib/cvApi";
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  Download,
  ShieldCheck,
  ImageIcon,
  Clock3,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function AdminCvPage() {
  const router = useRouter();

  const [cv, setCv] = useState<CvItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function loadCv() {
    setErr(null);
    setLoading(true);

    try {
      const data = await getAdminCv();
      setCv(data);
    } catch (e: any) {
      if (String(e?.message) === "UNAUTHORIZED") {
        logout();
        router.replace("/admin/login");
        return;
      }
      setErr(e?.message || "Failed to load CV");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCv();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validateFile(selected: File | null) {
    if (!selected) return "Please select a file";
    if (!ALLOWED_TYPES.includes(selected.type)) {
      return "Only PDF, JPG, JPEG, PNG, and WEBP files are allowed";
    }
    return null;
  }

  async function handleUploadOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    const validationError = validateFile(file);
    if (validationError) {
      setErr(validationError);
      return;
    }

    try {
      setSaving(true);

      if (!cv) {
        await uploadCv(file as File);
        setMsg("CV uploaded successfully");
      } else {
        await updateCv(cv._id, file as File);
        setMsg("CV replaced successfully");
      }

      setFile(null);

      const input = document.getElementById(
        "cv-file-input"
      ) as HTMLInputElement | null;
      if (input) input.value = "";

      await loadCv();
    } catch (e: any) {
      if (String(e?.message) === "UNAUTHORIZED") {
        logout();
        router.replace("/admin/login");
        return;
      }
      setErr(e?.message || "Failed to save CV");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!cv) return;

    const ok = window.confirm("Are you sure you want to delete the CV?");
    if (!ok) return;

    setErr(null);
    setMsg(null);

    try {
      setSaving(true);
      await deleteCv(cv._id);
      setMsg("CV deleted successfully");
      setCv(null);
      setFile(null);

      const input = document.getElementById(
        "cv-file-input"
      ) as HTMLInputElement | null;
      if (input) input.value = "";

      await loadCv();
    } catch (e: any) {
      if (String(e?.message) === "UNAUTHORIZED") {
        logout();
        router.replace("/admin/login");
        return;
      }
      setErr(e?.message || "Failed to delete CV");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RequireAuth>
      <main className="relative overflow-hidden bg-slate-950 px-4 py-8 text-white">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl space-y-6">
          {/* top hero */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Manage CV
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                    Upload, replace, view, download, or delete your CV file.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Status
                    </p>
                    <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {cv ? "Uploaded" : "Empty"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Format
                    </p>
                    <FileText className="h-4 w-4 text-cyan-300" />
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">
                    PDF / Image
                  </p>
                </div>
              </div>
            </div>
          </section>

          {err && (
            <div className="animate-in fade-in slide-in-from-top-1 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-300 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-red-500/10 p-2 text-red-300">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-red-200">Something went wrong</p>
                  <p className="mt-1 text-red-300/90">{err}</p>
                </div>
              </div>
            </div>
          )}

          {msg && (
            <div className="animate-in fade-in slide-in-from-top-1 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-300 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-emerald-500/10 p-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-200">Success</p>
                  <p className="mt-1 text-emerald-300/90">{msg}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            {/* upload / replace */}
            <section className="group rounded-3xl border border-white/10 bg-slate-900/40 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/15 hover:bg-slate-900/50 md:p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {cv ? "Replace Current CV" : "Upload New CV"}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleUploadOrUpdate} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    CV File
                  </label>

                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4 transition-all duration-300 hover:border-cyan-400/30 hover:bg-slate-950/80">
                    <input
                      id="cv-file-input"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cyan-300 hover:border-cyan-400/20"
                    />

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
                        PDF
                      </span>
                      <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
                        JPG
                      </span>
                      <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
                        JPEG
                      </span>
                      <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
                        PNG
                      </span>
                      <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
                        WEBP
                      </span>
                    </div>

                    {file && (
                      <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-100 animate-in fade-in">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-cyan-400/10 p-2 text-cyan-300">
                            {file.type === "application/pdf" ? (
                              <FileText className="h-4 w-4" />
                            ) : (
                              <ImageIcon className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{file.name}</p>
                            <p className="text-xs text-cyan-200/70">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving || loading}
                    className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Upload className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    {saving ? "Saving..." : cv ? "Replace CV" : "Upload CV"}
                  </button>

                  {cv && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={saving}
                      className="group inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      Delete CV
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* current cv */}
            <section className="group rounded-3xl border border-white/10 bg-slate-900/40 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/15 hover:bg-slate-900/50 md:p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Current CV</h2>
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-[260px] items-center justify-center">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                    Loading CV...
                  </div>
                </div>
              ) : !cv ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-6 text-center">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-slate-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-white">
                    No CV uploaded yet
                  </p>
                  <p className="mt-2 max-w-sm text-sm text-slate-400">
                    Upload a CV file to make it available for viewing and downloading.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-950/80">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          File Name
                        </p>
                        <FileText className="h-4 w-4 text-cyan-300" />
                      </div>
                      <p className="mt-3 break-all text-sm font-medium text-white">
                        {cv.filename}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-950/80">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          File Type
                        </p>
                        <ImageIcon className="h-4 w-4 text-cyan-300" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-white">
                        {cv.contentType}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-950/80">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          Last Uploaded
                        </p>
                        <Clock3 className="h-4 w-4 text-cyan-300" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-white">
                        {new Date(cv.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <a
                      href={getPublicCvViewUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      <Eye className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      View CV
                    </a>

                    <a
                      href={getPublicCvDownloadUrl()}
                      className="group inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500/20"
                    >
                      <Download className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      Download CV
                    </a>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}