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
    <section className="relative overflow-hidden rounded-3xl p-5 sm:p-6 md:p-8">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl sm:-right-20 sm:-top-20 sm:h-48 sm:w-48" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl sm:-left-20 sm:-bottom-20 sm:h-48 sm:w-48" />

      <div className="relative">
        {/* title */}
        <h2 className="mb-8 text-xl font-bold tracking-tight text-white sm:mb-10 sm:text-2xl md:text-3xl">
          Education
        </h2>

        {/* timeline */}
        <div className="relative pl-6 sm:pl-8">
          {/* vertical line */}
          <div className="absolute bottom-2 left-2.5 top-2 w-px bg-gradient-to-b from-cyan-400/60 via-white/10 to-violet-400/60 sm:left-3" />

          {education.map((item, index) => {
            const styles = getAccent(item.accent);
            return (
              <div
                key={item.type}
                className={`relative ${index !== education.length - 1 ? "mb-10 sm:mb-14" : ""}`}
              >
                {/* dot */}
                <div
                  className={`absolute -left-[1.2rem] top-3 h-3 w-3 rounded-full border sm:-left-[1.55rem] ${styles.dot}`}
                />

                {/* header row */}
                <div className="flex items-start gap-4">
                  {/* logo placeholder */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-[10px] font-bold tracking-wider sm:h-14 sm:w-14 sm:text-xs ${styles.logo}`}
                  >
                    {item.initial}
                  </div>

                  {/* info */}
                  <div className="flex-1 space-y-1">
                    {/* type + period */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className={`text-[11px] font-medium uppercase tracking-[0.2em] sm:text-xs ${styles.type}`}>
                        {item.type}
                      </p>
                      <span className={`text-[11px] font-medium sm:text-xs ${styles.period}`}>
                        {item.period}
                      </span>
                    </div>

                    {/* institution */}
                    <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">
                      {item.institution}
                    </h3>

                    {/* degree */}
                    <p className="text-sm text-slate-400">
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
                <p className="mt-4 text-justify text-sm leading-7 text-slate-300 sm:leading-8 md:text-base">
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