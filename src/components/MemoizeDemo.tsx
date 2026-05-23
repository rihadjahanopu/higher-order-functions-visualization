"use client";

import React, { useState, useRef } from "react";
import { Brain, Play, Database, ShieldAlert, Sparkles, Check } from "lucide-react";
import CodeBlock from "./CodeBlock";

const VANILLA_CODE = `// Real-world: Cache expensive computations
const memoize = (fn) => {
  const cache = {};

  return (...args) => {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key]; // Cache hit!
    }
    
    const result = fn(...args);
    cache[key] = result; // Cache store
    return result;
  };
};

// Recursive Fibonacci (Exponential cost: O(2^n))
const fib = (n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};

const memoizedFib = memoize(fib);
// fib(35)         -> Takes ~100ms & 29M operations
// memoizedFib(35) -> First run takes ~2ms, second takes 0ms!
`;

const REACT_CODE = `"use client";

import React, { useState } from "react";

// 1. Fully-typed Generic Memoize HOF
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache: Record<string, ReturnType<T>> = {};

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  }) as unknown as T;
}
`;

interface CacheRecord {
  n: number;
  result: number;
  timeAdded: string;
}

export default function MemoizeDemo() {
  const [nInput, setNInput] = useState("25");
  const [useMemo, setUseMemo] = useState(true);
  
  // Results states
  const [result, setResult] = useState<number | null>(null);
  const [opCount, setOpCount] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [cacheHit, setCacheHit] = useState(false);
  const [highlightedKey, setHighlightedKey] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Persistent Cache Store inside Closure (ref-persisted so it stays across renders)
  const cacheStoreRef = useRef<Record<number, { result: number; ops: number }>>({});
  const [cacheList, setCacheList] = useState<CacheRecord[]>([]);

  const handleCompute = () => {
    const n = parseInt(nInput);
    if (isNaN(n) || n < 0) {
      setError("Please enter a positive integer");
      setResult(null);
      return;
    }
    // Safeguard to prevent page freezing for non-memoized runs!
    if (!useMemo && n > 35) {
      setError("Un-memoized recursion over 35 is disabled to protect browser memory! Enable memoization for large inputs.");
      setResult(null);
      return;
    }
    if (useMemo && n > 40) {
      setError("Inputs above 40 can overflow JavaScript's max integers. Please select a value between 0 and 40.");
      setResult(null);
      return;
    }
    setError("");

    // Performance timer triggers
    const startTime = performance.now();
    let totalRecursions = 0;

    // Check custom cache store closure ref if Memoized
    if (useMemo && cacheStoreRef.current[n] !== undefined) {
      const cached = cacheStoreRef.current[n];
      const endTime = performance.now();

      setResult(cached.result);
      setOpCount(0); // 0 operations since it was pulled from memory!
      setDuration(Number((endTime - startTime).toFixed(4)));
      setCacheHit(true);

      // Flash cache visualizer hit
      setHighlightedKey(n);
      setTimeout(() => setHighlightedKey(null), 1000);
      return;
    }

    setCacheHit(false);

    // Standard recursive Fibonacci algorithm
    const fibonacci = (val: number): number => {
      totalRecursions++;
      if (val <= 1) return val;
      return fibonacci(val - 1) + fibonacci(val - 2);
    };

    const fibResult = fibonacci(n);
    const endTime = performance.now();
    const timeTaken = Number((endTime - startTime).toFixed(4));

    setResult(fibResult);
    setOpCount(totalRecursions);
    setDuration(timeTaken);

    // Store in cache closure ref if using memoization
    if (useMemo) {
      cacheStoreRef.current[n] = { result: fibResult, ops: totalRecursions };
      
      const newCacheItem: CacheRecord = {
        n,
        result: fibResult,
        timeAdded: new Date().toLocaleTimeString().split(" ")[0],
      };
      setCacheList((prev) => [newCacheItem, ...prev]);
    }
  };

  const handleClearCache = () => {
    cacheStoreRef.current = {};
    setCacheList([]);
    setResult(null);
    setOpCount(null);
    setDuration(null);
    setCacheHit(false);
  };

  return (
    <section className="mb-16 scroll-mt-24" id="memoization-caching">
      {/* Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/50 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Brain size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            6. Memoization (Caching Higher-Order Wrapper)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Optimize recursive or CPU-bound tasks by saving intermediate computations. Intercept subsequent executions to pull instantly from a closure cache database.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive UI */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>🧠</span> Expensive Fibonacci Engine
            </h3>

            {/* Inputs & Toggles */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  value={nInput}
                  onChange={(e) => setNInput(e.target.value)}
                  placeholder="Enter N index (0-38)..."
                  className="flex-1 bg-slate-950 border border-slate-850 hover:border-slate-700 text-white px-4.5 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-sm font-mono"
                  min="0"
                  max="40"
                />
                
                <button
                  onClick={handleCompute}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-98"
                >
                  <Play size={14} className="fill-white" /> Compute
                </button>
              </div>

              {/* Memoize Toggle Swticher */}
              <div className="flex items-center justify-between bg-slate-950/60 border border-slate-900 rounded-xl p-3.5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-300">
                    Memoize Wrapper (HOF Caching)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Wraps function in internal closure storage
                  </span>
                </div>
                <button
                  onClick={() => setUseMemo(!useMemo)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                    useMemo ? "bg-indigo-600" : "bg-slate-855"
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${
                      useMemo ? "translate-x-5.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 text-rose-455 font-mono text-xs bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl leading-normal">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Computation Stat Monitors */}
            {result !== null && (
              <div className="mt-6 grid grid-cols-3 gap-3">
                {/* Result Block */}
                <div className="bg-slate-955 border border-slate-850 p-3 rounded-2xl text-center">
                  <span className="text-[9px] text-slate-550 font-bold uppercase block">
                    Fib({nInput}) Result
                  </span>
                  <span className="text-sm font-bold font-mono text-white mt-1 block truncate">
                    {result}
                  </span>
                </div>

                {/* Operations Count Block */}
                <div className="bg-slate-955 border border-slate-850 p-3 rounded-2xl text-center">
                  <span className="text-[9px] text-slate-550 font-bold uppercase block">
                    Recursion Calls
                  </span>
                  <span className="text-sm font-bold font-mono text-orange-400 mt-1 block">
                    {opCount?.toLocaleString()}
                  </span>
                </div>

                {/* Execution Duration Block */}
                <div className="bg-slate-955 border border-slate-850 p-3 rounded-2xl text-center relative overflow-hidden">
                  <span className="text-[9px] text-slate-550 font-bold uppercase block">
                    Duration Speed
                  </span>
                  <span
                    className={`text-sm font-bold font-mono mt-1 block transition-colors duration-300 ${
                      cacheHit ? "text-emerald-400 font-extrabold" : "text-sky-400"
                    }`}
                  >
                    {duration}ms
                  </span>
                  
                  {cacheHit && (
                    <span className="absolute inset-x-0 bottom-0 text-[7px] font-bold text-center bg-emerald-500/10 border-t border-emerald-500/10 text-emerald-400 py-0.5 tracking-widest uppercase">
                      Cache Hit!
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Cache Storage visual schema */}
            {useMemo && (
              <div className="mt-6 border-t border-slate-850 pt-5">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                    <Database size={13} />
                    <span>Closure Memory Database</span>
                  </div>
                  {cacheList.length > 0 && (
                    <button
                      onClick={handleClearCache}
                      className="text-[9px] font-mono text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      Wipe Cache
                    </button>
                  )}
                </div>

                <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4.5 min-h-[100px] flex flex-col justify-center">
                  {cacheList.length === 0 ? (
                    <div className="text-center text-slate-550 font-mono text-[11px]">
                      Closure storage database is empty. Calculate N index values above with Memoization enabled.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 max-h-[110px] overflow-y-auto pr-1">
                      {cacheList.map((item, idx) => {
                        const isHit = highlightedKey === item.n;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs transition-all duration-300 ${
                              isHit
                                ? "bg-emerald-600/20 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-300 scale-105"
                                : "bg-slate-900 border-slate-850 text-slate-300"
                            }`}
                          >
                            <span className="text-slate-500">N:</span>
                            <span className="font-bold text-white">{item.n}</span>
                            <span className="text-slate-700">→</span>
                            <span className="text-emerald-400 font-semibold">{item.result}</span>
                            
                            {isHit && (
                              <Check size={11} className="text-emerald-400 animate-[bounce_0.3s_infinite]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Explanation */}
        <div>
          <CodeBlock
            vanillaCode={VANILLA_CODE}
            reactCode={REACT_CODE}
            title="memoization-caching.ts"
          />
        </div>
      </div>
    </section>
  );
}
