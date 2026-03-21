import ProjectCard from "../components/projectCard";
import { getLatestStats, getFeaturedGitHubProjects } from "../lib/api";
import GithubLanguages from "@/components/home/GithubLanguages";
import HeroSection from "@/components/home/HeroSection";
import LiveStatsSection from "@/components/home/LiveStatsSection";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import TechStackStrip from "@/components/home/TechStackStrip";
import Social3DIcons from "@/components/home/Social3DIcons";
import VisitTracker from "@/components/home/VisitTracker";
import BackgroundAnimation from "@/components/animation/BackgroundAnimation";

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
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <VisitTracker />

      <BackgroundAnimation />

      <div className="relative z-10 mx-auto max-w-5xl space-y-10 px-4 py-8 sm:space-y-12 sm:py-10 md:space-y-14 md:py-12">
        <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-25">
          <HeroSection />
          <Social3DIcons />
        </div>

        <TechStackStrip />
        <LiveStatsSection stats={stats} />

        {/*
        // GITHUB LANGUAGES
        <section className="space-y-5">
          <h2 className="text-xl font-semibold text-white">Languages</h2>
          <div className="animate-[fade-up_0.65s_cubic-bezier(.22,.8,.5,1)_forwards] opacity-0">
            <GithubLanguages />
          </div>
        </section> */}

        <section className="space-y-5 sm:space-y-6">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Featured Projects
          </h2>

          <div className="grid items-stretch gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((p: any, i: number) => {
              const techArr =
                Array.isArray(p.topics) && p.topics.length
                  ? p.topics
                  : [p.language].filter(Boolean);

              const mapped = {
                title: p.customTitle || p.name,
                description:
                  p.customDescription ||
                  p.description ||
                  "No description available for this project.",
                tech: techArr,
                link: p.liveUrl || p.htmlUrl || "",
                githubUrl: p.htmlUrl || "",
                imageUrl: p.imageUrl || "",
                type: p.type || "",
                platform: p.platform || "",
                stars: p.stars ?? 0,
                forks: p.forks ?? 0,
              };

              return (
                <div
                  key={p._id || p.repoId || mapped.title}
                  className="h-full animate-[fade-up_0.65s_cubic-bezier(.22,.8,.5,1)_forwards] opacity-0"
                  style={{ animationDelay: `${150 + i * 90}ms` }}
                >
                  <ProjectCard project={mapped as any} />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <ScrollToTopButton />

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}