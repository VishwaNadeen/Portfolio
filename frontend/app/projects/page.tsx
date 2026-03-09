import ProjectCard from "../../components/projectCard";

export const dynamic = "force-dynamic";

type DbProject = {
  _id?: string;
  repoId?: number;
  name?: string;
  title?: string;
  description?: string | null;
  htmlUrl?: string;
  homepage?: string | null;
  language?: string | null;
  topics?: string[];
  stars?: number;
  forks?: number;
  isHidden?: boolean;
  isPrivate?: boolean;
  featured?: boolean;
  displayOrder?: number;
  pushedAt?: string;
  updatedAtGithub?: string;
};

async function getDatabaseProjects(): Promise<DbProject[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;

  if (!apiBase) {
    console.error("NEXT_PUBLIC_API_BASE is not set.");
    return [];
  }

  try {
    const res = await fetch(`${apiBase}/api/github/projects`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch projects from database.");
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Database projects fetch failed:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getDatabaseProjects();

  const mappedProjects = projects.map((project) => ({
    title: project.title || project.name || "Untitled Project",
    description:
      project.description || "No description available for this project.",
    tech:
      Array.isArray(project.topics) && project.topics.length
        ? project.topics
        : [project.language].filter(Boolean),
    link: project.homepage || project.htmlUrl || "#",
    githubUrl: project.htmlUrl || "",
    type: "GitHub Repository",
    platform: "GitHub",
    stars: project.stars ?? 0,
    forks: project.forks ?? 0,
  }));

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute h-[520px] w-[520px] rounded-full bg-cyan-500/5 blur-3xl"
          style={{ top: "6%", left: "68%" }}
        />
        <div
          className="absolute h-[460px] w-[460px] rounded-full bg-blue-500/5 blur-3xl"
          style={{ top: "52%", left: "8%" }}
        />
        <div
          className="absolute h-[380px] w-[380px] rounded-full bg-sky-400/5 blur-3xl"
          style={{ top: "30%", left: "82%" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        {/* Projects Grid */}
        <section className="mt-10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              All Repositories
            </h2>
          </div>

          {mappedProjects.length === 0 ? (
            <div className="rounded-2xl bg-white/[0.03] p-6 text-slate-300">
              No public repositories found.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {mappedProjects.map((project, i) => (
                <div
                  key={project.githubUrl || project.title || i}
                  className="animate-[fade-up_0.65s_cubic-bezier(.22,.8,.5,1)_forwards] opacity-0"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <ProjectCard project={project as any} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}