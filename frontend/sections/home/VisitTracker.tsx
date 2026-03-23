"use client";

import { useEffect } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001";

export default function VisitTracker() {
  useEffect(() => {
    // 🚫 Do not track visits on localhost
    if (typeof window !== "undefined") {
      const host = window.location.hostname;

      if (host === "localhost" || host === "127.0.0.1") {
        return;
      }
    }

    fetch(`${API_BASE}/api/public/visit`, {
      method: "POST",
    }).catch(() => {});
  }, []);

  return null;
}