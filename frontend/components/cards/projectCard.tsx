"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ExternalLink, GitFork, Star, Globe, Layers3, X } from "lucide-react";

const DEFAULT_PROJECT_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";

export default function ProjectCard({ project }: { project: Project }) {
  const tech = Array.isArray(project.tech) ? project.tech.slice(0, 5) : [];
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);

  const customImage =
    typeof project.imageUrl === "string" ? project.imageUrl.trim() : "";

  const imageSrc = customImage.length > 0 ? customImage : DEFAULT_PROJECT_IMAGE;

  useEffect(() => {
    const checkOverflow = () => {
      const el = descriptionRef.current;
      if (!el) return;
      setShowSeeMore(el.scrollHeight > el.clientHeight + 1);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [project.description]);

  useEffect(() => {
    if (!showModal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [showModal]);

  return (
    <>
      <div className="group relative h-full overflow-hidden rounded-2xl bg-white/[0.04] p-4 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-white/[0.07] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(34,211,238,0.08)] sm:p-5">
        <a
          href={project.link || project.githubUrl || "#"}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 z-10"
          aria-label={`Open ${project.title}`}
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse at 70% 0%, rgba(34,211,238,0.07) 0%, transparent 65%)",
          }}
        />

        <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-cyan-400/8 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:h-32 sm:w-32" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-blue-500/8 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:h-32 sm:w-32" />

        <div className="relative z-20 flex h-full flex-col">
          <div className="relative -mx-4 -mt-4 mb-4 h-40 overflow-hidden rounded-t-2xl sm:-mx-5 sm:-mt-5 sm:h-48">
            <img
              src={imageSrc}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
          </div>

          <div className="flex min-h-[48px] items-start justify-between gap-3 sm:min-h-[56px]">
            <h3 className="line-clamp-2 min-w-0 text-sm font-semibold text-white transition-colors duration-300 group-hover:text-cyan-200 sm:text-lg">
              {project.title}
            </h3>

            <span className="shrink-0 rounded-full bg-white/[0.05] p-1.5 text-white/50 transition-all duration-300 group-hover:bg-cyan-400/10 group-hover:text-cyan-300 sm:p-2">
              <ExternalLink className="h-4 w-4" />
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            {project.type ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-300">
                <Layers3 className="h-3.5 w-3.5" />
                {project.type}
              </span>
            ) : null}

            {project.platform ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-white/70">
                <Globe className="h-3.5 w-3.5" />
                {project.platform}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50 sm:mt-4">
            <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-yellow-300">
              <Star className="h-4 w-4" />
              <span>{project.stars ?? 0}</span>
            </div>

            <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-cyan-300">
              <GitFork className="h-4 w-4" />
              <span>{project.forks ?? 0}</span>
            </div>
          </div>

          {project.description ? (
            <div className="mt-4">
              <p
                ref={descriptionRef}
                className="line-clamp-2 text-sm leading-6 text-white/65"
              >
                {project.description}
              </p>

              {showSeeMore ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                  className="relative z-30 mt-2 inline-flex text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                >
                  See more...
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="flex-1" />

          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
            {tech.map((t, index) => (
              <span
                key={t}
                className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-white/75 transition-all duration-300 group-hover:bg-cyan-400/10 group-hover:text-cyan-100"
                style={{ transitionDelay: `${index * 35}ms` }}
              >
                {t}
              </span>
            ))}

            {Array.isArray(project.tech) && project.tech.length > 5 ? (
              <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-white/50">
                +{project.tech.length - 5}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {showModal ? (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close description popup"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="pr-10 text-base font-semibold text-white sm:text-xl">
              {project.title}
            </h3>

            <div className="mt-4 max-h-[calc(85vh-80px)] overflow-y-auto pr-1 sm:max-h-[70vh]">
              <p className="whitespace-pre-line break-words text-sm leading-7 text-white/75 sm:text-base">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}