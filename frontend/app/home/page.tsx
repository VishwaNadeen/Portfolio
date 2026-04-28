import { getLatestStats, getFeaturedGitHubProjects } from "../../lib/api";
import HeroSection from "@/sections/home/HeroSection";
import LiveStatsSection from "@/sections/home/LiveStatsSection";
import ScrollToTopButton from "@/components/comon/ScrollToTopButton";
import TechStackStrip from "@/sections/home/TechStackStrip";
import Social3DIcons from "@/sections/home/Social3DIcons";
import VisitTracker from "@/sections/home/VisitTracker";
import BackgroundAnimation from "@/components/animation/BackgroundAnimation";
import FeaturedProjects from "@/sections/home/FeaturedProjects";
import GithubLanguages from "@/sections/home/GithubLanguages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vishwa Nadeen | Full Stack Developer Portfolio",
  description: "Portfolio of Vishwa Nadeen - Full Stack Developer",
  alternates: {
    canonical: "https://vishwanadeen.lk/",
  },
};

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

      <div className="relative z-10 mx-auto max-w-5xl space-y-10 px-4 pb-8 pt-28 sm:space-y-12 sm:pb-10 sm:pt-30 md:space-y-14 md:pb-12 md:pt-32">
        <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-25">
          <HeroSection />
          <Social3DIcons />
        </div>

        <TechStackStrip />
        <LiveStatsSection stats={stats} />

        {/* <GithubLanguages /> */}

        <FeaturedProjects featured={featured} />
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