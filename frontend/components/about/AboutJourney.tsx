export default function AboutJourney() {
  return (
    <section className="relative overflow-hidden rounded-3xl p-6 md:p-8">

      {/* background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative space-y-5">

        
        {/* title */}
        <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          My Journey 
        </h2>

        {/* content */}
        <p className="text-sm leading-8 text-slate-300 md:text-base text-justify">
        My journey into development started with a growing curiosity about
        how websites and digital systems are created. What began as simple
        exploration gradually turned into a strong interest in building
        modern, practical, and visually appealing web applications.
        </p>

        <p className="text-sm leading-8 text-slate-300 md:text-base text-justify">
        Over time, I became more interested in full-stack development,
        especially working with technologies such as JavaScript, React,
        Next.js, Node.js, and databases. I enjoy combining clean user
        interfaces with efficient backend systems to create complete
        digital solutions.
        </p>

        <p className="text-sm leading-8 text-slate-300 md:text-base text-justify">
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