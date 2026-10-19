
"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MessageCircle,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  LoaderCircle,
} from "lucide-react";
import { SOCIAL_LINKS } from "@/data/socialLinks";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  message: "",
};

const MAX_MESSAGE_LENGTH = 1000;

const SOCIALS = [
  {
    name: "WhatsApp",
    href: "https://wa.me/94715688517?text=Hello%20Vishwa%2C%20I%20want%20to%20connect%20with%20you.",
    color: "hover:text-green-300",
  },
  {
    name: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    color: "hover:text-blue-300",
  },
  {
    name: "Instagram",
    href: SOCIAL_LINKS.instagram,
    color: "hover:text-pink-300",
  },
  {
    name: "Facebook",
    href: SOCIAL_LINKS.facebook,
    color: "hover:text-sky-300",
  },
  {
    name: "Telegram",
    href: SOCIAL_LINKS.telegram,
    color: "hover:text-cyan-300",
  },
];

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Close with Escape and prevent background scrolling.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      firstInputRef.current?.focus();
    }, 200);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, submitting]);

  function updateField(field: keyof FormData, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

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
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
        }),
      });

      const validationData = await validationResponse.json();

      if (!validationResponse.ok || !validationData.valid) {
        setErrors({
          email:
            validationData?.message ||
            "Please enter a valid email address.",
        });
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to send your message."
        );
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

  function closePopup() {
    if (submitting) return;
    setIsOpen(false);
  }

  return (
    <>
      <style>{`
        @keyframes contact-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes contact-panel-in {
          from {
            opacity: 0;
            transform: translateY(18px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes contact-button-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 211, 238, .15),
                        0 8px 30px rgba(8, 145, 178, .22);
          }
          50% {
            box-shadow: 0 0 0 7px rgba(34, 211, 238, 0),
                        0 8px 30px rgba(8, 145, 178, .28);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-motion {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Floating contact button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open contact form"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="contact-motion group fixed bottom-5 right-5 z-[80] flex size-14 items-center justify-center rounded-full border border-cyan-200/30 bg-gradient-to-br from-cyan-400 to-cyan-700 text-white shadow-[0_8px_30px_rgba(8,145,178,0.25)] transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_40px_rgba(8,145,178,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:bottom-7 sm:right-7"
        style={{
          animation: isOpen
            ? "none"
            : "contact-button-pulse 3s ease-in-out infinite",
        }}
      >
        <MessageCircle
          size={25}
          strokeWidth={1.8}
          className="transition-transform duration-300 group-hover:rotate-[-8deg]"
        />

        <span className="pointer-events-none absolute right-[calc(100%+12px)] whitespace-nowrap rounded-lg border border-white/10 bg-slate-900/95 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-xl transition duration-200 group-hover:translate-x-0 group-hover:opacity-100">
          Let&apos;s talk
        </span>
      </button>

      {/* Modal and blurred backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-md contact-motion sm:items-center sm:p-5"
          style={{
            animation: "contact-backdrop-in 250ms ease-out both",
          }}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !submitting
            ) {
              closePopup();
            }
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="floating-contact-title"
            className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-slate-950/95 shadow-[0_25px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl contact-motion sm:max-h-[90dvh] sm:rounded-3xl"
            style={{
              animation: "contact-panel-in 300ms cubic-bezier(.22,.8,.5,1) both",
            }}
          >
            {/* Decorative glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-cyan-500/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-24 size-64 rounded-full bg-blue-500/[0.08] blur-3xl"
            />

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <MessageCircle size={22} />
                </div>

                <div className="min-w-0">
                  <h2
                    id="floating-contact-title"
                    className="text-lg font-bold tracking-tight text-white sm:text-xl"
                  >
                    Let&apos;s talk
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    Have a project or an idea? Send me a message.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePopup}
                disabled={submitting}
                aria-label="Close contact form"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:opacity-40"
              >
                <X size={19} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="relative overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
              {feedback && (
                <div
                  role="status"
                  className={`mb-5 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm ${
                    feedback.type === "success"
                      ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
                      : "border-red-400/20 bg-red-400/[0.08] text-red-300"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="floating-contact-name"
                    className="text-sm font-medium text-slate-200"
                  >
                    Name
                  </label>

                  <input
                    ref={firstInputRef}
                    id="floating-contact-name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Enter your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={
                      errors.name ? "floating-name-error" : undefined
                    }
                    className={`w-full rounded-xl border bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:bg-white/[0.05] focus:ring-2 focus:ring-cyan-400/10 ${
                      errors.name
                        ? "border-red-400/50 focus:border-red-400"
                        : "border-white/10 focus:border-cyan-400/50"
                    }`}
                  />

                  {errors.name && (
                    <p
                      id="floating-name-error"
                      className="text-xs text-red-400"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="floating-contact-email"
                    className="text-sm font-medium text-slate-200"
                  >
                    Email
                  </label>

                  <input
                    id="floating-contact-email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "floating-email-error" : undefined
                    }
                    className={`w-full rounded-xl border bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:bg-white/[0.05] focus:ring-2 focus:ring-cyan-400/10 ${
                      errors.email
                        ? "border-red-400/50 focus:border-red-400"
                        : "border-white/10 focus:border-cyan-400/50"
                    }`}
                  />

                  {errors.email && (
                    <p
                      id="floating-email-error"
                      className="text-xs text-red-400"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="floating-contact-message"
                      className="text-sm font-medium text-slate-200"
                    >
                      Message
                    </label>

                    <span
                      className={`text-xs tabular-nums ${
                        form.message.length > MAX_MESSAGE_LENGTH * 0.9
                          ? "text-amber-400"
                          : "text-slate-500"
                      }`}
                    >
                      {form.message.length}/{MAX_MESSAGE_LENGTH}
                    </span>
                  </div>

                  <textarea
                    id="floating-contact-message"
                    rows={4}
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={form.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    placeholder="Tell me about your idea..."
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message
                        ? "floating-message-error"
                        : undefined
                    }
                    className={`min-h-[110px] w-full resize-y rounded-xl border bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:bg-white/[0.05] focus:ring-2 focus:ring-cyan-400/10 ${
                      errors.message
                        ? "border-red-400/50 focus:border-red-400"
                        : "border-white/10 focus:border-cyan-400/50"
                    }`}
                  />

                  {errors.message && (
                    <p
                      id="floating-message-error"
                      className="text-xs text-red-400"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-gradient-to-r from-cyan-500 to-cyan-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/20 transition hover:from-cyan-400 hover:to-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Sending message...
                    </>
                  ) : (
                    <>
                      <Send
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {/* Social links */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.08]" />
                <span className="text-xs text-slate-500">
                  Or connect directly
                </span>
                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-xs text-slate-400 transition-colors ${social.color}`}
                  >
                    {social.name}
                    <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
