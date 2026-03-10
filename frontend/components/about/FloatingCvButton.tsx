"use client";

import { useEffect, useState } from "react";
import { getPublicCv, getPublicCvDownloadUrl } from "@/lib/cvApi";

export default function FloatingCvButton() {
  const [hasCv, setHasCv] = useState(false);

  useEffect(() => {
    async function checkCv() {
      try {
        const cv = await getPublicCv();
        setHasCv(!!cv);
      } catch {
        setHasCv(false);
      }
    }

    checkCv();
  }, []);

  if (!hasCv) return null;

  return (
    <a
      href={getPublicCvDownloadUrl()}
      download
      className="fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-400/20 hover:text-cyan-200 sm:bottom-6 sm:right-6 sm:px-5 sm:py-3 sm:text-sm md:right-25"
    >
      ⬇ Download CV
    </a>
  );
}