"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="
      group fixed bottom-7 right-7 z-50
      flex h-12 w-12 items-center justify-center
      rounded-xl
      border border-white/10
      bg-white/[0.04]
      backdrop-blur-md
      text-cyan-400
      shadow-[0_10px_30px_rgba(0,0,0,0.45)]
      transition-all duration-300
      hover:-translate-y-1
      hover:border-cyan-400/40
      hover:text-cyan-300
      hover:shadow-[0_12px_40px_rgba(34,211,238,0.25)]
    "
    >
      {/* glow layer */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/0 via-transparent to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <ArrowUp
        size={20}
        className="relative transition-transform duration-300 group-hover:-translate-y-0.5"
      />
    </button>
  );
}