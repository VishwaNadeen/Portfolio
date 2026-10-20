"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

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

/* Tailwind can only generate classes it can read as complete strings in the
   source, so each language's colors are written out in full (not built from a
   variable). bg = dot / bar / glow, text = percentage, glow = dot halo. */
type LangStyle = { bg: string; text: string; glow: string };

const LANG_STYLES: Record<string, LangStyle> = {
  TypeScript: { bg: "bg-[#3178c6]", text: "text-[#3178c6]", glow: "shadow-[0_0_10px_2px_#3178c666]" },
  JavaScript: { bg: "bg-[#f1e05a]", text: "text-[#f1e05a]", glow: "shadow-[0_0_10px_2px_#f1e05a66]" },
  HTML: { bg: "bg-[#e34c26]", text: "text-[#e34c26]", glow: "shadow-[0_0_10px_2px_#e34c2666]" },
  CSS: { bg: "bg-[#563d7c]", text: "text-[#563d7c]", glow: "shadow-[0_0_10px_2px_#563d7c66]" },
  Python: { bg: "bg-[#3572A5]", text: "text-[#3572A5]", glow: "shadow-[0_0_10px_2px_#3572A566]" },
  Java: { bg: "bg-[#b07219]", text: "text-[#b07219]", glow: "shadow-[0_0_10px_2px_#b0721966]" },
  "C#": { bg: "bg-[#178600]", text: "text-[#178600]", glow: "shadow-[0_0_10px_2px_#17860066]" },
  C: { bg: "bg-[#555555]", text: "text-[#555555]", glow: "shadow-[0_0_10px_2px_#55555566]" },
  "C++": { bg: "bg-[#f34b7d]", text: "text-[#f34b7d]", glow: "shadow-[0_0_10px_2px_#f34b7d66]" },
  PHP: { bg: "bg-[#4F5D95]", text: "text-[#4F5D95]", glow: "shadow-[0_0_10px_2px_#4F5D9566]" },
  Go: { bg: "bg-[#00ADD8]", text: "text-[#00ADD8]", glow: "shadow-[0_0_10px_2px_#00ADD866]" },
  Kotlin: { bg: "bg-[#A97BFF]", text: "text-[#A97BFF]", glow: "shadow-[0_0_10px_2px_#A97BFF66]" },
  Dart: { bg: "bg-[#00B4AB]", text: "text-[#00B4AB]", glow: "shadow-[0_0_10px_2px_#00B4AB66]" },
  Swift: { bg: "bg-[#F05138]", text: "text-[#F05138]", glow: "shadow-[0_0_10px_2px_#F0513866]" },
  Shell: { bg: "bg-[#89e051]", text: "text-[#89e051]", glow: "shadow-[0_0_10px_2px_#89e05166]" },
  Ruby: { bg: "bg-[#701516]", text: "text-[#701516]", glow: "shadow-[0_0_10px_2px_#70151666]" },
  Rust: { bg: "bg-[#dea584]", text: "text-[#dea584]", glow: "shadow-[0_0_10px_2px_#dea58466]" },
  Scala: { bg: "bg-[#c22d40]", text: "text-[#c22d40]", glow: "shadow-[0_0_10px_2px_#c22d4066]" },
  Vue: { bg: "bg-[#41b883]", text: "text-[#41b883]", glow: "shadow-[0_0_10px_2px_#41b88366]" },
  SCSS: { bg: "bg-[#c6538c]", text: "text-[#c6538c]", glow: "shadow-[0_0_10px_2px_#c6538c66]" },
  JSX: { bg: "bg-[#61dafb]", text: "text-[#61dafb]", glow: "shadow-[0_0_10px_2px_#61dafb66]" },
  TSX: { bg: "bg-[#3178c6]", text: "text-[#3178c6]", glow: "shadow-[0_0_10px_2px_#3178c666]" },
};

const FALLBACK_STYLE: LangStyle = {
  bg: "bg-[#94a3b8]",
  text: "text-[#94a3b8]",
  glow: "shadow-[0_0_10px_2px_#94a3b866]",
};

const VISIBLE_COUNT = 6;

/* Transitions with per-property timing, written as Tailwind arbitrary
   properties. --d is the per-item delay passed in from the component. */
const ROW_TRANSITION =
  "[transition:opacity_200ms_ease,background-color_200ms_ease]";
const ROW_ANIMATED_TRANSITION =
  "[transition:opacity_350ms_cubic-bezier(.22,.8,.5,1)_var(--d),transform_350ms_cubic-bezier(.22,.8,.5,1)_var(--d),background-color_200ms_ease]";
const BAR_TRANSITION =
  "[transition:width_900ms_cubic-bezier(.22,.8,.5,1)_var(--d),opacity_200ms_ease]";

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

  const styleOf = (lang: string): LangStyle => LANG_STYLES[lang] || FALLBACK_STYLE;

  // Hover highlight only for mouse / pen. Touch emulates mouseenter on tap and
  // never fires mouseleave, which left rows dimmed ("stuck") on phones.
  const hoverProps = (lang: string) => ({
    onPointerEnter: (e: ReactPointerEvent) => {
      if (e.pointerType !== "touch") setHovered(lang);
    },
    onPointerLeave: (e: ReactPointerEvent) => {
      if (e.pointerType !== "touch") setHovered(null);
    },
  });

  const renderRow = (it: Item, i: number, animated = false) => {
    const lang = styleOf(it.lang);
    const active = hovered === it.lang;
    const dim = hovered !== null && !active;

    const rowState = animated
      ? `${showAll ? (dim ? "opacity-[0.45]" : "opacity-100") : "opacity-0"} ${
          showAll ? "[transform:translateY(0)]" : "[transform:translateY(-6px)]"
        } ${ROW_ANIMATED_TRANSITION}`
      : `${dim ? "opacity-[0.45]" : "opacity-100"} ${ROW_TRANSITION}`;

    return (
      <li
        key={it.lang}
        {...hoverProps(it.lang)}
        className={`group flex items-center gap-3 rounded-lg px-2 py-2 ${
          active ? "bg-white/[0.06]" : "bg-transparent"
        } ${rowState}`}
        style={
          animated
            ? ({ "--d": `${showAll ? i * 45 : 0}ms` } as CSSProperties)
            : undefined
        }
      >
        <span
          className={`size-2.5 shrink-0 rounded-full transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-125 ${
            lang.bg
          } ${active ? lang.glow : "shadow-none"}`}
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
          className={`w-12 shrink-0 whitespace-nowrap text-right text-sm font-semibold tabular-nums transition-colors duration-200 ${
            active ? lang.text : "text-slate-200"
          }`}
        >
          {it.pct.toFixed(1)}%
        </span>
      </li>
    );
  };

  return (
    <section className="min-w-0 space-y-4 sm:space-y-5">
      <h2 className="text-lg font-semibold text-white sm:text-xl">Languages</h2>

      <div className="animate-[fade-up_0.65s_cubic-bezier(.22,.8,.5,1)_forwards] opacity-0">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:p-6">
          {/* ambient glow from the top / hovered language */}
          {top && (
            <div
              aria-hidden
              className={`pointer-events-none absolute -right-16 -top-16 size-48 transform-gpu rounded-full opacity-20 blur-3xl transition-colors duration-500 ${
                styleOf(hovered ?? top.lang).bg
              }`}
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
                      className={`min-w-0 truncate text-2xl font-semibold tracking-tight sm:text-3xl ${
                        styleOf(top?.lang ?? "").text
                      }`}
                    >
                      {top?.lang ?? "—"}
                    </span>
                    {top && (
                      <span className="shrink-0 whitespace-nowrap text-sm font-medium tabular-nums text-slate-300">
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
                      {...hoverProps(it.lang)}
                      className={`h-full cursor-pointer first:rounded-l-full last:rounded-r-full ${
                        styleOf(it.lang).bg
                      } ${grown ? "w-[var(--w)]" : "w-0"} ${
                        dim ? "opacity-25" : "opacity-100"
                      } ${BAR_TRANSITION}`}
                      style={
                        {
                          "--w": `${Math.max(0.6, it.pct)}%`,
                          "--d": `${idx * 50}ms`,
                        } as CSSProperties
                      }
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
                    className={`grid transition-[grid-template-rows] duration-[450ms] ease-[cubic-bezier(.22,.8,.5,1)] ${
                      showAll ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
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
                    className="group mt-3 flex w-full touch-manipulation items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-medium text-slate-300 transition-colors [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:hover:border-white/20 [@media(hover:hover)]:hover:bg-white/[0.05] [@media(hover:hover)]:hover:text-white [@media(pointer:coarse)]:min-h-11"
                  >
                    <span>{showAll ? "Show less" : `Show ${hiddenCount} more`}</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`size-3.5 transition-transform duration-300 ${
                        showAll ? "rotate-180" : "rotate-0"
                      }`}
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