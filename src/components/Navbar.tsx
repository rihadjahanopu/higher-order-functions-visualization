"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Menu, X } from "lucide-react";

const NAV_TABS = [
  { id: "array-methods",        label: "1. Array" },
  { id: "function-composition", label: "2. Compose" },
  { id: "closures-factories",   label: "3. Closures" },
  { id: "debounce-throttle",    label: "4. Debounce" },
  { id: "middleware-pattern",   label: "5. Middleware" },
  { id: "memoization-caching",  label: "6. Memoize" },
  { id: "currying",             label: "7. Curry" },
  { id: "once-wrapper",         label: "8. Once" },
  { id: "throttle",             label: "9. Throttle" },
  { id: "retry",                label: "10. Retry" },
  { id: "decorator",            label: "11. Decorator" },
];

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <header
      ref={menuRef}
      className="sticky top-4 bg-slate-950/70 border border-slate-800/80 backdrop-blur-md rounded-2xl z-[50] shadow-lg shadow-black/10 mb-12"
    >
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
            <Terminal size={14} className="text-indigo-400" />
            HOF.visualizer
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-wrap items-center justify-end gap-1">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`px-2.5 py-1.5 text-[10px] font-mono font-medium rounded-lg transition-all ${
                activeSection === tab.id
                  ? "bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 shadow-sm shadow-indigo-900/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600 transition-all active:scale-95"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-800/60 px-3 py-3 grid grid-cols-2 gap-1.5">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`px-3 py-2.5 text-[11px] font-mono font-medium rounded-xl transition-all text-left ${
                activeSection === tab.id
                  ? "bg-indigo-600/15 border border-indigo-500/30 text-indigo-300"
                  : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
