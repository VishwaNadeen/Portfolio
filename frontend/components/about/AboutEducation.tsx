export default function AboutEducation() {
  const education = [
    {
      type: "School",
      institution: "Sri Chandananda Buddhist College, Kandy",
      degree: "Secondary Education",
      period: "2009 - 2022",
      accent: "cyan",
      initial: "SCBCK",
      desc: "Years filled with growth, laughter, and countless memories. A chapter that quietly shaped my values, my outlook, and the person I was becoming long before I knew where life would take me.",
    },
    {
      type: "University",
      institution: "Sri Lanka Institute of Information Technology",
      degree: "BSc (Hons) in Information Technology",
      specialization: "Specialisation in Software Engineering",
      period: "2023 - Present",
      accent: "violet",
      initial: "SLIIT",
      desc: "Currently pursuing my BSc (Hons) in Software Engineering at SLIIT, this chapter has been more than just academics. It's where theory meets practice, ideas become projects, and every semester pushes me closer to the engineer I'm working hard to become.",
    },
  ];

  const getAccent = (accent: string) => {
    switch (accent) {
      case "cyan":
        return {
          dot: "bg-cyan-400 border-cyan-300/60 shadow-[0_0_18px_rgba(34,211,238,0.5)]",
          line: "from-cyan-400/60",
          type: "text-cyan-300/80",
          logo: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
          period: "text-cyan-300/60",
        };
      case "violet":
        return {
          dot: "bg-violet-400 border-violet-300/60 shadow-[0_0_18px_rgba(167,139,250,0.5)]",
          line: "to-violet-400/60",
          type: "text-violet-300/80",
          logo: "border-violet-400/30 bg-violet-400/10 text-violet-300",
          period: "text-violet-300/60",
        };
      default:
        return {
          dot: "bg-blue-400 border-blue-300/60 shadow-[0_0_18px_rgba(96,165,250,0.5)]",
          line: "to-blue-400/60",
          type: "text-blue-300/80",
          logo: "border-blue-400/30 bg-blue-400/10 text-blue-300",
          period: "text-blue-300/60",
        };
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-5 md:p-8">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl sm:-right-16 sm:-top-16 sm:h-36 sm:w-36 md:-right-20 md:-top-20 md:h-48 md:w-48" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl sm:-left-16 sm:-bottom-16 sm:h-36 sm:w-36 md:-left-20 md:-bottom-20 md:h-48 md:w-48" />

      <div className="relative">
        {/* title */}
        <h2 className="mb-6 text-lg font-bold tracking-tight text-white sm:mb-8 sm:text-xl md:mb-10 md:text-3xl">
          Education
        </h2>

        {/* timeline */}
        <div className="relative pl-5 sm:pl-6 md:pl-8">
          {/* vertical line */}
          <div className="absolute bottom-2 left-2 top-2 w-px bg-gradient-to-b from-cyan-400/60 via-white/10 to-violet-400/60 sm:left-2.5 md:left-3" />

          {education.map((item, index) => {
            const styles = getAccent(item.accent);
            return (
              <div
                key={item.type}
                className={`relative ${index !== education.length - 1 ? "mb-8 sm:mb-10 md:mb-14" : ""}`}
              >
                {/* dot */}
                <div
                  className={`absolute -left-[0.95rem] top-3 h-2.5 w-2.5 rounded-full border sm:-left-[1.2rem] sm:h-3 sm:w-3 md:-left-[1.55rem] ${styles.dot}`}
                />

                {/* header row */}
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* logo placeholder */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border px-1 text-[9px] font-bold tracking-wider sm:h-12 sm:w-12 sm:rounded-xl sm:text-[10px] md:h-14 md:w-14 md:text-xs ${styles.logo}`}
                  >
                    {item.initial}
                  </div>

                  {/* info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    {/* type + period */}
                    <div className="flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
                      <p
                        className={`text-[10px] font-medium uppercase tracking-[0.18em] sm:text-[11px] md:text-xs ${styles.type}`}
                      >
                        {item.type}
                      </p>
                      <span
                        className={`text-[10px] font-medium sm:text-[11px] md:text-xs ${styles.period}`}
                      >
                        {item.period}
                      </span>
                    </div>

                    {/* institution */}
                    <h3 className="text-sm font-semibold leading-snug text-white sm:text-base md:text-lg">
                      {item.institution}
                    </h3>

                    {/* degree */}
                    <p className="text-xs leading-6 text-slate-400 sm:text-sm">
                      {item.degree}
                      {item.specialization && (
                        <>
                          <span className="mx-1.5 text-slate-600">·</span>
                          <span>{item.specialization}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* description */}
                <p className="mt-3 text-left text-sm leading-6 text-slate-300 sm:mt-4 sm:text-sm sm:leading-7 md:text-base md:leading-8">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}