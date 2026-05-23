"use client";

import React, { useState } from "react";
import { Link2, Sparkles, HelpCircle, Terminal, Layers, ArrowRight } from "lucide-react";
import CodeBlock from "./CodeBlock";

const VANILLA_CODE = `// Real-world: Multi-stage curried logger
const log = (level) => (component) => (message) => {
  const timestamp = new Date().toLocaleTimeString();
  return \`[\${timestamp}] [\${level}] [\${component}] \${message}\`;
};

// Partial Application stages
const errorLog = log('ERROR'); // locks level
const dbErrorLog = errorLog('Database'); // locks component

// Usage
dbErrorLog('Connection timeout'); 
// Output: "[17:25:00] [ERROR] [Database] Connection timeout"
`;

const REACT_CODE = `"use client";

import React from "react";

// 1. Curried Logger in TypeScript
type CurriedLogger = 
  (level: string) => 
    (component: string) => 
      (message: string) => string;

const log: CurriedLogger = (level) => (component) => (message) => {
  const time = new Date().toLocaleTimeString().split(" ")[0];
  return \`[\${time}] [\${level.toUpperCase()}] [\${component}] \${message}\`;
};

// 2. Creating specific reusable curriers
const infoLog = log("INFO");
const authInfoLog = infoLog("AuthService");
`;

export default function CurryDemo() {
  const [level, setLevel] = useState("INFO");
  const [component, setComponent] = useState("AuthService");
  const [message, setMessage] = useState("User login succeeded");

  // Stages of partial application
  const [stage, setStage] = useState(0); // 0: unapplied, 1: level locked, 2: component locked, 3: fully computed
  const [finalLog, setFinalLog] = useState("");

  const handleNextStage = () => {
    if (stage === 0) {
      setStage(1);
    } else if (stage === 1) {
      setStage(2);
    } else if (stage === 2) {
      // Complete Currying chain execution
      const time = new Date().toLocaleTimeString().split(" ")[0];
      const curriedLog = `[${time}] [${level}] [${component}] ${message}`;
      setFinalLog(curriedLog);
      setStage(3);
    }
  };

  const handleReset = () => {
    setStage(0);
    setFinalLog("");
  };

  return (
    <section className="mb-16 scroll-mt-24" id="currying-partial">
      {/* Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/50 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Layers size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            7. Function Currying & Partial Application
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Deconstruct a multi-argument function into a chain of single-argument nesting functions. Lock arguments step-by-step to compile custom, highly reusable derivatives.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive UI */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <span>🔗</span> Curried Step-by-Step Logger
              </h3>
              {stage > 0 && (
                <button
                  onClick={handleReset}
                  className="text-[9px] font-mono text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Reset Chain
                </button>
              )}
            </div>

            {/* Stage Selector Controls */}
            <div className="space-y-4">
              {stage === 0 && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                    Step 1: Set Log Level (Locks Level Closure)
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                  >
                    <option value="DEBUG">DEBUG (Detailed tracing)</option>
                    <option value="INFO">INFO (Normal operational logs)</option>
                    <option value="WARN">WARN (Warning messages)</option>
                    <option value="ERROR">ERROR (Severe failures)</option>
                  </select>
                </div>
              )}

              {stage === 1 && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                    Step 2: Set Component Module (Locks Component Closure)
                  </label>
                  <select
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                  >
                    <option value="AuthService">AuthService (User credentials)</option>
                    <option value="Database">Database (SQL query execution)</option>
                    <option value="Network">Network (Sockets & API hooks)</option>
                    <option value="PaymentGateway">PaymentGateway (Credit card billing)</option>
                  </select>
                </div>
              )}

              {stage === 2 && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                    Step 3: Enter Payload Message & Trigger final callback
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter logging message..."
                    className="w-full bg-slate-950 border border-slate-850 text-white px-4.5 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                  />
                </div>
              )}

              {stage < 3 && (
                <button
                  onClick={handleNextStage}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 active:scale-98"
                >
                  {stage === 0 && "Lock Level (log(level))"}
                  {stage === 1 && "Lock Component (log(level)(component))"}
                  {stage === 2 && "Resolve Payload (log(level)(component)(msg))"}
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Visual Nesting Closures Diagram */}
            <div className="mt-6">
              <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900 pb-2 mb-4">
                🔬 Lexical Closures Stack (Visualizing Arguments Locked)
              </label>

              {/* Stack Wrapper */}
              <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
                
                {/* Level Frame (Outer Scope) */}
                <div
                  className={`w-full max-w-[340px] border rounded-2xl p-3.5 transition-all duration-300 text-center ${
                    stage >= 1
                      ? "bg-indigo-600/5 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)] text-indigo-300"
                      : "bg-slate-900/40 border-slate-850 opacity-40 text-slate-500"
                  }`}
                >
                  <div className="text-[9px] font-mono font-bold uppercase tracking-wide">
                    log(level) Closure (level = &quot;{stage >= 1 ? level : "?"}&quot;)
                  </div>
                  
                  {/* Component Frame (Mid Scope) */}
                  <div
                    className={`mt-3 w-full border rounded-xl p-3.5 transition-all duration-300 ${
                      stage >= 2
                        ? "bg-purple-600/5 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)] text-purple-300"
                        : "bg-slate-900/60 border-slate-900 opacity-40 text-slate-600"
                    }`}
                  >
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wide">
                      (component) Closure (component = &quot;{stage >= 2 ? component : "?"}&quot;)
                    </div>

                    {/* Message Frame (Inner Scope) */}
                    <div
                      className={`mt-3 w-full border rounded-lg p-2.5 transition-all duration-300 font-mono text-[10px] ${
                        stage >= 3
                          ? "bg-emerald-600/10 border-emerald-500 text-emerald-300"
                          : "bg-slate-950 border-slate-900 opacity-40 text-slate-700"
                      }`}
                    >
                      {stage >= 3 ? (
                        <div className="truncate">
                          (message) =&gt; Output Resolved!
                        </div>
                      ) : (
                        <div>(message) =&gt; Wait for final resolve...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolved Log Panel */}
            {stage === 3 && (
              <div className="mt-5 bg-slate-950 border border-slate-900 rounded-2xl p-4.5 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-500 border-b border-slate-900 pb-2">
                  <span className="font-bold text-[10px] uppercase tracking-wide flex items-center gap-1">
                    <Terminal size={12} /> Console Output
                  </span>
                  <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                    Success
                  </span>
                </div>
                <div className="text-emerald-400 leading-normal break-all font-medium py-1">
                  {finalLog}
                </div>
                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white rounded-xl transition-all font-semibold text-xs active:scale-98"
                >
                  Create Another Log
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Explanation */}
        <div>
          <CodeBlock
            vanillaCode={VANILLA_CODE}
            reactCode={REACT_CODE}
            title="currying-closures.ts"
          />
        </div>
      </div>
    </section>
  );
}
