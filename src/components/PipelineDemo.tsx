"use client";

import React, { useState } from "react";
import { Link, ChevronRight, ChevronDown, CheckCircle2, User, AlertCircle } from "lucide-react";
import CodeBlock from "./CodeBlock";

const VANILLA_CODE = `// Real-world: Data validation pipeline
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const trim = (str) => str.trim();
const toLower = (str) => str.toLowerCase();
const removeSpecialChars = (str) => str.replace(/[^a-z0-9]/g, '');
const addPrefix = (prefix) => (str) => \`\${prefix}_\${str}\`;

const sanitizeUsername = pipe(
  trim,
  toLower,
  removeSpecialChars,
  addPrefix('user')
);

// Usage: " John_Doe@123 " → "user_johndoe123"
`;

const REACT_CODE = `"use client";

import React, { useState } from "react";

// 1. Variadic pipe implementation in TypeScript
type Transformer = (str: string) => string;
const pipe = (...fns: Transformer[]) => (x: string) => 
  fns.reduce((v, f) => f(v), x);

// 2. Pure single-responsibility transformers
const trim: Transformer = (str) => str.trim();
const toLower: Transformer = (str) => str.toLowerCase();
const removeSpecialChars: Transformer = (str) => str.replace(/[^a-z0-9]/g, "");
const addPrefix = (prefix: string): Transformer => (str) => \`\${prefix}_\${str}\`;
const limitLength: Transformer = (str) => str.slice(0, 20);

// 3. Composed higher-order pipeline
const sanitizeUsername = pipe(
  trim,
  toLower,
  removeSpecialChars,
  addPrefix("user"),
  limitLength
);
`;

interface PipelineStepResult {
  name: string;
  description: string;
  result: string;
}

export default function PipelineDemo() {
  const [username, setUsername] = useState("  John_Doe@123  ");
  const [pipelineResults, setPipelineResults] = useState<PipelineStepResult[]>([]);
  const [finalResult, setFinalResult] = useState("");
  const [error, setError] = useState("");

  const handleSanitize = () => {
    if (!username.trim()) {
      setError("Please enter a username to process");
      setPipelineResults([]);
      setFinalResult("");
      return;
    }
    setError("");

    // Transformer functions
    const trimFn = (str: string) => str.trim();
    const toLowerFn = (str: string) => str.toLowerCase();
    const removeSpecialCharsFn = (str: string) => str.replace(/[^a-z0-9]/g, "");
    const addPrefixFn = (prefix: string) => (str: string) => `${prefix}_${str}`;
    const limitLengthFn = (str: string) => str.slice(0, 20);

    const steps: { name: string; description: string; fn: (str: string) => string }[] = [
      { name: "Original Input", description: "The messy string entered by user", fn: (x) => x },
      { name: "trim()", description: "Removes leading and trailing whitespace", fn: trimFn },
      { name: "toLowerCase()", description: "Standardizes all characters to lowercase", fn: toLowerFn },
      { name: "replace(/[^a-z0-9]/g, '')", description: "Strips out all special characters, underscores, and spaces", fn: removeSpecialCharsFn },
      { name: 'addPrefix("user")', description: "Prepends 'user_' namespace namespace to username", fn: addPrefixFn("user") },
      { name: "slice(0, 20)", description: "Limits the final string length to 20 characters maximum", fn: limitLengthFn },
    ];

    const results: PipelineStepResult[] = [];
    let current = username;

    for (const step of steps) {
      current = step.fn(current);
      results.push({
        name: step.name,
        description: step.description,
        result: current,
      });
    }

    setPipelineResults(results);
    setFinalResult(current);
  };

  // Run on mount once
  React.useEffect(() => {
    handleSanitize();
  }, []);

  return (
    <section className="mb-16 scroll-mt-24" id="function-composition">
      {/* Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/50 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Link size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            2. Function Composition & Pipelines
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Compose intricate operations from simple, atomic functions. The output of one function feeds seamlessly into the input of the next.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive UI */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>📝</span> Username Sanitizer
            </h3>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter messy username..."
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-sm font-mono"
                  />
                </div>
                <button
                  onClick={handleSanitize}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-98"
                >
                  Sanitize
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Pipeline Step Visualizer */}
            {pipelineResults.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
                    Pipeline Visualizer
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    Composable Flow
                  </span>
                </div>

                {/* Steps Nodes */}
                <div className="space-y-2">
                  {pipelineResults.map((step, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && (
                        <div className="flex justify-center sm:justify-start sm:ml-8 py-0.5 text-slate-655 text-indigo-500 animate-pulse">
                          {/* Chevron showing flow direction */}
                          <ChevronDown size={14} className="sm:hidden block" />
                          <ChevronDown size={16} className="hidden sm:block" />
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-950/70 border border-slate-900 rounded-2xl p-3.5 hover:border-slate-800 transition-all duration-200">
                        {/* Circle step index */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-1">
                          <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold font-mono text-indigo-400 flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-slate-200 text-xs sm:text-sm font-semibold font-mono">
                              {step.name}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">
                              {step.description}
                            </div>
                          </div>
                        </div>

                        {/* Visual output */}
                        <div className="mt-2.5 sm:mt-0 font-mono text-xs sm:text-sm bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-lg text-emerald-400 self-end sm:self-auto min-w-[130px] text-right font-medium truncate max-w-[200px]">
                          &quot;{step.result}&quot;
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Composed Output */}
                <div className="mt-5 bg-gradient-to-br from-indigo-950/20 to-slate-950 border border-indigo-950/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-xs font-sans font-bold text-slate-300 uppercase tracking-wide">
                      Sanitized Output
                    </span>
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-white bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-2 rounded-xl text-center shadow-sm">
                    &quot;{finalResult}&quot;
                  </div>
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
            title="functional-pipeline.ts"
          />
        </div>
      </div>
    </section>
  );
}
