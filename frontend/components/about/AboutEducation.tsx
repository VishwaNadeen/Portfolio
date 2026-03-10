export default function AboutEducation() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6 md:p-8">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl sm:-right-20 sm:-top-20 sm:h-48 sm:w-48" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl sm:-left-20 sm:-bottom-20 sm:h-48 sm:w-48" />

      <div className="relative">
        {/* title */}
        <h2 className="mb-6 text-xl font-bold tracking-tight text-white sm:mb-8 sm:text-2xl md:text-3xl">
          Education
        </h2>

        {/* timeline wrapper */}
        <div className="relative pl-6 sm:pl-8">
          {/* vertical line */}
          <div className="absolute bottom-2 left-2.5 top-2 w-px bg-gradient-to-b from-cyan-400/50 via-white/10 to-blue-500/40 sm:left-3" />

          {/* School */}
          <div className="relative mb-8 sm:mb-10">
            {/* dot */}
            <div className="absolute -left-[1.2rem] top-2 h-3 w-3 rounded-full border border-cyan-300/60 bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.5)] sm:-left-[1.55rem]" />

            <div className="rounded-2xl bg-white/[0.025] p-4 transition-all duration-300 hover:bg-white/[0.045] sm:p-5">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-300/80 sm:text-xs">
                School
              </p>

              <h3 className="text-lg font-semibold text-white sm:text-xl">
                Sri Chandananda Buddhist College, Kandy
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Secondary Education
              </p>

              <p className="mt-4 text-justify text-sm leading-7 text-slate-300 sm:leading-8 md:text-base">
                I completed my school education here, where I built the
                foundation for my academic journey and developed my early
                interest in technology, learning, and problem solving.
              </p>
            </div>
          </div>

          {/* University */}
          <div className="relative">
            {/* dot */}
            <div className="absolute -left-[1.2rem] top-2 h-3 w-3 rounded-full border border-blue-300/60 bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.5)] sm:-left-[1.55rem]" />

            <div className="rounded-2xl bg-white/[0.025] p-4 transition-all duration-300 hover:bg-white/[0.045] sm:p-5">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-blue-300/80 sm:text-xs">
                University
              </p>

              <h3 className="text-lg font-semibold text-white sm:text-xl">
                Sri Lanka Institute of Information Technology (SLIIT)
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Undergraduate — BSc (Hons) in Information Technology
                <br className="hidden md:block" />
                <span className="md:ml-1">
                  Specialisation in Software Engineering
                </span>
              </p>

              <p className="mt-4 text-justify text-sm leading-7 text-slate-300 sm:leading-8 md:text-base">
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