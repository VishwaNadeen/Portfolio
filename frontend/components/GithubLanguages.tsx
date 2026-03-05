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
};

export default function GithubLanguages() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [err, setErr] = useState<string>("");

  // animated widths
  const [w, setW] = useState<Record<string, number>>({});

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

        // start widths at 0 for animation (top10 only)
        const top = full.items.slice(0, 10);
        const zero: Record<string, number> = {};
        for (const it of top) zero[it.lang] = 0;
        setW(zero);

        // animate to real widths
        setTimeout(() => {
          if (!mounted) return;
          const target: Record<string, number> = {};
          for (const it of top) target[it.lang] = Math.max(0, Math.min(100, it.pct));
          setW(target);
        }, 30);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (mounted) setErr(msg);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const top10 = useMemo(() => {
    if (!data) return [];
    return data.items.slice(0, 10);
  }, [data]);

  if (err) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h3 className="text-base font-semibold">GitHub Usage</h3>
        <p className="mt-2 text-sm opacity-80">Error: {err}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h3 className="text-base font-semibold">GitHub Usage</h3>
        <p className="mt-2 text-sm opacity-80">Loading...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h3 className="text-base font-semibold">GitHub Usage (Languages %)</h3>

      {/* Breakdown list (percent only) */}
      <div className="mt-5 space-y-4">
        {top10.map((it) => {
          const color = LANG_COLORS[it.lang] || "rgba(255,255,255,0.55)";
          const width = w[it.lang] ?? 0;

          return (
            <div key={it.lang} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: color }}
                    aria-hidden
                  />
                  <span className="opacity-90">{it.lang}</span>
                </div>

                <span className="opacity-80 font-medium">{it.pct.toFixed(1)}%</span>
              </div>

              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(0, Math.min(100, width))}%`,
                    background: color,
                    opacity: 0.9,
                  }}
                  aria-label={`${it.lang} ${it.pct.toFixed(1)}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}