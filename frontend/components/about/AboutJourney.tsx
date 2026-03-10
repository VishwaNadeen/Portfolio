export default function AboutJourney() {
  return (
    <section className="relative overflow-hidden rounded-3xl p-5 sm:p-6 md:p-8">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl sm:-right-20 sm:-top-20 sm:h-48 sm:w-48" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl sm:-left-20 sm:-bottom-20 sm:h-48 sm:w-48" />

      <div className="relative space-y-4 sm:space-y-5">
        {/* title */}
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
          My Journey
        </h2>

        {/* content */}
        <p className="text-justify text-sm leading-7 text-slate-300 sm:leading-8 md:text-base">
          My journey into development started with a growing curiosity about
          how websites and digital systems are created. What began as simple
          exploration gradually turned into a strong interest in building
          modern, practical, and visually appealing web applications.
        </p>

        <p className="text-justify text-sm leading-7 text-slate-300 sm:leading-8 md:text-base">
          Over time, I became more interested in full-stack development,
          especially working with technologies such as JavaScript, React,
          Next.js, Node.js, and databases. I enjoy combining clean user
          interfaces with efficient backend systems to create complete
          digital solutions.
        </p>

        <p className="text-justify text-sm leading-7 text-slate-300 sm:leading-8 md:text-base">
          Through university studies, personal learning, and hands-on
          projects, I continue improving my skills and exploring better
          ways to design, build, and deliver modern web experiences.
          Every project I work on helps me grow as a developer and
          strengthens my understanding of real-world development.
        </p>
      </div>
    </section>
  );
}