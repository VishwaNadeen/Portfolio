import Link from "next/link";
import ProjectCard from "../components/projectCard";
import StatCard from "../components/statCard";
import { getLatestStats, getFeaturedGitHubProjects } from "../lib/api";

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
  };
  fetchedAt: { github: string | null; youtube: string | null };
};

export default async function HomePage() {
  // ✅ Featured projects from MongoDB (public latest 3)
  const featured = await getFeaturedGitHubProjects(3);

  const stats = (await getLatestStats()) as StatsResponse | null;
  const github = stats?.github ?? null;
  const youtube = stats?.youtube ?? null;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-14">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-6 md:p-10 backdrop-blur">
          {/* glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="space-y-5 fade-up">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Hi, I’m{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Vishwa Nadeen
              </span>
            </h1>

            {/* BIO */}
            <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed">
              I’m a passionate developer from Sri Lanka who enjoys building modern
              web applications and learning new technologies. I focus on creating
              clean, efficient, and user-friendly digital experiences while
              continuously improving my skills in full-stack development.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:opacity-95 hover:shadow-[0_0_0_6px_rgba(34,211,238,0.12)]"
              >
                View Projects
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800/60"
              >
                Contact
              </Link>
            </div>
          </div>
        </section>

        {/* LIVE STATS */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold text-white">Live Stats</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-1 transition-all duration-300 hover:bg-slate-900/30 hover:-translate-y-0.5">
              <div className="rounded-2xl p-3">
                <StatCard
                  title="GitHub"
                  subtitle={github?.username ? `@${github.username}` : "Not available"}
                  link={
                    github?.profileUrl
                      ? { label: "Open", href: github.profileUrl }
                      : undefined
                  }
                  items={[
                    { label: "Projects", value: github?.publicRepos ?? 0 },
                    { label: "Followers", value: github?.followers ?? 0 },
                    { label: "Status", value: github ? "Live" : "N/A" },
                  ]}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-1 transition-all duration-300 hover:bg-slate-900/30 hover:-translate-y-0.5">
              <div className="rounded-2xl p-3">
                <StatCard
                  title="YouTube"
                  subtitle={youtube?.title ? youtube.title : "Not available"}
                  items={[
                    { label: "Subscribers", value: youtube?.subscribers ?? 0 },
                    { label: "Videos", value: youtube?.videoCount ?? 0 },
                    { label: "Views", value: youtube?.viewCount ?? 0 },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PROJECTS */}
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Featured Projects</h2>

            <Link
              className="text-sm text-slate-300 hover:text-white transition-colors duration-300"
              href="/projects"
            >
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
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
    tech: techArr, // ✅ IMPORTANT (ProjectCard uses project.tech.map)
    url: p.htmlUrl, // or "href" depending on your ProjectCard
    liveUrl: p.liveUrl || "",
  };

  return (
    <div
      key={p._id || p.repoId || mapped.title}
      className="rounded-2xl border border-slate-800 bg-slate-950/40 p-1 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/30"
      style={{ animationDelay: `${i * 80}ms` }}
    >
      <div
        className="rounded-2xl p-3 fade-up"
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