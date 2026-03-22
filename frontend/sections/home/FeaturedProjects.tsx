import ProjectCard from "@/components/cards/projectCard";

type FeaturedProjectsSectionProps = {
  featured: any[];
};

export default function FeaturedProjectsSection({
  featured,
}: FeaturedProjectsSectionProps) {
  return (
    <section className="space-y-5 sm:space-y-6">
      <h2 className="text-lg font-semibold text-white sm:text-xl">
        Featured Projects
      </h2>

      <div className="grid items-stretch gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((p: any, i: number) => {
          const techArr =
            Array.isArray(p.topics) && p.topics.length
              ? p.topics
              : [p.language].filter(Boolean);

          const mapped = {
            title: p.customTitle || p.name,
            description:
              p.customDescription ||
              p.description ||
              "No description available for this project.",
            tech: techArr,
            link: p.liveUrl || p.htmlUrl || "",
            githubUrl: p.htmlUrl || "",
            imageUrl: p.imageUrl || "",
            type: p.type || "",
            platform: p.platform || "",
            stars: p.stars ?? 0,
            forks: p.forks ?? 0,
          };

          return (
            <div
              key={p._id || p.repoId || mapped.title}
              className="h-full animate-[fade-up_0.65s_cubic-bezier(.22,.8,.5,1)_forwards] opacity-0"
              style={{ animationDelay: `${150 + i * 90}ms` }}
            >
              <ProjectCard project={mapped as any} />
            </div>
          );
        })}
      </div>
    </section>
  );
}