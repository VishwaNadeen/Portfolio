import Link from "next/link";
import LogoutButton from "./components/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">

        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r border-slate-800 p-4">
          <div className="text-lg font-bold">Admin</div>

          <nav className="mt-6 space-y-2">
            <Link
              className="block rounded-xl px-3 py-2 hover:bg-slate-900"
              href="/admin/dashboard"
            >
              Dashboard
            </Link>

            <Link
              className="block rounded-xl px-3 py-2 hover:bg-slate-900"
              href="/admin/projects"
            >
              Projects
            </Link>
          </nav>

          {/* Logout */}
          <div className="mt-10">
            <LogoutButton />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <header className="border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="font-semibold">Portfolio Admin Panel</div>
            <div className="text-xs text-slate-400">v1</div>
          </header>

          <div className="p-4">{children}</div>
        </main>

      </div>
    </div>
  );
}