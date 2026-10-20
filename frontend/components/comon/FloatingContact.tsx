"use client";

import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  LoaderCircle,
  Mail,
  MessageCircle,
  PenLine,
  Send,
  User,
  X,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import { SOCIAL_LINKS } from "@/data/socialLinks";
import { usePathname } from "next/navigation";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type Phase = "closed" | "open" | "closing";

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  message: "",
};

const MAX_MESSAGE_LENGTH = 1000;
// Keep in sync with the 340ms in the closing animation classes below.
const CLOSE_DURATION_MS = 340;
// A visible-area shrink bigger than this means the phone keyboard is open.
const KEYBOARD_THRESHOLD_PX = 150;

/* Animation classes (same values as before, now as Tailwind classes).
   The matching @keyframes stay in the <style> block below. */
const FRAME_OPEN =
  "animate-[contact-win-open_520ms_cubic-bezier(.34,1.22,.64,1)_backwards,contact-fade-in_200ms_ease-out_backwards]";
const FRAME_CLOSE =
  "animate-[contact-win-close_340ms_cubic-bezier(.5,0,.75,0)_both,contact-fade-out_340ms_linear_both]";
const BACKDROP_OPEN = "animate-[contact-backdrop-in_320ms_ease-out_backwards]";
const BACKDROP_CLOSE = "animate-[contact-backdrop-out_340ms_ease-in_both]";

// Avoids the "useLayoutEffect does nothing on the server" warning during SSR.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Social = {
  name: string;
  href: string;
  bg: string; // real app-icon background (Tailwind class)
  Icon: IconType;
};

const SOCIALS: Social[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/94715688517?text=Hello%20Vishwa%2C%20I%20want%20to%20connect%20with%20you.",
    bg: "bg-[linear-gradient(160deg,#3DDC6B,#1FAF4B)]",
    Icon: FaWhatsapp,
  },
  {
    name: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    bg: "bg-[linear-gradient(160deg,#1D87D6,#0A66C2)]",
    Icon: FaLinkedinIn,
  },
  {
    name: "Instagram",
    href: SOCIAL_LINKS.instagram,
    bg: "bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]",
    Icon: FaInstagram,
  },
  {
    name: "Facebook",
    href: SOCIAL_LINKS.facebook,
    bg: "bg-[linear-gradient(160deg,#2D8CFF,#1877F2)]",
    Icon: FaFacebookF,
  },
  {
    name: "Telegram",
    href: SOCIAL_LINKS.telegram,
    bg: "bg-[linear-gradient(160deg,#2AABEE,#229ED9)]",
    Icon: FaTelegram,
  },
];

function inputClass(hasError: boolean) {
  return [
    // text-base on phones: iOS Safari zooms the whole page when an input is
    // smaller than 16px, which breaks the layout.
    "w-full rounded-xl border bg-white/[0.04] py-3 pl-11 pr-4 text-base text-white outline-none transition sm:text-sm",
    "placeholder:text-slate-600 focus:bg-white/[0.06] focus:ring-2",
    hasError
      ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/10"
      : "border-white/10 focus:border-cyan-400/60 focus:ring-cyan-400/10",
  ].join(" ");
}

// On phones the keyboard's "next" key jumps to the following field instead of
// submitting the form early. Desktop keeps its normal Enter behavior.
function onEnterNext(next: { current: HTMLElement | null }) {
  return (event: ReactKeyboardEvent) => {
    if (event.key !== "Enter") return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    event.preventDefault();
    next.current?.focus();
  };
}

function Field({
  id,
  label,
  icon,
  error,
  aside,
  textarea,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  aside?: ReactNode;
  textarea?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-slate-200">
          {label}
        </label>
        {aside}
      </div>

      <div className="relative">
        <span
          className={`pointer-events-none absolute left-4 text-slate-500 ${
            textarea ? "top-3.5" : "top-1/2 -translate-y-1/2"
          }`}
        >
          {icon}
        </span>
        {children}
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function FloatingContact() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const pathname = usePathname();
  const isAboutPage = pathname === "/about";

  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const buttonCenter = useRef({ x: 0, y: 0 });
  const lockRef = useRef({ x: 0, y: 0 });
  const keyboardRef = useRef(false);
  const baseRef = useRef({ w: 0, h: 0 });

  const mounted = phase !== "closed";
  const isOpen = phase === "open";
  const closing = phase === "closing";
  const sent = feedback?.type === "success";

  /* ---------- macOS-style open / close ---------- */

  function captureButtonCenter() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    buttonCenter.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  // Point the window's transform-origin at the floating button,
  // so it grows out of (and shrinks back into) the button like a Dock icon.
  function applyOrigin() {
    const el = frameRef.current;
    const wrap = wrapperRef.current;
    if (!el || !wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    el.style.transformOrigin = `${
      buttonCenter.current.x - wrapRect.left - el.offsetLeft
    }px ${buttonCenter.current.y - wrapRect.top - el.offsetTop}px`;
  }

  function openPopup() {
    captureButtonCenter();
    setPhase("open");
  }

  function closePopup() {
    if (submitting || phase !== "open") return;
    // Put the phone keyboard away before the window shrinks into the button.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    captureButtonCenter();
    applyOrigin();
    setPhase("closing");
  }

  useIsoLayoutEffect(() => {
    if (phase === "open") applyOrigin();
  }, [phase]);

  // Unmount once the close animation has finished.
  useEffect(() => {
    if (phase !== "closing") return;
    const timer = window.setTimeout(
      () => setPhase("closed"),
      CLOSE_DURATION_MS
    );
    return () => window.clearTimeout(timer);
  }, [phase]);

  /* ---------- tell the navbar to slide away while the window is open ---------- */

  useEffect(() => {
    const root = document.documentElement;

    if (phase === "open") {
      root.setAttribute("data-contact-open", "true");
    } else {
      root.removeAttribute("data-contact-open");
    }

    return () => root.removeAttribute("data-contact-open");
  }, [phase]);

  /* ---------- follow the visible area (phone keyboard) ----------
     On phones the keyboard covers the bottom of the page without resizing it.
     The window is therefore sized to the visual viewport, so it always sits
     right above the keyboard and nothing is hidden behind it. */

  useEffect(() => {
    if (!mounted) return;

    const vv = window.visualViewport;
    const wrap = wrapperRef.current;
    if (!vv || !wrap) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;

      // New width = rotation: forget the old "full height".
      const width = Math.round(vv.width);
      if (baseRef.current.w !== width) baseRef.current = { w: width, h: 0 };
      baseRef.current.h = Math.max(
        baseRef.current.h,
        doc.clientHeight,
        vv.height
      );

      // Pinch-zoomed page: leave the normal full-screen layout alone.
      if (vv.scale > 1.01) {
        wrap.style.removeProperty("--vv-top");
        wrap.style.removeProperty("--vv-bottom");
        keyboardRef.current = false;
        setKeyboardOpen(false);
        return;
      }

      const top = Math.max(0, vv.offsetTop);
      const bottom = Math.max(0, doc.clientHeight - top - vv.height);
      wrap.style.setProperty("--vv-top", `${top}px`);
      wrap.style.setProperty("--vv-bottom", `${bottom}px`);

      const open = baseRef.current.h - vv.height > KEYBOARD_THRESHOLD_PX;
      keyboardRef.current = open;
      setKeyboardOpen(open);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    vv.addEventListener("resize", schedule);
    vv.addEventListener("scroll", schedule);

    return () => {
      vv.removeEventListener("resize", schedule);
      vv.removeEventListener("scroll", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      keyboardRef.current = false;
      setKeyboardOpen(false);
    };
  }, [mounted]);

  // Keep the field you are typing in visible when the keyboard opens.
  useEffect(() => {
    if (!keyboardOpen) return;
    const timer = window.setTimeout(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && frameRef.current?.contains(active)) {
        active.scrollIntoView({ block: "nearest" });
      }
    }, 60);
    return () => window.clearTimeout(timer);
  }, [keyboardOpen]);

  /* ---------- stop page scrolling (scrollbar stays visible, no layout shift) ---------- */

  useEffect(() => {
    if (!mounted) return;

    lockRef.current = { x: window.scrollX, y: window.scrollY };

    const insideWindow = (target: EventTarget | null) =>
      target instanceof Node && !!frameRef.current?.contains(target);

    // Mouse wheel / touch outside the popup must not scroll the page.
    const blockOutside = (event: Event) => {
      if (!insideWindow(event.target)) event.preventDefault();
    };

    // Keyboard scrolling (space, arrows, page keys) outside the popup.
    const blockKeys = (event: KeyboardEvent) => {
      const scrollKeys = [
        " ",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        "ArrowUp",
        "ArrowDown",
      ];
      if (scrollKeys.includes(event.key) && !insideWindow(event.target)) {
        event.preventDefault();
      }
    };

    // Catches everything else, e.g. dragging the scrollbar thumb.
    // Skipped while the phone keyboard is open: the browser scrolls the page
    // itself then, and fighting it makes the screen jump.
    const keepPosition = () => {
      if (keyboardRef.current) return;
      const { x, y } = lockRef.current;
      if (window.scrollX !== x || window.scrollY !== y) {
        window.scrollTo({
          left: x,
          top: y,
          behavior: "instant" as ScrollBehavior,
        });
      }
    };

    window.addEventListener("wheel", blockOutside, { passive: false });
    window.addEventListener("touchmove", blockOutside, { passive: false });
    window.addEventListener("keydown", blockKeys);
    window.addEventListener("scroll", keepPosition, { passive: true });

    return () => {
      window.removeEventListener("wheel", blockOutside);
      window.removeEventListener("touchmove", blockOutside);
      window.removeEventListener("keydown", blockKeys);
      window.removeEventListener("scroll", keepPosition);
    };
  }, [mounted]);

  // When the keyboard closes, put the page back where it was.
  useEffect(() => {
    if (!mounted || keyboardOpen) return;
    const { x, y } = lockRef.current;
    if (window.scrollX !== x || window.scrollY !== y) {
      window.scrollTo({
        left: x,
        top: y,
        behavior: "instant" as ScrollBehavior,
      });
    }
  }, [keyboardOpen, mounted]);

  /* ---------- Escape + autofocus ---------- */

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        closePopup();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Autofocus only with a mouse. On a phone it would pop the keyboard up
    // over the window while it is still opening.
    const focusTimer = window.setTimeout(() => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        firstInputRef.current?.focus({ preventScroll: true });
      }
    }, 380);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, submitting]);

  /* ---------- form logic ---------- */

  function updateField(field: keyof FormData, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setFeedback(null);
  }

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    } else if (form.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Please enter your message.";
    } else if (form.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();

    setErrors(nextErrors);
    setFeedback(null);

    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);

    try {
      const validationResponse = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim() }),
      });

      const validationData = await validationResponse.json();

      if (!validationResponse.ok || !validationData.valid) {
        setErrors({
          email:
            validationData?.message || "Please enter a valid email address.",
        });
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to send your message.");
      }

      setForm(INITIAL_FORM);
      setErrors({});
      setFeedback({
        type: "success",
        message: "Your message has been sent successfully!",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Only transform + opacity are animated (GPU-composited), and each has a single
  // keyframe interval, so the motion is one continuous curve with no speed jumps.
  const frameAnimation = closing ? FRAME_CLOSE : FRAME_OPEN;
  const backdropAnimation = closing ? BACKDROP_CLOSE : BACKDROP_OPEN;

  return (
    <>
      <style>{`
        /* Pause the navbar's decorative animation while the popup is open,
           so the open / close animation gets the whole frame budget */
        html[data-contact-open] .nav-frame {
          animation-play-state: paused;
        }

        /* Rotating outline: a transform-only rotation (runs on the GPU,
           works in every browser, no @property needed) */
        @keyframes contact-border-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes contact-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes contact-backdrop-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        /* Grows out of the button; the overshoot comes from the easing curve */
        @keyframes contact-win-open {
          from { transform: scale(.08, .04); }
          to   { transform: scale(1, 1); }
        }
        /* Genie-style squeeze back into the button */
        @keyframes contact-win-close {
          from { transform: scale(1, 1) skewX(0deg); }
          to   { transform: scale(.06, .03) skewX(-8deg); }
        }
        @keyframes contact-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes contact-fade-out {
          0%, 50% { opacity: 1; }
          100%    { opacity: 0; }
        }
        @keyframes contact-pop {
          0%   { transform: scale(.5); opacity: 0; }
          70%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes contact-button-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,238,.35), 0 10px 30px rgba(8,145,178,.30); }
          50%      { box-shadow: 0 0 0 10px rgba(34,211,238,0), 0 10px 30px rgba(8,145,178,.40); }
        }
      `}</style>

      {/* Floating contact button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={openPopup}
        aria-label="Open contact form"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`group fixed right-4 z-[80] flex h-14 w-14 touch-manipulation items-center justify-center gap-2.5 rounded-full border border-cyan-200/30 bg-gradient-to-br from-cyan-400 via-cyan-600 to-indigo-600 text-white [-webkit-tap-highlight-color:transparent] [transition:bottom_350ms_ease-out,transform_300ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:animate-none motion-reduce:transition-none sm:right-7 sm:w-auto sm:pl-4 sm:pr-5 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:scale-105 ${
          isAboutPage
            ? "bottom-[calc(5.5rem+env(safe-area-inset-bottom))]"
            : "bottom-[calc(1.25rem+env(safe-area-inset-bottom))]"
        } ${
          // Pause the pulse while the popup is up: it only costs frames behind the backdrop
          mounted
            ? "animate-none"
            : "animate-[contact-button-pulse_3s_ease-in-out_infinite]"
        }`}
      >
        <MessageCircle
          size={24}
          strokeWidth={1.9}
          className="transition-transform duration-300 [@media(hover:hover)]:group-hover:-rotate-6"
        />
        <span className="hidden text-sm font-semibold sm:inline">
          Let&apos;s talk
        </span>
      </button>

      {/* Modal: sized to the visible area, so the phone keyboard never covers it */}
      {mounted && (
        <div
          ref={wrapperRef}
          className={`fixed inset-x-0 bottom-[var(--vv-bottom,0px)] top-[var(--vv-top,0px)] z-[100] flex items-end justify-center sm:items-center sm:p-5 ${
            closing ? "pointer-events-none" : ""
          }`}
          onMouseDown={(event) => {
            if (!frameRef.current?.contains(event.target as Node)) {
              closePopup();
            }
          }}
        >
          {/* Backdrop layer: only its opacity is animated */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-slate-950/70 backdrop-blur-[8px] [@supports_not_((backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px)))]:bg-slate-950/90 motion-reduce:animate-none ${backdropAnimation}`}
          />

          {/* Animated outline frame */}
          <div
            ref={frameRef}
            className={`relative isolate flex max-h-[92%] w-full max-w-lg overflow-hidden rounded-t-3xl bg-cyan-400/25 p-px shadow-[0_20px_60px_rgba(0,0,0,0.55)] [-webkit-backface-visibility:hidden] [backface-visibility:hidden] before:pointer-events-none before:absolute before:left-1/2 before:top-1/2 before:aspect-square before:w-[calc(100%+100vh)] before:animate-[contact-border-rotate_6s_linear_infinite] before:bg-[conic-gradient(from_0deg,rgba(34,211,238,0.10)_0%,rgba(34,211,238,0.95)_10%,rgba(129,140,248,0.95)_22%,rgba(34,211,238,0.10)_38%,rgba(255,255,255,0.08)_70%,rgba(34,211,238,0.10)_100%)] before:content-[''] before:[transform:translate(-50%,-50%)_rotate(0deg)] motion-reduce:animate-none motion-reduce:before:animate-none sm:max-h-[90%] sm:rounded-3xl ${frameAnimation}`}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="floating-contact-title"
              className="relative flex w-full flex-col overflow-hidden rounded-t-[23px] bg-slate-950 sm:rounded-[23px]"
            >
              {/* Decorative glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-cyan-500/10 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-24 size-64 rounded-full bg-indigo-500/10 blur-3xl"
              />

              {/* Header (a bit more compact while the keyboard is open) */}
              <div
                className={`relative flex items-start justify-between gap-4 px-5 sm:px-7 sm:pb-4 sm:pt-6 ${
                  keyboardOpen ? "pb-2 pt-3" : "pb-4 pt-5"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.35)]">
                    <MessageCircle size={23} strokeWidth={2.2} />
                  </div>

                  <div className="min-w-0">
                    <h2
                      id="floating-contact-title"
                      className="text-lg font-bold tracking-tight text-white sm:text-xl"
                    >
                      Let&apos;s talk
                    </h2>
                    <p
                      className={`mt-0.5 text-sm leading-5 text-slate-400 ${
                        keyboardOpen ? "hidden sm:block" : ""
                      }`}
                    >
                      Have a project or an idea? Send me a message.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closePopup}
                  disabled={submitting}
                  aria-label="Close contact form"
                  className="grid size-9 shrink-0 touch-manipulation place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:opacity-40 [@media(pointer:coarse)]:size-11"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="relative min-h-0 flex-1 scroll-py-4 overflow-y-auto overscroll-contain px-5 pb-5 pt-1 sm:px-7">
                {sent ? (
                  <div
                    role="status"
                    className="flex flex-col items-center gap-3 py-8 text-center"
                  >
                    <div className="grid size-16 animate-[contact-pop_500ms_cubic-bezier(.22,.8,.5,1)_both] place-items-center rounded-full bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/30 motion-reduce:animate-none">
                      <CheckCircle2 size={34} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Message sent!
                    </h3>
                    <p className="max-w-xs text-sm text-slate-400">
                      {feedback?.message} I&apos;ll get back to you soon.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFeedback(null)}
                      className="mt-2 inline-flex touch-manipulation items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      Send another message
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    {feedback?.type === "error" && (
                      <div
                        role="alert"
                        className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-3.5 py-3 text-sm text-red-300"
                      >
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <span>{feedback.message}</span>
                      </div>
                    )}

                    <form
                      onSubmit={handleSubmit}
                      onFocus={(event) => {
                        // Already typing with the keyboard open: bring the
                        // newly focused field into view.
                        if (!keyboardRef.current) return;
                        const target = event.target as HTMLElement;
                        window.setTimeout(
                          () => target.scrollIntoView({ block: "nearest" }),
                          60
                        );
                      }}
                      noValidate
                      className="space-y-4"
                    >
                      <Field
                        id="floating-contact-name"
                        label="Name"
                        icon={<User size={17} />}
                        error={errors.name}
                      >
                        <input
                          ref={firstInputRef}
                          id="floating-contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          autoCapitalize="words"
                          enterKeyHint="next"
                          maxLength={100}
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          onKeyDown={onEnterNext(emailRef)}
                          placeholder="Your name"
                          aria-invalid={!!errors.name}
                          aria-describedby={
                            errors.name
                              ? "floating-contact-name-error"
                              : undefined
                          }
                          className={inputClass(!!errors.name)}
                        />
                      </Field>

                      <Field
                        id="floating-contact-email"
                        label="Email"
                        icon={<Mail size={17} />}
                        error={errors.email}
                      >
                        <input
                          ref={emailRef}
                          id="floating-contact-email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          enterKeyHint="next"
                          maxLength={254}
                          value={form.email}
                          onChange={(e) =>
                            updateField("email", e.target.value)
                          }
                          onKeyDown={onEnterNext(messageRef)}
                          placeholder="you@example.com"
                          aria-invalid={!!errors.email}
                          aria-describedby={
                            errors.email
                              ? "floating-contact-email-error"
                              : undefined
                          }
                          className={inputClass(!!errors.email)}
                        />
                      </Field>

                      <Field
                        id="floating-contact-message"
                        label="Message"
                        icon={<PenLine size={17} />}
                        error={errors.message}
                        textarea
                        aside={
                          <span
                            className={`text-xs tabular-nums ${
                              form.message.length > MAX_MESSAGE_LENGTH * 0.9
                                ? "text-amber-400"
                                : "text-slate-500"
                            }`}
                          >
                            {form.message.length}/{MAX_MESSAGE_LENGTH}
                          </span>
                        }
                      >
                        <textarea
                          ref={messageRef}
                          id="floating-contact-message"
                          name="message"
                          rows={4}
                          enterKeyHint="enter"
                          maxLength={MAX_MESSAGE_LENGTH}
                          value={form.message}
                          onChange={(e) =>
                            updateField("message", e.target.value)
                          }
                          placeholder="Tell me about your idea..."
                          aria-invalid={!!errors.message}
                          aria-describedby={
                            errors.message
                              ? "floating-contact-message-error"
                              : undefined
                          }
                          className={`${inputClass(
                            !!errors.message
                          )} min-h-[112px] resize-y leading-6`}
                        />
                      </Field>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="group flex w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_-10px_rgba(34,211,238,0.6)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <LoaderCircle
                              size={17}
                              className="animate-spin"
                            />
                            Sending message...
                          </>
                        ) : (
                          <>
                            <Send
                              size={16}
                              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Quick connect: real app icons, pinned to the bottom
                  (hidden while the keyboard is open to leave room for the form) */}
              <div
                className={`relative border-t border-white/[0.08] bg-white/[0.02] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3.5 sm:px-7 ${
                  keyboardOpen ? "hidden" : ""
                }`}
              >
                <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                  Quick connect
                </p>

                <div className="grid grid-cols-5 gap-2">
                  {SOCIALS.map(({ name, href, bg, Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="group/app flex touch-manipulation flex-col items-center gap-1.5 [-webkit-tap-highlight-color:transparent] focus-visible:outline-none"
                    >
                      <span
                        className={`grid size-11 place-items-center rounded-[14px] text-white shadow-[0_6px_16px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-black/20 transition duration-200 ease-out group-focus-visible/app:ring-2 group-focus-visible/app:ring-cyan-300 min-[360px]:size-12 [@media(hover:hover)]:group-hover/app:-translate-y-1.5 [@media(hover:hover)]:group-hover/app:scale-110 ${bg}`}
                      >
                        <Icon size={22} />
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 transition-colors group-hover/app:text-slate-200">
                        {name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}