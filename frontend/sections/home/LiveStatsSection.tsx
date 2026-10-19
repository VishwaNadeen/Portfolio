"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type StatsResponse = {
  github: null | {
    username: string;
    followers: number;
    publicRepos: number;
    profileUrl: string;
  };
  youtube: null | {
    channelId: string;
    title: string;
    subscribers: number;
    videoCount: number;
    viewCount: number;
    channelUrl?: string;
  };
  fetchedAt: {
    github: string | null;
    youtube: string | null;
  };
};

type Props = {
  stats: StatsResponse | null;
};

/* ───────────────────── Helpers ───────────────────── */

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function useCountUp(
  target: number,
  active: boolean,
  duration = 1200
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || target === 0) {
      setCount(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(
        1,
        (now - start) / duration
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return count;
}

function formatValue(value: number, target: number) {
  return target >= 100_000
    ? new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value)
    : value.toLocaleString("en-US");
}

/* ───────────────────── Brand Icons ───────────────────── */

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-6 text-white"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 28 20"
      className="h-5 w-7"
      aria-hidden="true"
    >
      <rect width="28" height="20" rx="5.5" fill="#FF0000" />
      <path d="M11.2 5.8v8.4L18.6 10z" fill="#fff" />
    </svg>
  );
}

/* ───────────────────── Count Up ───────────────────── */

function CountUp({
  value,
  active,
}: {
  value: number;
  active: boolean;
}) {
  const count = useCountUp(value, active);
  return <>{formatValue(count, value)}</>;
}

/* ───────────────────── Platform Card ───────────────────── */

type StatRow = {
  label: string;
  value: number;
};

function PlatformCard({
  icon,
  name,
  handle,
  link,
  rows,
  live,
  active,
  accent,
}: {
  icon: ReactNode;
  name: string;
  handle: string | null;
  link?: string;
  rows: StatRow[];
  live: boolean;
  active: boolean;
  accent: "cyan" | "red";
}) {
  const accentStyles =
    accent === "cyan"
      ? {
          icon: "border-cyan-400/20 bg-cyan-400/10",
          hover: "group-hover:border-cyan-400/30",
          link: "text-cyan-300 hover:text-cyan-200",
          glow: "bg-cyan-400/5",
        }
      : {
          icon: "border-red-400/20 bg-red-400/10",
          hover: "group-hover:border-red-400/30",
          link: "text-red-300 hover:text-red-200",
          glow: "bg-red-400/5",
        };

  return (
    <article
      className={`group relative isolate overflow-hidden rounded-2xl border border-white/[0.09] bg-slate-900/45 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:bg-slate-900/70 hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] motion-reduce:transform-none motion-reduce:transition-none sm:p-6 ${accentStyles.hover}`}
    >
      {/* Subtle hover glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-16 -z-10 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${accentStyles.glow}`}
      />

      {/* Platform heading */}
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none ${accentStyles.icon}`}
        >
          {icon}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white sm:text-lg">
            {name}
          </h3>

          {live && handle && link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`block truncate text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${accentStyles.link}`}
            >
              {handle}
              <span className="ml-1" aria-hidden="true">↗</span>
            </a>
          ) : (
            <p className="truncate text-sm text-slate-500">
              {handle ?? "Not connected"}
            </p>
          )}
        </div>
      </div>

      {/* Statistics */}
      <dl
        className={`mt-6 grid ${
          rows.length === 2 ? "grid-cols-2" : "grid-cols-3"
        } gap-3 sm:gap-4`}
      >
        {rows.map((row) => (
          <div key={row.label} className="min-w-0">
            <dd
              className={`text-2xl font-bold tracking-tight tabular-nums sm:text-3xl ${
                live ? "text-white" : "text-slate-600"
              }`}
            >
              {live ? (
                <CountUp value={row.value} active={active} />
              ) : (
                "—"
              )}
            </dd>

            <dt className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
              {row.label}
            </dt>
          </div>
        ))}
      </dl>

      {!live && (
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Couldn&apos;t load these statistics. Refresh the page to try again.
        </p>
      )}

      {/* Bottom accent */}
      <div
        aria-hidden="true"
        className={`mt-5 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${
          accent === "cyan" ? "bg-cyan-400/40" : "bg-red-400/40"
        }`}
      />
    </article>
  );
}

/* ───────────────────── Main Section ───────────────────── */

export default function LiveStatsSection({ stats }: Props) {
  const github = stats?.github ?? null;
  const youtube = stats?.youtube ?? null;

  const { ref, visible } = useInView();

  const youtubeLink =
    youtube?.channelUrl ||
    (youtube?.channelId
      ? `https://www.youtube.com/channel/${youtube.channelId}`
      : undefined);

  return (
    <>
      <style>{`
        @keyframes activity-enter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes subtitle-reveal {
          from {
            opacity: 0;
            transform: translateY(8px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .activity-enter,
          .activity-subtitle {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      <section
        ref={ref}
        aria-labelledby="live-stats-heading"
        className="space-y-5 sm:space-y-6"
      >
        {/* Section heading */}
        <div
          className={`activity-enter ${
            visible ? "animate-[activity-enter_650ms_cubic-bezier(.22,.8,.5,1)_both]" : "opacity-0"
          }`}
        >
          <h2
            id="live-stats-heading"
            className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
          >
            Developer Activity
          </h2>
        
        </div>

        {/* Platform cards */}
        <div
          className={`grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 ${
            visible ? "" : "opacity-0"
          }`}
        >
          <div
            className={
              visible
                ? "animate-[activity-enter_650ms_cubic-bezier(.22,.8,.5,1)_150ms_both]"
                : ""
            }
          >
            <PlatformCard
              icon={<GitHubIcon />}
              name="GitHub"
              handle={github?.username ? `@${github.username}` : null}
              link={github?.profileUrl}
              live={!!github}
              rows={[
                {
                  label: "Repositories",
                  value: github?.publicRepos ?? 0,
                },
                {
                  label: "Followers",
                  value: github?.followers ?? 0,
                },
              ]}
              active={visible}
              accent="cyan"
            />
          </div>

          <div
            className={
              visible
                ? "animate-[activity-enter_650ms_cubic-bezier(.22,.8,.5,1)_300ms_both]"
                : ""
            }
          >
            <PlatformCard
              icon={<YouTubeIcon />}
              name="YouTube"
              handle={youtube?.title ?? null}
              link={youtubeLink}
              live={!!youtube}
              rows={[
                {
                  label: "Subscribers",
                  value: youtube?.subscribers ?? 0,
                },
                {
                  label: "Videos",
                  value: youtube?.videoCount ?? 0,
                },
                {
                  label: "Views",
                  value: youtube?.viewCount ?? 0,
                },
              ]}
              active={visible}
              accent="red"
            />
          </div>
        </div>
      </section>
    </>
  );
}
