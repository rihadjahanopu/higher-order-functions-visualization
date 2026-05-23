"use client";

import React, { useState, useEffect } from "react";
import FloatingShapes from "@/components/FloatingShapes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CartDemo from "@/components/CartDemo";
import PipelineDemo from "@/components/PipelineDemo";
import FactoryDemo from "@/components/FactoryDemo";
import SearchDemo from "@/components/SearchDemo";
import MiddlewareDemo from "@/components/MiddlewareDemo";
import MemoizeDemo from "@/components/MemoizeDemo";
import CurryDemo from "@/components/CurryDemo";
import OnceDemo from "@/components/OnceDemo";
import ThrottleDemo from "@/components/ThrottleDemo";
import RetryDemo from "@/components/RetryDemo";
import DecoratorDemo from "@/components/DecoratorDemo";
import { Sparkles, Code, Cpu, Award, BookOpen } from "lucide-react";

const SECTION_IDS = [
  "array-methods",
  "function-composition",
  "closures-factories",
  "debounce-throttle",
  "middleware-pattern",
  "memoization-caching",
  "currying",
  "once-wrapper",
  "throttle",
  "retry",
  "decorator",
];

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("array-methods");

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 160) current = id;
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[100] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <FloatingShapes />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <Navbar activeSection={activeSection} />

        {/* Hero */}
        <HeroSection />

        {/* Demos */}
        <main className="space-y-20 mt-8">
          <div id="array-methods" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <CartDemo />
          </div>
          <div id="function-composition" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <PipelineDemo />
          </div>
          <div id="closures-factories" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <FactoryDemo />
          </div>
          <div id="debounce-throttle" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <SearchDemo />
          </div>
          <div id="middleware-pattern" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <MiddlewareDemo />
          </div>
          <div id="memoization-caching" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <MemoizeDemo />
          </div>
          <div id="currying" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <CurryDemo />
          </div>
          <div id="once-wrapper" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <OnceDemo />
          </div>
          <div id="throttle" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <ThrottleDemo />
          </div>
          <div id="retry" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <RetryDemo />
          </div>
          <div id="decorator" className="bg-slate-900/10 border border-slate-900 rounded-3xl p-3 sm:p-5 scroll-mt-24">
            <DecoratorDemo />
          </div>
        </main>

        {/* Why HOFs Matter */}
        <section className="mt-28 bg-gradient-to-br from-indigo-950/20 via-purple-950/15 to-slate-950 border border-indigo-950/45 rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-[760px] mx-auto text-center space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center justify-center gap-2">
              <Sparkles size={20} className="text-amber-400 fill-amber-400" />
              Why Higher-Order Functions Matter
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-[620px] mx-auto font-medium">
              HOFs elevate your code to be highly declarative, composable, and reusable. Instead of
              cluttering your logic with endless loops and branches, you define{" "}
              <em>what</em> needs to be done, leaving the implementation details abstracted away.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left max-w-[580px] mx-auto mt-6">
              {[
                "Abstract repetitive logic blocks (loops, validations)",
                "Create highly configurable, reusable utility layers",
                "Enable advanced function pipelines & compositions",
                "Provide secure state protection with closures",
                "Greatly increase unit testing isolation & coverage",
                "Promote stateless, declarative software design",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 font-medium text-xs text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real-World Applications */}
        <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              tag: "React Hook",
              title: "Custom Hooks",
              desc: "useFetch, useLocalStorage, and useDebounce are higher-order callbacks that encapsulate component states, hooks, and side-effects.",
              icon: <Code size={16} className="text-sky-400" />,
              color: "bg-sky-500/10 border-sky-500/10 text-sky-400",
            },
            {
              tag: "Node.js",
              title: "Express Middleware",
              desc: "app.use() registers variadic handlers that process HTTP requests, inspect body payloads, authenticate headers, and catch pipeline errors.",
              icon: <Cpu size={16} className="text-emerald-400" />,
              color: "bg-emerald-500/10 border-emerald-500/10 text-emerald-400",
            },
            {
              tag: "Testing",
              title: "Mock Functions",
              desc: "jest.fn() and sinon.spy() are wrapper higher-order functions that hook targets to monitor execution counts, arguments, and throw states.",
              icon: <Award size={16} className="text-purple-400" />,
              color: "bg-purple-500/10 border-purple-500/10 text-purple-400",
            },
            {
              tag: "Redux",
              title: "Store Enhancers",
              desc: "applyMiddleware() intercepts standard dispatch pipelines, injecting loggers, thunks, or actions to enhance state management.",
              icon: <BookOpen size={16} className="text-pink-400" />,
              color: "bg-pink-500/10 border-pink-500/10 text-pink-400",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-black/5 group"
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[9px] font-bold tracking-widest font-mono uppercase px-2 py-0.5 rounded-full ${card.color}`}>
                  {card.tag}
                </span>
                <div className="text-slate-600 group-hover:text-white transition-colors">{card.icon}</div>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{card.title}</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{card.desc}</p>
            </div>
          ))}
        </section>

        <Footer />
      </div>
    </div>
  );
}
