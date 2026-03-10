const skillGroups = [
  {
    title: "Frontend",
    accent: "cyan",
    skills: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    title: "Backend",
    accent: "blue",
    skills: ["Node.js", "Express.js", "Spring Boot", "REST APIs"],
  },
  {
    title: "Mobile Development",
    accent: "emerald",
    skills: ["Android Studio", "Java", "Android SDK"],
  },
  {
    title: "Database",
    accent: "indigo",
    skills: ["MongoDB", "MySQL"],
  },
  {
    title: "Tools",
    accent: "sky",
    skills: ["Git", "GitHub", "VS Code", "Android Studio", "Postman"],
  },
];

function getAccentClasses(accent: string) {
  switch (accent) {
    case "cyan":
      return {
        dot: "bg-cyan-400",
        title: "text-cyan-300",
        border: "border-cyan-400/20",
        bg: "bg-cyan-400/5",
        tag: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
      };
    case "blue":
      return {
        dot: "bg-blue-400",
        title: "text-blue-300",
        border: "border-blue-400/20",
        bg: "bg-blue-400/5",
        tag: "border-blue-400/20 bg-blue-400/10 text-blue-300",
      };
    case "emerald":
      return {
        dot: "bg-emerald-400",
        title: "text-emerald-300",
        border: "border-emerald-400/20",
        bg: "bg-emerald-400/5",
        tag: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      };
    case "indigo":
      return {
        dot: "bg-indigo-400",
        title: "text-indigo-300",
        border: "border-indigo-400/20",
        bg: "bg-indigo-400/5",
        tag: "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
      };
    default:
      return {
        dot: "bg-sky-400",
        title: "text-sky-300",
        border: "border-sky-400/20",
        bg: "bg-sky-400/5",
        tag: "border-sky-400/20 bg-sky-400/10 text-sky-300",
      };
  }
}

export default function AboutSkills() {
  return (
    <section className="relative overflow-hidden rounded-[32px] py-5 sm:py-6 md:py-8">
      {/* glow effects */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl sm:-right-20 sm:-top-20 sm:h-48 sm:w-48" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl sm:-left-20 sm:-bottom-20 sm:h-48 sm:w-48" />

      <div className="relative space-y-6 sm:space-y-8">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
          Tech Stack
        </h2>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {skillGroups.map((group) => {
            const styles = getAccentClasses(group.accent);

            return (
              <div
                key={group.title}
                className="rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 sm:p-5"
              >
                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
                  <h3 className={`text-base font-semibold sm:text-lg ${styles.title}`}>
                    {group.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-full border px-3 py-1 text-xs sm:text-sm ${styles.tag}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}