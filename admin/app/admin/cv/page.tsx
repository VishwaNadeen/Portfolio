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
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Manage CV</h1>
            <p className="mt-1 text-sm text-slate-400">
              Upload, replace, view, download, or delete your CV file.
            </p>
          </div>

          {err && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {err}
            </div>
          )}

          {msg && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {msg}
            </div>
          )}

          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="mb-4 text-lg font-semibold">
              {cv ? "Replace Current CV" : "Upload New CV"}
            </h2>

            <form onSubmit={handleUploadOrUpdate} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  CV File
                </label>
                <input
                  id="cv-file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cyan-300"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Allowed: PDF, JPG, JPEG, PNG, WEBP
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : cv ? "Replace CV" : "Upload CV"}
                </button>

                {cv && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete CV
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="mb-4 text-lg font-semibold">Current CV</h2>

            {loading ? (
              <p className="text-sm text-slate-400">Loading CV...</p>
            ) : !cv ? (
              <p className="text-sm text-slate-400">No CV uploaded yet.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      File Name
                    </p>
                    <p className="mt-1 break-all text-sm text-white">
                      {cv.filename}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      File Type
                    </p>
                    <p className="mt-1 text-sm text-white">
                      {cv.contentType}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Last Uploaded
                    </p>
                    <p className="mt-1 text-sm text-white">
                      {new Date(cv.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={getPublicCvViewUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View CV
                  </a>

                  <a
                    href={getPublicCvDownloadUrl()}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                  >
                    Download CV
                  </a>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </RequireAuth>
  );
}