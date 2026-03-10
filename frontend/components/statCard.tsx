type Props = {
  title: string;
  subtitle?: string;
  items: { label: string; value: number | string }[];
  link?: string;
};

function formatCompact(n: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function CardContent({ title, subtitle, items }: Omit<Props, "link">) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-white/65 sm:text-base">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-2xl border border-white/5 bg-black/25 px-4 py-3.5 transition duration-300 sm:px-5 sm:py-4"
          >
            <p className="text-sm text-white/55">{it.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {typeof it.value === "number" ? formatCompact(it.value) : it.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default function StatCard({ title, subtitle, items, link }: Props) {
  const baseClass =
    "group relative block rounded-[28px] bg-white/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:shadow-[0_0_30px_rgba(34,211,238,0.08)] sm:p-6 md:p-7";

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className={baseClass}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-cyan-400/[0.05] via-transparent to-blue-500/[0.06] opacity-0 transition duration-300 group-hover:opacity-100" />
        <div className="relative">
          <CardContent title={title} subtitle={subtitle} items={items} />
        </div>
      </a>
    );
  }

  return (
    <div className={baseClass}>
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-cyan-400/[0.05] via-transparent to-blue-500/[0.06]" />
      <div className="relative">
        <CardContent title={title} subtitle={subtitle} items={items} />
      </div>
    </div>
  );
}