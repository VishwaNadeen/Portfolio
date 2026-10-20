"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import profile from "@/data/profile";

/* Mouse parallax hook */
function useMouse() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    // Parallax is only useful on devices with a precise mouse/trackpad.
    // Avoid unnecessary listeners and React updates on touch-first devices.
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!pointerQuery.matches) return;

    let frame = 0;
    let latestX = 0.5;
    let latestY = 0.5;

    const handler = (e: MouseEvent) => {
      latestX = e.clientX / Math.max(window.innerWidth, 1);
      latestY = e.clientY / Math.max(window.innerHeight, 1);

      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setPos({ x: latestX, y: latestY });
        frame = 0;
      });
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handler);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return pos;
}

/* Name with a clean hover style: glow + light sweep + drawn underline */
function AnimatedName({ name }: { name: string }) {
  return (
    <span className="group relative inline-block cursor-default select-none">
      {/* base gradient text + soft glow on hover */}
      <span className="animate-[gradientMove_6s_linear_infinite] bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-[length:200%_200%] bg-clip-text text-transparent transition-[filter] duration-300 group-hover:drop-shadow-[0_0_14px_rgba(34,211,238,0.5)]">
        {name}
      </span>

      {/* light sweep, clipped to the letters */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.85)_50%,transparent_65%)] bg-[position:150%_0] bg-[length:250%_100%] bg-clip-text text-transparent opacity-0 group-hover:animate-[sweep_0.9s_ease-out] group-hover:opacity-100 motion-reduce:hidden"
      >
        {name}
      </span>

      {/* underline that draws in from the left */}
      <span
        aria-hidden
        className="absolute -bottom-1 left-0 h-[3px] w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-500 ease-[cubic-bezier(.22,.8,.5,1)] group-hover:scale-x-100"
      />
    </span>
  );
}

/* Rotating "I build ..." line */
const ROLES = [
  "cross-platform mobile apps",
  "full web experiences",
  "interactions that feel right",
];

function RotatingRole() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ROLES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <p className="flex flex-wrap items-start gap-x-2 text-base font-medium text-slate-300 sm:text-lg md:text-xl">
      <span className="text-slate-500">I build</span>

      {/* Reserves the size of the longest phrase so layout (and the avatar) never shifts */}
      <span className="relative inline-grid min-w-0">
        {ROLES.map((role) => (
          <span
            key={role}
            aria-hidden
            className="invisible col-start-1 row-start-1 select-none"
          >
            {role}
          </span>
        ))}

        {/* Visible phrase, overlaid; same animation as before */}
        <span
          key={i}
          className="absolute inset-0 animate-[swap_0.5s_cubic-bezier(.22,.8,.5,1)_both] text-cyan-300 motion-reduce:animate-none"
        >
          {ROLES[i]}
        </span>
      </span>
    </p>
  );
}

/* GitHub avatar: pop-in, blur-up load, float, spinning ring, glow, parallax.
   Hover (mouse) / tap (touch) / keyboard focus -> enlarged popup over a blurred backdrop. */
function GitHubAvatar({
  username,
  className = "",
  px = 0,
  py = 0,
}: {
  username: string;
  className?: string;
  px?: number;
  py?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [geo, setGeo] = useState({ size: 320, ox: 160, oy: 160 });
  const imgRef = useRef<HTMLImageElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // portal needs the client; also handles images cached before hydration
  useEffect(() => {
    setMounted(true);
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setLoaded(true);

    // Warm up the large popup image so the first open doesn't wait on download/decode
    const big = new Image();
    big.src = `https://github.com/${username}.png?size=640`;
    big.decode?.().catch(() => {});
  }, [username]);

  // popup size + the point it grows out of (the small photo's center)
  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const size = Math.min(window.innerWidth * 0.8, viewportHeight * 0.7, 380);
    const left = (window.innerWidth - size) / 2;
    const top = (viewportHeight - size) / 2;
    return {
      size,
      ox: r.left + r.width / 2 - left,
      oy: r.top + r.height / 2 - top,
    };
  }, []);

  // Keep the popup geometry up to date while it is closed (and invisible), so the very
  // first open doesn't also animate width / height / transform-origin from the defaults.
  useEffect(() => {
    if (!mounted || open) return;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const g = measure();
      if (!g) return;
      setGeo((p) =>
        Math.abs(p.size - g.size) < 0.5 &&
        Math.abs(p.ox - g.ox) < 0.5 &&
        Math.abs(p.oy - g.oy) < 0.5
          ? p
          : g
      );
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(sync);
    };
    sync();
    const settle = window.setTimeout(sync, 1300); // after the intro animations finish
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.clearTimeout(settle);
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [mounted, open, measure]);

  const show = () => {
    const g = measure();
    if (!g) return;
    // popup grows out of the small photo's position
    setGeo(g);
    setOpen(true);
  };
  const hide = () => setOpen(false);

  // close on Escape, scroll, or a tap outside (touch devices)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!triggerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onScroll = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  const fallback = (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white">
      VN
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        tabIndex={0}
        role="button"
        aria-label="Enlarge profile photo"
        onPointerEnter={(e) => e.pointerType === "mouse" && show()}
        onPointerLeave={(e) => e.pointerType === "mouse" && hide()}
        onPointerUp={(e) => e.pointerType !== "mouse" && (open ? hide() : show())}
        // Only open on keyboard focus. On touch, a tap also focuses the element,
        // which would open and then instantly close the popup.
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && show()}
        onBlur={hide}
        className={`cursor-zoom-in touch-manipulation rounded-full outline-none [-webkit-tap-highlight-color:transparent] transition-transform duration-300 ease-out focus-visible:ring-2 focus-visible:ring-cyan-300 ${className}`}
        style={{ transform: `translate(${px}px, ${py}px)` }}
      >
        <div className="group relative size-full animate-[pop_0.8s_cubic-bezier(.22,.8,.5,1)_0.4s_both] opacity-0 motion-reduce:animate-none motion-reduce:opacity-100">
          <div className="size-full transform-gpu animate-[float_5s_ease-in-out_infinite] transition-transform duration-500 group-hover:scale-105 motion-reduce:animate-none">
            {/* pulsing glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-3 animate-[pulseGlow_3s_ease-in-out_infinite] rounded-full bg-cyan-400/30 blur-xl motion-reduce:animate-none"
            />

            {/* rotating gradient ring */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-[3px] transform-gpu animate-[spin_6s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#22d3ee,#3b82f6,transparent_60%,#22d3ee)] motion-reduce:animate-none"
            />

            {/* image */}
            <div className="relative size-full overflow-hidden rounded-full border-4 border-slate-950 bg-slate-900">
              {!loaded && !failed && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-800 to-slate-700" />
              )}

              {failed ? (
                fallback
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imgRef}
                  src={`https://github.com/${username}.png?size=320`}
                  alt="Vishwa Nadeen's GitHub profile photo"
                  width={160}
                  height={160}
                  onLoad={() => setLoaded(true)}
                  onError={() => setFailed(true)}
                  className={`size-full object-cover transition-all duration-700 ease-out ${
                    loaded ? "scale-100 opacity-100 blur-0" : "scale-110 opacity-0 blur-md"
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* popup: rendered in a portal so transformed / blurred parents can't clip it */}
      {mounted &&
        createPortal(
          <>
            {/* blurred backdrop */}
            <div
              aria-hidden
              className={`pointer-events-none fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-md transition-opacity duration-500 ease-out will-change-[opacity] motion-reduce:transition-none ${
                open ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* enlarged photo */}
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center"
            >
              <div
                className={`relative transition-all duration-500 ease-[cubic-bezier(.22,.8,.5,1)] will-change-[transform,opacity,filter] motion-reduce:transition-none ${
                  open ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-sm"
                }`}
                style={{
                  width: geo.size,
                  height: geo.size,
                  transformOrigin: `${geo.ox}px ${geo.oy}px`,
                }}
              >
                <div className="absolute -inset-6 animate-[pulseGlow_3s_ease-in-out_infinite] rounded-full bg-cyan-400/30 blur-2xl motion-reduce:animate-none" />
                <div className="absolute -inset-1 animate-[spin_6s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#22d3ee,#3b82f6,transparent_60%,#22d3ee)] motion-reduce:animate-none" />
                <div className="relative size-full overflow-hidden rounded-full border-[6px] border-slate-950 bg-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                  {failed ? (
                    fallback
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://github.com/${username}.png?size=640`}
                      alt=""
                      className="size-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}

/* Code-style profile card */
function ProfileCard({ tx, ty }: { tx: number; ty: number }) {
  return (
    <div className="[perspective:1000px]">
      <div
        className="relative rounded-2xl border border-white/10 bg-slate-950/70 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-300 ease-out"
        style={{ transform: `rotateY(${tx}deg) rotateX(${-ty}deg)` }}
      >
        {/* window bar */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-rose-400/80" />
          <span className="size-2.5 rounded-full bg-amber-300/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-xs text-slate-500">profile.ts</span>
        </div>

        <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-6 text-slate-300 sm:p-5 sm:text-[13px]">
          <code>
            <span className="text-fuchsia-300">const</span> <span className="text-cyan-300">me</span>{" "}
            = {"{"}
            {"\n"}
            {"  "}name: <span className="text-emerald-300">&quot;{profile.name}&quot;</span>,{"\n"}
            {"  "}role: <span className="text-emerald-300">&quot;{profile.role}&quot;</span>,{"\n"}
            {"  "}from: <span className="text-emerald-300">&quot;{profile.from}&quot;</span>,{"\n"}
            {"  "}builds: [{"\n"}
            {"    "}
            <span className="text-emerald-300">&quot;{profile.builds[0]}&quot;</span>,{"\n"}
            {"    "}
            <span className="text-emerald-300">&quot;{profile.builds[1]}&quot;</span>,{"\n"}
            {"    "}
            <span className="text-emerald-300">&quot;{profile.builds[2]}&quot;</span>,{"\n"}
            {"    "}
            <span className="text-emerald-300">&quot;{profile.builds[3]}&quot;</span>,{"\n"}
            {"  "}],{"\n"}
            {"  "}cares: <span className="text-emerald-300">&quot;{profile.cares}&quot;</span>,
            {"\n"}
            {"  "}focus: [{"\n"}
            {"    "}
            <span className="text-emerald-300">&quot;{profile.focus[0]}&quot;</span>,{"\n"}
            {"    "}
            <span className="text-emerald-300">&quot;{profile.focus[1]}&quot;</span>,{"\n"}
            {"  "}],{"\n"}
            {"  "}goal: <span className="text-emerald-300">&quot;{profile.goal}&quot;</span>,
            {"\n"}
            {"}"};
            <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 animate-[blink_1.1s_steps(1)_infinite] bg-cyan-300/80 motion-reduce:animate-none" />
          </code>
        </pre>
      </div>
    </div>
  );
}

/* Main Component */
export default function HeroSection() {
  const mouse = useMouse();

  const px = (mouse.x - 0.5) * 28;
  const py = (mouse.y - 0.5) * 28;
  const tx = (mouse.x - 0.5) * 8; // card tilt (deg)
  const ty = (mouse.y - 0.5) * 8;

  return (
    <>
      {/* Keyframes can't be written inline with Tailwind classes, so they stay as CSS */}
      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes sweep {
          from { background-position: 150% 0; }
          to   { background-position: -50% 0; }
        }
        @keyframes swap {
          from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);   filter: blur(0);   }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.08); }
        }
        @keyframes pop {
          from { opacity: 0; transform: scale(0.6) rotate(-8deg); }
          to   { opacity: 1; transform: scale(1)   rotate(0); }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950/70 to-slate-900/40 p-5 backdrop-blur-xl sm:p-8 md:p-12">
        {/* dot grid, faded toward the edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.25)_1px,transparent_1px)] bg-[length:22px_22px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />

        {/* mouse-parallax glows */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl transition-transform duration-300 ease-out sm:h-64 sm:w-64 md:-right-32 md:-top-32 md:h-80 md:w-80"
          style={{ transform: `translate(${-px * 0.4}px, ${-py * 0.4}px)` }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-blue-500/15 blur-3xl transition-transform duration-300 ease-out sm:h-64 sm:w-64 md:-bottom-32 md:-left-32 md:h-80 md:w-80"
          style={{ transform: `translate(${px * 0.3}px, ${py * 0.3}px)` }}
        />

        {/* ── content ── */}
        <div className="relative grid items-center gap-8 md:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* left: heading + avatar (right of the name), then paragraph */}
          <div className="min-w-0 animate-[rise_0.65s_cubic-bezier(.22,.8,.5,1)_0.1s_both] space-y-6 opacity-0 md:space-y-7">
            <div className="flex min-w-0 items-center gap-2 sm:gap-6 md:gap-8">
              {/* greeting (smaller), name (large, never wraps), role */}
              <div className="min-w-0 space-y-3">
                <h1 className="font-bold tracking-tight text-white">
                  <span className="mb-1 block text-lg font-medium text-slate-300 sm:text-xl md:text-2xl">
                    Hi, I&apos;m
                  </span>
                  <span className="block whitespace-nowrap text-[clamp(1.125rem,6vw,1.5rem)] sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
                    <AnimatedName name="Vishwa Nadeen" />
                  </span>
                </h1>
                <RotatingRole />
              </div>

              {/* avatar on the right of the name (fixed size, never shrinks) */}
              <GitHubAvatar
                username={profile.githubUsername}
                className="size-12 shrink-0 min-[360px]:size-14 sm:size-24 md:size-28 2xl:size-32"
                px={px * 0.25}
                py={py * 0.25}
              />
            </div>

            <p className="max-w-2xl text-justify text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 md:text-lg">
              {profile.bio}
            </p>
          </div>

          {/* right: code card (hidden on small screens to keep the hero short) */}
          <div className="hidden animate-[rise_0.8s_cubic-bezier(.22,.8,.5,1)_0.3s_both] opacity-0 lg:block">
            <ProfileCard tx={tx} ty={ty} />
          </div>
        </div>
      </section>
    </>
  );
}