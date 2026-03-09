"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    try {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("admin_token");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("auth_token");
    } catch {}

    router.replace("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500/20 hover:text-red-200"
    >
      <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      Logout
    </button>
  );
}