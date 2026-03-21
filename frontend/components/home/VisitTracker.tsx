"use client";

import { useEffect } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001";

export default function VisitTracker() {
  useEffect(() => {
    fetch(`${API_BASE}/api/public/visit`, {
      method: "POST",
    }).catch(() => {});
  }, []);

  return null;
}