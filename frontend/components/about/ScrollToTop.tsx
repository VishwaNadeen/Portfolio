"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!visible) return null;

  return (
    <button
      onClick={scrollTop}
      className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12] sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
    >
      ↑
    </button>
  );
}