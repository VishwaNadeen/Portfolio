"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import BackgroundAnimation from "@/components/animation/BackgroundAnimation";
import PageTransition from "@/components/animation/PageTransition";

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
  type: "success" | "error";
  message: string;
};

const HEADING_TEXT = "Drop Me a Message";
const MESSAGE_MAX = 1000;

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
    type: "success",
    message: "",
  });

  // Typing animation state
  const [displayedHeading, setDisplayedHeading] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Repeating type → pause → erase → pause loop
  useEffect(() => {
    if (formTouched) {
      // Stop loop, snap to full heading, hide cursor
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

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  function showToast(type: "success" | "error", message: string) {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ show: true, type, message });
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
      showToast("error", "Please check your form details.");
      return;
    }

    try {
      setSubmitting(true);

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
      showToast("success", "Message sent successfully.");
    } catch {
      showToast("error", "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <PageTransition>
        <BackgroundAnimation />

        {/* Ambient blobs */}
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

        {/* Toast */}
        <div
          className={`pointer-events-none fixed z-[70] transition-all duration-500 ${
            toast.show
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          } left-1/2 top-[4.5rem] w-[min(calc(100vw-1rem),22rem)] -translate-x-1/2 px-0 sm:left-auto sm:right-6 sm:top-20 sm:w-full sm:max-w-sm sm:translate-x-0`}
        >
          <div
            className={`pointer-events-auto flex items-start gap-2 rounded-xl border px-3 py-2.5 shadow-2xl backdrop-blur-xl sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3 ${
              toast.type === "success"
                ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                : "border-red-400/30 bg-red-500/15 text-red-200"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold sm:text-sm">
                {toast.type === "success" ? "Success" : "Error"}
              </p>
              <p className="mt-0.5 break-words text-[11px] leading-4 sm:text-sm sm:leading-6">
                {toast.message}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-10 md:px-6 md:py-16">
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
                {/* Name */}
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

                {/* Email */}
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

              {/* Message */}
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
        </div>
      </PageTransition>
    </main>
  );
}