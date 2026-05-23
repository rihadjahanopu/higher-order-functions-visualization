"use client";

import React, { useState, useRef } from "react";
import CodeBlock from "./CodeBlock";

interface PerfRecord {
  id: number;
  label: string;
  duration: number;
  calls: number;
  timestamp: string;
  args: string;
}

// The Decorator HOF — wraps any function with performance auditing
function withPerformance<T extends (...args: unknown[]) => unknown>(
  fn: T,
  label: string,
  onRecord: (rec: Omit<PerfRecord, "id">) => void
): T {
  let callCount = 0;
  return ((...args: unknown[]) => {
    callCount++;
    const start = performance.now();
    const result = fn(...args);
    const duration = performance.now() - start;
    onRecord({
      label,
      duration,
      calls: callCount,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      args: JSON.stringify(args).slice(0, 60),
    });
    return result;
  }) as T;
}

// Demo functions to decorate
function slowFibonacci(n: number): number {
  if (n <= 1) return n;
  return slowFibonacci(n - 1) + slowFibonacci(n - 2);
}

function sortArray(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b);
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

const PRESETS = [
  {
    label: "fibonacci(30)",
    fn: (rec: (r: Omit<PerfRecord, "id">) => void) =>
      withPerformance(slowFibonacci as (...args: unknown[]) => unknown, "fibonacci", rec),
    args: [30] as unknown[],
    color: "from-violet-600 to-purple-600",
    shadow: "shadow-violet-900/30",
    tag: "violet",
  },
  {
    label: "sortArray(1000)",
    fn: (rec: (r: Omit<PerfRecord, "id">) => void) =>
      withPerformance(
        (n: unknown) => sortArray(Array.from({ length: n as number }, () => Math.random() * 10000 | 0)) as unknown,
        "sortArray",
        rec
      ),
    args: [1000] as unknown[],
    color: "from-pink-600 to-rose-600",
    shadow: "shadow-pink-900/30",
    tag: "pink",
  },
  {
    label: "formatCurrency",
    fn: (rec: (r: Omit<PerfRecord, "id">) => void) =>
      withPerformance(formatCurrency as (...args: unknown[]) => unknown, "formatCurrency", rec),
    args: [1234567.89, "USD"] as unknown[],
    color: "from-amber-600 to-orange-600",
    shadow: "shadow-amber-900/30",
    tag: "amber",
  },
];

const TAG_COLORS: Record<string, string> = {
  violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  pink: "bg-pink-500/10 border-pink-500/20 text-pink-400",
  amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
};

export default function DecoratorDemo() {
  const [records, setRecords] = useState<PerfRecord[]>([]);
  const idRef = useRef(0);

  const addRecord = (rec: Omit<PerfRecord, "id">) => {
    setRecords((prev) => [{ ...rec, id: ++idRef.current }, ...prev.slice(0, 19)]);
  };

  const runPreset = (preset: (typeof PRESETS)[number]) => {
    const decorated = preset.fn(addRecord);
    decorated(...preset.args);
  };

  const avgDuration =
    records.length > 0
      ? (records.reduce((s, r) => s + r.duration, 0) / records.length).toFixed(2)
      : "—";

  const slowest = records.length > 0 ? Math.max(...records.map((r) => r.duration)).toFixed(2) : "—";

  return (
    <section id="decorator" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
          <span className="text-violet-400 text-xs font-bold">◈</span>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Performance Decorator</h2>
          <p className="text-slate-400 text-xs mt-0.5">Wrap any function to automatically audit execution time & call count</p>
        </div>
        <span className="ml-auto text-[9px] font-bold tracking-widest font-mono uppercase px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/10 text-violet-400">
          HOF
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Panel */}
        <div className="space-y-4">

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Runs", value: records.length, color: "text-violet-400" },
              { label: "Avg (ms)", value: avgDuration, color: "text-sky-400" },
              { label: "Slowest (ms)", value: slowest, color: "text-rose-400" },
            ].map((s) => (
              <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-slate-500 text-[10px] mt-0.5 uppercase tracking-wider font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Function buttons */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              Decorate &amp; Run a Function
            </p>
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => runPreset(preset)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-br ${preset.color} text-white shadow-lg ${preset.shadow} hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 text-left flex items-center gap-3`}
              >
                <span className="text-white/60 font-mono text-[10px]">withPerformance(</span>
                <span className="font-mono">{preset.label}</span>
                <span className="text-white/60 font-mono text-[10px]">)</span>
              </button>
            ))}
          </div>

          {/* Audit Log */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Audit Log</span>
              <button
                onClick={() => setRecords([])}
                className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors font-mono"
              >
                clear
              </button>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {records.length === 0 && (
                <p className="text-slate-600 text-xs italic text-center py-6">Run a function above to see audit records…</p>
              )}
              {records.map((r) => {
                const preset = PRESETS.find((p) => p.fn.toString().includes(r.label) || r.label === "fibonacci" && p.label.includes("fib") || r.label === "sortArray" && p.label.includes("sort") || r.label === "formatCurrency" && p.label.includes("format"));
                const tagKey = preset?.tag ?? "violet";
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-2.5 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg"
                  >
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${TAG_COLORS[tagKey]}`}>
                      {r.label}
                    </span>
                    <span className="text-slate-400 text-[11px] font-mono flex-1">
                      #{r.calls} · <span className="text-amber-400">{r.duration.toFixed(2)}ms</span>
                    </span>
                    <span className="text-slate-600 text-[10px] font-mono">{r.timestamp}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Code */}
        <CodeBlock
          title="withPerformance.ts"
          vanillaCode={`function withPerformance(fn, label) {
  let callCount = 0; // closed-over state

  return function(...args) {
    callCount++;
    const start = performance.now();

    const result = fn.apply(this, args); // call original fn

    const duration = performance.now() - start;
    console.log(
      '[' + label + '] call #' + callCount +
      ' took ' + duration.toFixed(2) + 'ms'
    );

    return result; // transparent passthrough
  };
}

// Usage - zero changes to original functions!
const auditedFetch  = withPerformance(fetch,  'fetch');
const auditedRender = withPerformance(render, 'render');
const auditedSort   = withPerformance(sort,   'sort');`}
          reactCode={`function withPerformance<T extends (...args: unknown[]) => unknown>(
  fn: T,
  label: string
): T {
  let callCount = 0; // closed-over state

  return ((...args: unknown[]) => {
    callCount++;
    const start = performance.now();

    const result = fn(...args); // call original fn

    const duration = performance.now() - start;
    console.log(
      '[' + label + '] call #' + callCount +
      ' took ' + duration.toFixed(2) + 'ms'
    );

    return result; // transparent passthrough
  }) as T;
}

// Usage - zero changes to original functions!
const auditedFetch  = withPerformance(fetch,  'fetch');
const auditedRender = withPerformance(render, 'render');
const auditedSort   = withPerformance(sort,   'sort');`}
        />
      </div>
    </section>
  );
}
