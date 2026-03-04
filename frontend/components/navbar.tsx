"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl">
      <nav className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Brand */}
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 text-lg font-semibold tracking-wide text-white"
          >
            <span className="relative">
              Vishwa Nadeen
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item, idx) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300",
                    "text-slate-300 hover:text-white",
                    "hover:bg-slate-800/60",
                    active ? "text-white" : "",
                    "motion-safe:animate-[navIn_500ms_ease-out_both]",
                  ].join(" ")}
                  style={{ animationDelay: `${idx * 70}ms` }}
                >

                  {/* Active background */}
                  <span
                    className={[
                      "absolute inset-0 -z-10 rounded-xl transition-all duration-300",
                      active
                        ? "bg-gradient-to-r from-blue-500/20 to-cyan-400/20"
                        : "bg-transparent",
                    ].join(" ")}
                  />

                  {/* Text */}
                  <span className="relative">
                    {item.label}

                    {/* underline animation */}
                    <span
                      className={[
                        "absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300",
                        active
                          ? "w-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          : "w-0 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full",
                      ].join(" ")}
                    />
                  </span>
                </Link>
              );
            })}
          </div>

        </div>
      </nav>

      {/* animation */}
      <style jsx>{`
        @keyframes navIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}