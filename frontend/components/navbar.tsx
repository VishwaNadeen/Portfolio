import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-white/70 backdrop-blur border-b">
      <nav className="mx-auto max-w-5xl px-4 py-3 flex gap-6">
        <Link href="/" className="font-semibold">Vishwa</Link>
        <Link href="/about">About</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}