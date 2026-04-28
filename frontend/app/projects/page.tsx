import ProjectCard from "../../components/cards/projectCard";
import ScrollToTopButton from "@/components/comon/ScrollToTopButton";
import BackgroundAnimation from "@/components/animation/BackgroundAnimation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Vishwa Nadeen",
  description: "Explore projects by Vishwa Nadeen.",
  alternates: {
    canonical: "https://vishwanadeen.lk/projects",
  },
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

type DbProject = {
  _id?: string;
  repoId?: number;
  name?: string;
  fullName?: string;

  description?: string | null;
  customDescription?: string | null;

  htmlUrl?: string;
  homepage?: string | null;
  liveUrl?: string | null;

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

  customTitle?: string | null;
  type?: string | null;
  platform?: string | null;

  imageUrl?: string | null;
  imagePublicId?: string | null;
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
      next: { revalidate: 0 },
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
    title:
      (typeof project.customTitle === "string" && project.customTitle.trim()) ||
      project.name ||
      "Untitled Project",

    description:
      (typeof project.customDescription === "string" &&
        project.customDescription.trim()) ||
      project.description ||
      "No description available for this project.",

    tech:
      Array.isArray(project.topics) && project.topics.length
        ? project.topics
        : [project.language].filter(Boolean),

    link:
      (typeof project.liveUrl === "string" && project.liveUrl.trim()) ||
      project.homepage ||
      project.htmlUrl ||
      "#",

    githubUrl: project.htmlUrl || "",

    type:
      (typeof project.type === "string" && project.type.trim()) ||
      "GitHub Repository",

    platform:
      (typeof project.platform === "string" && project.platform.trim()) ||
      "GitHub",

    stars: project.stars ?? 0,
    forks: project.forks ?? 0,

    imageUrl:
      (typeof project.imageUrl === "string" && project.imageUrl.trim()) || "",
  }));

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <BackgroundAnimation />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-3xl sm:h-[420px] sm:w-[420px] md:h-[520px] md:w-[520px]"
          style={{ top: "6%", left: "68%" }}
        />
        <div
          className="absolute h-[260px] w-[260px] rounded-full bg-blue-500/5 blur-3xl sm:h-[360px] sm:w-[360px] md:h-[460px] md:w-[460px]"
          style={{ top: "52%", left: "8%" }}
        />
        <div
          className="absolute h-[220px] w-[220px] rounded-full bg-sky-400/5 blur-3xl sm:h-[300px] sm:w-[300px] md:h-[380px] md:w-[380px]"
          style={{ top: "30%", left: "82%" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-28 sm:pb-10 sm:pt-30 md:px-6 md:pb-16 md:pt-32">
        <section className="mt-6 space-y-5 sm:mt-8 sm:space-y-6 md:mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
              All Projects
            </h2>
          </div>

          {mappedProjects.length === 0 ? (
            <div className="rounded-2xl bg-white/[0.03] p-5 text-sm text-slate-300 sm:p-6 sm:text-base">
              No public repositories found.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
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