"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../utils/auth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const t = getToken();
    if (!t) router.replace("/admin/login");
  }, [router]);

  return <>{children}</>;
}