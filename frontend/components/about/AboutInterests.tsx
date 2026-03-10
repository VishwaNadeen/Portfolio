export default function AboutInterests() {
  const items = [
    {
      title: "Full-Stack Web Applications",
      desc: "Building modern web applications with clean UI, efficient backend systems, and scalable architecture using modern JavaScript frameworks."
    },
    {
      title: "Modern UI & UX",
      desc: "Designing visually appealing interfaces with smooth interactions, responsive layouts, and user-friendly experiences."
    },
    {
      title: "Mobile Applications",
      desc: "Developing Android applications using Android Studio and Java while exploring ways to integrate mobile apps with backend services."
    },
    {
      title: "Practical Software Systems",
      desc: "Creating real-world systems such as management platforms, data-driven applications, and tools that solve practical problems."
    }
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl p-5 sm:p-6 md:p-8">
      {/* glow effects */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl sm:-right-20 sm:-top-20 sm:h-48 sm:w-48" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl sm:-left-20 sm:-bottom-20 sm:h-48 sm:w-48" />

      <div className="relative space-y-6 sm:space-y-8">
        {/* title */}
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
          Interests
        </h2>

        {/* cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="space-y-3 rounded-2xl bg-white/[0.02] p-4 sm:p-5"
            >
              <h3 className="text-base font-semibold text-white sm:text-lg">
                {item.title}
              </h3>

              <p className="text-sm leading-7 text-slate-300 md:text-base">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}