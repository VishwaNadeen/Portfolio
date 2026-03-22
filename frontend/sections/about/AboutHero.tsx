"use client";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-12">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl sm:-right-20 sm:-top-20 sm:h-60 sm:w-60 sm:rounded-full md:-right-24 md:-top-24 md:h-72 md:w-72" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl sm:-bottom-20 sm:-left-20 sm:h-60 sm:w-60 sm:rounded-full md:-bottom-24 md:-left-24 md:h-72 md:w-72" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl sm:h-40 sm:w-40" />

      {/* content */}
      <div className="relative space-y-5 sm:space-y-6 md:space-y-8">
        {/* heading */}
        <div className="space-y-1.5 sm:space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-4xl">
            Who I Am
          </h1>
          <p className="text-[11px] font-medium tracking-[0.18em] text-violet-300/60 sm:text-xs sm:tracking-widest md:text-sm">
            Software Engineer · Sri Lanka
          </p>
        </div>

        {/* divider */}
        <div className="h-px w-full bg-gradient-to-r from-cyan-400/20 via-violet-400/20 to-transparent" />

        {/* paragraphs */}
        <div className="space-y-4 sm:space-y-4 md:space-y-5">
          <p
            className="text-sm leading-7 text-cyan-200/80 sm:text-base sm:leading-8 md:text-lg"
            style={{ textAlign: "justify" }}
          >
            Hi, I'm a Software Engineer from Sri Lanka with a love for building
            things people enjoy using. From cross-platform mobile apps to full
            web experiences, I focus on quality at every layer - thoughtful
            design and interactions that just feel right.
          </p>

          <p
            className="text-sm leading-7 text-violet-200/80 sm:text-base sm:leading-8 md:text-lg"
            style={{ textAlign: "justify" }}
          >
            I enjoy turning ideas into real, working products that make a
            meaningful difference in people's daily lives, one great experience
            at a time.
          </p>

          <p
            className="text-sm leading-7 text-blue-200/80 sm:text-base sm:leading-8 md:text-lg"
            style={{ textAlign: "justify" }}
          >
            Currently pursuing my BSc (Hons) in Software Engineering at SLIIT,
            where I'm continuously growing my skills and deepening my passion
            for crafting exceptional digital experiences.
          </p>
        </div>

        {/* bottom divider + tagline */}
        <div className="space-y-3">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-400/20 to-cyan-400/20" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:text-[11px] sm:tracking-[0.2em] md:text-xs">
              Building · Learning · Growing
            </p>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-300/70 sm:text-[11px] md:text-xs">
                Open to opportunities
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}