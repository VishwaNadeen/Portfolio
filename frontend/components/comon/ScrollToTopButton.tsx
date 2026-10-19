"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollTop}
      className={`fixed right-5 sm:right-7 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 text-white shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12] ${
  visible
    ? "opacity-100 translate-y-0"
    : "pointer-events-none opacity-0 translate-y-4"
}`}
style={{
  bottom: "calc(6.5rem + env(safe-area-inset-bottom))",
}}
    >
      ↑
    </button>
  );
}