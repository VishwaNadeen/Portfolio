import type { Project } from "@/data/projects";
import { ExternalLink, GitFork, Star, Globe, Layers3 } from "lucide-react";

export default function ProjectCard({ project }: { project: Project }) {
  const tech = Array.isArray(project.tech) ? project.tech.slice(0, 5) : [];

  return (
    <a
      href={project.link || project.githubUrl || "#"}
      target="_blank"
      rel="noreferrer"
      className="group relative block h-full overflow-hidden rounded-2xl bg-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-white/[0.07] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(34,211,238,0.08)]"
    >
      {/* soft inner glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(ellipse at 70% 0%, rgba(34,211,238,0.07) 0%, transparent 65%)" }}
      />

      {/* top-right orb */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/8 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* bottom-left orb */}
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-blue-500/8 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col">

        {/* Top */}
        <div className="flex items-start justify-between gap-3 min-h-[56px]">
          <h3 className="line-clamp-2 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-cyan-200">
            {project.title}
          </h3>

          <span className="shrink-0 rounded-full bg-white/[0.05] p-2 text-white/50 transition-all duration-300 group-hover:bg-cyan-400/10 group-hover:text-cyan-300">
            <ExternalLink className="h-4 w-4" />
          </span>
        </div>

        {/* Type + Platform */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.type ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-300">
              <Layers3 className="h-3.5 w-3.5" />
              {project.type}
            </span>
          ) : null}

          {project.platform ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-white/70">
              <Globe className="h-3.5 w-3.5" />
              {project.platform}
            </span>
          ) : null}
        </div>

        {/* Repo stats */}
        <div className="mt-4 flex items-center gap-4 text-sm text-white/50">
          <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-yellow-300">
            <Star className="h-4 w-4" />
            <span>{project.stars ?? 0}</span>
          </div>

          <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-cyan-300">
            <GitFork className="h-4 w-4" />
            <span>{project.forks ?? 0}</span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Tech stack */}
        <div className="mt-5 flex flex-wrap gap-2">
          {tech.map((t, index) => (
            <span
              key={t}
              className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-white/75 transition-all duration-300 group-hover:bg-cyan-400/10 group-hover:text-cyan-100"
              style={{ transitionDelay: `${index * 35}ms` }}
            >
              {t}
            </span>
          ))}

          {Array.isArray(project.tech) && project.tech.length > 5 ? (
            <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-white/50">
              +{project.tech.length - 5}
            </span>
          ) : null}
        </div>

      </div>
    </a>
  );
}