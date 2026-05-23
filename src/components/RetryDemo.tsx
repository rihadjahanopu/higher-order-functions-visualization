"use client";

import React, { useState, useRef } from "react";
import CodeBlock from "./CodeBlock";

interface AttemptLog {
  attempt: number;
  delay: number;
  status: "pending" | "failed" | "success";
  error?: string;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelay: number,
  onAttempt: (log: AttemptLog) => void,
  signal: AbortSignal
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    const delay = attempt === 1 ? 0 : baseDelay * 2 ** (attempt - 2);
    onAttempt({ attempt, delay, status: "pending" });
    if (delay > 0) await sleep(delay);
    if (signal.aborted) throw new Error("Aborted");
    try {
      const result = await fn();
      onAttempt({ attempt, delay, status: "success" });
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      onAttempt({ attempt, delay, status: "failed", error: msg });
      if (attempt > maxRetries) throw err;
    }
  }
  throw new Error("Exhausted");
}

const FAIL_RATE_OPTIONS = [0.3, 0.6, 0.9];

export default function RetryDemo() {
  const [attempts, setAttempts] = useState<AttemptLog[]>([]);
  const [running, setRunning] = useState(false);
  const [finalStatus, setFinalStatus] = useState<"idle" | "success" | "failed">("idle");
  const [failRate, setFailRate] = useState(0.6);
  const [maxRetries, setMaxRetries] = useState(3);
  const abortRef = useRef<AbortController | null>(null);

  const runRetry = async () => {
    if (running) return;
    abortRef.current = new AbortController();
    setAttempts([]);
    setFinalStatus("idle");
    setRunning(true);

    const logMap = new Map<number, AttemptLog>();

    const onAttempt = (log: AttemptLog) => {
      logMap.set(log.attempt, log);
      setAttempts([...logMap.values()]);
    };

    const fakeApiCall = () =>
      new Promise<string>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < failRate) {
            reject(new Error("Network timeout (simulated)"));
          } else {
            resolve("{ status: 200, data: 'OK' }");
          }
        }, 400);
      });

    try {
      await withRetry(fakeApiCall, maxRetries, 600, onAttempt, abortRef.current.signal);
      setFinalStatus("success");
    } catch {
      setFinalStatus("failed");
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setAttempts([]);
    setFinalStatus("idle");
    setRunning(false);
  };

  return (
    <section id="retry" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center shrink-0">
          <span className="text-cyan-400 text-xs font-bold">↺</span>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Retry with Backoff</h2>
          <p className="text-slate-400 text-xs mt-0.5">Wrap async functions with automatic exponential-backoff retry logic</p>
        </div>
        <span className="ml-auto text-[9px] font-bold tracking-widest font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/10 text-cyan-400">
          HOF
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Panel */}
        <div className="space-y-4">
          {/* Config */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Configuration</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 text-[10px] uppercase tracking-wider font-medium block mb-2">
                  Fail Rate
                </label>
                <div className="flex gap-1.5">
                  {FAIL_RATE_OPTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setFailRate(r)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                        failRate === r
                          ? "bg-cyan-600/20 border border-cyan-500/40 text-cyan-300"
                          : "bg-slate-800 border border-slate-700 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {Math.round(r * 100)}%
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-[10px] uppercase tracking-wider font-medium block mb-2">
                  Max Retries
                </label>
                <div className="flex gap-1.5">
                  {[2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMaxRetries(n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                        maxRetries === n
                          ? "bg-cyan-600/20 border border-cyan-500/40 text-cyan-300"
                          : "bg-slate-800 border border-slate-700 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Attempt Timeline */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Attempt Timeline</span>
              {finalStatus !== "idle" && (
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    finalStatus === "success"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {finalStatus === "success" ? "✓ Succeeded" : "✗ Exhausted"}
                </span>
              )}
            </div>

            <div className="space-y-2 min-h-[120px]">
              {attempts.length === 0 && !running && (
                <p className="text-slate-600 text-xs italic text-center py-8">Run to see retry attempts…</p>
              )}
              {attempts.map((a) => (
                <div key={a.attempt} className="flex items-center gap-3">
                  {/* Attempt number bubble */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      a.status === "pending"
                        ? "bg-slate-700 text-slate-400 animate-pulse"
                        : a.status === "success"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {a.attempt}
                  </div>

                  {/* Progress bar / status */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-mono text-slate-400">
                        {a.status === "pending"
                          ? "Attempting…"
                          : a.status === "success"
                          ? "Success"
                          : a.error ?? "Failed"}
                      </span>
                      {a.delay > 0 && (
                        <span className="text-[9px] text-slate-600 font-mono">+{a.delay}ms delay</span>
                      )}
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          a.status === "pending"
                            ? "w-1/2 bg-slate-600 animate-pulse"
                            : a.status === "success"
                            ? "w-full bg-emerald-500"
                            : "w-full bg-rose-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={runRetry}
              disabled={running}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-br from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-900/30 hover:shadow-cyan-900/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {running ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Retrying…
                </span>
              ) : (
                "▶ Run API Call"
              )}
            </button>
            <button
              onClick={reset}
              className="px-5 py-3 rounded-xl text-sm font-bold border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all duration-200"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right: Code */}
        <CodeBlock
          title="withRetry.ts"
          vanillaCode={`async function withRetry(fn, maxRetries, baseDelay) {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    // Exponential backoff: 0ms, 600ms, 1200ms, 2400ms
    const delay = attempt === 1 ? 0 : baseDelay * 2 ** (attempt - 2);
    if (delay > 0) await sleep(delay);

    try {
      return await fn(); // execute wrapped function
    } catch (err) {
      if (attempt > maxRetries) throw err; // exhausted
      console.warn('Attempt ' + attempt + ' failed — retrying...');
    }
  }
  throw new Error('Unreachable');
}

// Usage
const robustFetch = () =>
  withRetry(() => fetch('/api/data').then(r => r.json()), 3, 600);`}
          reactCode={`async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelay: number
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    // Exponential backoff: 0ms, 600ms, 1200ms, 2400ms
    const delay = attempt === 1 ? 0 : baseDelay * 2 ** (attempt - 2);
    if (delay > 0) await sleep(delay);

    try {
      return await fn();         // execute wrapped function
    } catch (err) {
      if (attempt > maxRetries) throw err; // exhausted
      console.warn('Attempt ' + attempt + ' failed...');
    }
  }
  throw new Error('Unreachable');
}

// Usage
const robustFetch = () =>
  withRetry(() => fetch('/api/data').then(r => r.json()), 3, 600);`}
        />
      </div>
    </section>
  );
}
