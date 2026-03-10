"use client";

import { useEffect, useRef, useState } from "react";
import StatCard from "./statCard";

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
  fetchedAt: { github: string | null; youtube: string | null };
};

type Props = {
  stats: StatsResponse | null;
};

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

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
        @keyframes slide-x-in {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-x-in-r {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes heading-reveal {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes data-flicker {
          0%,100% { opacity: 1; }
          92%     { opacity: 1; }
          93%     { opacity: 0.45; }
          94%     { opacity: 1; }
          97%     { opacity: 0.65; }
          98%     { opacity: 1; }
        }
      `}</style>

      <section className="space-y-4 sm:space-y-5" ref={ref}>
        {/* heading */}
        <h2
          className={[
            "text-lg font-semibold text-white opacity-0 sm:text-xl",
            visible
              ? "animate-[heading-reveal_0.5s_cubic-bezier(.22,.8,.5,1)_both]"
              : "",
          ].join(" ")}
        >
          Live Stats
        </h2>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {/* GitHub card — slides in from left */}
          <div
            className={[
              "opacity-0",
              visible
                ? "animate-[slide-x-in_0.6s_cubic-bezier(.22,.8,.5,1)_0.1s_both]"
                : "",
            ].join(" ")}
          >
            <div className="rounded-xl transition-[transform,filter] duration-[250ms] ease-[cubic-bezier(.22,.8,.5,1)] will-change-transform hover:-translate-y-1 hover:drop-shadow-[0_12px_24px_rgba(6,182,212,0.12)]">
              <div className="animate-[data-flicker_6s_ease-in-out_infinite]">
                <StatCard
                  title="GitHub"
                  subtitle={github?.username ? `@${github.username}` : "Not available"}
                  link={github?.profileUrl}
                  items={[
                    { label: "Projects", value: github?.publicRepos ?? 0 },
                    { label: "Followers", value: github?.followers ?? 0 },
                    { label: "Status", value: github ? "Live" : "N/A" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* YouTube card — slides in from right */}
          <div
            className={[
              "opacity-0",
              visible
                ? "animate-[slide-x-in-r_0.6s_cubic-bezier(.22,.8,.5,1)_0.25s_both]"
                : "",
            ].join(" ")}
          >
            <div className="rounded-xl transition-[transform,filter] duration-[250ms] ease-[cubic-bezier(.22,.8,.5,1)] will-change-transform hover:-translate-y-1 hover:drop-shadow-[0_12px_24px_rgba(6,182,212,0.12)]">
              <div
                className="animate-[data-flicker_6s_ease-in-out_infinite]"
                style={{ animationDelay: "1.5s" }}
              >
                <StatCard
                  title="YouTube"
                  subtitle={youtube?.title || "Not available"}
                  link={youtubeLink}
                  items={[
                    { label: "Subscribers", value: youtube?.subscribers ?? 0 },
                    { label: "Videos", value: youtube?.videoCount ?? 0 },
                    { label: "Views", value: youtube?.viewCount ?? 0 },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}