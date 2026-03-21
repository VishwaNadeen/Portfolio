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
      className={`fixed bottom-16 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12] sm:bottom-20 sm:right-6 sm:h-12 sm:w-12 ${
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-4"
      }`}
    >
      ↑
    </button>
  );
}