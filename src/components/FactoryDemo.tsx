"use client";

import React, { useState } from "react";
import { Factory, DollarSign, Lock, Play, Layers, Key } from "lucide-react";
import CodeBlock from "./CodeBlock";

const VANILLA_CODE = `// Real-world: API client factory with auth
const createAPIClient = (baseURL, apiKey) => {
  // Private state via closure
  let requestCount = 0;

  return {
    get: async (endpoint) => {
      requestCount++;
      console.log(\`Request #\${requestCount} to \${baseURL}\${endpoint}\`);
      return fetch(\`\${baseURL}\${endpoint}\`, {
        headers: { 'Authorization': \`Bearer \${apiKey}\` }
      });
    },
    getRequestCount: () => requestCount
  };
};

// Usage
const githubAPI = createAPIClient('https://api.github.com', 'ghp_xxx');
`;

const REACT_CODE = `"use client";

import React, { useState } from "react";

// 1. Calculator closure-based interface
interface DiscountCalculator {
  calculate: (price: number) => {
    original: number;
    discount: number;
    final: number;
    count: number;
  };
  getRate: () => number;
  getUsageCount: () => number;
}

// 2. Factory function preserving state in a closure
const createDiscountCalculator = (discountPercent: number): DiscountCalculator => {
  let usageCount = 0; // Private state variable
  const rate = discountPercent / 100;

  return {
    calculate: (price: number) => {
      usageCount++; // Closed over usageCount is updated
      const discount = price * rate;
      return {
        original: price,
        discount: Number(discount.toFixed(2)),
        final: Number((price - discount).toFixed(2)),
        count: usageCount,
      };
    },
    getRate: () => discountPercent,
    getUsageCount: () => usageCount,
  };
};
`;

interface CalculationResult {
  original: number;
  discount: number;
  final: number;
  count: number;
}

export default function FactoryDemo() {
  const [discountInput, setDiscountInput] = useState("20");
  const [priceInput, setPriceInput] = useState("100");
  
  // Custom calculator state (closure ref)
  const [calculator, setCalculator] = useState<{
    calculate: (price: number) => CalculationResult;
    getRate: () => number;
    getUsageCount: () => number;
  } | null>(null);

  const [calcResult, setCalcResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState("");
  const [priceError, setPriceError] = useState("");
  
  // Animation pulse triggers
  const [pulseCount, setPulseCount] = useState(false);
  const [pulseRate, setPulseRate] = useState(false);

  const handleCreateCalculator = () => {
    const rate = parseFloat(discountInput);
    if (isNaN(rate) || rate <= 0 || rate > 100) {
      setError("Please enter a valid rate (1-100)%");
      setCalculator(null);
      setCalcResult(null);
      return;
    }
    setError("");

    // Instantiate Closure Factory
    let usageCount = 0;
    const decimalRate = rate / 100;

    const calcInstance = {
      calculate: (price: number) => {
        usageCount++;
        const discountAmount = price * decimalRate;
        return {
          original: price,
          discount: Number(discountAmount.toFixed(2)),
          final: Number((price - discountAmount).toFixed(2)),
          count: usageCount,
        };
      },
      getRate: () => rate,
      getUsageCount: () => usageCount,
    };

    setCalculator(calcInstance);
    setCalcResult(null);
    
    // Trigger animation flash
    setPulseRate(true);
    setTimeout(() => setPulseRate(false), 500);
  };

  const handleCalculateDiscount = () => {
    if (!calculator) return;
    const price = parseFloat(priceInput);
    if (isNaN(price) || price <= 0) {
      setPriceError("Please enter a positive price value");
      return;
    }
    setPriceError("");

    const result = calculator.calculate(price);
    setCalcResult(result);

    // Pulse closure block state variables to highlight encapsulation activity
    setPulseCount(true);
    setTimeout(() => setPulseCount(false), 500);
  };

  return (
    <section className="mb-16 scroll-mt-24" id="closures-factories">
      {/* Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/50 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Factory size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            3. Function Factories & Closures
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Spin up customized, high-order utility functions dynamically. Leverage scopes to protect private variables and encapsulate states.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive UI */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>🔧</span> Discount Calculator Factory
            </h3>

            {/* Stage 1: Create Calculator */}
            <div className="space-y-4">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Step 1: Set Discount & Instantiate Scope
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-550 font-mono text-xs">
                    %
                  </span>
                  <input
                    type="number"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    placeholder="Enter discount rate (e.g. 20)..."
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-sm font-mono"
                    min="1"
                    max="100"
                  />
                </div>
                <button
                  onClick={handleCreateCalculator}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-98"
                >
                  Create Calculator
                </button>
              </div>

              {error && (
                <div className="text-rose-455 font-mono text-xs bg-rose-500/10 border border-rose-500/20 px-4.5 py-3 rounded-xl">
                  {error}
                </div>
              )}
            </div>

            {/* Stage 2: Calculate prices (active only when calculator is created) */}
            {calculator && (
              <div className="mt-6 border-t border-slate-850 pt-6 space-y-6">
                
                {/* Closure scope card visual */}
                <div className="bg-slate-955 border border-slate-850 rounded-2xl p-4.5">
                  <div className="flex items-center gap-2 mb-3 text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                    <Lock size={13} className="text-indigo-400" />
                    <span>Enclosed Lexical Scope (Closure Scope)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div
                      className={`bg-slate-900 border border-slate-800 rounded-xl p-3 text-center transition-all duration-300 ${
                        pulseRate ? "bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/20" : ""
                      }`}
                    >
                      <span className="block text-[10px] text-slate-550 font-bold font-sans uppercase">
                        Rate (Fixed)
                      </span>
                      <span className="text-base font-bold font-mono text-white mt-1 block">
                        {calculator.getRate()}%
                      </span>
                    </div>
                    <div
                      className={`bg-slate-900 border border-slate-800 rounded-xl p-3 text-center transition-all duration-300 ${
                        pulseCount ? "bg-emerald-600/20 border-emerald-500 ring-2 ring-emerald-500/20 scale-105" : ""
                      }`}
                    >
                      <span className="block text-[10px] text-slate-550 font-bold font-sans uppercase">
                        Usage Count (Mutable)
                      </span>
                      <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
                        {calculator.getUsageCount()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Step 2: Run Price Calculations
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono">
                        $
                      </span>
                      <input
                        type="number"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        placeholder="Enter item price..."
                        className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-sm font-mono"
                        min="1"
                      />
                    </div>
                    <button
                      onClick={handleCalculateDiscount}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-xl font-semibold text-sm transition-all active:scale-98"
                    >
                      <Play size={14} className="fill-slate-200" /> Calculate
                    </button>
                  </div>
                  
                  {priceError && (
                    <div className="text-rose-455 font-mono text-xs bg-rose-500/10 border border-rose-500/20 px-4.5 py-3 rounded-xl">
                      {priceError}
                    </div>
                  )}
                </div>

                {/* Calculation Outputs */}
                {calcResult && (
                  <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4.5 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-slate-400 border-b border-slate-900 pb-2">
                      <span className="font-bold text-[10px] uppercase tracking-wide">Calculation Details</span>
                      <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                        Call #{calcResult.count}
                      </span>
                    </div>
                    <div className="space-y-2 text-slate-300">
                      <div className="flex justify-between">
                        <span>Original Price:</span>
                        <span className="text-white">${calcResult.original}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discounted Amount ({calculator.getRate()}%):</span>
                        <span className="text-rose-400">-${calcResult.discount}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-900 pt-2 text-sm font-bold text-slate-200">
                        <span>Final Price:</span>
                        <span className="text-emerald-400">${calcResult.final}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!calculator && (
              <div className="mt-8 text-center text-slate-550 border border-dashed border-slate-800 rounded-2xl py-8 px-4 text-xs font-mono">
                Click &quot;Create Calculator&quot; above to lock a discount rate into a closure lexical environment.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Explanation */}
        <div>
          <CodeBlock
            vanillaCode={VANILLA_CODE}
            reactCode={REACT_CODE}
            title="closure-factory.ts"
          />
        </div>
      </div>
    </section>
  );
}
