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
  }, []);

  function validateFile(selected: File | null) {
    if (!selected) return "Please select a file";
    if (!ALLOWED_TYPES.includes(selected.type))
      return "Only PDF, JPG, JPEG, PNG, and WEBP files are allowed";
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
      const input = document.getElementById("cv-file-input") as HTMLInputElement | null;
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
      const input = document.getElementById("cv-file-input") as HTMLInputElement | null;
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
      <>
        <style>{`
          @keyframes cv-spin { to { transform: rotate(360deg); } }

          @keyframes cv-fadein {
            from { opacity: 0; transform: translateY(5px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div
          className="flex flex-col gap-[14px] font-sans"
          style={{ animation: "cv-fadein 0.2s ease" }}
        >
          {/* ── HEADER ── */}
          <div className="relative overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[20px] py-[20px] sm:px-[24px]">
            {/* top accent line */}
            <div
              className="absolute left-0 right-0 top-0 h-px opacity-70"
              style={{
                background:
                  "linear-gradient(90deg,transparent,#1e40af,#0ea5e9,transparent)",
              }}
            />
            {/* dot grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative flex flex-wrap items-start justify-between gap-5">
              {/* title block */}
              <div>
                <div className="mb-[10px] font-mono text-[10px] tracking-[0.18em] text-[#3a5570]">
                  ADMIN / CV
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[7px] border border-[#1d4ed850] bg-[#0c1e3a] shadow-[0_0_16px_#1d4ed825]">
                    <FileText size={17} color="#60a5fa" />
                  </div>
                  <div>
                    <h1 className="m-0 text-[20px] font-bold leading-[1.2] text-[#e2e8f0]">
                      Manage CV
                    </h1>
                    <p className="mt-[3px] text-[13px] text-[#4a6680]">
                      Upload, replace, view, download, or delete your CV file
                    </p>
                  </div>
                </div>
              </div>

              {/* stat pills */}
              <div className="flex flex-wrap gap-[10px]">
                <div className="flex flex-col gap-2 rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[16px] py-[14px] transition-colors duration-150 hover:border-[#2a4060]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-[10px] tracking-[0.14em] text-[#3a5570]">
                      STATUS
                    </div>
                    <div
                      className={`flex h-[26px] w-[26px] items-center justify-center rounded-[5px] border ${
                        cv
                          ? "border-[#15803d40] bg-[#071510]"
                          : "border-[#1a2d46] bg-[#07111f]"
                      }`}
                    >
                      <ShieldCheck size={13} color={cv ? "#4ade80" : "#3a5570"} />
                    </div>
                  </div>
                  <div
                    className={`text-[14px] font-semibold ${
                      cv ? "text-[#4ade80]" : "text-[#4a6680]"
                    }`}
                  >
                    {cv ? "Uploaded" : "Empty"}
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[16px] py-[14px] transition-colors duration-150 hover:border-[#2a4060]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-[10px] tracking-[0.14em] text-[#3a5570]">
                      FORMAT
                    </div>
                    <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] border border-[#1d4ed840] bg-[#0c1e3a]">
                      <FileText size={13} color="#60a5fa" />
                    </div>
                  </div>
                  <div className="text-[14px] font-semibold text-[#94a3b8]">
                    PDF / Image
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── ERROR ── */}
          {err && (
            <div className="flex items-start gap-3 rounded-[7px] border border-[#7f1d1d60] bg-[#1a0808] px-[16px] py-[13px]">
              <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[5px] border border-[#ef444430] bg-[#2a0a0a]">
                <AlertCircle size={14} color="#f87171" />
              </div>
              <div>
                <div className="mb-[3px] text-[13px] font-semibold text-[#fca5a5]">
                  Something went wrong
                </div>
                <div className="text-[13px] text-[#f87171]">{err}</div>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {msg && (
            <div className="flex items-start gap-3 rounded-[7px] border border-[#15803d50] bg-[#071510] px-[16px] py-[13px]">
              <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[5px] border border-[#22c55e30] bg-[#0a1e14]">
                <CheckCircle2 size={14} color="#4ade80" />
              </div>
              <div>
                <div className="mb-[3px] text-[13px] font-semibold text-[#86efac]">
                  Success
                </div>
                <div className="text-[13px] text-[#4ade80]">{msg}</div>
              </div>
            </div>
          )}

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-[1.05fr_0.95fr]">
            {/* ── LEFT: Upload / Replace ── */}
            <div className="relative overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[20px] py-[20px] sm:px-[22px]">
              {/* cyan shimmer */}
              <div
                className="absolute left-0 right-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,#38bdf870,transparent)",
                }}
              />

              {/* section header */}
              <div className="mb-5 flex items-center gap-[10px]">
                <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px] border border-[#0ea5e940] bg-[#0c1f30]">
                  <Upload size={15} color="#38bdf8" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#3a5570]">
                    {cv ? "REPLACE_CV" : "UPLOAD_CV"}
                  </div>
                  <div className="mt-[1px] text-[15px] font-semibold text-[#94a3b8]">
                    {cv ? "Replace Current CV" : "Upload New CV"}
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleUploadOrUpdate}
                className="flex flex-col gap-[18px]"
              >
                {/* drop zone */}
                <div>
                  <span className="mb-2 block font-mono text-[11px] tracking-[0.06em] text-[#4a6680]">
                    cv_file
                  </span>

                  <div className="rounded-[7px] border border-dashed border-[#1a2d46] bg-[#060f1e] p-[18px] transition-colors duration-150 hover:border-[#2a4060] hover:bg-[#070e1a]">
                    <input
                      id="cv-file-input"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full cursor-pointer rounded-[5px] border border-[#1a2d46] bg-[#040c1a] px-[13px] py-[9px] text-[13px] text-[#94a3b8] outline-none transition-colors duration-150 file:mr-3 file:cursor-pointer file:rounded-[4px] file:border file:border-[#1d4ed850] file:bg-[#0c1e3a] file:px-[12px] file:py-[5px] file:text-[12px] file:font-medium file:text-[#60a5fa] hover:border-[#2a4060] file:hover:bg-[#102540]"
                    />

                    {/* allowed formats */}
                    <div className="mt-3 flex flex-wrap gap-[6px]">
                      {["PDF", "JPG", "JPEG", "PNG", "WEBP"].map((f) => (
                        <span
                          key={f}
                          className="rounded-[3px] border border-[#1a2d46] bg-[#07111f] px-[9px] py-[3px] font-mono text-[10px] font-medium tracking-[0.06em] text-[#4a6680]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* staged file preview */}
                    {file && (
                      <div className="mt-[14px] flex items-center gap-3 rounded-[6px] border border-[#1d4ed840] bg-[#0a1e30] px-[14px] py-[11px]">
                        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[5px] border border-[#1d4ed850] bg-[#0c1e3a]">
                          {file.type === "application/pdf" ? (
                            <FileText size={14} color="#60a5fa" />
                          ) : (
                            <ImageIcon size={14} color="#60a5fa" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-[#cbd5e1]">
                            {file.name}
                          </div>
                          <div className="mt-[2px] font-mono text-[10px] text-[#3a5570]">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        <span className="ml-auto shrink-0 rounded-[3px] border border-[#0a3a20] bg-[#052010] px-[8px] py-[3px] font-mono text-[9px] font-semibold tracking-[0.1em] text-[#4ade80]">
                          STAGED
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* action buttons */}
                <div className="flex flex-wrap gap-[9px]">
                  <button
                    type="submit"
                    disabled={saving || loading}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-[#3b82f680] bg-[linear-gradient(135deg,#1e3a8a,#1d4ed8_55%,#0369a1)] px-[22px] py-[9px] text-[13px] font-semibold text-[#dbeafe] shadow-[0_0_24px_#1d4ed830,inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_0_36px_#1d4ed850] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    {saving ? (
                      <span
                        className="h-[13px] w-[13px] rounded-full border-[2px] border-[#bfdbfe] border-t-transparent"
                        style={{ animation: "cv-spin 0.8s linear infinite" }}
                      />
                    ) : (
                      <Upload size={14} />
                    )}
                    {saving ? "Saving…" : cv ? "Replace CV" : "Upload CV"}
                  </button>

                  {cv && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-[#7f1d1d60] bg-[#0f0808] px-[22px] py-[9px] text-[13px] font-semibold text-[#f87171] transition-all duration-150 hover:border-[#ef444460] hover:bg-[#1a0808] hover:shadow-[0_0_20px_#ef444418] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                      Delete CV
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* ── RIGHT: Current CV ── */}
            <div className="relative overflow-hidden rounded-[8px] border border-[#1a2d46] bg-[#040c1a] px-[20px] py-[20px] sm:px-[22px]">
              {/* amber shimmer */}
              <div
                className="absolute left-0 right-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,#fbbf2470,transparent)",
                }}
              />

              {/* section header */}
              <div className="mb-5 flex items-center gap-[10px]">
                <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px] border border-[#f59e0b40] bg-[#141008]">
                  <FileText size={15} color="#fbbf24" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#3a5570]">
                    CURRENT_CV
                  </div>
                  <div className="mt-[1px] text-[15px] font-semibold text-[#94a3b8]">
                    Current CV
                  </div>
                </div>
              </div>

              {/* loading */}
              {loading ? (
                <div className="flex min-h-[200px] items-center justify-center gap-3">
                  <div
                    className="h-[16px] w-[16px] rounded-full border-[2px] border-[#1d4ed8] border-t-transparent"
                    style={{ animation: "cv-spin 0.8s linear infinite" }}
                  />
                  <span className="font-mono text-[11px] tracking-[0.1em] text-[#3a5570]">
                    LOADING CV…
                  </span>
                </div>
              ) : !cv ? (
                /* empty state */
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[7px] border border-dashed border-[#1a2d46] bg-[#060f1e] px-[24px] py-[32px] text-center">
                  <div className="mb-[14px] flex h-[44px] w-[44px] items-center justify-center rounded-[8px] border border-[#1a2d46] bg-[#07111f]">
                    <FileText size={20} color="#3a5570" />
                  </div>
                  <div className="mb-[6px] text-[14px] font-semibold text-[#4a6680]">
                    No CV uploaded yet
                  </div>
                  <div className="text-[12px] leading-[1.6] text-[#3a5570]">
                    Upload a CV file to make it available for viewing and downloading.
                  </div>
                </div>
              ) : (
                /* cv detail */
                <div
                  className="flex flex-col gap-4"
                  style={{ animation: "cv-fadein 0.2s ease" }}
                >
                  <div className="grid grid-cols-1 gap-2 min-[560px]:grid-cols-2 min-[1400px]:grid-cols-3">
                    {/* file_name */}
                    <div className="flex flex-col gap-[5px] rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[14px] py-[12px] transition-colors duration-150 hover:border-[#2a4060]">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-[10px] tracking-[0.12em] text-[#3a5570]">
                          FILE_NAME
                        </div>
                        <FileText size={12} color="#3a5570" />
                      </div>
                      <div className="break-all text-[13px] font-medium leading-[1.4] text-[#cbd5e1]">
                        {cv.filename}
                      </div>
                    </div>

                    {/* file_type */}
                    <div className="flex flex-col gap-[5px] rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[14px] py-[12px] transition-colors duration-150 hover:border-[#2a4060]">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-[10px] tracking-[0.12em] text-[#3a5570]">
                          FILE_TYPE
                        </div>
                        <ImageIcon size={12} color="#3a5570" />
                      </div>
                      <div className="text-[13px] font-medium text-[#cbd5e1]">
                        {cv.contentType}
                      </div>
                    </div>

                    {/* last_uploaded */}
                    <div className="flex flex-col gap-[5px] rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[14px] py-[12px] transition-colors duration-150 hover:border-[#2a4060]">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-[10px] tracking-[0.12em] text-[#3a5570]">
                          LAST_UPLOADED
                        </div>
                        <Clock3 size={12} color="#3a5570" />
                      </div>
                      <div className="text-[13px] font-medium leading-[1.4] text-[#cbd5e1]">
                        {new Date(cv.uploadedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* view / download actions */}
                  <div className="flex flex-wrap gap-[9px]">
                    <a
                      href={getPublicCvViewUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-[#1a2d46] bg-[#07111f] px-[20px] py-[9px] text-[13px] font-medium text-[#5a7090] no-underline transition-all duration-150 hover:border-[#2a4060] hover:bg-[#0a1628] hover:text-[#94a3b8]"
                    >
                      <Eye size={14} />
                      View CV
                    </a>
                    <a
                      href={getPublicCvDownloadUrl()}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-[#15803d50] bg-[#071510] px-[20px] py-[9px] text-[13px] font-medium text-[#4ade80] no-underline transition-all duration-150 hover:border-[#22c55e60] hover:bg-[#0a1e14] hover:shadow-[0_0_20px_#4ade8018]"
                    >
                      <Download size={14} />
                      Download CV
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </RequireAuth>
  );
}