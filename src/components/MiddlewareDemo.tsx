"use client";

import React, { useState } from "react";
import { Shield, Check, X, ArrowRight, RefreshCw, Key, Globe, Terminal } from "lucide-react";
import CodeBlock from "./CodeBlock";

const VANILLA_CODE = `// Real-world: HTTP request pipeline
const createMiddlewarePipeline = (...middlewares) => {
  return (ctx) => {
    let index = 0;

    const next = () => {
      if (index >= middlewares.length) return;
      const middleware = middlewares[index++];
      middleware(ctx, next);
    };

    next();
    return ctx;
  };
};

// Middleware functions
const logger = (ctx, next) => {
  ctx.logs.push(\`Request: \${ctx.url}\`);
  next();
};

const auth = (ctx, next) => {
  if (!ctx.token) throw new Error('Unauthorized');
  ctx.user = { id: 1, name: 'John' };
  next();
};
`;

const REACT_CODE = `"use client";

import React from "react";

// 1. Context Interface passed through middlewares
interface RequestContext {
  url: string;
  token: string;
  logs: string[];
  user: { id: number; username: string } | null;
  error?: string;
  response?: { status: number; body: string };
}

type Middleware = (ctx: RequestContext, next: () => void) => void;

// 2. High-Order Pipeline Builder
const createMiddlewarePipeline = (...middlewares: Middleware[]) => {
  return (ctx: RequestContext) => {
    let index = 0;
    const next = () => {
      if (index >= middlewares.length) return;
      const middleware = middlewares[index++];
      middleware(ctx, next);
    };
    next();
    return ctx;
  };
};
`;

interface MiddlewareStepVisual {
  name: string;
  description: string;
  status: "idle" | "running" | "success" | "failed";
  log: string;
}

export default function MiddlewareDemo() {
  const [requestUrl, setRequestUrl] = useState("/api/dashboard");
  const [tokenInput, setTokenInput] = useState("secret_jwt_token_123");
  
  // Pipeline state outputs
  const [logs, setLogs] = useState<string[]>([]);
  const [userResult, setUserResult] = useState<any>(null);
  const [responseResult, setResponseResult] = useState<any>(null);
  const [errorResult, setErrorResult] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  // Middleware step status for UI rendering
  const [steps, setSteps] = useState<MiddlewareStepVisual[]>([
    { name: "Logger Middleware", description: "Records request timestamp and target endpoint", status: "idle", log: "" },
    { name: "Auth Verification", description: "Verifies authorization header token structure", status: "idle", log: "" },
    { name: "Data Validation", description: "Validates request payload structure against schemas", status: "idle", log: "" },
    { name: "Endpoint Handler", description: "Retrieves DB results and writes status codes", status: "idle", log: "" },
  ]);

  const handleRunPipeline = () => {
    setHasRun(true);
    setErrorResult(null);
    setResponseResult(null);
    setUserResult(null);

    const ctx = {
      url: requestUrl,
      token: tokenInput,
      logs: [] as string[],
      user: null as any,
      error: undefined as string | undefined,
      response: undefined as any,
    };

    // Reinitialize visual steps list to running state
    const currentSteps: MiddlewareStepVisual[] = [
      { name: "Logger Middleware", description: "Records request timestamp and target endpoint", status: "idle", log: "" },
      { name: "Auth Verification", description: "Verifies authorization header token structure", status: "idle", log: "" },
      { name: "Data Validation", description: "Validates request payload structure against schemas", status: "idle", log: "" },
      { name: "Endpoint Handler", description: "Retrieves DB results and writes status codes", status: "idle", log: "" },
    ];

    // Define Middlewares
    const loggerMiddleware = (c: typeof ctx, next: () => void) => {
      currentSteps[0].status = "success";
      const timestamp = new Date().toLocaleTimeString();
      const logMsg = `[${timestamp}] 📝 Logger: Request received for url="${c.url}"`;
      c.logs.push(logMsg);
      currentSteps[0].log = logMsg;
      next();
    };

    const authMiddleware = (c: typeof ctx, next: () => void) => {
      currentSteps[1].status = "running";
      if (!c.token || c.token.trim() === "") {
        currentSteps[1].status = "failed";
        const logMsg = `[${new Date().toLocaleTimeString()}] ❌ Auth: Verification failed (Missing Authorization Token)`;
        c.logs.push(logMsg);
        c.error = "Unauthorized - 401";
        currentSteps[1].log = logMsg;
        // Don't call next() to mimic actual short-circuiting!
        return;
      }
      currentSteps[1].status = "success";
      const logMsg = `[${new Date().toLocaleTimeString()}] ✅ Auth: Token authenticated (Session active for user "Admin")`;
      c.logs.push(logMsg);
      c.user = { id: 101, username: "Admin User", role: "SuperAdmin" };
      currentSteps[1].log = logMsg;
      next();
    };

    const validatorMiddleware = (c: typeof ctx, next: () => void) => {
      if (c.error) return;
      currentSteps[2].status = "running";
      
      // Mimic simple endpoint specific validation logic
      if (c.url.includes("/admin") && c.user?.role !== "SuperAdmin") {
        currentSteps[2].status = "failed";
        const logMsg = `[${new Date().toLocaleTimeString()}] ❌ Validator: Rule failed (Resource requires administrator permissions)`;
        c.logs.push(logMsg);
        c.error = "Forbidden - 403";
        currentSteps[2].log = logMsg;
        return;
      }

      currentSteps[2].status = "success";
      const logMsg = `[${new Date().toLocaleTimeString()}] 🔍 Validator: Input structure matches criteria`;
      c.logs.push(logMsg);
      currentSteps[2].log = logMsg;
      next();
    };

    const endpointHandler = (c: typeof ctx, next: () => void) => {
      if (c.error) return;
      currentSteps[3].status = "success";
      const logMsg = `[${new Date().toLocaleTimeString()}] 🎯 Handler: Request resolved successfully`;
      c.logs.push(logMsg);
      c.response = { status: 200, body: "API Success: User Dashboard Data Delivered" };
      currentSteps[3].log = logMsg;
    };

    // Variadic Pipeline Builder
    const pipeline = (...middlewares: Array<(c: typeof ctx, next: () => void) => void>) => {
      return (context: typeof ctx) => {
        let index = 0;
        const next = () => {
          if (index >= middlewares.length) return;
          const middleware = middlewares[index++];
          middleware(context, next);
        };
        next();
      };
    };

    // Compose Middlewares
    const app = pipeline(loggerMiddleware, authMiddleware, validatorMiddleware, endpointHandler);
    app(ctx);

    // Update statuses for idle blocks after a short circuit occurs
    let foundFailure = false;
    for (let i = 0; i < currentSteps.length; i++) {
      if (currentSteps[i].status === "failed") {
        foundFailure = true;
        continue;
      }
      if (foundFailure) {
        currentSteps[i].status = "idle";
      }
    }

    setSteps(currentSteps);
    setLogs(ctx.logs);
    setUserResult(ctx.user);
    setResponseResult(ctx.response);
    setErrorResult(ctx.error || null);
  };

  // Run on mount
  React.useEffect(() => {
    handleRunPipeline();
  }, []);

  return (
    <section className="mb-16 scroll-mt-24" id="middleware-pattern">
      {/* Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/50 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Shield size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            5. Middleware Pattern (Express & Next.js Style)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Chain series of processing blocks sequentially. Verify, modify headers, validate inputs, and handle errors. Control flows and short-circuits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive UI */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>🛡️</span> Request Middleware Chain
            </h3>

            {/* Config Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Target URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-550 font-bold uppercase tracking-wide flex items-center gap-1.5">
                    <Globe size={11} /> Request URL
                  </label>
                  <input
                    type="text"
                    value={requestUrl}
                    onChange={(e) => setRequestUrl(e.target.value)}
                    placeholder="/api/admin"
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-xs font-mono"
                  />
                </div>

                {/* Authentication Token */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-550 font-bold uppercase tracking-wide flex items-center gap-1.5">
                    <Key size={11} /> Authorization Token
                  </label>
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="None (triggers unauthorized)..."
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-xs font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleRunPipeline}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-98"
              >
                <RefreshCw size={14} /> Process Request Pipeline
              </button>
            </div>

            {/* Vertical Stack Chain Visualizer */}
            {hasRun && (
              <div className="mt-6 space-y-4">
                <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900 pb-2">
                  ⛓️ Middleware Chain Visual Pipeline
                </label>

                <div className="space-y-3 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-850 before:pointer-events-none">
                  {steps.map((step, idx) => {
                    const isSuccess = step.status === "success";
                    const isFailed = step.status === "failed";
                    const isRunning = step.status === "running";

                    let indicatorBg = "bg-slate-950 border-slate-850 text-slate-600";
                    let indicatorIcon = <span>{idx + 1}</span>;

                    if (isSuccess) {
                      indicatorBg = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400";
                      indicatorIcon = <Check size={12} />;
                    } else if (isFailed) {
                      indicatorBg = "bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse";
                      indicatorIcon = <X size={12} />;
                    } else if (isRunning) {
                      indicatorBg = "bg-indigo-500/10 border-indigo-500/40 text-indigo-400";
                      indicatorIcon = <RefreshCw size={10} className="animate-spin" />;
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-4 p-3.5 border rounded-2xl transition-all duration-300 ${
                          isSuccess
                            ? "bg-emerald-950/5 border-emerald-950/20"
                            : isFailed
                            ? "bg-rose-950/5 border-rose-950/20 shadow-lg shadow-rose-950/5"
                            : isRunning
                            ? "bg-indigo-950/5 border-indigo-950/20"
                            : "bg-slate-950/20 border-slate-900 opacity-60"
                        }`}
                      >
                        {/* Status Pin Circle */}
                        <div
                          className={`w-[10px] sm:w-[22px] h-[10px] sm:h-[22px] rounded-full border flex items-center justify-center shrink-0 font-mono text-[9px] font-bold transition-all duration-300 mt-0.5 sm:mt-1 ${indicatorBg}`}
                        >
                          {indicatorIcon}
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-bold text-slate-200">
                              {step.name}
                            </span>
                            <span
                              className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                                isSuccess
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : isFailed
                                  ? "bg-rose-500/10 text-rose-400"
                                  : isRunning
                                  ? "bg-indigo-500/10 text-indigo-400"
                                  : "bg-slate-900 text-slate-655"
                              }`}
                            >
                              {step.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            {step.description}
                          </p>
                          
                          {/* Log attached to middleware block if run */}
                          {step.log && (
                            <div className="font-mono text-[10px] text-emerald-400 bg-slate-950 border border-slate-900 px-3 py-2 rounded-xl mt-2 select-text">
                              {step.log}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Final Context Outputs */}
                <div className="mt-6 space-y-3.5 bg-slate-950/80 border border-slate-900 rounded-2xl p-4.5 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-500 border-b border-slate-900 pb-2.5">
                    <span className="font-bold text-[10px] uppercase tracking-wide flex items-center gap-1.5">
                      <Terminal size={12} /> Execution Details
                    </span>
                    <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">
                      Pipeline Complete
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-350">
                    <div className="flex justify-between flex-wrap gap-1">
                      <span>Authenticated User:</span>
                      <span className="text-white">
                        {userResult ? JSON.stringify(userResult) : "null (Guest)"}
                      </span>
                    </div>
                    
                    {errorResult ? (
                      <div className="flex justify-between text-rose-400 border-t border-slate-900/65 pt-2">
                        <span>Pipeline Error:</span>
                        <span className="font-bold">{errorResult}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-emerald-400 border-t border-slate-900/65 pt-2 flex-wrap gap-1">
                        <span>Success Response:</span>
                        <span className="font-bold">
                          {responseResult ? JSON.stringify(responseResult) : "null"}
                        </span>
                      </div>
                    )}
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
            title="middleware-pipeline.ts"
          />
        </div>
      </div>
    </section>
  );
}
