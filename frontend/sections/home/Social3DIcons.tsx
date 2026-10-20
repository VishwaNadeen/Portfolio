"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";
import { FaTelegram, FaTiktok } from "react-icons/fa6";
import { SOCIAL_LINKS } from "@/data/socialLinks";

/* Tailwind only generates classes it can read as complete strings in the
   source, so each cube's colors and entry delay are written out in full.
   text = icon color, bg = face color, glow = shadow color under the cube. */
const socials = [
  {
    name: "GitHub",
    icon: <FaGithub size={28} />,
    link: SOCIAL_LINKS.github,
    text: "text-[#e2e8f0]",
    bg: "bg-[#1e293b]",
    glow: "bg-[#e2e8f0]",
    entry: "animate-[cube-entry_0.6s_cubic-bezier(.22,.8,.5,1)_0s_backwards]",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin size={28} />,
    link: SOCIAL_LINKS.linkedin,
    text: "text-[#0a66c2]",
    bg: "bg-[#0a1628]",
    glow: "bg-[#0a66c2]",
    entry: "animate-[cube-entry_0.6s_cubic-bezier(.22,.8,.5,1)_0.08s_backwards]",
  },
  {
    name: "Instagram",
    icon: <FaInstagram size={28} />,
    link: SOCIAL_LINKS.instagram,
    text: "text-[#e1306c]",
    bg: "bg-[#2d0a1a]",
    glow: "bg-[#e1306c]",
    entry: "animate-[cube-entry_0.6s_cubic-bezier(.22,.8,.5,1)_0.16s_backwards]",
  },
  {
    name: "YouTube",
    icon: <FaYoutube size={28} />,
    link: SOCIAL_LINKS.youtube,
    text: "text-[#ff0000]",
    bg: "bg-[#2d0000]",
    glow: "bg-[#ff0000]",
    entry: "animate-[cube-entry_0.6s_cubic-bezier(.22,.8,.5,1)_0.24s_backwards]",
  },
  {
    name: "Facebook",
    icon: <FaFacebook size={28} />,
    link: SOCIAL_LINKS.facebook,
    text: "text-[#1877f2]",
    bg: "bg-[#0a1f3d]",
    glow: "bg-[#1877f2]",
    entry: "animate-[cube-entry_0.6s_cubic-bezier(.22,.8,.5,1)_0.32s_backwards]",
  },
  {
    name: "TikTok",
    icon: <FaTiktok size={28} />,
    link: SOCIAL_LINKS.tiktok,
    text: "text-[#ee1d52]",
    bg: "bg-[#2a0d1a]",
    glow: "bg-[#ee1d52]",
    entry: "animate-[cube-entry_0.6s_cubic-bezier(.22,.8,.5,1)_0.4s_backwards]",
  },
  {
    name: "Telegram",
    icon: <FaTelegram size={28} />,
    link: SOCIAL_LINKS.telegram,
    text: "text-[#229ed9]",
    bg: "bg-[#0a2233]",
    glow: "bg-[#229ed9]",
    entry: "animate-[cube-entry_0.6s_cubic-bezier(.22,.8,.5,1)_0.48s_backwards]",
  },
  {
    name: "WhatsApp",
    icon: <FaWhatsapp size={28} />,
    link: SOCIAL_LINKS.whatsapp,
    text: "text-[#25d366]",
    bg: "bg-[#0a2415]",
    glow: "bg-[#25d366]",
    entry: "animate-[cube-entry_0.6s_cubic-bezier(.22,.8,.5,1)_0.56s_backwards]",
  },
];

const FACES = [
  {
    key: "front",
    pos: "[transform:translateZ(29px)] sm:[transform:translateZ(32px)] md:[transform:translateZ(36px)]",
    shade: "",
  },
  {
    key: "back",
    pos: "[transform:rotateY(180deg)_translateZ(29px)] sm:[transform:rotateY(180deg)_translateZ(32px)] md:[transform:rotateY(180deg)_translateZ(36px)]",
    shade: "",
  },
  {
    key: "left",
    pos: "[transform:rotateY(-90deg)_translateZ(29px)] sm:[transform:rotateY(-90deg)_translateZ(32px)] md:[transform:rotateY(-90deg)_translateZ(36px)]",
    shade: "bg-[linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3))]",
  },
  {
    key: "right",
    pos: "[transform:rotateY(90deg)_translateZ(29px)] sm:[transform:rotateY(90deg)_translateZ(32px)] md:[transform:rotateY(90deg)_translateZ(36px)]",
    shade: "bg-[linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3))]",
  },
  {
    key: "top",
    pos: "[transform:rotateX(90deg)_translateZ(29px)] sm:[transform:rotateX(90deg)_translateZ(32px)] md:[transform:rotateX(90deg)_translateZ(36px)]",
    shade: "bg-[linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45))]",
  },
  {
    key: "bottom",
    pos: "[transform:rotateX(-90deg)_translateZ(29px)] sm:[transform:rotateX(-90deg)_translateZ(32px)] md:[transform:rotateX(-90deg)_translateZ(36px)]",
    shade: "bg-[linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55))]",
  },
];

const FACE_BASE =
  "absolute flex h-[58px] w-[58px] flex-col items-center justify-center gap-1 rounded-xl border border-white/[0.08] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,transparent_60%)] before:content-[''] sm:h-16 sm:w-16 sm:rounded-[13px] md:h-[72px] md:w-[72px] md:rounded-[14px]";

/* Tracks whether the section is on screen (with a small margin) so the
   spinning can pause when it is not: off-screen cubes cost nothing. */
function useOnScreen(rootMargin = "120px") {
  const ref = useRef<HTMLElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, onScreen };
}

export default function Social3DIcons() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { ref, onScreen } = useOnScreen();

  return (
    <>
      <style>{`
        @keyframes cube-spin {
          0%   { transform: rotateX(0deg)   rotateY(0deg);   }
          25%  { transform: rotateX(-15deg) rotateY(90deg);  }
          50%  { transform: rotateX(0deg)   rotateY(180deg); }
          75%  { transform: rotateX(15deg)  rotateY(270deg); }
          100% { transform: rotateX(0deg)   rotateY(360deg); }
        }

        @keyframes cube-entry {
          from { opacity: 0; transform: scale(0.4) rotateY(-180deg); }
          to   { opacity: 1; transform: scale(1) rotateY(0deg); }
        }
      `}</style>

      <section ref={ref} className="min-w-0 space-y-6">
        {/* 4 cubes per row on phones and small tablets (4 + 4), one row of 8 from md */}
        <div className="grid w-full grid-cols-4 justify-items-center gap-x-2 gap-y-8 sm:gap-x-4 md:grid-cols-8 md:gap-x-2">
          {socials.map((s) => {
            const paused = hovered === s.name || !onScreen;

            return (
              <a
                key={s.name}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                title={s.name}
                aria-label={s.name}
                className={`relative block touch-manipulation [-webkit-tap-highlight-color:transparent] motion-reduce:animate-none ${s.entry}`}
                // mouse / pen only: on touch, a tap fakes "hover" and would
                // leave the cube frozen
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") setHovered(s.name);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== "touch") setHovered(null);
                }}
              >
                {/* scene: size + perspective */}
                <div className="peer h-[58px] w-[58px] [perspective:280px] sm:h-16 sm:w-16 sm:[perspective:300px] md:h-[72px] md:w-[72px] md:[perspective:320px]">
                  {/* cube: 3D spin */}
                  <div
                    className={`relative h-full w-full will-change-transform [transform-style:preserve-3d] motion-reduce:animate-none ${
                      paused ? "[animation-play-state:paused]" : ""
                    }`}
                  >
                    {FACES.map((f) => (
                      <div
                        key={f.key}
                        className={`${FACE_BASE} ${s.bg} ${s.text} ${f.pos} ${f.shade}`}
                      >
                        {s.icon}
                      </div>
                    ))}
                  </div>
                </div>

                {/* glow shadow beneath */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-[-14px] left-1/2 h-[9px] w-10 -translate-x-1/2 rounded-full opacity-40 blur-[8px] [transition:opacity_0.3s,width_0.3s] sm:bottom-[-16px] sm:h-[10px] sm:w-[46px] md:bottom-[-18px] md:w-[50px] [@media(hover:hover)]:peer-hover:w-[60px] [@media(hover:hover)]:peer-hover:opacity-70 ${s.glow}`}
                />
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}