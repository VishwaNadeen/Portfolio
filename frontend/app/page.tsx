import ProjectCard from "../components/projectCard";
import { getLatestStats, getFeaturedGitHubProjects } from "../lib/api";
import GithubLanguages from "@/components/GithubLanguages";
import HeroSection from "@/components/HeroSection";
import LiveStatsSection from "@/components/LiveStatsSection";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import TechStackStrip from "@/components/TechStackStrip";
import Social3DIcons from "@/components/Social3DIcons";
import VisitTracker from "@/components/VisitTracker";

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

/* ── floating code symbols rendered server-side (stable positions) ── */
const CODE_SYMBOLS = [
  { sym: "</>", x: 5, y: 8, size: 13, delay: 0, dur: 18 },
  { sym: "{ }", x: 88, y: 12, size: 11, delay: 2, dur: 22 },
  { sym: "=>", x: 15, y: 55, size: 10, delay: 4, dur: 20 },
  { sym: "[ ]", x: 78, y: 40, size: 12, delay: 1, dur: 25 },
  { sym: "&&", x: 92, y: 68, size: 9, delay: 6, dur: 19 },
  { sym: "fn()", x: 3, y: 80, size: 11, delay: 3, dur: 23 },
  { sym: "git", x: 50, y: 5, size: 10, delay: 5, dur: 21 },
  { sym: "npm", x: 65, y: 85, size: 9, delay: 7, dur: 24 },
  { sym: "===", x: 35, y: 90, size: 10, delay: 2.5, dur: 17 },
  { sym: "||", x: 20, y: 20, size: 14, delay: 8, dur: 26 },
  { sym: "const", x: 72, y: 22, size: 9, delay: 1.5, dur: 20 },
  { sym: "async", x: 42, y: 70, size: 10, delay: 4.5, dur: 22 },
  { sym: "#", x: 58, y: 50, size: 16, delay: 0.5, dur: 28 },
  { sym: "< >", x: 10, y: 42, size: 11, delay: 9, dur: 19 },
  { sym: "return", x: 83, y: 55, size: 8, delay: 3.5, dur: 21 },
  { sym: "=>", x: 30, y: 35, size: 13, delay: 6.5, dur: 23 },
  { sym: "{ }", x: 55, y: 15, size: 9, delay: 7.5, dur: 18 },
  { sym: "*.ts", x: 95, y: 30, size: 9, delay: 2, dur: 20 },
  { sym: "0x", x: 25, y: 65, size: 10, delay: 10, dur: 24 },
  { sym: "~/", x: 70, y: 75, size: 11, delay: 5.5, dur: 22 },
  { sym: "useEffect()", x: 12, y: 28, size: 8, delay: 2.2, dur: 24 },
  { sym: "import", x: 82, y: 18, size: 9, delay: 4.8, dur: 21 },
  { sym: "export", x: 18, y: 72, size: 9, delay: 6.2, dur: 23 },
  { sym: "props", x: 62, y: 60, size: 8, delay: 1.8, dur: 20 },
  { sym: "node", x: 8, y: 60, size: 10, delay: 7.2, dur: 25 },
  { sym: "sql", x: 90, y: 82, size: 9, delay: 5.2, dur: 22 },
  { sym: "api", x: 40, y: 12, size: 10, delay: 3.3, dur: 19 },
  { sym: "json", x: 76, y: 63, size: 9, delay: 8.2, dur: 24 },
  { sym: "JWT", x: 28, y: 10, size: 9, delay: 2.7, dur: 20 },
  { sym: "tsx", x: 54, y: 88, size: 10, delay: 9.1, dur: 23 },
  { sym: "map()", x: 97, y: 48, size: 8, delay: 1.2, dur: 21 },
  { sym: "hook", x: 6, y: 35, size: 9, delay: 4.1, dur: 22 },
];

export default async function HomePage() {
  const featured = await getFeaturedGitHubProjects(3);
  const stats = (await getLatestStats()) as StatsResponse | null;

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <VisitTracker />

      {/* ── floating code background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        {CODE_SYMBOLS.map((s, i) => (
          <span
            key={i}
            className="absolute select-none font-medium text-cyan-200/[0.12] will-change-transform [font-family:'Fira_Code','Cascadia_Code','JetBrains_Mono',monospace] animate-[float-code_linear_infinite] sm:text-cyan-200/[0.18]"
            style={{
              left: `${s.x}%`,
              bottom: `-${s.size + 2}%`,
              fontSize: `${Math.max(s.size - 2, 8)}px`,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            {s.sym}
          </span>
        ))}

        {/* radial glow layers */}
        <div
          className="absolute h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_70%)] sm:h-[440px] sm:w-[440px] md:h-[600px] md:w-[600px]"
          style={{ top: "10%", left: "60%" }}
        />
        <div
          className="absolute h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.04)_0%,transparent_70%)] sm:h-[360px] sm:w-[360px] md:h-[500px] md:w-[500px]"
          style={{ top: "70%", left: "20%" }}
        />
        <div
          className="absolute h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.035)_0%,transparent_72%)] sm:h-[320px] sm:w-[320px] md:h-[420px] md:w-[420px]"
          style={{ top: "35%", left: "85%" }}
        />
      </div>

      {/* ── page content ── */}
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

        {/* FEATURED PROJECTS */}
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

      {/* keyframes that Tailwind cannot express as utility classes */}
      <style>{`
        @keyframes float-code {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(15deg); opacity: 0; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 640px) {
          .animate-\\[float-code_linear_infinite\\] {
            font-size: inherit !important;
          }
        }
      `}</style>
    </main>
  );
}