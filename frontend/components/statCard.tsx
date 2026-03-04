type Props = {
  title: string;
  subtitle?: string;
  items: { label: string; value: number | string }[];
  link?: { label: string; href: string };
};

function formatCompact(n: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export default function StatCard({ title, subtitle, items, link }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm opacity-70">{subtitle}</p> : null}
        </div>
        {link ? (
          <a
            href={link.href}
            target="_blank"
            className="text-sm underline opacity-70 hover:opacity-100"
          >
            {link.label}
          </a>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-xl bg-black/20 p-4">
            <p className="text-xs opacity-70">{it.label}</p>
            <p className="mt-1 text-2xl font-bold">
              {typeof it.value === "number" ? formatCompact(it.value) : it.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}