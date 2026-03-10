"use client";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 md:p-12">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl sm:-right-24 sm:-top-24 sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl sm:-bottom-24 sm:-left-24 sm:h-72 sm:w-72" />

      {/* content */}
      <div className="relative space-y-5 sm:space-y-6">
        {/* heading */}
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
          About Me
        </h1>

        {/* description */}
        <p
          className="text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 md:text-lg"
          style={{ textAlign: "justify" }}
        >
          I'm a full-stack developer from Sri Lanka passionate about building
          modern web applications and exploring new technologies. I mainly work
          with JavaScript, React, Next.js, and Node.js to create clean,
          efficient, and user-friendly digital experiences. I'm currently an
          undergraduate at SLIIT following the BSc (Hons) in Software
          Engineering program.
        </p>
      </div>
    </section>
  );
}