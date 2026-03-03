export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm opacity-80">
        © {new Date().getFullYear()} Vishwa Nadeen
      </div>
    </footer>
  );
}