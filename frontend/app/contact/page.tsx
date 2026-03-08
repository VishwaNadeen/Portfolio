"use client";

import { FormEvent, useState } from "react";

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

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
    setSuccessMsg("");
    setErrorMsg("");

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

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

      setSuccessMsg("Your message has been sent successfully.");
      setForm({
        name: "",
        email: "",
        message: "",
      });
      setErrors({});
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute h-[520px] w-[520px] rounded-full bg-cyan-500/5 blur-3xl"
          style={{ top: "8%", left: "68%" }}
        />
        <div
          className="absolute h-[460px] w-[460px] rounded-full bg-blue-500/5 blur-3xl"
          style={{ top: "58%", left: "8%" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <section className="relative overflow-hidden rounded-3xl bg-white/[0.03] p-6 backdrop-blur-xl md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative space-y-4">

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Drop Me a Message
            </h1>

            <p className="max-w-3xl text-sm leading-8 text-slate-300 md:text-base">
              Have a question, idea, project, or just want to connect? Fill out
              the form below and send me a message.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
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
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.06]"
              />
              {errors.message && (
                <p className="text-sm text-red-400">{errors.message}</p>
              )}
            </div>

            {successMsg && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}