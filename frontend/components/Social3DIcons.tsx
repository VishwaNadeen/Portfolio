"use client";

import { useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import { FaTelegram, FaTiktok } from "react-icons/fa6";
import { SOCIAL_LINKS } from "@/data/socialLinks";

const socials = [
  { name: "GitHub",   icon: <FaGithub size={28} />,    link: SOCIAL_LINKS.github,    color: "#e2e8f0", bg: "#1e293b" },
  { name: "LinkedIn", icon: <FaLinkedin size={28} />,  link: SOCIAL_LINKS.linkedin,  color: "#0a66c2", bg: "#0a1628" },
  { name: "Instagram",icon: <FaInstagram size={28} />, link: SOCIAL_LINKS.instagram, color: "#e1306c", bg: "#2d0a1a" },
  { name: "YouTube",  icon: <FaYoutube size={28} />,   link: SOCIAL_LINKS.youtube,   color: "#ff0000", bg: "#2d0000" },
  { name: "Facebook", icon: <FaFacebook size={28} />,  link: SOCIAL_LINKS.facebook,  color: "#1877f2", bg: "#0a1f3d" },
  { name: "TikTok",   icon: <FaTiktok size={28} />,    link: SOCIAL_LINKS.tiktok,    color: "#ee1d52", bg: "#2a0d1a" },
  { name: "Telegram", icon: <FaTelegram size={28} />,  link: SOCIAL_LINKS.telegram,  color: "#229ed9", bg: "#0a2233" },
];

export default function Social3DIcons() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <style>{`
        /* ── cube wrapper ── */
        .cube-scene {
          width: 72px;
          height: 72px;
          perspective: 320px;
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
          width: 72px;
          height: 72px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          backface-visibility: visible;
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }
        .face::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .face-front  { transform: translateZ(36px); }
        .face-back   { transform: rotateY(180deg) translateZ(36px); }
        .face-left   { transform: rotateY(-90deg) translateZ(36px); }
        .face-right  { transform: rotateY(90deg)  translateZ(36px); }
        .face-top    { transform: rotateX(90deg)  translateZ(36px); }
        .face-bottom { transform: rotateX(-90deg) translateZ(36px); }

        /* ── glow shadow beneath ── */
        .cube-shadow {
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 10px;
          border-radius: 50%;
          filter: blur(8px);
          opacity: 0.4;
          transition: opacity 0.3s, width 0.3s;
        }
        .cube-scene:hover .cube-shadow {
          opacity: 0.7;
          width: 60px;
        }

        /* ── entry animation ── */
        @keyframes cube-entry {
          from { opacity: 0; transform: scale(0.4) rotateY(-180deg); }
          to   { opacity: 1; transform: scale(1)   rotateY(0deg); }
        }
        .cube-entry {
          animation: cube-entry 0.6s cubic-bezier(.22,.8,.5,1) both;
        }

      `}</style>

      <section className="space-y-6">

        <div className="flex w-full items-center justify-between">
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

                  {/* FRONT */}
                  <div className="face face-front" style={{ background: s.bg, color: s.color }}>
                    {s.icon}
                  </div>

                  {/* BACK */}
                  <div className="face face-back" style={{ background: s.bg, color: s.color }}>
                    {s.icon}
                  </div>

                  {/* LEFT */}
                  <div className="face face-left" style={{ background: `color-mix(in srgb, ${s.bg} 70%, black)`, color: s.color }}>
                    {s.icon}
                  </div>

                  {/* RIGHT */}
                  <div className="face face-right" style={{ background: `color-mix(in srgb, ${s.bg} 70%, black)`, color: s.color }}>
                    {s.icon}
                  </div>

                  {/* TOP */}
                  <div className="face face-top" style={{ background: `color-mix(in srgb, ${s.bg} 55%, black)`, color: s.color }}>
                    {s.icon}
                  </div>

                  {/* BOTTOM */}
                  <div className="face face-bottom" style={{ background: `color-mix(in srgb, ${s.bg} 45%, black)`, color: s.color }}>
                    {s.icon}
                  </div>

                </div>
              </div>

              {/* shadow below cube */}
              <div
                className="cube-shadow"
                style={{ background: s.color }}
              />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}