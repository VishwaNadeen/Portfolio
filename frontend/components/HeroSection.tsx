"use client";

import { useEffect, useState, useCallback } from "react";

/* Mouse parallax hook */
function useMouse() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

/* Glitch effect on name */
function GlitchName({ name }: { name: string }) {
  const [glitching, setGlitching] = useState(false);
  const trigger = useCallback(() => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 600);
  }, []);

  return (
    <span
      className="relative inline-block cursor-default select-none"
      onMouseEnter={trigger}
    >
      <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientMove_6s_linear_infinite]">
        {name}
      </span>
      {glitching && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-rose-400 to-fuchsia-400 bg-clip-text text-transparent [clip-path:inset(30%_0_50%_0)] [mix-blend-mode:screen] [transform:translate(-3px,2px)]"
          >
            {name}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent [clip-path:inset(60%_0_20%_0)] [mix-blend-mode:screen] [transform:translate(3px,-2px)]"
          >
            {name}
          </span>
        </>
      )}
    </span>
  );
}

/* Main Component */
export default function HeroSection() {
  const mouse = useMouse();

  const px = (mouse.x - 0.5) * 40;
  const py = (mouse.y - 0.5) * 40;

  return (
    <>
      <style>{`
        @keyframes scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950/70 to-slate-900/40 p-8 backdrop-blur-xl md:p-12">
        {/* scan line */}
        <div className="pointer-events-none absolute inset-0 h-[60px] bg-[linear-gradient(transparent_0%,rgba(103,232,249,0.03)_50%,transparent_100%)] animate-[scan_8s_linear_infinite]" />

        {/* mouse-parallax glows */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl transition-transform duration-300 ease-out"
          style={{ transform: `translate(${-px * 0.4}px, ${-py * 0.4}px)` }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl transition-transform duration-300 ease-out"
          style={{ transform: `translate(${px * 0.3}px, ${py * 0.3}px)` }}
        />

        {/* floating particles */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute top-12 left-12 h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <div className="absolute top-24 right-20 h-2 w-2 rounded-full bg-blue-400 animate-ping" />
          <div className="absolute bottom-20 left-1/3 h-2 w-2 rounded-full bg-cyan-300 animate-ping" />
        </div>

        {/* ── content ── */}
        <div className="relative space-y-6 animate-[rise_0.65s_cubic-bezier(.22,.8,.5,1)_0.1s_both] opacity-0">
          {/* heading */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Hi, I'm{" "}
              <GlitchName name="Vishwa Nadeen" />
            </h1>
          </div>

          {/* description */}
          <p className="text-base leading-8 text-slate-300 text-justify md:text-lg">
            I'm a full-stack developer from Sri Lanka who enjoys building modern,
            scalable web applications and exploring new technologies. I work mainly
            with JavaScript, React, Next.js, and Node.js to create clean,
            efficient, and user-friendly digital experiences. I enjoy turning ideas
            into real products while continuously improving my skills through
            practical projects and learning.
          </p>
        </div>
      </section>
    </>
  );
}