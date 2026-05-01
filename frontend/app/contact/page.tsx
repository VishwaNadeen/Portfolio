"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import BackgroundAnimation from "@/components/animation/BackgroundAnimation";
import PageTransition from "@/components/animation/PageTransition";
import { SOCIAL_LINKS } from "@/data/socialLinks";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type Errors = {
  name?: string;
  email?: string;
  message?: string;
};

type ToastState = {
  show: boolean;
  message: string;
};

const HEADING_TEXT = "Drop Me a Message";
const MESSAGE_MAX = 1000;

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.97L.05 24l6.25-1.64a11.9 11.9 0 0 0 5.78 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.18-1.24-6.17-3.5-8.42ZM12.09 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.83 9.83 0 0 1-1.51-5.27c0-5.44 4.42-9.86 9.86-9.86 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.89 6.95c0 5.44-4.42 9.89-9.85 9.89Zm5.41-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.1 20.45H3.54V9H7.1v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M9.04 15.47 8.65 20.9c.56 0 .8-.24 1.09-.53l2.62-2.51 5.43 3.98c1 .55 1.71.26 1.98-.92L23.36 4.1c.36-1.67-.6-2.32-1.57-1.96L.71 10.21c-1.44.56-1.42 1.37-.24 1.74l5.39 1.68L18.39 5.8c.59-.39 1.13-.17.69.22L9.04 15.47Z" />
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
  });

  const [displayedHeading, setDisplayedHeading] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (formTouched) {
      if (typingRef.current) clearTimeout(typingRef.current);
      setDisplayedHeading(HEADING_TEXT);
      setTypingDone(true);
      return;
    }

    let i = 0;
    let erasing = false;

    function tick() {
      if (!erasing) {
        i++;
        setDisplayedHeading(HEADING_TEXT.slice(0, i));
        setTypingDone(i >= HEADING_TEXT.length);

        if (i >= HEADING_TEXT.length) {
          erasing = true;
          typingRef.current = setTimeout(tick, 1800);
        } else {
          typingRef.current = setTimeout(tick, 90);
        }
      } else {
        i--;
        setDisplayedHeading(HEADING_TEXT.slice(0, i));
        setTypingDone(false);

        if (i <= 0) {
          erasing = false;
          typingRef.current = setTimeout(tick, 600);
        } else {
          typingRef.current = setTimeout(tick, 55);
        }
      }
    }

    typingRef.current = setTimeout(tick, 400);
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [formTouched]);

  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  function showSuccessToast(message: string) {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ show: true, message });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  function validate(values: FormData) {
    const newErrors: Errors = {};

    if (!values.name.trim()) {
      newErrors.name = "Please enter your name.";
    } else if (values.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!values.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!values.message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (values.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    return newErrors;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      const emailValidationRes = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const emailValidationData = await emailValidationRes.json();

      if (!emailValidationRes.ok || !emailValidationData.valid) {
        setErrors((prev) => ({
          ...prev,
          email:
            emailValidationData?.message ||
            "Please enter a real email address.",
        }));

        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send message.");
      }

      setForm({ name: "", email: "", message: "" });
      setErrors({});
      showSuccessToast("Message sent successfully.");
    } catch {
      setErrors((prev) => ({
        ...prev,
        message: "Failed to send message.",
      }));
    } finally {
      setSubmitting(false);
    }
  }

  const socialItems = [
    {
      name: "WhatsApp",
      href:
        "https://wa.me/94715688517?text=Hello%20Vishwa%2C%20I%20want%20to%20connect%20with%20you.",
      icon: <WhatsAppIcon />,
      className:
        "border-green-400/30 bg-green-400/10 text-green-300 hover:bg-green-400/20",
    },
    {
      name: "Instagram",
      href: SOCIAL_LINKS.instagram,
      icon: <InstagramIcon />,
      className:
        "border-pink-400/30 bg-pink-400/10 text-pink-300 hover:bg-pink-400/20",
    },
    {
      name: "LinkedIn",
      href: SOCIAL_LINKS.linkedin,
      icon: <LinkedinIcon />,
      className:
        "border-blue-400/30 bg-blue-400/10 text-blue-300 hover:bg-blue-400/20",
    },
    {
      name: "Facebook",
      href: SOCIAL_LINKS.facebook,
      icon: <FacebookIcon />,
      className:
        "border-sky-400/30 bg-sky-400/10 text-sky-300 hover:bg-sky-400/20",
    },
    {
      name: "Telegram",
      href: SOCIAL_LINKS.telegram,
      icon: <TelegramIcon />,
      className:
        "border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20",
    },
  ];

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <PageTransition>
        <BackgroundAnimation />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute h-[220px] w-[220px] rounded-full bg-cyan-500/5 blur-3xl sm:h-[420px] sm:w-[420px] md:h-[520px] md:w-[520px]"
            style={{ top: "6%", left: "62%" }}
          />
          <div
            className="absolute h-[220px] w-[220px] rounded-full bg-blue-500/5 blur-3xl sm:h-[360px] sm:w-[360px] md:h-[460px] md:w-[460px]"
            style={{ top: "64%", left: "0%" }}
          />
        </div>

        <div
          className={`pointer-events-none fixed z-[70] transition-all duration-500 ${
            toast.show
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          } left-1/2 top-[4.5rem] w-[min(calc(100vw-1rem),22rem)] -translate-x-1/2 px-0 sm:left-auto sm:right-6 sm:top-20 sm:w-full sm:max-w-sm sm:translate-x-0`}
        >
          <div className="pointer-events-auto flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-3 py-2.5 text-emerald-200 shadow-2xl backdrop-blur-xl sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3">
            <div className="mt-0.5 shrink-0">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold sm:text-sm">Success</p>
              <p className="mt-0.5 break-words text-[11px] leading-4 sm:text-sm sm:leading-6">
                {toast.message}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-3 pb-6 pt-28 sm:px-4 sm:pb-10 sm:pt-30 md:px-6 md:pb-16 md:pt-32">
          <section className="relative overflow-hidden rounded-2xl bg-white/[0.03] p-4 backdrop-blur-xl sm:rounded-3xl sm:p-6 md:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />

            <div className="relative space-y-3 sm:space-y-4">
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-4xl">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                  {displayedHeading}
                </span>
                {!formTouched && (
                  <span
                    className={`ml-0.5 inline-block w-[2px] align-middle transition-opacity duration-100 ${
                      typingDone && !cursorVisible ? "opacity-0" : "opacity-100"
                    } bg-cyan-400`}
                    style={{ height: "1em" }}
                    aria-hidden="true"
                  />
                )}
              </h1>

              <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:leading-8 md:text-base">
                Have a question, idea, project, or just want to connect? Fill
                out the form below and send me a message.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="relative mt-6 space-y-5 sm:mt-8"
            >
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    onInput={() => setFormTouched(true)}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.06]"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    onInput={() => setFormTouched(true)}
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.06]"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-slate-200">
                    Message
                  </label>
                  <span
                    className={`text-xs tabular-nums transition-colors ${
                      form.message.length > MESSAGE_MAX * 0.9
                        ? "text-amber-400"
                        : "text-slate-500"
                    }`}
                  >
                    {form.message.length} / {MESSAGE_MAX}
                  </span>
                </div>
                <textarea
                  rows={7}
                  value={form.message}
                  maxLength={MESSAGE_MAX}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  onInput={() => setFormTouched(true)}
                  placeholder="Write your message here..."
                  className="min-h-[180px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.06] sm:min-h-[196px]"
                />
                {errors.message && (
                  <p className="text-sm text-red-400">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </section>

          <section className="relative mt-6 overflow-hidden rounded-2xl bg-white/[0.03] p-4 backdrop-blur-xl sm:mt-8 sm:rounded-3xl sm:p-6 md:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />

            <div className="relative">
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Connect via Social Media
              </h2>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Choose any platform below to contact me directly.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {socialItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex min-h-[112px] flex-col items-center justify-center rounded-2xl border p-4 text-center transition hover:-translate-y-1 ${item.className}`}
                  >
                    <div className="transition group-hover:scale-110">
                      {item.icon}
                    </div>
                    <p className="mt-3 text-sm font-semibold">{item.name}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </PageTransition>
    </main>
  );
}