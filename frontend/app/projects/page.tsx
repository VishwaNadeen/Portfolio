import ProjectCard from "../../components/projectCard";

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  private: boolean;
};

async function getGitHubRepos(): Promise<GitHubRepo[]> {
  const username = process.env.GITHUB_USER;

  if (!username) {
    throw new Error("GITHUB_USER is not set in environment variables.");
  }

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
    {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch GitHub repositories.");
  }

  const repos = (await res.json()) as GitHubRepo[];

  return repos
    .filter((repo) => !repo.private && !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);
}

export default async function ProjectsPage() {
  const repos = await getGitHubRepos();

  const mappedProjects = repos.map((repo) => ({
    title: repo.name,
    description: repo.description || "No description available for this repository.",
    tech: Array.isArray(repo.topics) && repo.topics.length
      ? repo.topics
      : [repo.language].filter(Boolean),
    link: repo.homepage || repo.html_url,
    githubUrl: repo.html_url,
    type: "GitHub Repository",
    platform: "GitHub",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
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
            <span className="text-sm text-slate-400">
              {mappedProjects.length} repos
            </span>
          </div>

          {mappedProjects.length === 0 ? (
            <div className="rounded-2xl bg-white/[0.03] p-6 text-slate-300">
              No public repositories found.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {mappedProjects.map((project, i) => (
                <div
                  key={project.githubUrl || project.title}
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