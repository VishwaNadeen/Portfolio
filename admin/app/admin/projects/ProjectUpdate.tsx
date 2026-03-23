"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
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
  const [imageAction, setImageAction] = useState<"idle" | "uploading" | "deleting">(
    "idle"
  );

  useEffect(() => {
    setSelectedImageFile(null);
    setPreviewUrl("");
    setPendingRemoveImage(false);
    setImageAction("idle");
  }, [editing?._id]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const displayImageSrc = useMemo(() => {
    if (pendingRemoveImage && !previewUrl) return DEFAULT_PROJECT_IMAGE;
    if (previewUrl) return previewUrl;
    return editing?.imageUrl || DEFAULT_PROJECT_IMAGE;
  }, [editing?.imageUrl, pendingRemoveImage, previewUrl]);

  if (!editing) return null;

  const isUploading = imageAction === "uploading";
  const isDeleting = imageAction === "deleting";
  const isImageProcessing = isUploading || isDeleting;

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setSelectedImageFile(file);
    setPreviewUrl(nextPreviewUrl);
    setPendingRemoveImage(false);

    e.target.value = "";
  };

  const handleRemoveClick = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <form
          onSubmit={handleSubmit}
          className="flex max-h-[calc(100vh-24px)] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#020b2a] shadow-[0_25px_80px_rgba(0,0,0,0.55)] sm:max-h-[calc(100vh-32px)] sm:rounded-3xl"
        >
          <div className="border-b border-white/10 bg-white/[0.02] px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                  {editing.customTitle || editing.name}
                </h2>
                <p className="mt-1 break-all text-xs text-slate-400 sm:text-sm">
                  {editing?.fullName || ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditing(null)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            <label className="block text-xs text-slate-400">
              Custom Title
              <input
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
                value={editing.customTitle || ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, customTitle: e.target.value } : prev
                  )
                }
              />
            </label>

            <label className="block text-xs text-slate-400">
              Platform
              <select
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
                value={editing.platform || ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, platform: e.target.value } : prev
                  )
                }
              >
                <option value="">Select platform</option>
                {PLATFORM_OPTIONS.filter(Boolean).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs text-slate-400">
              <div className="flex items-center justify-between gap-3">
                <span>Custom Description</span>
                <span className="shrink-0 text-[11px] text-slate-500">
                  {(editing.customDescription || "").length}/{DESCRIPTION_LIMIT}
                </span>
              </div>

              <textarea
                className="mt-2 min-h-[110px] w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
                rows={4}
                maxLength={DESCRIPTION_LIMIT}
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
            </label>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-200">
                Project Image
              </label>

              <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 sm:h-44">
                <Image
                  src={displayImageSrc}
                  alt={editing.customTitle || editing.name}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    isImageProcessing ? "opacity-40" : "opacity-100"
                  }`}
                />

                {isImageProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                    <div className="w-[80%] max-w-sm">
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700/80">
                        <div className="h-full w-1/2 animate-[uploadingBar_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                      </div>
                      <p className="mt-3 text-center text-xs font-medium text-slate-200">
                        {isUploading ? "Uploading image..." : "Deleting image..."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="file"
                  accept="image/*"
                  disabled={saving || isImageProcessing}
                  onChange={handleUploadChange}
                  className="block w-full text-sm text-slate-300 file:mr-3 file:mb-2 file:rounded-xl file:border-0 file:bg-cyan-500/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cyan-200 hover:file:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:file:mb-0 sm:file:mr-4"
                />

                <button
                  type="button"
                  onClick={handleRemoveClick}
                  disabled={saving || isImageProcessing}
                  className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-60 sm:w-auto sm:shrink-0"
                >
                  Remove
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Image is saved only after clicking Save Changes.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800/70 sm:w-auto"
            >
              Cancel
            </button>

            <button
              disabled={saving || isImageProcessing}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-60 sm:w-auto"
            >
              {saving || isImageProcessing ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <style jsx>{`
            @keyframes uploadingBar {
              0% {
                transform: translateX(-120%);
              }
              100% {
                transform: translateX(320%);
              }
            }
          `}</style>
        </form>
      </div>
    </div>
  );
}