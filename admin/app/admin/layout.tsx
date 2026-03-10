"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./components/LogoutButton";
import { LayoutDashboard, FolderKanban, FileText, Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-950 text-white">{children}</div>;
  }

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/projects",
      label: "Projects",
      icon: FolderKanban,
    },
    {
      href: "/admin/cv",
      label: "CV Management",
      icon: FileText,
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative flex h-screen overflow-hidden">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />
          <div className="absolute right-0 top-16 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-500/5 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />
        </div>

        {/* Sidebar */}
        <aside className="hidden md:flex md:w-72 md:flex-col md:border-r md:border-white/10 md:bg-slate-950/70 md:backdrop-blur-xl">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide text-white">
                    Admin Panel
                  </h2>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-6">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      active
                        ? "translate-x-1 border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.06)]"
                        : "border border-transparent text-slate-300 hover:translate-x-1 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                    }`}
                    style={{
                      animationDelay: `${index * 80}ms`,
                    }}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                        active
                          ? "bg-cyan-400/10 text-cyan-300"
                          : "bg-white/[0.03] text-slate-400 group-hover:bg-white/[0.06] group-hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-4">
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl md:px-6">
            <div className="grid grid-cols-3 items-center">
              <div className="text-xs text-slate-500"></div>

              <div className="text-center">
                <h1 className="text-sm font-semibold tracking-wide text-white sm:text-base md:text-lg">
                  Portfolio Admin Panel
                </h1>
              </div>

              <div className="text-right text-xs text-slate-400">v1</div>
            </div>

            {/* Mobile nav */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 ${
                      active
                        ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                        : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="w-full pt-2">
                <LogoutButton />
              </div>
            </div>
          </header>

          {/* Scrollable content only */}
          <main className="flex-1 overflow-y-auto">
            <div className="animate-in fade-in p-4 duration-500 sm:p-5 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}