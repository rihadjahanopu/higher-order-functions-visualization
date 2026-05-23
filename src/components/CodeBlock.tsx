"use client";

import React, { useState } from "react";
import { Clipboard, Check } from "lucide-react";

interface CodeBlockProps {
  vanillaCode: string;
  reactCode: string;
  title?: string;
}

export default function CodeBlock({ vanillaCode, reactCode, title }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState<"vanilla" | "react">("vanilla");
  const [copied, setCopied] = useState(false);

  const activeCode = activeTab === "vanilla" ? vanillaCode : reactCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-2xl transition-all duration-300">
      {/* Code Header (dots + tabs + copy) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950 gap-2 sm:gap-0">
        <div className="flex items-center gap-4">
          {/* OS Windows Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 block" />
          </div>
          {title && (
            <span className="text-xs font-mono text-slate-400 font-medium tracking-wide">
              {title}
            </span>
          )}
        </div>

        {/* Tab Controls and Action Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Code Switcher Tabs */}
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800/80">
            <button
              onClick={() => setActiveTab("vanilla")}
              className={`px-3 py-1 text-xs font-medium font-sans rounded-md transition-all duration-200 ${
                activeTab === "vanilla"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Vanilla JS
            </button>
            <button
              onClick={() => setActiveTab("react")}
              className={`px-3 py-1 text-xs font-medium font-sans rounded-md transition-all duration-200 ${
                activeTab === "react"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              TypeScript / React
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg transition-all active:scale-95"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Clipboard size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Syntax Highlighting Container */}
      <div className="p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-300 overflow-x-auto max-h-[350px] scrollbar-thin bg-slate-950/40 select-text">
        <pre className="whitespace-pre">
          {formatSyntax(activeCode)}
        </pre>
      </div>
    </div>
  );
}

// Simple custom syntax highlighting logic to parse and highlight JS/TS code beautifully
function formatSyntax(code: string) {
  const lines = code.split("\n");
  return lines.map((line, idx) => {
    // Escape standard tags, but allow styling
    const tokens: React.ReactNode[] = [];
    
    // Check if the line is fully a comment
    if (line.trim().startsWith("//")) {
      return (
        <div key={idx} className="text-slate-500 italic whitespace-pre select-text">
          {line}
        </div>
      );
    }

    // RegEx patterns for basic code constructs
    // This is robust, secure and runs entirely client-side
    const parts = line.split(/(\/\/.*$|(?:\b(?:const|let|var|function|return|async|await|import|export|from|default|interface|type|class|extends)\b)|(?:['"`].*?['"`])|(?:\b\d+\b)|(?:[+\-*\/=<>!&|?:]+))/);

    let keyCounter = 0;
    for (const part of parts) {
      if (!part) continue;
      keyCounter++;

      if (part.startsWith("//")) {
        tokens.push(
          <span key={keyCounter} className="text-slate-500 italic select-text">
            {part}
          </span>
        );
      } else if (
        ["const", "let", "var", "function", "return", "async", "await", "import", "export", "from", "default", "interface", "type", "class", "extends"].includes(
          part.trim()
        )
      ) {
        tokens.push(
          <span key={keyCounter} className="text-purple-400 font-semibold select-text">
            {part}
          </span>
        );
      } else if (
        (part.startsWith("'") && part.endsWith("'")) ||
        (part.startsWith('"') && part.endsWith('"')) ||
        (part.startsWith("`") && part.endsWith("`"))
      ) {
        tokens.push(
          <span key={keyCounter} className="text-emerald-400 select-text">
            {part}
          </span>
        );
      } else if (/^\d+$/.test(part.trim())) {
        tokens.push(
          <span key={keyCounter} className="text-pink-400 select-text">
            {part}
          </span>
        );
      } else if (/^[+\-*\/=<>!&|?:]+$/.test(part.trim())) {
        tokens.push(
          <span key={keyCounter} className="text-amber-400 select-text">
            {part}
          </span>
        );
      } else {
        // Highlight method/function calls like .map, .filter, console.log
        const subParts = part.split(/(\.[a-zA-Z0-9_]+(?=\())/);
        let subCounter = 0;
        for (const subPart of subParts) {
          subCounter++;
          if (subPart.startsWith(".") && subPart.length > 1) {
            tokens.push(
              <span key={`${keyCounter}-${subCounter}-dot`} className="text-slate-300 select-text">
                .
              </span>
            );
            tokens.push(
              <span key={`${keyCounter}-${subCounter}-func`} className="text-sky-400 font-medium select-text">
                {subPart.slice(1)}
              </span>
            );
          } else {
            tokens.push(<span key={`${keyCounter}-${subCounter}-text`} className="select-text">{subPart}</span>);
          }
        }
      }
    }

    return (
      <div key={idx} className="min-h-[1.5rem] whitespace-pre select-text">
        {tokens}
      </div>
    );
  });
}
