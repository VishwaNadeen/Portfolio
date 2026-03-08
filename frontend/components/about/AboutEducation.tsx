export default function AboutEducation() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white/[0.03] p-6 backdrop-blur-xl md:p-8">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative">
        {/* title */}
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-white md:text-3xl">
          Education
        </h2>

        {/* timeline wrapper */}
        <div className="relative pl-8">
          {/* vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/50 via-white/10 to-blue-500/40" />

          {/* School */}
          <div className="relative mb-10">
            {/* dot */}
            <div className="absolute -left-[1.55rem] top-2 h-3 w-3 rounded-full border border-cyan-300/60 bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.5)]" />

            <div className="rounded-2xl bg-white/[0.025] p-5 transition-all duration-300 hover:bg-white/[0.045]">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300/80">
                School
              </p>

              <h3 className="text-xl font-semibold text-white">
                Sri Chandananda Buddhist College, Kandy
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Secondary Education
              </p>

              <p className="mt-4 text-justify text-sm leading-8 text-slate-300 md:text-base">
                I completed my school education here, where I built the
                foundation for my academic journey and developed my early
                interest in technology, learning, and problem solving.
              </p>
            </div>
          </div>

          {/* University */}
          <div className="relative">
            {/* dot */}
            <div className="absolute -left-[1.55rem] top-2 h-3 w-3 rounded-full border border-blue-300/60 bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.5)]" />

            <div className="rounded-2xl bg-white/[0.025] p-5 transition-all duration-300 hover:bg-white/[0.045]">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-blue-300/80">
                University
              </p>

              <h3 className="text-xl font-semibold text-white">
                Sri Lanka Institute of Information Technology (SLIIT)
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Undergraduate — BSc (Hons) in Information Technology
                <br className="hidden md:block" />
                <span className="md:ml-1">
                  Specialisation in Software Engineering
                </span>
              </p>

              <p className="mt-4 text-justify text-sm leading-8 text-slate-300 md:text-base">
                I am currently pursuing my undergraduate studies at SLIIT. The
                program strengthens my understanding of software engineering,
                modern development practices, and real-world system design while
                helping me improve my technical skills through practical work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}