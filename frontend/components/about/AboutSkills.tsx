const skillGroups = [
  {
    title: "Languages",
    accent: "violet",
    skills: ["JavaScript", "TypeScript", "Java", "Kotlin", "Python", "C", "C++", "PHP"],
  },
  {
    title: "Frontend",
    accent: "cyan",
    skills: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    title: "Backend",
    accent: "blue",
    skills: ["Node.js", "Express.js", "Spring Boot", "REST APIs"],
  },
  {
    title: "Mobile Development",
    accent: "emerald",
    skills: ["Flutter", "React Native", "Android Studio", "Android SDK"],
  },
  {
    title: "Database",
    accent: "indigo",
    skills: ["MongoDB", "MySQL"],
  },
  {
    title: "AI Tools",
    accent: "rose",
    skills: ["ChatGPT", "Gemini", "Grok", "Claude", "GitHub Copilot", "Windsurf", "Devin AI"],
  },
  {
    title: "DevOps & Hosting",
    accent: "amber",
    skills: ["Git", "GitHub", "Vercel", "Render", "Cloudflare"],
  },
  {
    title: "Tools",
    accent: "sky",
    skills: ["VS Code", "Postman", "Android Studio", "Figma", "XAMPP", "Eclipse", "IntelliJ IDEA", "MySQL Workbench"],
  },
];

function getAccentClasses(accent: string) {
  switch (accent) {
    case "cyan":
      return {
        dot: "bg-cyan-400",
        title: "text-cyan-300",
        tag: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
      };
    case "blue":
      return {
        dot: "bg-blue-400",
        title: "text-blue-300",
        tag: "border-blue-400/20 bg-blue-400/10 text-blue-300",
      };
    case "emerald":
      return {
        dot: "bg-emerald-400",
        title: "text-emerald-300",
        tag: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      };
    case "indigo":
      return {
        dot: "bg-indigo-400",
        title: "text-indigo-300",
        tag: "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
      };
    case "violet":
      return {
        dot: "bg-violet-400",
        title: "text-violet-300",
        tag: "border-violet-400/20 bg-violet-400/10 text-violet-300",
      };
    case "rose":
      return {
        dot: "bg-rose-400",
        title: "text-rose-300",
        tag: "border-rose-400/20 bg-rose-400/10 text-rose-300",
      };
    case "amber":
      return {
        dot: "bg-amber-400",
        title: "text-amber-300",
        tag: "border-amber-400/20 bg-amber-400/10 text-amber-300",
      };
    default:
      return {
        dot: "bg-sky-400",
        title: "text-sky-300",
        tag: "border-sky-400/20 bg-sky-400/10 text-sky-300",
      };
  }
}

export default function AboutSkills() {
  return (
    <section className="relative overflow-hidden rounded-2xl p-4 sm:rounded-[32px] sm:p-5 md:p-8">
      {/* glow effects */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-500/10 blur-3xl sm:-right-16 sm:-top-16 sm:h-36 sm:w-36 md:-right-20 md:-top-20 md:h-48 md:w-48" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl sm:-left-16 sm:-bottom-16 sm:h-36 sm:w-36 md:-left-20 md:-bottom-20 md:h-48 md:w-48" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl sm:h-36 sm:w-36 md:h-48 md:w-48" />

      <div className="relative space-y-5 sm:space-y-6 md:space-y-8">
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl md:text-3xl">
          Tech Stack
        </h2>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const styles = getAccentClasses(group.accent);

            return (
              <div
                key={group.title}
                className="rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 sm:p-5"
              >
                <div className="mb-2.5 flex items-center gap-2.5 sm:mb-3 sm:gap-3 md:mb-4">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`} />
                  <h3 className={`text-sm font-semibold sm:text-base md:text-lg ${styles.title}`}>
                    {group.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-full border px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs md:text-sm ${styles.tag}`}
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