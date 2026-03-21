export default function AboutInterests() {
  const items = [
    {
      title: "Full-Stack Web Applications",
      accent: "cyan",
      desc: "I don't just build websites - I engineer complete digital products. From the first pixel to the final API call, I own the entire stack and make sure every layer performs."
    },
    {
      title: "Mobile Applications",
      accent: "emerald",
      desc: "Great apps don't just work - they feel right. I build cross-platform mobile experiences that are fast, fluid, and built to last across every screen and platform."
    },
    {
      title: "Modern UI & UX",
      accent: "violet",
      desc: "Design is not decoration - it's communication. I craft interfaces that are sharp, intuitive, and intentional, where every element earns its place on the screen."
    },
    {
      title: "UI/UX Design",
      accent: "pink",
      desc: "Good design solves problems before users even notice them. I think in systems, prototype with purpose, and obsess over the details that turn a good product into a great one."
    },
    {
      title: "Practical Software Systems",
      accent: "blue",
      desc: "Real software solves real problems. I build management platforms, data-driven tools, and systems that don't just look good on paper - they hold up in the real world."
    },
    {
      title: "Gaming",
      accent: "amber",
      desc: "Gaming shaped the way I think about user experience - feedback, flow, and engagement done right. It's where I go to recharge, get inspired, and remind myself what truly great UX feels like."
    },
  ];

  const getAccent = (accent: string) => {
    switch (accent) {
      case "cyan":
        return {
          dot: "bg-cyan-400",
          title: "text-cyan-300",
          border: "border-cyan-400/20",
          bg: "bg-cyan-400/5",
          glow: "bg-cyan-500/10",
        };
      case "emerald":
        return {
          dot: "bg-emerald-400",
          title: "text-emerald-300",
          border: "border-emerald-400/20",
          bg: "bg-emerald-400/5",
          glow: "bg-emerald-500/10",
        };
      case "violet":
        return {
          dot: "bg-violet-400",
          title: "text-violet-300",
          border: "border-violet-400/20",
          bg: "bg-violet-400/5",
          glow: "bg-violet-500/10",
        };
      case "pink":
        return {
          dot: "bg-pink-400",
          title: "text-pink-300",
          border: "border-pink-400/20",
          bg: "bg-pink-400/5",
          glow: "bg-pink-500/10",
        };
      case "blue":
        return {
          dot: "bg-blue-400",
          title: "text-blue-300",
          border: "border-blue-400/20",
          bg: "bg-blue-400/5",
          glow: "bg-blue-500/10",
        };
      case "amber":
        return {
          dot: "bg-amber-400",
          title: "text-amber-300",
          border: "border-amber-400/20",
          bg: "bg-amber-400/5",
          glow: "bg-amber-500/10",
        };
      default:
        return {
          dot: "bg-sky-400",
          title: "text-sky-300",
          border: "border-sky-400/20",
          bg: "bg-sky-400/5",
          glow: "bg-sky-500/10",
        };
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl p-5 sm:p-6 md:p-8">
      {/* glow effects */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl sm:-right-20 sm:-top-20 sm:h-48 sm:w-48" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl sm:-left-20 sm:-bottom-20 sm:h-48 sm:w-48" />

      <div className="relative space-y-6 sm:space-y-8">
        {/* title */}
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
          Interests
        </h2>

        {/* cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {items.map((item) => {
            const styles = getAccent(item.accent);
            return (
              <div
              key={item.title}
              className="relative overflow-hidden space-y-3 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 sm:p-5"
            >
              {/* remove the card inner glow div entirely */}

              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                <h3 className={`text-base font-semibold sm:text-lg ${styles.title}`}>
                  {item.title}
                </h3>
              </div>

              <p className="text-justify text-sm leading-7 text-slate-300 md:text-base">
                {item.desc}
              </p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}