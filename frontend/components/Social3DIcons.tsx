"use client";

import { useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa";
import { FaTelegram, FaTiktok } from "react-icons/fa6";
import { SOCIAL_LINKS } from "@/data/socialLinks";

const socials = [
  {
    name: "GitHub",
    icon: <FaGithub size={28} />,
    link: SOCIAL_LINKS.github,
    color: "#e2e8f0",
    bg: "#1e293b",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin size={28} />,
    link: SOCIAL_LINKS.linkedin,
    color: "#0a66c2",
    bg: "#0a1628",
  },
  {
    name: "Instagram",
    icon: <FaInstagram size={28} />,
    link: SOCIAL_LINKS.instagram,
    color: "#e1306c",
    bg: "#2d0a1a",
  },
  {
    name: "YouTube",
    icon: <FaYoutube size={28} />,
    link: SOCIAL_LINKS.youtube,
    color: "#ff0000",
    bg: "#2d0000",
  },
  {
    name: "Facebook",
    icon: <FaFacebook size={28} />,
    link: SOCIAL_LINKS.facebook,
    color: "#1877f2",
    bg: "#0a1f3d",
  },
  {
    name: "TikTok",
    icon: <FaTiktok size={28} />,
    link: SOCIAL_LINKS.tiktok,
    color: "#ee1d52",
    bg: "#2a0d1a",
  },
  {
    name: "Telegram",
    icon: <FaTelegram size={28} />,
    link: SOCIAL_LINKS.telegram,
    color: "#229ed9",
    bg: "#0a2233",
  },
];

export default function Social3DIcons() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <style>{`
        /* ── cube wrapper ── */
        .cube-scene {
          width: 58px;
          height: 58px;
          perspective: 280px;
        }

        @media (min-width: 640px) {
          .cube-scene {
            width: 64px;
            height: 64px;
            perspective: 300px;
          }
        }

        @media (min-width: 768px) {
          .cube-scene {
            width: 72px;
            height: 72px;
            perspective: 320px;
          }
        }

        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: cube-spin 6s linear infinite;
          transition: animation-play-state 0.3s;
        }

        .cube.paused {
          animation-play-state: paused;
          transform: rotateX(-18deg) rotateY(25deg);
          transition: transform 0.5s cubic-bezier(.22,.8,.5,1);
        }

        @keyframes cube-spin {
          0%   { transform: rotateX(0deg)   rotateY(0deg);   }
          25%  { transform: rotateX(-15deg) rotateY(90deg);  }
          50%  { transform: rotateX(0deg)   rotateY(180deg); }
          75%  { transform: rotateX(15deg)  rotateY(270deg); }
          100% { transform: rotateX(0deg)   rotateY(360deg); }
        }

        /* ── six faces ── */
        .face {
          position: absolute;
          width: 58px;
          height: 58px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          backface-visibility: visible;
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .face {
            width: 64px;
            height: 64px;
            border-radius: 13px;
          }
        }

        @media (min-width: 768px) {
          .face {
            width: 72px;
            height: 72px;
            border-radius: 14px;
          }
        }

        .face::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .face-front  { transform: translateZ(29px); }
        .face-back   { transform: rotateY(180deg) translateZ(29px); }
        .face-left   { transform: rotateY(-90deg) translateZ(29px); }
        .face-right  { transform: rotateY(90deg)  translateZ(29px); }
        .face-top    { transform: rotateX(90deg)  translateZ(29px); }
        .face-bottom { transform: rotateX(-90deg) translateZ(29px); }

        @media (min-width: 640px) {
          .face-front  { transform: translateZ(32px); }
          .face-back   { transform: rotateY(180deg) translateZ(32px); }
          .face-left   { transform: rotateY(-90deg) translateZ(32px); }
          .face-right  { transform: rotateY(90deg)  translateZ(32px); }
          .face-top    { transform: rotateX(90deg)  translateZ(32px); }
          .face-bottom { transform: rotateX(-90deg) translateZ(32px); }
        }

        @media (min-width: 768px) {
          .face-front  { transform: translateZ(36px); }
          .face-back   { transform: rotateY(180deg) translateZ(36px); }
          .face-left   { transform: rotateY(-90deg) translateZ(36px); }
          .face-right  { transform: rotateY(90deg)  translateZ(36px); }
          .face-top    { transform: rotateX(90deg)  translateZ(36px); }
          .face-bottom { transform: rotateX(-90deg) translateZ(36px); }
        }

        /* ── glow shadow beneath ── */
        .cube-shadow {
          position: absolute;
          bottom: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 9px;
          border-radius: 50%;
          filter: blur(8px);
          opacity: 0.4;
          transition: opacity 0.3s, width 0.3s;
        }

        @media (min-width: 640px) {
          .cube-shadow {
            bottom: -16px;
            width: 46px;
            height: 10px;
          }
        }

        @media (min-width: 768px) {
          .cube-shadow {
            bottom: -18px;
            width: 50px;
            height: 10px;
          }
        }

        .cube-scene:hover .cube-shadow {
          opacity: 0.7;
          width: 60px;
        }

        /* ── entry animation ── */
        @keyframes cube-entry {
          from { opacity: 0; transform: scale(0.4) rotateY(-180deg); }
          to   { opacity: 1; transform: scale(1) rotateY(0deg); }
        }

        .cube-entry {
          animation: cube-entry 0.6s cubic-bezier(.22,.8,.5,1) both;
        }
      `}</style>

      <section className="space-y-6">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-8 sm:gap-x-5 md:justify-between md:gap-x-4">
          {socials.map((s, i) => (
            <a
              key={s.name}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              title={s.name}
              className="cube-entry relative block"
              style={{ animationDelay: `${i * 0.08}s` }}
              onMouseEnter={() => setHovered(s.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="cube-scene">
                <div className={`cube${hovered === s.name ? " paused" : ""}`}>
                  <div
                    className="face face-front"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.icon}
                  </div>

                  <div
                    className="face face-back"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.icon}
                  </div>

                  <div
                    className="face face-left"
                    style={{
                      background: `color-mix(in srgb, ${s.bg} 70%, black)`,
                      color: s.color,
                    }}
                  >
                    {s.icon}
                  </div>

                  <div
                    className="face face-right"
                    style={{
                      background: `color-mix(in srgb, ${s.bg} 70%, black)`,
                      color: s.color,
                    }}
                  >
                    {s.icon}
                  </div>

                  <div
                    className="face face-top"
                    style={{
                      background: `color-mix(in srgb, ${s.bg} 55%, black)`,
                      color: s.color,
                    }}
                  >
                    {s.icon}
                  </div>

                  <div
                    className="face face-bottom"
                    style={{
                      background: `color-mix(in srgb, ${s.bg} 45%, black)`,
                      color: s.color,
                    }}
                  >
                    {s.icon}
                  </div>
                </div>
              </div>

              <div className="cube-shadow" style={{ background: s.color }} />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}