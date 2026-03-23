"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "../lib/adminApi";
import { AlertTriangle, Lock, Terminal, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await adminLogin(username, password);
      setUsername("");
      setPassword("");
      router.push("/admin/dashboard");
    } catch (error: any) {
      if (error?.message === "INVALID_CREDENTIALS") {
        setErr("Invalid username or password");
      } else {
        setErr(error?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#020810] px-4 py-6 font-sans sm:px-4">
      <style>{`
        @keyframes lg-in {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lg-shake {
          0%   { transform: translateX(0); }
          20%  { transform: translateX(-5px); }
          40%  { transform: translateX(5px); }
          60%  { transform: translateX(-4px); }
          80%  { transform: translateX(3px); }
          100% { transform: translateX(0); }
        }
        @keyframes lg-spin { to { transform: rotate(360deg); } }
        .lg-shake { animation: lg-shake 0.35s ease-in-out; }
        .lg-spin { animation: lg-spin 0.8s linear infinite; }
      `}</style>

      {/* background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* glow orbs */}
      <div
        className="pointer-events-none absolute rounded-full blur-[80px]"
        style={{
          width: 340,
          height: 340,
          background: "#1e40af",
          opacity: 0.06,
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full blur-[80px]"
        style={{
          width: 260,
          height: 260,
          background: "#0ea5e9",
          opacity: 0.05,
          bottom: "15%",
          left: "15%",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full blur-[80px]"
        style={{
          width: 220,
          height: 220,
          background: "#1d4ed8",
          opacity: 0.05,
          top: "20%",
          right: "12%",
        }}
      />

      {/* ── CARD ── */}
      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-[10px] border border-[#1a2d46] bg-[#040c1a] shadow-[0_0_0_1px_#060e1c,0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.03)]"
        style={{ animation: "lg-in 0.28s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* top accent line */}
        <div
          className="h-px shrink-0 opacity-80"
          style={{
            background:
              "linear-gradient(90deg,transparent 0%,#1e40af 30%,#0ea5e9 70%,transparent 100%)",
          }}
        />

        {/* scanlines */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.04) 2px,
              rgba(0,0,0,0.04) 4px
            )`,
            borderRadius: "inherit",
          }}
        />

        {/* ── window bar ── */}
        <div className="flex items-center gap-[10px] border-b border-[#0e1a2e] bg-[#050d1c] px-[18px] py-[11px]">
          {/* traffic dots */}
          <div className="flex gap-[6px]">
            {[
              ["#2a1010", "#3f1515"],
              ["#1f1a09", "#3a300d"],
              ["#0a1f0e", "#133a1a"],
            ].map(([bg, border], i) => (
              <span
                key={i}
                className="block h-[10px] w-[10px] rounded-full"
                style={{ background: bg, border: `1px solid ${border}` }}
              />
            ))}
          </div>

          <div className="h-[14px] w-px bg-[#1a2d46]" />

          {/* terminal path */}
          <div className="flex flex-1 items-center gap-[6px] min-w-0">
            <Terminal size={11} color="#3a5570" />
            <span className="min-w-0 truncate font-mono text-[10px] tracking-[0.08em] text-[#3a5570]">
              admin / auth / login
            </span>
          </div>

          {/* status pill */}
          <span className="shrink-0 rounded-[3px] border border-[#1e3a6a] bg-[#0c2044] px-[8px] py-[2px] font-mono text-[9px] font-semibold leading-[1.7] tracking-[0.1em] text-[#60a5fa]">
            SECURE
          </span>
        </div>

        {/* ── BODY ── */}
        <div className="px-[24px] pb-[26px] pt-[28px]">
          {/* logo / title block */}
          <div className="mb-[28px] text-center">
            <div className="mx-auto mb-[16px] flex h-[48px] w-[48px] items-center justify-center rounded-[10px] border border-[#1d4ed860] bg-[#0c1e3a] shadow-[0_0_24px_#1d4ed830]">
              <Lock size={20} color="#60a5fa" />
            </div>

            {/* system label */}
            <div className="mb-[8px] font-mono text-[9px] tracking-[0.2em] text-[#3a5570]">
              PORTFOLIO ADMIN SYSTEM
            </div>

            <h1 className="m-0 text-[22px] font-bold leading-[1.2] text-[#e2e8f0]">
              Admin Login
            </h1>
            <p className="mb-0 mt-[6px] text-[13px] text-[#4a6680]">
              Sign in to manage projects
            </p>
          </div>

          {/* ── FORM ── */}
          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="flex flex-col gap-[14px]"
          >
            {/* username */}
            <div>
              <span className="mb-[7px] block font-mono text-[11px] tracking-[0.06em] text-[#4a6680]">
                username
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-[13px] top-1/2 flex -translate-y-1/2 items-center text-[#2a4060]">
                  <User size={14} />
                </span>
                <input
                  className="box-border w-full rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[14px] py-[11px] pl-[40px] text-[14px] text-[#cbd5e1] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#2a4060] focus:border-[#2563eb70] focus:shadow-[0_0_0_3px_#1e40af1a]"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <span className="mb-[7px] block font-mono text-[11px] tracking-[0.06em] text-[#4a6680]">
                password
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-[13px] top-1/2 flex -translate-y-1/2 items-center text-[#2a4060]">
                  <Lock size={14} />
                </span>
                <input
                  className="box-border w-full rounded-[6px] border border-[#1a2d46] bg-[#060f1e] px-[14px] py-[11px] pl-[40px] text-[14px] text-[#cbd5e1] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#2a4060] focus:border-[#2563eb70] focus:shadow-[0_0_0_3px_#1e40af1a]"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* error */}
            {err && (
              <div className="lg-shake flex items-center gap-[10px] rounded-[6px] border border-[#7f1d1d60] bg-[#1a0808] px-[14px] py-[10px]">
                <AlertTriangle
                  size={14}
                  color="#f87171"
                  className="shrink-0"
                />
                <span className="text-[13px] text-[#fca5a5]">{err}</span>
              </div>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-[4px] flex w-full items-center justify-center gap-[9px] rounded-[6px] border border-[#3b82f680] bg-[linear-gradient(135deg,#1e3a8a,#1d4ed8_55%,#0369a1)] px-[22px] py-[11px] text-[14px] font-semibold text-[#dbeafe] shadow-[0_0_28px_#1d4ed830,inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none hover:enabled:-translate-y-[1px] hover:enabled:shadow-[0_0_40px_#1d4ed850]"
            >
              {loading ? (
                <>
                  <span
                    className="lg-spin inline-block h-[14px] w-[14px] rounded-full border-[2px] border-[#bfdbfe] border-t-transparent"
                  />
                  Authenticating…
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Login
                </>
              )}
            </button>
          </form>

          {/* footer hint */}
          <div className="mt-[22px] border-t border-[#0e1a2e] pt-[16px] text-center">
            <span className="font-mono text-[9px] tracking-[0.12em] text-[#1e3050]">
              AUTHORISED PERSONNEL ONLY · SESSION ENCRYPTED
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}