export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
      <style>{`
        @keyframes bar-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%);  }
        }
        @keyframes dot-bounce {
          0%,100% { transform: translateY(0px);  opacity: 0.4; }
          50%     { transform: translateY(-8px); opacity: 1;   }
        }
      `}</style>

      <div className="flex flex-col items-center gap-6">

        {/* progress bar */}
        <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{ animation: "bar-slide 1.2s ease-in-out infinite" }}
          />
        </div>

        {/* bouncing dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-cyan-400/60"
              style={{
                animation:      "dot-bounce 1s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}