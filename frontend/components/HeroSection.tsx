"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPublicCv, getPublicCvDownloadUrl } from "../lib/cvApi";

export default function HeroSection() {
  const [hasCv, setHasCv] = useState(false);
  const [cvLoading, setCvLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadCv() {
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

    loadCv();

    return () => {
      ignore = true;
    };
  }, []);

  const actionBtnClass =
    "group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:opacity-95 hover:shadow-[0_0_0_6px_rgba(34,211,238,0.12)]";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-6 backdrop-blur md:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="space-y-5 fade-up">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
          Hi, I’m{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Vishwa Nadeen
          </span>
        </h1>

        <p className="w-full text-base text-justify font-sans leading-8 tracking-normal text-slate-300 md:text-lg">
          I’m a full-stack developer from Sri Lanka who enjoys building modern,
          scalable web applications and exploring new technologies. I work mainly
          with JavaScript, React, Next.js, and Node.js to create clean,
          efficient, and user-friendly digital experiences. I enjoy turning ideas
          into real products while continuously improving my skills through
          practical projects and learning.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          {!cvLoading && hasCv && (
            <a href={getPublicCvDownloadUrl()} download className={actionBtnClass}>
              <span className="mr-2">⬇</span>
              Download CV
            </a>
          )}

          <Link href="/projects" className={actionBtnClass}>
            View Projects
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}