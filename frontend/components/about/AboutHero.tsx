"use client";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-12">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl sm:-right-24 sm:-top-24 sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl sm:-bottom-24 sm:-left-24 sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />

      {/* content */}
      <div className="relative space-y-6 sm:space-y-8">

        {/* heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Who I Am
          </h1>
          <p className="text-xs font-medium tracking-widest text-violet-300/60 sm:text-sm">
            Software Engineer · Sri Lanka
          </p>
        </div>

        {/* divider */}
        <div className="h-px w-full bg-gradient-to-r from-cyan-400/20 via-violet-400/20 to-transparent" />

        {/* paragraphs */}
        <div className="space-y-4 sm:space-y-5">
          <p
            className="text-sm leading-7 text-cyan-200/80 sm:text-base sm:leading-8 md:text-lg"
            style={{ textAlign: "justify" }}>
            Hi, I'm a Software Engineer from Sri Lanka with a love for building things
            people enjoy using. From cross-platform mobile apps to full web experiences,
            I focus on quality at every layer - thoughtful design and interactions that
            just feel right.
          </p>

          <p
            className="text-sm leading-7 text-violet-200/80 sm:text-base sm:leading-8 md:text-lg"
            style={{ textAlign: "justify" }}>
            I enjoy turning ideas into real, working products that make a meaningful
            difference in people's daily lives, one great experience at a time.
          </p>

          <p
            className="text-sm leading-7 text-blue-200/80 sm:text-base sm:leading-8 md:text-lg"
            style={{ textAlign: "justify" }}>
            Currently pursuing my BSc (Hons) in Software Engineering at SLIIT, where I'm
            continuously growing my skills and deepening my passion for crafting exceptional
            digital experiences.
          </p>
        </div>

        {/* bottom divider + tagline */}
        <div className="space-y-3">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-400/20 to-cyan-400/20" />
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
              Building · Learning · Growing
            </p>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-300/70 sm:text-xs">
                Open to opportunities
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}