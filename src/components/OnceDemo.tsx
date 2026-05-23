"use client";

import React, { useState } from "react";
import { Fingerprint, Lock, Unlock, Coins, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import CodeBlock from "./CodeBlock";

const VANILLA_CODE = `// Real-world: Prevent duplicate submissions
const once = (fn) => {
  let hasRun = false;
  let result;

  return (...args) => {
    if (hasRun) {
      return result; // Locked
    }
    hasRun = true;
    result = fn(...args);
    return result;
  };
};

// Checkout call wrapped with HOF
const processCheckout = once((orderId) => {
  console.log('Charging payment for:', orderId);
  return 'Payment Succeeded';
});
`;

const REACT_CODE = `"use client";

import React from "react";

// 1. Once HOF in TypeScript
function once<T extends (...args: any[]) => any>(fn: T): T {
  let hasRun = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>): ReturnType<T> => {
    if (hasRun) {
      return result;
    }
    hasRun = true;
    result = fn(...args);
    return result;
  }) as unknown as T;
}
`;

export default function OnceDemo() {
  const [normalClicks, setNormalClicks] = useState(0);
  const [onceClicks, setOnceClicks] = useState(0);

  const [normalLogs, setNormalLogs] = useState<string[]>([]);
  const [onceLogs, setOnceLogs] = useState<string[]>([]);

  // Closure state visual
  const [hasRunState, setHasRunState] = useState(false);
  const [lockedVisual, setLockedVisual] = useState(false);

  const handleNormalPay = () => {
    setNormalClicks((c) => c + 1);
    const timestamp = new Date().toLocaleTimeString().split(" ")[0];
    setNormalLogs((prev) => [
      `[${timestamp}] 💳 Charged $49.00 (Count: ${normalClicks + 1})`,
      ...prev,
    ].slice(0, 5));
  };

  const handleOncePay = () => {
    setOnceClicks((c) => c + 1);
    const timestamp = new Date().toLocaleTimeString().split(" ")[0];
    
    if (hasRunState) {
      // Short-circuited inside HOF closure!
      setOnceLogs((prev) => [
        `[${timestamp}] 🔒 Pay Blocked! Charge already processed`,
        ...prev,
      ].slice(0, 5));
      setLockedVisual(true);
      setTimeout(() => setLockedVisual(false), 500);
      return;
    }

    setHasRunState(true);
    setOnceLogs((prev) => [
      `[${timestamp}] 💳 Charged $49.00 (Processed Successfully!)`,
      ...prev,
    ].slice(0, 5));
  };

  const handleReset = () => {
    setNormalClicks(0);
    setOnceClicks(0);
    setNormalLogs([]);
    setOnceLogs([]);
    setHasRunState(false);
    setLockedVisual(false);
  };

  return (
    <section className="mb-16 scroll-mt-24" id="once-wrapper">
      {/* Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/50 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Fingerprint size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            8. Once Wrapper HOF (Preventing Duplicates)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Restrict a function to a single invocation. Perfect for securing forms, checkout submissions, and critical one-shot initialization events.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive UI */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <span>🛡️</span> Checkout Payment Form
              </h3>
              {(normalClicks > 0 || onceClicks > 0) && (
                <button
                  onClick={handleReset}
                  className="text-[9px] font-mono text-slate-450 hover:text-white flex items-center gap-1 bg-slate-950 border border-slate-850 px-2 py-1 rounded-lg transition-colors"
                >
                  <RotateCcw size={10} /> Reset Form
                </button>
              )}
            </div>

            {/* Split Comparison buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              
              {/* Box 1: Normal clicker */}
              <div className="bg-slate-955 border border-slate-850 rounded-2xl p-4.5 flex flex-col justify-between h-[230px]">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Coins size={13} className="text-amber-500" />
                    <span>Unsecured Button</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-mono">
                    Can execute multiple times. Risky checkout double-billing!
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Console Logs */}
                  <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl text-[9px] font-mono text-slate-450 h-[80px] overflow-y-auto leading-relaxed">
                    {normalLogs.length === 0 ? (
                      <span className="text-slate-655 italic">Waiting for click...</span>
                    ) : (
                      normalLogs.map((log, idx) => <div key={idx} className="border-b border-slate-900 pb-1 mb-1 last:border-0">{log}</div>)
                    )}
                  </div>

                  <button
                    onClick={handleNormalPay}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition-all active:scale-98"
                  >
                    Charge $49.00 ({normalClicks})
                  </button>
                </div>
              </div>

              {/* Box 2: Once clicker */}
              <div
                className={`bg-slate-955 border rounded-2xl p-4.5 flex flex-col justify-between h-[230px] transition-all duration-300 ${
                  lockedVisual ? "border-rose-500/50 ring-2 ring-rose-500/20 scale-98" : "border-slate-850"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    {hasRunState ? <Lock size={13} /> : <Unlock size={13} />}
                    <span>Once-wrapped HOF</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-mono">
                    Locked inside `once()` closure. Absolute duplicate protection!
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Console Logs */}
                  <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl text-[9px] font-mono text-slate-450 h-[80px] overflow-y-auto leading-relaxed">
                    {onceLogs.length === 0 ? (
                      <span className="text-slate-655 italic">Waiting for click...</span>
                    ) : (
                      onceLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className={`border-b border-slate-900 pb-1 mb-1 last:border-0 ${
                            log.includes("🔒") ? "text-rose-400 font-medium" : "text-emerald-400 font-medium"
                          }`}
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={handleOncePay}
                    disabled={false}
                    className={`w-full py-2.5 font-semibold text-xs rounded-xl transition-all duration-300 active:scale-98 ${
                      hasRunState
                        ? "bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    }`}
                  >
                    {hasRunState ? (
                      <span className="flex items-center justify-center gap-1">
                        <Lock size={11} /> Locked Payment Form
                      </span>
                    ) : (
                      `Charge Once $49.00 (${onceClicks})`
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* HOF Once Closure variable schema */}
            <div className="mt-5 border-t border-slate-850 pt-5">
              <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900 pb-2 mb-3.5">
                🔒 Once HOF Closure variables
              </label>

              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Fingerprint size={14} className="text-indigo-400" />
                  <span>State variable: hasRun</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    hasRunState
                      ? "bg-rose-500/15 border border-rose-500/20 text-rose-400"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  {hasRunState ? "true (Locked)" : "false (Available)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Explanation */}
        <div>
          <CodeBlock
            vanillaCode={VANILLA_CODE}
            reactCode={REACT_CODE}
            title="once-executor.ts"
          />
        </div>
      </div>
    </section>
  );
}
