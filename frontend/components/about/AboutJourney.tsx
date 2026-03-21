export default function AboutJourney() {
  return (
    <section className="relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-5 md:p-8">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-500/10 blur-3xl sm:-right-16 sm:-top-16 sm:h-36 sm:w-36 md:-right-20 md:-top-20 md:h-48 md:w-48" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl sm:-left-16 sm:-bottom-16 sm:h-36 sm:w-36 md:-left-20 md:-bottom-20 md:h-48 md:w-48" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl sm:h-32 sm:w-32 md:h-44 md:w-44" />

      <div className="relative space-y-4 sm:space-y-4 md:space-y-5">
        {/* title */}
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl md:text-3xl">
          My Journey
        </h2>

        {/* paragraph 1 — cyan */}
        <p className="text-justify text-sm leading-7 text-cyan-200/80 sm:text-sm sm:leading-8 md:text-base">
          It started with curiosity - a simple question of how things on a screen
          actually work. That curiosity never left. It only grew deeper, pulling me
          further into the world of development until building things became less
          of an interest and more of a calling.
        </p>

        {/* paragraph 2 — violet */}
        <p className="text-justify text-sm leading-7 text-violet-200/80 sm:text-sm sm:leading-8 md:text-base">
          What excites me most is the full picture - the way a well-thought interface
          connects to a solid backend, how every layer of a product plays its part.
          I don't just want to build features, I want to craft experiences that feel
          complete, intentional, and alive.
        </p>

        {/* paragraph 3 — blue */}
        <p className="text-justify text-sm leading-7 text-blue-200/80 sm:text-sm sm:leading-8 md:text-base">
          Through university, personal projects, and continuous learning, I keep
          pushing my craft forward. Every product I build teaches me something new
          - and that's exactly what keeps me going.
        </p>
      </div>
    </section>
  );
}