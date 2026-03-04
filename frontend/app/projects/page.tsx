import ProjectCard from "../../components/projectCard";
import { projects } from "../../data/projects";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </div>
  );
}