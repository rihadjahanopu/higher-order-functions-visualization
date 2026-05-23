"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-800/60 py-8 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p>© {new Date().getFullYear()} HOF Visualizer. Built with Next.js + Tailwind CSS.</p>
      <div className="flex gap-4">
        <span className="hover:text-slate-300 transition-colors cursor-default">Functional Paradigm</span>
        <span>•</span>
        <span className="hover:text-slate-300 transition-colors cursor-default">Declarative Coding</span>
      </div>
    </footer>
  );
}
