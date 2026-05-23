"use client";

import React from "react";

export default function HeroSection() {
  return (
    <div className="text-center py-10 md:py-16 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-glow select-none">
        Higher-Order Functions
      </h1>
      <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-[640px] mx-auto mt-4 leading-relaxed font-medium">
        Unlock the power of JavaScript functional programming. Master concepts
        of functions that receive, build, and operate on other functions through
        live interactive visual tools.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
        <span className="text-[10px] font-mono text-slate-500 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-full">
          11 interactive demos
        </span>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-full">
          live visualization
        </span>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-full">
          real code
        </span>
      </div>
    </div>
  );
}
