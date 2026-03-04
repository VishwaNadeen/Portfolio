"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-900"
    >
      Logout
    </button>
  );
}