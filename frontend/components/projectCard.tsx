import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-5 backdrop-blur-md transition duration-300 hover:bg-white/[0.05]">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>

        <p className="text-sm leading-6 text-white/75">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(project.tech ?? []).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/85"
            >
              {t}
            </span>
          ))}
        </div>

        {project.link && (
          <div className="pt-2">
            <a
              className="inline-flex items-center text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              href={project.link}
              target="_blank"
              rel="noreferrer"
            >
              View Project →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}