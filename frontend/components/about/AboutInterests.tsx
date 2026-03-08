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
    <section className="relative overflow-hidden rounded-3xl p-6 md:p-8">

      {/* glow effects */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative space-y-8">

        {/* title */}
        <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Interests
        </h2>

        {/* cards */}
        <div className="grid gap-6 md:grid-cols-2">

          {items.map((item) => (
            <div
              key={item.title}
              className="space-y-3 rounded-2xl bg-white/[0.02] p-5"
            >
              <h3 className="text-lg font-semibold text-white">
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