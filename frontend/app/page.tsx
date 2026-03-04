import Link from "next/link";
import { projects } from "../data/projects";
import ProjectCard from "../components/projectCard";
import StatCard from "../components/statCard";
import { getLatestStats } from "../lib/api";

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
  const featured = projects.slice(0, 3);

  // ✅ fetch latest stats from DB (backend)
  const stats = (await getLatestStats()) as StatsResponse | null;
  const github = stats?.github ?? null;
  const youtube = stats?.youtube ?? null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-12">
      {/* HERO */}
      <section className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold">Hi, I’m Vishwa Nadeen</h1>

        <p className="text-base md:text-lg opacity-80 max-w-2xl">
          Full-stack developer. I build clean, modern web apps using Next.js and Node.js.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link className="px-4 py-2 border rounded-lg hover:opacity-90" href="/projects">
            View Projects
          </Link>
          <Link className="px-4 py-2 border rounded-lg hover:opacity-90" href="/contact">
            Contact
          </Link>
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Live Stats</h2>

        <div className="grid gap-4 md:grid-cols-2">
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

        {/* optional: show last fetch time */}
        <p className="text-sm opacity-60">
          Updated:{" "}
          {stats?.fetchedAt?.github
            ? new Date(stats.fetchedAt.github).toLocaleString()
            : "—"}
        </p>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Featured Projects</h2>
          <Link className="text-sm underline opacity-80 hover:opacity-100" href="/projects">
            View all
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {featured.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}