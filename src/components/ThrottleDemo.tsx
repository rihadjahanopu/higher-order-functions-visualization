"use client";

import React, { useRef, useState, useCallback } from "react";
import CodeBlock from "./CodeBlock";

function throttle<T extends (...args: unknown[]) => void>(fn: T, limit: number): T {
  let lastCall = 0;
  return ((...args: unknown[]) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}

interface ClickEvent {
  id: number;
  time: string;
  allowed: boolean;
}

const THROTTLE_MS = 1500;

export default function ThrottleDemo() {
  const [events, setEvents] = useState<ClickEvent[]>([]);
  const [lastAllowed, setLastAllowed] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const idRef = useRef(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleThrottled = useCallback(
    throttle(() => {
      const now = Date.now();
      setLastAllowed(now);
      setCooldown(true);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = setTimeout(() => setCooldown(false), THROTTLE_MS);

      setEvents((prev) => [
        {
          id: ++idRef.current,
          time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          allowed: true,
        },
        ...prev.slice(0, 14),
      ]);
    }, THROTTLE_MS),
    []
  );

  const handleRawClick = () => {
    const now = Date.now();
    const isAllowed = now - lastAllowed >= THROTTLE_MS;

    if (!isAllowed) {
      // Blocked click
      setEvents((prev) => [
        {
          id: ++idRef.current,
          time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          allowed: false,
        },
        ...prev.slice(0, 14),
      ]);
    }

    handleThrottled();
  };

  const allowedCount = events.filter((e) => e.allowed).length;
  const blockedCount = events.filter((e) => !e.allowed).length;

  return (
    <section id="throttle" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
          <span className="text-orange-400 text-xs font-bold">⏱</span>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Throttle</h2>
          <p className="text-slate-400 text-xs mt-0.5">Rate-limit a function to fire at most once per interval</p>
        </div>
        <span className="ml-auto text-[9px] font-bold tracking-widest font-mono uppercase px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/10 text-orange-400">
          HOF
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Panel */}
        <div className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Limit", value: `${THROTTLE_MS}ms`, color: "text-orange-400" },
              { label: "Fired", value: allowedCount, color: "text-emerald-400" },
              { label: "Blocked", value: blockedCount, color: "text-rose-400" },
            ].map((s) => (
              <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-slate-500 text-[10px] mt-0.5 uppercase tracking-wider font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Throttle button */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col items-center gap-4">
            <p className="text-slate-400 text-xs text-center">
              Click rapidly — throttle allows execution at most every <span className="text-orange-300 font-bold">{THROTTLE_MS}ms</span>.
            </p>

            {/* Cooldown bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${cooldown ? "bg-orange-500" : "bg-emerald-500"}`}
                style={{
                  width: cooldown ? "100%" : "0%",
                  transition: cooldown ? "none" : `width ${THROTTLE_MS}ms linear`,
                }}
              />
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              {cooldown ? (
                <span className="text-orange-400">⏸ Throttled — cooldown active</span>
              ) : (
                <span className="text-emerald-400">▶ Ready to fire</span>
              )}
            </div>

            <button
              onClick={handleRawClick}
              className="relative group px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-900/30 hover:shadow-orange-900/50 hover:scale-[1.03] active:scale-95 transition-all duration-200 overflow-hidden"
            >
              <span className="relative z-10">🖱 Click Me (Rapidly!)</span>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </button>
          </div>

          {/* Event log */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Event Log</span>
              <button
                onClick={() => setEvents([])}
                className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors font-mono"
              >
                clear
              </button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {events.length === 0 && (
                <p className="text-slate-600 text-xs italic text-center py-4">Start clicking to see events…</p>
              )}
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                    ev.allowed
                      ? "bg-emerald-500/8 border border-emerald-500/15 text-emerald-300"
                      : "bg-rose-500/8 border border-rose-500/15 text-rose-400"
                  }`}
                >
                  <span>{ev.allowed ? "✓" : "✗"}</span>
                  <span className="text-slate-500">{ev.time}</span>
                  <span>{ev.allowed ? "Executed" : "Throttled (blocked)"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Code */}
        <CodeBlock
          title="throttle.ts"
          vanillaCode={`function throttle(fn, limit) {
  let lastCall = 0;

  return function(...args) {
    const now = Date.now();

    // Only fire if enough time has elapsed
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args); // execute the wrapped fn
    }
    // Otherwise: silently drop this invocation
  };
}

// Usage
const throttledSave = throttle(saveDocument, 1500);

// No matter how fast the user types…
editor.on('change', throttledSave);
// …saveDocument runs at most once every 1500ms`}
          reactCode={`function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): T {
  let lastCall = 0;

  return ((...args: unknown[]) => {
    const now = Date.now();

    // Only fire if enough time has elapsed
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);   // execute the wrapped function
    }
    // Otherwise: silently drop this invocation
  }) as T;
}

// Usage — wrap any handler
const throttledSave = throttle(saveDocument, 1500);
editor.on('change', throttledSave);
// saveDocument fires at most once every 1500ms`}
        />
      </div>
    </section>
  );
}
