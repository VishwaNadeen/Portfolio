"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ExternalLink, GitFork, Star, Globe, Layers3 } from "lucide-react";

const DEFAULT_PROJECT_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";

const DESCRIPTION_LINE_HEIGHT = 24;
const DESCRIPTION_VISIBLE_LINES = 3;
const DESCRIPTION_PAGE_HEIGHT =
  DESCRIPTION_LINE_HEIGHT * DESCRIPTION_VISIBLE_LINES;

export default function ProjectCard({ project }: { project: Project }) {
  const tech = Array.isArray(project.tech) ? project.tech.slice(0, 5) : [];
  const descriptionInnerRef = useRef<HTMLParagraphElement | null>(null);

  const [descriptionPage, setDescriptionPage] = useState(0);
  const [descriptionPagesCount, setDescriptionPagesCount] = useState(1);

  const customImage =
    typeof project.imageUrl === "string" ? project.imageUrl.trim() : "";

  const imageSrc = customImage.length > 0 ? customImage : DEFAULT_PROJECT_IMAGE;

  const finalLink =
    project.link && project.link.trim().length > 0
      ? project.link
      : project.githubUrl && project.githubUrl.trim().length > 0
      ? project.githubUrl
      : "";

  const hasLink = finalLink.length > 0;

  useEffect(() => {
    const calculateDescriptionPages = () => {
      const el = descriptionInnerRef.current;
      if (!el || !project.description) {
        setDescriptionPagesCount(1);
        setDescriptionPage(0);
        return;
      }

      const totalHeight = el.scrollHeight;
      const totalPages = Math.max(
        1,
        Math.ceil(totalHeight / DESCRIPTION_PAGE_HEIGHT)
      );

      setDescriptionPagesCount(totalPages);
      setDescriptionPage(0);
    };

    calculateDescriptionPages();
    window.addEventListener("resize", calculateDescriptionPages);

    return () => {
      window.removeEventListener("resize", calculateDescriptionPages);
    };
  }, [project.description]);

  useEffect(() => {
    if (!project.description || descriptionPagesCount <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setDescriptionPage((prev) => (prev + 1) % descriptionPagesCount);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [project.description, descriptionPagesCount]);

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-white/[0.04] p-4 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-white/[0.07] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(34,211,238,0.08)] sm:p-5">
      {hasLink ? (
        <a
          href={finalLink}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 z-30"
          aria-label={`Open ${project.title}`}
        />
      ) : null}

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
          <h3 className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold text-white transition-colors duration-300 group-hover:text-cyan-200 sm:text-lg">
            {project.title}
          </h3>

          <span className="shrink-0 rounded-full bg-white/[0.05] p-1.5 text-white/50 transition-all duration-300 group-hover:bg-cyan-400/10 group-hover:text-cyan-300 sm:p-2">
            <ExternalLink className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
          {project.type ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-300">
              <Layers3 className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{project.type}</span>
            </span>
          ) : null}

          {project.platform ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-white/70">
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{project.platform}</span>
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50 sm:mt-4">
          <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-yellow-300">
            <Star className="h-4 w-4 shrink-0" />
            <span>{project.stars ?? 0}</span>
          </div>

          <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-cyan-300">
            <GitFork className="h-4 w-4 shrink-0" />
            <span>{project.forks ?? 0}</span>
          </div>
        </div>

        {project.description ? (
          <div
            className="mt-4 overflow-hidden"
            style={{ height: `${DESCRIPTION_PAGE_HEIGHT}px` }}
          >
            <p
              ref={descriptionInnerRef}
              className="whitespace-pre-line text-justify text-sm leading-6 text-white/65 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateY(-${
                  descriptionPage * DESCRIPTION_PAGE_HEIGHT
                }px)`,
              }}
            >
              {project.description}
            </p>
          </div>
        ) : null}

        <div className="flex-1" />

        <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
          {tech.map((t, index) => (
            <span
              key={t}
              className="break-words rounded-full bg-white/[0.05] px-3 py-1 text-xs text-white/75 transition-all duration-300 group-hover:bg-cyan-400/10 group-hover:text-cyan-100"
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
  );
}