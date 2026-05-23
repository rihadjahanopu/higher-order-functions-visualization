# 🚀 JS/TS Higher-Order Functions (HOF) Visualizer

An immersive, interactive, and high-fidelity educational dashboard designed to demystify and demonstrate the power of JavaScript/TypeScript **Higher-Order Functions (HOFs)**. Master closures, functional composition, rate limiting, and asynchronous execution control through real-time animated simulations and side-by-side implementations.

---

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

---

## Live Link
[Higher-Order Functions Visualizer](https://higher-order-functions-visualizatio.vercel.app)

## 📋 Table of Contents
1. [📖 What is a Higher-Order Function?](#-what-is-a-higher-order-function)
2. [✨ Key Features & UX Design](#-key-features--ux-design)
3. [⚡ Interactive Demos Matrix](#-interactive-demos-matrix)
4. [🛠️ Deep-Dive into the 11 Patterns](#-deep-dive-into-the-11-patterns)
5. [⚙️ Architecture & Folder Structure](#%EF%B8%8F-architecture--folder-structure)
6. [🚀 Quick Start & Development](#-quick-start--development)
7. [📜 License](#-license)

---

## 📖 What is a Higher-Order Function?

In mathematics and computer science, a **Higher-Order Function (HOF)** is a function that does at least one of the following:
1.  **Takes one or more functions as arguments** (e.g., callbacks, array iterators).
2.  **Returns a function as its result** (e.g., generators, decorators, curried chains).

### The Math Behind HOFs
$$f: (X \to Y) \to Z \quad \text{or} \quad f: X \to (Y \to Z)$$

### Code Example
```typescript
// 1. Receiving a function (Callback abstraction)
const repeat = (n: number, action: (i: number) => void) => {
  for (let i = 0; i < n; i++) action(i);
};

// 2. Returning a function (Closure multiplier factory)
const multiplyBy = (factor: number) => {
  return (value: number) => value * factor;
};
const triple = multiplyBy(3);
console.log(triple(10)); // 30
```

---

## ✨ Key Features & UX Design

This visualizer is not just a collection of code snippets. It is a premium, interactive simulation suite built with:
*   **Vibrant Glassmorphism Design**: Rich dark-mode aesthetics utilizing HSL-tailored color accents, deep shadow borders, and translucent cards.
*   **Ambient Animation System**: Custom Tailwind v4 animations including glowing badges, pulsating timers, and float paths.
*   **Sticky Scrollspy Navigation**: A responsive sidebar/header that highlights the current topic as you scroll, topped by an active reading progress bar.
*   **Interactive Simulation Engines**: Real-time canvas triggers, exponential timers, cooldown progress meters, and dynamic text composition flow.
*   **Dual-Tabs Code Viewer**: Instantly toggle between pure JavaScript code and modern React/TypeScript configurations.

---

## ⚡ Interactive Demos Matrix

| # | HOF Pattern | Type Signature | Primary Interface Control | Practical Industry Use Case |
|---|-------------|----------------|---------------------------|-----------------------------|
| 1 | **Array HOFs** | `(A[], A->B) -> B[]` | Shopping cart list compiler | E-commerce total computation |
| 2 | **Composition** | `(...(A->A)) -> (A->A)` | Text transformer pipeline | Data sanitizer / compile chains |
| 3 | **Factories** | `(A) -> (() -> B)` | Multi-state counter modules | Isolated configurations & stores |
| 4 | **Debounce** | `(fn, delay) -> debouncedFn` | Type delay interactive console | Search input autocomplete queries |
| 5 | **Middleware** | `(...fns) -> handler` | Middleware execution path simulator | Express.js / Next.js request pipelines |
| 6 | **Memoize** | `(fn) -> memoizedFn` | Fibonacci calc step comparisons | Caching heavy reports & queries |
| 7 | **Currying** | `(A, B, C) -> A->B->C` | Closure layers builder log | Structured logger builders |
| 8 | **Once Guard** | `(fn) -> singleFireFn` | Side-by-side checkout test buttons | Preventing duplicate payment requests |
| 9 | **Throttle** | `(fn, limit) -> throttledFn` | Laser/Rocket shooter triggers | Rate-limiting event handlers / scroll |
| 10| **Retry Backoff** | `(fn, retries) -> promise` | Flaky network simulation node | Resilient API gateways / microservices |
| 11| **Decorator** | `(fn) -> auditedFn` | Math performance console logs | Application telemetry & execution audit |

---

## 🛠️ Deep-Dive into the 11 Patterns

### 1. Array HOFs (`CartDemo`)
*   **Mechanism**: Chain `.filter()` (to discard items), `.map()` (to apply discounts), and `.reduce()` (to compile totals).
*   **Visualizer**: A list showing items inside a shopping cart. Add items or adjust discounts and see the step-by-step pipeline execute live calculations.

### 2. Function Composition (`PipelineDemo`)
*   **Mechanism**: A composition pipeline that chains functions sequentially:
    $$\text{input} \xrightarrow{f_1} x_1 \xrightarrow{f_2} x_2 \xrightarrow{f_3} \text{output}$$
*   **Visualizer**: An interactive chain of transformation boxes where you can select, order, and preview the state of text as it traverses functions.

### 3. Closures & Factories (`FactoryDemo`)
*   **Mechanism**: A factory function returning a closure that captures local state:
    ```javascript
    const createCounter = (incrementStep) => {
      let count = 0; // Private state
      return () => { count += incrementStep; return count; };
    };
    ```
*   **Visualizer**: Spawn independent counter widgets that operate with isolated closure scopes.

### 4. Debounced Search (`SearchDemo`)
*   **Mechanism**: Delays execution of a callback until a certain timeout passes without any new triggers.
*   **Visualizer**: An input bar featuring a dynamic milliseconds radial dial that resets with every keypress. Shows active keystroke dispatch vs debounced output.

### 5. Middleware Pipeline (`MiddlewareDemo`)
*   **Mechanism**: Mimics Express middleware execution, passing control via a `next()` callback function down a pipeline of handlers.
    ```
    Request ──► [Logger] ──► [Auth] ──► [Rate Limit] ──► Response
    ```
*   **Visualizer**: A visual queue list of middleware functions. Execute requests and watch the highlights transition through each block sequentially.

### 6. Fibonacci Memoization (`MemoizeDemo`)
*   **Mechanism**: Wraps a recursive Fibonacci calculator, using a key-value object to cache precalculated values.
*   **Visualizer**: Comparison panels showing the number of steps and milliseconds taken for non-cached calculations vs instantly retrieved cached calculations.

### 7. Function Currying (`CurryDemo`)
*   **Mechanism**: Transforms a function with multiple parameters into a chain of unary (single-argument) functions:
    $$f(a, b, c) \iff f(a)(b)(c)$$
*   **Visualizer**: Visual building blocks where you lock parameters (Level → System → Message) step-by-step to view the resulting partial execution.

### 8. Once Wrapper (`OnceDemo`)
*   **Mechanism**: Wraps a critical function, returning a handler that executes the target function exactly once and skips all subsequent attempts:
    ```javascript
    const once = (fn) => {
      let called = false;
      return (...args) => {
        if (!called) { called = true; return fn(...args); }
      };
    };
    ```
*   **Visualizer**: Comparison UI comparing a raw checkout action with a protected `once` wrapper, tracking execution failure metrics.

### 9. Throttling (`ThrottleDemo`)
*   **Mechanism**: Caps execution rate, ignoring incoming triggers inside a cooldown window.
*   **Visualizer**: A shooter interface. Fire actions quickly to view immediate execution, followed by a locked cooldown indicator bar that blocks trigger spam.

### 10. Retry with Exponential Backoff (`RetryDemo`)
*   **Mechanism**: Retries failed async tasks, doubling delay durations dynamically after each error:
    $$\text{delay} = \text{initialDelay} \times 2^{\text{retryCount}}$$
*   **Visualizer**: Configurable failure simulator featuring an active timeline tracker highlighting fetch retries, success indicators, and backoff times.

### 11. Performance Decorator (`DecoratorDemo`)
*   **Mechanism**: Extends functionality (runtime metrics logging) without mutating the target function:
    ```javascript
    const auditPerformance = (fn) => {
      return (...args) => {
        const start = performance.now();
        const result = fn(...args);
        const duration = performance.now() - start;
        console.log(`Executed in ${duration}ms`);
        return result;
      };
    };
    ```
*   **Visualizer**: An integrated IDE terminal panel showing live telemetry metrics for audited math functions.

---

## ⚙️ Architecture & Folder Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # HTML shell, page metadata, Geist font config
│   │   ├── page.tsx           # Home entrypoint compiling layout components
│   │   └── globals.css        # Tailwind v4 configuration, theme variables & animations
│   ├── components/
│   │   ├── Navbar.tsx         # Floating scroll-spy navigation header
│   │   ├── Footer.tsx         # Footer component with links
│   │   ├── HeroSection.tsx    # Header with title and stats tags
│   │   ├── FloatingShapes.tsx # Decorative particle background canvas
│   │   ├── CodeBlock.tsx      # Code preview component with copy functionality
│   │   ├── CartDemo.tsx       # Demo 1 - Array Iteration (map/filter/reduce)
│   │   ├── PipelineDemo.tsx   # Demo 2 - Functional Pipe & Composition
│   │   ├── FactoryDemo.tsx    # Demo 3 - Stateful Closure Factory
│   │   ├── SearchDemo.tsx     # Demo 4 - Search Debouncing
│   │   ├── MiddlewareDemo.tsx # Demo 5 - Request Middleware Chain
│   │   ├── MemoizeDemo.tsx    # Demo 6 - Fibonacci Memoization
│   │   ├── CurryDemo.tsx      # Demo 7 - Nested Currying Application
│   │   ├── OnceDemo.tsx       # Demo 8 - Action Blocker Guard
│   │   ├── ThrottleDemo.tsx   # Demo 9 - Execution Rate Throttle
│   │   ├── RetryDemo.tsx      # Demo 10 - Async Backoff Retry
│   │   └── DecoratorDemo.tsx  # Demo 11 - Telemetry Decorator Auditor
```

---

## 🚀 Quick Start & Development

Ensure you have [Node.js](https://nodejs.org) installed on your system (version 18 or above recommended).

### 1. Clone the project and install packages:
```bash
npm install
```

### 2. Run the hot-reloading development server:
```bash
npm run dev
```

### 3. Open the visualizer locally:
Visit [http://localhost:3000](http://localhost:3000) inside your web browser.

### 4. Build and typecheck for production:
```bash
npm run build
```

---

## 📜 License
This application is open-source and licensed under the [MIT License](LICENSE).
