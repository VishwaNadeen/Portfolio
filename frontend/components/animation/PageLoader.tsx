"use client";

import Lottie from "lottie-react";
import loadingAnimation from "../../public/animations/loading.json";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[65%] top-[8%] h-[320px] w-[320px] rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute left-[5%] top-[55%] h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative flex items-center justify-center">
        <Lottie
          animationData={loadingAnimation}
          loop
          className="h-32 w-32 sm:h-40 sm:w-40"
        />
      </div>
    </div>
  );
}