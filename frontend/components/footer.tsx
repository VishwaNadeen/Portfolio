export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">

        {/* Left */}
        <div>
          © {new Date().getFullYear()} <span className="text-white font-medium">Vishwa Nadeen</span>. All rights reserved.
        </div>

        {/* Right Links */}
        <div className="flex gap-5 mt-3 md:mt-0">
          <a
            href="https://github.com/"
            target="_blank"
            className="hover:text-white transition-colors duration-300"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com/"
            target="_blank"
            className="hover:text-white transition-colors duration-300"
          >
            LinkedIn
          </a>

          <a
            href="mailto:vishwanadeen@example.com"
            className="hover:text-white transition-colors duration-300"
          >
            Email
          </a>
        </div>

      </div>
    </footer>
  );
}