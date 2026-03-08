"use client";

import { useEffect, useState } from "react";
import { getPublicCvDownloadUrl, getPublicCv } from "@/lib/cvApi";

export default function AboutHero() {
  const [hasCv, setHasCv] = useState(false);
  const [cvLoading, setCvLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function checkCv() {
      try {
        const cv = await getPublicCv();

        if (!ignore) {
          setHasCv(!!cv);
        }
      } catch {
        if (!ignore) {
          setHasCv(false);
        }
      } finally {
        if (!ignore) {
          setCvLoading(false);
        }
      }
    }

    checkCv();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl md:p-12">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      {/* content */}
        <div className="relative space-y-6">

        {/* heading */}
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            About Me
        </h1>

        {/* description */}
        <p
            className="text-base leading-8 text-slate-300 md:text-lg"
            style={{ textAlign: "justify" }}
        >
            I'm a full-stack developer from Sri Lanka passionate about building
            modern web applications and exploring new technologies. I mainly work
            with JavaScript, React, Next.js, and Node.js to create clean,
            efficient, and user-friendly digital experiences. I'm currently an
            undergraduate at SLIIT following the BSc (Hons) in Software
            Engineering program.
        </p>

        </div>
    </section>
  );
}