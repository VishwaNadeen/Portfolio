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
      className="
        group flex w-full items-center justify-center gap-2
        whitespace-nowrap rounded-[6px]
        border border-[#7f1d1d50]
        bg-[#0f0808]
        px-[14px] py-[10px] md:py-[8px]
        text-[12px] font-medium
        text-[#7a3535]
        font-sans
        transition-all duration-150
        hover:border-[#ef444460]
        hover:bg-[#1a0808]
        hover:text-[#f87171]
        hover:shadow-[0_0_16px_#ef444412]
      "
    >
      <LogOut
        size={13}
        className="shrink-0 transition-transform duration-150 group-hover:-translate-x-[2px]"
      />
      <span className="font-mono text-[10px] tracking-[0.08em]">
        LOGOUT
      </span>
    </button>
  );
}