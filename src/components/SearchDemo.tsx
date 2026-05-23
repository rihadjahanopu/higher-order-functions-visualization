"use client";

import React, { useState, useRef, useEffect } from "react";
import { Hourglass, Flame, Zap, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";
import CodeBlock from "./CodeBlock";

const VANILLA_CODE = `// Real-world: Search input optimization
const debounce = (fn, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Usage: Wait 300ms after user stops typing
const searchInput = document.getElementById('search');
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
  // Perform API call
}, 300);

searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
`;

const REACT_CODE = `"use client";

import React, { useState, useRef, useEffect } from "react";

// 1. Traditional HOF Debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// 2. React-friendly ref-persisted debounce hook
export function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFn = (...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedFn;
}
`;

interface EventLog {
  id: string;
  time: string;
  type: "normal" | "debounced";
  text: string;
}

export default function SearchDemo() {
  const [query, setQuery] = useState("");
  const [normalCalls, setNormalCalls] = useState(0);
  const [debouncedCalls, setDebouncedCalls] = useState(0);
  const [logs, setLogs] = useState<EventLog[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search trigger (using pure React state)
  const triggerDebouncedSearch = (val: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedCalls((c) => c + 1);
      
      const newLog: EventLog = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString().split(" ")[0],
        type: "debounced",
        text: `Search API called for: "${val}"`,
      };
      setLogs((prev) => [newLog, ...prev].slice(0, 10)); // Limit to last 10 logs
    }, 400); // 400ms delay to make it highly visual
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    // 1. Normal/Immediate Trigger
    setNormalCalls((c) => c + 1);
    const normalLog: EventLog = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString().split(" ")[0],
      type: "normal",
      text: `Keydown captured: "${val}"`,
    };
    setLogs((prev) => [normalLog, ...prev].slice(0, 10));

    // 2. Debounced Trigger
    triggerDebouncedSearch(val);
  };

  const handleReset = () => {
    setQuery("");
    setNormalCalls(0);
    setDebouncedCalls(0);
    setLogs([]);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="mb-16 scroll-mt-24" id="debounce-throttle">
      {/* Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/50 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Hourglass size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            4. Debounce & Throttle (Performance)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Optimize expensive functions by controlling execution speed. Ideal for preventing server strain during fast user typing or scrolls.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive UI */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <span>⏱️</span> Type to Search (Live Test)
              </h3>
              <button
                onClick={handleReset}
                className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-lg transition-all"
              >
                <RefreshCw size={10} /> Reset
              </button>
            </div>

            {/* Search Input Box */}
            <div className="space-y-4">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Type rapidly here to see debounce in action..."
                className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 text-white px-4.5 py-3 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium"
              />
            </div>

            {/* Split Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Normal Box */}
              <div className="bg-slate-955 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-rose-455 text-xs font-bold uppercase tracking-wider">
                    <Flame size={13} className="animate-pulse" />
                    <span>Normal Execution</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    Triggers on every keydown
                  </p>
                </div>
                <div className="mt-5">
                  <div className="text-2xl font-bold font-mono text-white">
                    {normalCalls}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 italic truncate">
                    {query ? `Last: "${query}"` : "Waiting for input..."}
                  </div>
                </div>
              </div>

              {/* Debounced Box */}
              <div className="bg-slate-955 border border-indigo-950/65 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Zap size={13} />
                    <span>Debounced (400ms)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    Triggers 400ms after typing stops
                  </p>
                </div>
                <div className="mt-5">
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    {debouncedCalls}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 italic truncate">
                    {query ? `Last: "${query}"` : "Waiting for input..."}
                  </div>
                </div>
              </div>
            </div>

            {/* Live History Feed */}
            <div className="mt-6">
              <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900 pb-2 mb-3.5">
                📜 Event Activity Feed (Real-time logs)
              </label>
              
              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 h-[180px] overflow-y-auto space-y-2.5 scrollbar-thin">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-550 font-mono text-xs">
                    <Hourglass size={20} className="mb-1.5 animate-spin text-slate-700" style={{ animationDuration: "3s" }} />
                    Waiting for events... Type above to populate the timeline
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-2.5 font-mono text-[11px] leading-relaxed border-b border-slate-900 pb-2 last:border-b-0 animate-[fadeIn_0.2s_ease-out]"
                    >
                      <span className="text-slate-550 text-[10px]">{log.time}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          log.type === "normal"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                            : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                        }`}
                      >
                        {log.type === "normal" ? "KEy" : "API"}
                      </span>
                      <span className={log.type === "debounced" ? "text-emerald-300 font-medium" : "text-slate-350"}>
                        {log.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Explanation */}
        <div>
          <CodeBlock
            vanillaCode={VANILLA_CODE}
            reactCode={REACT_CODE}
            title="debounce-performance.ts"
          />
        </div>
      </div>
    </section>
  );
}
