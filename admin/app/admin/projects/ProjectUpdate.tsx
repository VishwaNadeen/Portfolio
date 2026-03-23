"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  X,
  ChevronDown,
  Check,
  Upload,
  Trash2,
  Save,
  AlertCircle,
} from "lucide-react";
import type { AdminGitHubProject } from "../lib/adminApi";

type ProjectUpdateProps = {
  editing: AdminGitHubProject | null;
  setEditing: React.Dispatch<React.SetStateAction<AdminGitHubProject | null>>;
  saveEdit: (e: React.FormEvent) => Promise<void> | void;
  saving: boolean;
  handleImageUpload: (projectId: string, file: File) => Promise<void> | void;
  handleImageRemove: (projectId: string) => Promise<void> | void;
};

const DESCRIPTION_LIMIT = 100;
const DEFAULT_PROJECT_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085";

const PLATFORM_OPTIONS = ["", "Android App", "iOS App", "Web App", "Mobile App"];

const PLATFORM_META: Record<string, { icon: string; color: string }> = {
  "Android App": { icon: "🤖", color: "#3DDC84" },
  "iOS App": { icon: "🍎", color: "#A8B8C8" },
  "Web App": { icon: "🌐", color: "#38BDF8" },
  "Mobile App": { icon: "📱", color: "#C084FC" },
};

export default function ProjectUpdate({
  editing,
  setEditing,
  saveEdit,
  saving,
  handleImageUpload,
  handleImageRemove,
}: ProjectUpdateProps) {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [pendingRemoveImage, setPendingRemoveImage] = useState(false);
  const [imageAction, setImageAction] = useState<"idle" | "uploading" | "deleting">("idle");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedImageFile(null);
    setPreviewUrl("");
    setPendingRemoveImage(false);
    setImageAction("idle");
    setDropdownOpen(false);
  }, [editing?._id]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const displayImageSrc = useMemo(() => {
    if (pendingRemoveImage && !previewUrl) return DEFAULT_PROJECT_IMAGE;
    if (previewUrl) return previewUrl;
    return editing?.imageUrl || DEFAULT_PROJECT_IMAGE;
  }, [editing?.imageUrl, pendingRemoveImage, previewUrl]);

  if (!editing) return null;

  const isUploading = imageAction === "uploading";
  const isDeleting = imageAction === "deleting";
  const isImageProcessing = isUploading || isDeleting;
  const currentPlatform = editing.platform || "";
  const currentMeta = PLATFORM_META[currentPlatform];

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPendingRemoveImage(false);
    e.target.value = "";
  };

  const handleRemoveClick = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImageFile(null);
    setPreviewUrl("");
    setPendingRemoveImage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?._id) return;
    try {
      if (selectedImageFile) {
        setImageAction("uploading");
        await handleImageUpload(editing._id, selectedImageFile);
        setImageAction("idle");
      } else if (pendingRemoveImage && editing.imageUrl) {
        setImageAction("deleting");
        await handleImageRemove(editing._id);
        setImageAction("idle");
      }
      await saveEdit(e);
      setSelectedImageFile(null);
      setPendingRemoveImage(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
    } catch (error) {
      console.error("Save failed:", error);
      setImageAction("idle");
    }
  };

  return (
    <>
      <style>{`
        @keyframes pu-in {
          from { opacity: 0; transform: scale(0.98) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pu-dd {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pu-bar {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(1,4,12,0.92)] p-2 font-sans backdrop-blur-[8px] sm:p-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[600px] flex-col overflow-hidden rounded-[9px] border border-[#1a2d46] bg-[#040c1a] shadow-[0_0_0_1px_#060e1c,0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.03)]"
          style={{
            maxHeight: "calc(100dvh - 16px)",
            animation: "pu-in 0.2s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            className="h-px shrink-0 opacity-70"
            style={{
              background:
                "linear-gradient(90deg,transparent 0%,#1e40af 30%,#0ea5e9 70%,transparent 100%)",
            }}
          />

          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#0e1a2e] bg-[#050d1c] px-3 py-[13px] sm:flex-nowrap sm:gap-3 sm:px-5">
            <div className="flex shrink-0 gap-[6px]">
              {["#2a1010", "#1f1a09", "#0a1f0e"].map((bg, i) => (
                <span
                  key={i}
                  className="block h-[10px] w-[10px] rounded-full"
                  style={{
                    background: bg,
                    border: `1px solid ${["#3f1515", "#3a300d", "#133a1a"][i]}`,
                  }}
                />
              ))}
            </div>

            <div className="hidden h-[14px] w-px shrink-0 bg-[#1a2d46] sm:block" />

            <div className="font-mono shrink-0 text-[10px] whitespace-nowrap text-[#3a5570] sm:text-[11px]">
              admin / projects /
            </div>
            <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[10px] text-[#4a6680] sm:text-[11px]">
              {editing.fullName || editing.name}
            </div>

            <span className="shrink-0 rounded-[3px] border border-[#1e3a6a] bg-[#0c2044] px-[7px] py-[3px] font-mono text-[9px] font-semibold leading-[1.7] tracking-[0.1em] text-[#60a5fa] sm:px-[9px] sm:text-[10px]">
              EDIT MODE
            </span>

            <button
              type="button"
              onClick={() => setEditing(null)}
              className="ml-auto flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[4px] border border-[#1a2d46] bg-transparent text-[#3a5570] transition-all duration-150 hover:border-[#4a1010] hover:bg-[#1a0808] hover:text-[#ef4444] sm:ml-0"
            >
              <X size={13} />
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-[10px] border-b border-[#0b1524] bg-[#040c1a] px-3 py-[10px] sm:px-5">
            <div
              className="h-[7px] w-[7px] shrink-0 rounded-full"
              style={{
                background: "linear-gradient(135deg,#1d4ed8,#0ea5e9)",
                boxShadow: "0 0 8px #1d4ed870",
              }}
            />
            <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold text-[#94a3b8] sm:text-[14px]">
              {editing.customTitle || editing.name}
            </span>
            <span className="shrink-0 font-mono text-[9px] tracking-[0.08em] text-[#2a4060] sm:text-[10px]">
              #{(editing._id ?? "").toUpperCase().slice(-6)}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-4 flex items-center gap-[10px] font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3a5570] before:h-px before:flex-1 before:bg-[#1a2d46] after:h-px after:flex-1 after:bg-[#1a2d46]">
                  Metadata
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <span className="mb-[7px] block font-mono text-[11px] font-medium tracking-[0.06em] text-[#4a6680]">
                      custom_title
                    </span>
                    <input
                      className="w-full rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[14px] py-[10px] text-[14px] leading-[1.55] text-[#cbd5e1] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#2a4060] focus:border-[#2563eb70] focus:shadow-[0_0_0_3px_#1e40af1a]"
                      value={editing.customTitle || ""}
                      placeholder="Leave blank to use repo name"
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, customTitle: e.target.value } : prev
                        )
                      }
                    />
                  </div>

                  <div>
                    <span className="mb-[7px] block font-mono text-[11px] font-medium tracking-[0.06em] text-[#4a6680]">
                      platform
                    </span>
                    <div ref={dropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((o) => !o)}
                        className={`flex w-full items-center justify-between gap-3 rounded-[6px] border bg-[#060f1e] px-[14px] py-[10px] text-[14px] transition-all duration-150 ${
                          dropdownOpen
                            ? "border-[#2563eb70] shadow-[0_0_0_3px_#1e40af1a]"
                            : "border-[#1a2d46]"
                        }`}
                      >
                        <span className="min-w-0 flex items-center gap-[10px] overflow-hidden">
                          {currentMeta ? (
                            <>
                              <span
                                className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[5px] border text-[13px]"
                                style={{
                                  background: `${currentMeta.color}18`,
                                  borderColor: `${currentMeta.color}30`,
                                }}
                              >
                                {currentMeta.icon}
                              </span>
                              <span
                                className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium"
                                style={{ color: currentMeta.color }}
                              >
                                {currentPlatform}
                              </span>
                            </>
                          ) : (
                            <span className="text-[#2a4060]">— unset —</span>
                          )}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`shrink-0 text-[#4a6680] transition-transform duration-150 ${
                            dropdownOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>

                      {dropdownOpen && (
                        <div
                          className="absolute left-0 right-0 top-[calc(100%+5px)] z-40 overflow-hidden rounded-[6px] border border-[#1a2d46] bg-[#060f1e] shadow-[0_16px_48px_rgba(0,0,0,0.7)]"
                          style={{ animation: "pu-dd 0.12s ease" }}
                        >
                          <button
                            type="button"
                            className={`flex w-full items-center gap-[11px] px-[14px] py-[9px] text-left text-[13px] transition-colors duration-100 ${
                              !currentPlatform
                                ? "bg-[#0a1628] text-[#64748b]"
                                : "text-[#3a5570] hover:bg-[#0a1628]"
                            }`}
                            onClick={() => {
                              setEditing((p) => (p ? { ...p, platform: "" } : p));
                              setDropdownOpen(false);
                            }}
                          >
                            <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[5px] border border-[#1a2d46] bg-[#1a2d4640] text-[11px] text-[#3a5570]">
                              —
                            </span>
                            <span>None</span>
                            {!currentPlatform && (
                              <Check size={12} className="ml-auto shrink-0 text-[#4a6680]" />
                            )}
                          </button>

                          <div className="mx-[14px] h-px bg-[#0e1a2e]" />

                          {PLATFORM_OPTIONS.filter(Boolean).map((option) => {
                            const meta = PLATFORM_META[option];
                            const isSel = currentPlatform === option;

                            return (
                              <button
                                key={option}
                                type="button"
                                className={`flex w-full items-center gap-[11px] px-[14px] py-[9px] text-left text-[13px] transition-colors duration-100 ${
                                  isSel
                                    ? "font-medium"
                                    : "text-[#94a3b8] hover:bg-[#0a1628]"
                                }`}
                                style={{
                                  background: isSel ? `${meta.color}0c` : "transparent",
                                  color: isSel ? meta.color : undefined,
                                }}
                                onClick={() => {
                                  setEditing((p) =>
                                    p ? { ...p, platform: option } : p
                                  );
                                  setDropdownOpen(false);
                                }}
                              >
                                <span
                                  className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[5px] border text-[14px]"
                                  style={{
                                    background: `${meta.color}18`,
                                    borderColor: `${meta.color}30`,
                                  }}
                                >
                                  {meta.icon}
                                </span>
                                <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                  {option}
                                </span>
                                {isSel && (
                                  <Check
                                    size={12}
                                    className="ml-auto shrink-0"
                                    style={{ color: meta.color }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-[7px] flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] font-medium tracking-[0.06em] text-[#4a6680]">
                        custom_description
                      </span>
                      <span
                        className={`shrink-0 font-mono text-[11px] ${
                          (editing.customDescription || "").length >= DESCRIPTION_LIMIT
                            ? "text-[#ef4444]"
                            : "text-[#3a5570]"
                        }`}
                      >
                        {(editing.customDescription || "").length}/{DESCRIPTION_LIMIT}
                      </span>
                    </div>
                    <textarea
                      className="min-h-[96px] w-full resize-none rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[14px] py-[10px] text-[14px] leading-[1.6] text-[#cbd5e1] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#2a4060] focus:border-[#2563eb70] focus:shadow-[0_0_0_3px_#1e40af1a]"
                      rows={4}
                      maxLength={DESCRIPTION_LIMIT}
                      placeholder="Short project summary…"
                      value={editing.customDescription || ""}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev
                            ? {
                                ...prev,
                                customDescription: e.target.value.slice(
                                  0,
                                  DESCRIPTION_LIMIT
                                ),
                              }
                            : prev
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-[10px] font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3a5570] before:h-px before:flex-1 before:bg-[#1a2d46] after:h-px after:flex-1 after:bg-[#1a2d46]">
                  Project Image
                </div>

                <div className="relative h-[158px] overflow-hidden rounded-[7px] border border-[#1a2d46] bg-[#06101f]">
                  <Image
                    src={displayImageSrc}
                    alt={editing.customTitle || editing.name}
                    fill
                    style={{
                      objectFit: "cover",
                      opacity: isImageProcessing ? 0.25 : 1,
                      transition: "opacity 0.3s",
                    }}
                  />

                  {!isImageProcessing && (
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,12,26,0.65)_0%,transparent_55%)]" />
                  )}

                  {isImageProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="h-[2px] w-[144px] overflow-hidden rounded-[2px] bg-[#1a2d46]">
                        <div
                          className="h-full w-1/2 rounded-[2px]"
                          style={{
                            background: "linear-gradient(90deg, #1d4ed8, #0ea5e9)",
                            animation: "pu-bar 1.2s ease-in-out infinite",
                          }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-[#4a6680]">
                        {isUploading ? "uploading…" : "removing…"}
                      </span>
                    </div>
                  )}

                  {selectedImageFile && !isImageProcessing && (
                    <span className="absolute bottom-[9px] left-[9px] rounded-[3px] border border-[#0a3a20] bg-[#052010] px-[9px] py-[3px] font-mono text-[10px] font-semibold leading-[1.6] tracking-[0.08em] text-[#4ade80]">
                      STAGED
                    </span>
                  )}

                  {pendingRemoveImage && !isImageProcessing && (
                    <span className="absolute bottom-[9px] left-[9px] rounded-[3px] border border-[#3a1010] bg-[#1a0808] px-[9px] py-[3px] font-mono text-[10px] font-semibold leading-[1.6] tracking-[0.08em] text-[#f87171]">
                      MARKED FOR REMOVAL
                    </span>
                  )}

                  <div
                    className="absolute right-0 top-0 h-[44px] w-[44px] opacity-[0.35]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #1a2d46 1px, transparent 1px)",
                      backgroundSize: "8px 8px",
                    }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-[9px]">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={saving || isImageProcessing}
                    onChange={handleUploadChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    className="inline-flex items-center gap-[7px] rounded-[6px] border border-[#1a2d46] bg-[#07111f] px-[15px] py-[8px] text-[13px] font-medium leading-[1.4] text-[#5a7090] transition-all duration-150 hover:border-[#1e40af70] hover:bg-[#0a1628] hover:text-[#93c5fd] disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={saving || isImageProcessing}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={13} />
                    {selectedImageFile ? "Replace" : "Upload"}
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-[7px] rounded-[6px] border border-[#1a2d46] bg-[#07111f] px-[15px] py-[8px] text-[13px] font-medium leading-[1.4] text-[#5a7090] transition-all duration-150 hover:border-[#7f1d1d70] hover:bg-[#0f0808] hover:text-[#fca5a5] disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={saving || isImageProcessing}
                    onClick={handleRemoveClick}
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>

                  <div className="flex w-full items-center gap-[6px] sm:ml-auto sm:w-auto">
                    <AlertCircle size={12} className="shrink-0 text-[#3a5570]" />
                    <span className="font-mono text-[10px] tracking-[0.07em] text-[#3a5570]">
                      COMMITTED ON SAVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 border-t border-[#0b1524] bg-[#050d1c] px-3 py-[13px] sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <span className="font-mono text-[10px] tracking-[0.1em] text-[#1a2d46]">
              PROJECT · {(editing._id ?? "").toUpperCase().slice(-8)}
            </span>

            <div className="flex w-full flex-col gap-[9px] sm:w-auto sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-[6px] border border-[#1a2d46] bg-transparent px-[18px] py-[8px] text-[13px] font-medium text-[#4a6680] transition-all duration-150 hover:border-[#2a4060] hover:text-[#64748b]"
              >
                Discard
              </button>

              <button
                type="submit"
                disabled={saving || isImageProcessing}
                className={`flex items-center justify-center gap-2 rounded-[6px] border px-[20px] py-[8px] text-[13px] font-semibold transition-all duration-150 ${
                  saving || isImageProcessing
                    ? "cursor-not-allowed border-[#1a2d46] bg-[#0a1628] text-[#3a5570] opacity-50 shadow-none"
                    : "border-[#3b82f680] bg-[linear-gradient(135deg,#1e3a8a,#1d4ed8_50%,#0369a1)] text-[#dbeafe] shadow-[0_0_24px_#1d4ed830,inset_0_1px_0_rgba(255,255,255,0.08)]"
                }`}
              >
                <Save size={13} />
                {saving || isImageProcessing ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}