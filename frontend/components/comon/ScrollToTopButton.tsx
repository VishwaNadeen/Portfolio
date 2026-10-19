
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  },);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`
        fixed left-1/2 z-50
        flex h-14 w-14 -translate-x-1/2
        items-center justify-center
        rounded-full
        border border-cyan-400/40
        bg-slate-950/80
        text-cyan-300
        shadow-lg shadow-cyan-500/10
        backdrop-blur-xl
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:border-cyan-300/70
        hover:bg-cyan-400/10
        hover:text-cyan-200
        hover:shadow-cyan-400/20
        active:scale-95
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }
      `}
      style={{
  bottom: "calc(5rem + env(safe-area-inset-bottom))",
}}
    >
      <ArrowUp size={22} strokeWidth={2} />
    </button>
  );
}
