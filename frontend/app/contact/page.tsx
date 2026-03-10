"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

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

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  function showToast(type: "success" | "error", message: string) {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast({
      show: true,
      type,
      message,
    });

    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send message.");
      }

      setForm({
        name: "",
        email: "",
        message: "",
      });
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
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute h-[320px] w-[320px] rounded-full bg-cyan-500/5 blur-3xl sm:h-[420px] sm:w-[420px] md:h-[520px] md:w-[520px]"
          style={{ top: "6%", left: "62%" }}
        />
        <div
          className="absolute h-[280px] w-[280px] rounded-full bg-blue-500/5 blur-3xl sm:h-[360px] sm:w-[360px] md:h-[460px] md:w-[460px]"
          style={{ top: "64%", left: "0%" }}
        />
      </div>

      <div
        className={`pointer-events-none fixed z-[70] transition-all duration-300 ${
          toast.show
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0"
        } left-1/2 top-[4.75rem] w-[min(calc(100vw-1.5rem),22rem)] -translate-x-1/2 px-0 sm:left-auto sm:right-6 sm:top-20 sm:w-full sm:max-w-sm sm:translate-x-0`}
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

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:py-10 md:px-6 md:py-16">
        <section className="relative overflow-hidden rounded-3xl bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6 md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />

          <div className="relative space-y-3 sm:space-y-4">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
              Drop Me a Message
            </h1>

            <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:leading-8 md:text-base">
              Have a question, idea, project, or just want to connect? Fill out
              the form below and send me a message.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative mt-6 space-y-5 sm:mt-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
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
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.06]"
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Message
              </label>
              <textarea
                rows={7}
                value={form.message}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Write your message here..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.06]"
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
    </main>
  );
}