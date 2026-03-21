"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  lang: string;
  bytes: number;
  pct: number;
};

type ApiResponse = {
  user: string;
  totalBytes: number;
  items: Item[];
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  C: "#555555",
  "C++": "#f34b7d",
  PHP: "#4F5D95",
  Go: "#00ADD8",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Swift: "#F05138",
  Shell: "#89e051",
  Ruby: "#701516",
  Rust: "#dea584",
  Scala: "#c22d40",
  Vue: "#41b883",
  SCSS: "#c6538c",
  JSX: "#61dafb",
  TSX: "#3178c6",
};

export default function GithubLanguages() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [err, setErr] = useState("");
  const [w, setW] = useState<Record<string, number>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/github/languages");
        const json = (await res.json()) as Partial<ApiResponse> & { error?: string };

        if (!res.ok) throw new Error(json.error || "Failed to load GitHub languages");
        if (!mounted) return;

        const full = json as ApiResponse;
        setData(full);

        const zero: Record<string, number> = {};
        for (const it of full.items) zero[it.lang] = 0;
        setW(zero);

        setTimeout(() => {
          if (!mounted) return;
          const target: Record<string, number> = {};
          for (const it of full.items) target[it.lang] = Math.max(0, Math.min(100, it.pct));
          setW(target);
        }, 50);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (mounted) setErr(msg);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const items = useMemo(() => (data ? data.items : []), [data]);

  if (err) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-6">
        <h3 className="text-base font-semibold text-white sm:text-lg">GitHub Languages</h3>
        <p className="mt-3 text-sm text-red-300">Error: {err}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-6">
        <h3 className="text-base font-semibold text-white sm:text-lg">GitHub Languages</h3>
        <p className="mt-3 text-sm text-slate-300">Loading...</p>
      </section>
    );
  }

  return (
    <>
      <style>{`
        @keyframes bar-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pct-pop {
          from { opacity: 0; transform: translateY(4px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
      `}</style>

      <section className="rounded-2xl bg-white/[0.05] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-6">
        <h3 className="text-base font-semibold text-white sm:text-lg">GitHub Usage</h3>

        <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
          {items.map((it, idx) => {
            const color = LANG_COLORS[it.lang] || "rgba(255,255,255,0.65)";
            const width = w[it.lang] ?? 0;
            const isHov = hovered === it.lang;

            return (
              <div
                key={it.lang}
                className="group space-y-2 transition-transform duration-200 ease-[cubic-bezier(.22,.8,.5,1)] hover:translate-x-1"
                style={{ animationDelay: `${idx * 60}ms` }}
                onMouseEnter={() => setHovered(it.lang)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* label row */}
                <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    {/* dot */}
                    <span
                      className="size-2 shrink-0 rounded-full transition-transform duration-200 ease-[cubic-bezier(.22,.8,.5,1)] group-hover:scale-[1.4] sm:size-2.5"
                      style={{
                        backgroundColor: color,
                        boxShadow: isHov
                          ? `0 0 8px 3px ${color}55`
                          : `0 0 6px 1px ${color}33`,
                      }}
                      aria-hidden
                    />
                    <span className="truncate font-medium text-slate-200">{it.lang}</span>
                  </div>

                  {/* percentage */}
                  <span
                    className="ml-3 shrink-0 font-semibold tabular-nums text-xs transition-colors duration-200 animate-[pct-pop_0.4s_cubic-bezier(.22,.8,.5,1)_both] sm:ml-4 sm:text-sm"
                    style={{ color: isHov ? color : "#cbd5e1" }}
                  >
                    {it.pct.toFixed(1)}%
                  </span>
                </div>

                {/* bar track */}
                <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-white/[0.07] sm:h-[7px]">
                  <div
                    className="relative h-full rounded-full transition-[width] duration-[800ms] ease-[cubic-bezier(.22,.8,.5,1)] group-hover:brightness-125
                      after:absolute after:inset-0 after:rounded-full
                      after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.35)_50%,transparent_100%)]
                      after:bg-[length:200%_100%] after:opacity-0 after:transition-opacity after:duration-200
                      after:[animation:bar-shimmer_1.4s_linear_infinite]
                      group-hover:after:opacity-100"
                    style={{
                      width: `${Math.max(0, Math.min(100, width))}%`,
                      background: isHov
                        ? `linear-gradient(90deg, ${color}cc, ${color})`
                        : color,
                    }}
                    aria-label={`${it.lang} ${it.pct.toFixed(1)}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}