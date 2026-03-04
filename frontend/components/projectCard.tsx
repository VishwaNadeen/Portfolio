import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border rounded-xl p-4 space-y-2">
      <h3 className="font-semibold">{project.title}</h3>
      <p className="text-sm opacity-80">{project.description}</p>

      <div className="flex flex-wrap gap-2">
        {(project.tech ?? []).map((t) => (
          <span key={t} className="text-xs border rounded-full px-2 py-1">
            {t}
          </span>
        ))}
      </div>

      {project.link && (
        <a className="underline text-sm" href={project.link} target="_blank">
          View
        </a>
      )}
    </div>
  );
}