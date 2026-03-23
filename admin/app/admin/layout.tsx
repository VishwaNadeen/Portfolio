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
    return (
      <>
        <style>{`
          @keyframes al-fadein {
            from { opacity: 0; transform: translateY(5px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="min-h-[100dvh] bg-[#020810] font-sans text-slate-200">
          {children}
        </div>
      </>
    );
  }

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      mono: "dashboard",
    },
    {
      href: "/admin/projects",
      label: "Projects",
      icon: FolderKanban,
      mono: "projects",
    },
    {
      href: "/admin/cv",
      label: "CV Management",
      icon: FileText,
      mono: "cv",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes al-fadein {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex h-[100dvh] min-h-[100dvh] flex-col overflow-hidden bg-[#020810] font-sans text-slate-200">
        <div className="relative flex h-full overflow-hidden">
          {/* ── subtle background grid ── */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* ════════════════════════════════════
              SIDEBAR  (desktop only)
          ════════════════════════════════════ */}
          <aside className="relative z-10 hidden w-[240px] shrink-0 flex-col border-r border-r-[#1a2d46] bg-[#040c1a] md:flex">
            {/* sidebar top accent */}
            <div
              className="h-px shrink-0 opacity-60"
              style={{
                background:
                  "linear-gradient(90deg,transparent,#1e40af,#0ea5e9,transparent)",
              }}
            />

            {/* ── Brand ── */}
            <div className="shrink-0 border-b border-b-[#0e1a2e] px-[18px] pb-[18px] pt-[20px]">
              <div className="flex items-center gap-[11px]">
                <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[7px] border border-[#1d4ed850] bg-[#0c1e3a] shadow-[0_0_16px_#1d4ed820]">
                  <Shield size={16} color="#60a5fa" />
                </div>
                <div>
                  <div className="text-[14px] font-bold leading-[1.2] text-slate-200">
                    Admin Panel
                  </div>
                  <div className="font-mono mt-[2px] text-[9px] tracking-[0.14em] text-[#3a5570]">
                    PORTFOLIO SYSTEM
                  </div>
                </div>
              </div>
            </div>

            {/* ── Nav section label ── */}
            <div className="px-[18px] pb-[8px] pt-[16px]">
              <div className="font-mono text-[9px] tracking-[0.18em] text-[#2a4060]">
                NAVIGATION
              </div>
            </div>

            {/* ── Nav items ── */}
            <nav className="flex flex-1 flex-col gap-[3px] px-[10px]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "relative flex cursor-pointer items-center gap-[11px] rounded-[6px] border px-[12px] py-[9px] no-underline transition-all duration-150",
                      active
                        ? "border-[#1d4ed850] bg-[#0a1e3a] text-[#60a5fa] shadow-[0_0_16px_#1d4ed815]"
                        : "border-transparent bg-transparent text-[#4a6680] hover:border-[#1a2d46] hover:bg-[#07111f] hover:text-slate-400",
                    ].join(" ")}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-[60%] w-[2px] -translate-y-1/2 rounded-r-[2px] bg-[#3b82f6]" />
                    )}

                    <div
                      className={[
                        "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[5px] border transition-all duration-150",
                        active
                          ? "border-[#1d4ed850] bg-[#0c1e3a]"
                          : "border-[#1a2d46] bg-[#07111f]",
                      ].join(" ")}
                    >
                      <Icon size={14} color={active ? "#60a5fa" : "#3a5570"} />
                    </div>

                    <div className="min-w-0">
                      <div
                        className={`text-[13px] leading-[1.2] ${
                          active
                            ? "font-semibold text-[#93c5fd]"
                            : "font-medium text-[#4a6680]"
                        }`}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`font-mono mt-[1px] text-[9px] tracking-[0.06em] ${
                          active ? "text-[#1d4ed870]" : "text-[#1e3050]"
                        }`}
                      >
                        /{item.mono}
                      </div>
                    </div>

                    {active && (
                      <div className="ml-auto h-[5px] w-[5px] shrink-0 rounded-full bg-[#3b82f6] shadow-[0_0_6px_#3b82f6]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Sidebar footer ── */}
            <div className="shrink-0 border-t border-t-[#0e1a2e] px-[10px] py-[14px]">
              <div className="mb-[10px] flex items-center gap-[8px] rounded-[5px] border border-[#1a2d46] bg-[#060f1e] px-[10px] py-[8px]">
                <div className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80]" />
                <span className="font-mono text-[9px] tracking-[0.1em] text-[#3a5570]">
                  SYSTEM ONLINE
                </span>
                <span className="font-mono ml-auto text-[9px] text-[#2a4060]">
                  v1
                </span>
              </div>

              <LogoutButton />
            </div>
          </aside>

          {/* ════════════════════════════════════
              MAIN AREA
          ════════════════════════════════════ */}
          <div className="relative z-[5] flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* ── HEADER ── */}
            <header className="sticky top-0 z-[30] shrink-0 border-b border-b-[#1a2d46] bg-[#040c1a]">
              <div
                className="h-px opacity-50"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,#1e40af50,#0ea5e950,transparent)",
                }}
              />

              <div className="flex items-center justify-between gap-3 px-[14px] py-[11px] md:px-[20px]">
                {/* left: current path */}
                <div className="font-mono min-w-0 max-w-[34%] flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] tracking-[0.1em] text-[#3a5570] md:max-w-none">
                  {navItems.find((n) => n.href === pathname)
                    ? `admin / ${navItems.find((n) => n.href === pathname)?.mono}`
                    : "admin"}
                </div>

                {/* center: title */}
                <div className="min-w-0 shrink text-center">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold text-[#64748b] md:text-[13px]">
                    Portfolio Admin Panel
                  </span>
                </div>

                {/* right: version badge */}
                <div className="flex flex-1 items-center justify-end gap-[7px]">
                  <span className="font-mono shrink-0 rounded-[3px] border border-[#1a2d46] bg-[#07111f] px-[8px] py-[2px] text-[9px] font-semibold tracking-[0.1em] text-[#3a5570]">
                    v1
                  </span>
                </div>
              </div>

              {/* ── MOBILE NAV ── */}
              <div className="block md:hidden">
                <div className="border-t border-t-[#0e1a2e] px-[14px] pb-[12px] pt-[10px]">
                  <div className="mb-[10px] flex gap-[7px] overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={[
                            "inline-flex shrink-0 whitespace-nowrap rounded-[5px] border px-[12px] py-[6px] text-[12px] font-medium no-underline transition-all duration-150",
                            "items-center gap-[7px]",
                            active
                              ? "border-[#1d4ed850] bg-[#0a1e3a] text-[#60a5fa]"
                              : "border-[#1a2d46] bg-[#07111f] text-[#4a6680] hover:border-[#2a4060] hover:bg-[#0a1628] hover:text-slate-400",
                          ].join(" ")}
                        >
                          <Icon size={13} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <LogoutButton />
                </div>
              </div>
            </header>

            {/* ── SCROLLABLE CONTENT ── */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:thin] [scrollbar-color:#1a2d46_transparent] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-[#1a2d46] [&::-webkit-scrollbar-track]:bg-transparent">
              <div
                className="p-[14px] md:p-[20px]"
                style={{ animation: "al-fadein 0.22s ease" }}
              >
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}