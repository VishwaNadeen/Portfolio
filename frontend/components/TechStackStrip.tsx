"use client";

import {
  SiReact,
  SiSpringboot,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiGit,
  SiDocker,
  SiRender,
  SiVercel,
  SiTypescript,
  SiLinux,
  SiOpenjdk,
  SiPostman,
} from "react-icons/si";
import { Database } from "lucide-react";

const techItems = [
  { name: "React", icon: SiReact, color: "text-cyan-400" },
  { name: "Spring Boot", icon: SiSpringboot, color: "text-green-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "TailwindCSS", icon: SiTailwindcss, color: "text-sky-400" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
  { name: "Express.js", icon: SiExpress, color: "text-zinc-200" },
  { name: "Database", icon: Database, color: "text-violet-400" },
  { name: "MongoDB", icon: SiMongodb, color: "text-emerald-400" },
  { name: "MySQL", icon: SiMysql, color: "text-blue-400" },
  { name: "Git", icon: SiGit, color: "text-orange-500" },
  { name: "Docker", icon: SiDocker, color: "text-blue-500" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-400" },
  { name: "Java", icon: SiOpenjdk, color: "text-red-400" },
  { name: "Linux", icon: SiLinux, color: "text-yellow-400" },
  { name: "Postman", icon: SiPostman, color: "text-orange-400" },
  { name: "Render", icon: SiRender, color: "text-indigo-400" },
  { name: "Vercel", icon: SiVercel, color: "text-white" },
];

const loopItems = [...techItems, ...techItems];

export default function TechStackStrip() {
  return (
    <section className="relative overflow-x-hidden overflow-y-visible bg-transparent py-4 sm:py-5 md:py-6">
      <div
        className="group overflow-x-hidden overflow-y-visible py-4 pb-12 sm:py-5 sm:pb-14 md:py-6 md:pb-16"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div
          className="
            flex w-max items-center gap-4 sm:gap-5 md:gap-6
            animate-[tech-marquee_30s_linear_infinite]
            group-hover:[animation-play-state:paused]
            md:animate-[tech-marquee_36s_linear_infinite]
          "
        >
          {loopItems.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={`${item.name}-${i}`}
                className="group/icon relative shrink-0"
              >
                {/* tooltip */}
                <div
                  className="
                    pointer-events-none absolute left-1/2 top-full z-20 mt-2.5
                    -translate-x-1/2 translate-y-1
                    whitespace-nowrap rounded-full border border-white/10
                    bg-slate-900/95 px-2.5 py-1 text-[11px] font-medium text-white/90
                    opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                    backdrop-blur-md transition-all duration-300
                    group-hover/icon:translate-y-0 group-hover/icon:opacity-100
                    sm:mt-3 sm:px-3 sm:py-1.5 sm:text-xs
                  "
                >
                  {item.name}
                </div>

                {/* icon card */}
                <div
                  className="
                    relative flex h-14 w-14 items-center justify-center
                    rounded-2xl border border-white/10
                    bg-white/[0.05] backdrop-blur-md
                    shadow-[0_12px_30px_rgba(0,0,0,0.35)]
                    transition-all duration-300 ease-out
                    group-hover/icon:-translate-y-2 sm:group-hover/icon:-translate-y-3
                    group-hover/icon:scale-110
                    group-hover/icon:border-cyan-400/30
                    group-hover/icon:shadow-[0_18px_40px_rgba(34,211,238,0.18)]
                    sm:h-[60px] sm:w-[60px] md:h-16 md:w-16
                  "
                >
                  <Icon
                    size={26}
                    className={`${item.color} transition-transform duration-300 group-hover/icon:scale-110 sm:[&]:size-7 md:[&]:size-8`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}