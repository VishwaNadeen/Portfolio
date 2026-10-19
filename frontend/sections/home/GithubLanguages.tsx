"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  lang: string;
  bytes: number;
  pct: number;
  /** number of projects (repos) that use this language */
  projects?: number;
};

type ApiResponse = {
  user: string;
  totalBytes: number;
  /** total number of projects (repos) analysed */
  totalProjects?: number;
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

const FALLBACK_COLOR = "#94a3b8";
const VISIBLE_COUNT = 6;
const EASE = "cubic-bezier(.22,.8,.5,1)";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function GithubLanguages() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [err, setErr] = useState("");
  const [grown, setGrown] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;

    (async () => {
      try {
        const res = await fetch("/api/github/languages");
        const json = (await res.json()) as Partial<ApiResponse> & { error?: string };
        if (!res.ok) throw new Error(json.error || "Failed to load GitHub languages");
        if (!mounted) return;
        setData(json as ApiResponse);
        timer = setTimeout(() => mounted && setGrown(true), 60);
      } catch (e: unknown) {
        if (mounted) setErr(e instanceof Error ? e.message : "Unknown error");
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const items = useMemo(() => (data ? data.items : []), [data]);
  const top = items[0];
  const firstRows = items.slice(0, VISIBLE_COUNT);
  const extraRows = items.slice(VISIBLE_COUNT);
  const hiddenCount = extraRows.length;

  const colorOf = (lang: string) => LANG_COLORS[lang] || FALLBACK_COLOR;

  const renderRow = (it: Item, i: number, animated = false) => {
    const color = colorOf(it.lang);
    const active = hovered === it.lang;
    const dim = hovered !== null && !active;

    return (
      <li
        key={it.lang}
        onMouseEnter={() => setHovered(it.lang)}
        onMouseLeave={() => setHovered(null)}
        className="group flex items-center gap-3 rounded-lg px-2 py-2"
        style={{
          opacity: animated ? (showAll ? (dim ? 0.45 : 1) : 0) : dim ? 0.45 : 1,
          transform: animated ? (showAll ? "translateY(0)" : "translateY(-6px)") : undefined,
          backgroundColor: active ? "rgba(255,255,255,0.06)" : "transparent",
          transition: animated
            ? `opacity 350ms ${EASE} ${showAll ? i * 45 : 0}ms, transform 350ms ${EASE} ${
                showAll ? i * 45 : 0
              }ms, background-color 200ms ease`
            : "opacity 200ms ease, background-color 200ms ease",
        }}
      >
        <span
          className="size-2.5 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125"
          style={{
            backgroundColor: color,
            boxShadow: active ? `0 0 10px 2px ${color}66` : "none",
          }}
        />

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-200">
          {it.lang}
        </span>

        {typeof it.projects === "number" && (
          <span className="hidden whitespace-nowrap text-xs tabular-nums text-slate-500 sm:inline">
            {plural(it.projects, "project")}
          </span>
        )}

        <span
          className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums transition-colors duration-200"
          style={{ color: active ? color : "#e2e8f0" }}
        >
          {it.pct.toFixed(1)}%
        </span>
      </li>
    );
  };

  return (
    <section className="space-y-4 sm:space-y-5">
      <h2 className="text-lg font-semibold text-white sm:text-xl">Languages</h2>

      <div className="animate-[fade-up_0.65s_cubic-bezier(.22,.8,.5,1)_forwards] opacity-0">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:p-6">
          {/* ambient glow from the top / hovered language */}
          {top && (
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-20 blur-3xl transition-colors duration-500"
              style={{ backgroundColor: colorOf(hovered ?? top.lang) }}
            />
          )}

          {err ? (
            <div role="alert" className="relative text-sm text-red-300">
              Couldn&apos;t load languages: {err}
            </div>
          ) : !data ? (
            <div className="relative animate-pulse space-y-5">
              <div className="h-3 w-32 rounded bg-white/10" />
              <div className="h-8 w-48 rounded bg-white/10" />
              <div className="h-3 w-full rounded-full bg-white/10" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-xl bg-white/[0.06]" />
                ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* header: headline stat */}
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                    Most used
                  </p>
                  <p className="mt-1 flex items-baseline gap-2">
                    <span
                      className="truncate text-2xl font-semibold tracking-tight sm:text-3xl"
                      style={{ color: colorOf(top?.lang ?? "") }}
                    >
                      {top?.lang ?? "—"}
                    </span>
                    {top && (
                      <span className="text-sm font-medium tabular-nums text-slate-300">
                        {top.pct.toFixed(1)}%
                      </span>
                    )}
                  </p>
                </div>

                <div className="shrink-0 text-right text-xs text-slate-400">
                  <p className="tabular-nums">
                    <span className="font-semibold text-slate-200">{items.length}</span> languages
                  </p>
                  {typeof data.totalProjects === "number" && (
                    <p className="tabular-nums">
                      across{" "}
                      <span className="font-semibold text-slate-200">{data.totalProjects}</span>{" "}
                      projects
                    </p>
                  )}
                </div>
              </div>

              {/* stacked composition bar */}
              <div
                className="mt-5 flex h-3 w-full gap-[2px] overflow-hidden rounded-full sm:h-3.5"
                role="img"
                aria-label={`Language breakdown: ${items
                  .slice(0, 5)
                  .map((i) => `${i.lang} ${i.pct.toFixed(1)}%`)
                  .join(", ")}`}
              >
                {items.map((it, idx) => {
                  const dim = hovered !== null && hovered !== it.lang;
                  return (
                    <div
                      key={it.lang}
                      onMouseEnter={() => setHovered(it.lang)}
                      onMouseLeave={() => setHovered(null)}
                      className="h-full cursor-pointer first:rounded-l-full last:rounded-r-full"
                      style={{
                        width: grown ? `${Math.max(0.6, it.pct)}%` : "0%",
                        backgroundColor: colorOf(it.lang),
                        opacity: dim ? 0.25 : 1,
                        transition: `width 900ms ${EASE} ${idx * 50}ms, opacity 200ms ease`,
                      }}
                      title={`${it.lang} · ${it.pct.toFixed(1)}%`}
                    />
                  );
                })}
              </div>

              {/* legend: always-visible rows */}
              <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                {firstRows.map((it, i) => renderRow(it, i))}
              </ul>

              {/* legend: collapsible extra rows (height + stagger animation) */}
              {hiddenCount > 0 && (
                <>
                  <div
                    id="more-languages"
                    aria-hidden={!showAll}
                    className="grid"
                    style={{
                      gridTemplateRows: showAll ? "1fr" : "0fr",
                      transition: `grid-template-rows 450ms ${EASE}`,
                    }}
                  >
                    <div className="overflow-hidden">
                      <ul className="grid grid-cols-1 gap-x-6 gap-y-1 pt-1 sm:grid-cols-2">
                        {extraRows.map((it, i) => renderRow(it, i, true))}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    aria-expanded={showAll}
                    aria-controls="more-languages"
                    className="group mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                  >
                    <span>{showAll ? "Show less" : `Show ${hiddenCount} more`}</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3.5 transition-transform duration-300"
                      style={{ transform: showAll ? "rotate(180deg)" : "rotate(0deg)" }}
                      aria-hidden
                    >
                      <path d="M5 8l5 5 5-5" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}