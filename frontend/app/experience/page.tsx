
import type { Metadata } from "next";
import BackgroundAnimation from "@/components/animation/BackgroundAnimation";
import { Clock3, Sparkles } from "lucide-react";
import PageTransition from "@/components/animation/PageTransition";

export const metadata: Metadata = {
  title: "Experience | Vishwa Nadeen",
  description: "Professional experience — coming soon.",
  alternates: {
    canonical: "https://vishwanadeen.lk/experience",
  },
};

export default function ExperiencePage() {
  return (
    <PageTransition>
    <main className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <BackgroundAnimation />

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-10">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] shadow-[0_0_45px_rgba(34,211,238,0.08)] transition-transform duration-300 hover:scale-105 sm:mb-8 sm:h-20 sm:w-20 sm:rounded-3xl">
            <Clock3
              className="text-cyan-300"
              size={32}
              strokeWidth={1.5}
            />
          </div>

          {/* Status */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300 sm:text-xs">
            <Sparkles size={14} />
            Under Development
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Experience
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-md px-2 text-sm leading-7 text-slate-400 sm:mt-6 sm:text-base">
            Something exciting is on the way. This page is currently
            under development.
          </p>

          {/* Accent */}
          <div className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent sm:mt-10" />
        </div>
      </section>
    </main>
    </PageTransition>
  );
}
