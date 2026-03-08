import ProjectCard from "../components/projectCard";
import { getLatestStats, getFeaturedGitHubProjects } from "../lib/api";
import GithubLanguages from "@/components/GithubLanguages";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import LiveStatsSection from "@/components/LiveStatsSection";

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

export default async function HomePage() {
  const featured = await getFeaturedGitHubProjects(3);
  const stats = (await getLatestStats()) as StatsResponse | null;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-14">
        {/* HERO */}
        <HeroSection />

        {/* LIVE STATS */}
        <LiveStatsSection stats={stats} />

        {/* GITHUB LANGUAGES */}
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Languages</h2>
            <span className="text-sm text-slate-300">
              GitHub usage as percentage
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-3 transition-all duration-300 hover:bg-slate-900/30">
            <div className="fade-up rounded-2xl">
              <GithubLanguages />
            </div>
          </div>
        </section>

        {/* FEATURED PROJECTS */}
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Featured Projects</h2>

            <Link
              className="text-sm text-slate-300 transition-colors duration-300 hover:text-white"
              href="/projects"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((p: any, i: number) => {
              const techArr =
                Array.isArray(p.tech) && p.tech.length
                  ? p.tech
                  : Array.isArray(p.topics) && p.topics.length
                  ? p.topics
                  : [p.language].filter(Boolean);

              const mapped = {
                title: p.customTitle || p.name,
                description: p.customDescription || p.description || "",
                tech: techArr,
                link: p.htmlUrl || p.url || "",
              };

              return (
                <div
                  key={p._id || p.repoId || mapped.title}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/30"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className="fade-up rounded-2xl"
                    style={{ animationDelay: `${150 + i * 90}ms` }}
                  >
                    <ProjectCard project={mapped as any} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}