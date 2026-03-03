import Link from "next/link";
import { projects } from "../data/projects";
import ProjectCard from "../components/projectCard";

export default function HomePage() {
  const featured = projects.slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold">
          Hi, I’m Vishwa Nadeen
        </h1>
        <p className="text-base md:text-lg opacity-80 max-w-2xl">
          Full-stack developer. I build clean, modern web apps using Next.js and Node.js.
        </p>

        <div className="flex gap-3">
          <Link className="px-4 py-2 border rounded-lg" href="/projects">
            View Projects
          </Link>
          <Link className="px-4 py-2 border rounded-lg" href="/contact">
            Contact
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Featured Projects</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {featured.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}