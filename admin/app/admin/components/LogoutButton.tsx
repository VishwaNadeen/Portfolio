"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { adminLogout } from "../lib/adminApi";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await adminLogout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
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