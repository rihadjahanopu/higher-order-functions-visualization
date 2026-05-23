"use client";

import React, { useState } from "react";
import { ShoppingCart, Plus, Trash2, ArrowRight, DollarSign, Percent, Filter, HelpCircle } from "lucide-react";
import CodeBlock from "./CodeBlock";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  cartId: number;
}

const PRODUCTS: Product[] = [
  { id: "laptop", name: "MacBook Pro", price: 999 },
  { id: "phone", name: "iPhone 15", price: 699 },
  { id: "headphones", name: "Sony Headphones", price: 199 },
  { id: "book", name: "Eloquent JavaScript", price: 15 },
];

const VANILLA_CODE = `// Real-world: E-commerce cart processing
const cart = [
  { name: 'Laptop', price: 999, category: 'Electronics' },
  { name: 'Book', price: 15, category: 'Education' },
  { name: 'Headphones', price: 199, category: 'Electronics' }
];

// map: Transform data (get prices with tax)
const pricesWithTax = cart.map(item => ({
  ...item,
  priceWithTax: item.price * 1.1
}));

// filter: Select specific items
const electronics = cart.filter(item => item.category === 'Electronics');

// reduce: Aggregate values
const total = cart.reduce((sum, item) => sum + item.price, 0);
`;

const REACT_CODE = `"use client";

import React, { useState } from "react";

interface CartItem {
  cartId: number;
  name: string;
  price: number;
}

export default function CartDemo() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. map: Add 10% tax and format
  const pricesWithTax = cart.map(item => ({
    ...item,
    priceWithTax: (item.price * 1.1).toFixed(2)
  }));

  // 2. filter: Show items costing over $100
  const expensiveItems = cart.filter(item => item.price > 100);

  // 3. reduce: Calculate order subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  
  const average = cart.length > 0 ? subtotal / cart.length : 0;
}
`;

export default function CartDemo() {
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = () => {
    const product = PRODUCTS.find((p) => p.id === selectedProductId);
    if (product) {
      setCart((prev) => [...prev, { ...product, cartId: Date.now() }]);
    }
  };

  const handleRemoveFromCart = (cartId: number) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // HOF Operations
  // 1. map
  const withTax = cart.map((item) => ({
    ...item,
    priceWithTax: (item.price * 1.1).toFixed(2),
  }));

  // 2. filter
  const expensiveItems = cart.filter((item) => item.price > 100);

  // 3. reduce
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const avgPrice = cart.length > 0 ? total / cart.length : 0;

  return (
    <section className="mb-16 scroll-mt-24" id="array-methods">
      {/* Title & Description */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/50 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <ShoppingCart size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            1. Array Methods (map, filter, reduce)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            The fundamental trio of JavaScript functional programming. They accept callbacks to transform, select, or compile array data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive Demo */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>🛒</span> Interactive Cart Calculator
            </h3>

            {/* Inputs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-850 hover:border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm"
              >
                {PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} (${prod.price})
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-98"
                >
                  <Plus size={16} /> Add
                </button>
                <button
                  onClick={handleClearCart}
                  disabled={cart.length === 0}
                  className="flex items-center justify-center px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 text-slate-300 disabled:text-slate-500 rounded-xl font-semibold text-sm transition-all active:scale-98"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Cart Display */}
            <div className="mt-6 bg-slate-950/80 border border-slate-900 rounded-2xl p-4 min-h-[160px] flex flex-col justify-between">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <ShoppingCart size={32} className="text-slate-700 mb-2 animate-pulse" />
                  <p className="text-slate-550 text-xs font-mono max-w-[280px]">
                    Cart is empty. Add items above to trigger higher-order operations!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
                      Item List ({cart.length})
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Live State
                    </span>
                  </div>
                  <ul className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <li
                        key={item.cartId}
                        className="flex items-center justify-between bg-slate-900/80 hover:bg-slate-850/80 border border-slate-800/50 px-3.5 py-2.5 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span className="text-slate-200 text-xs sm:text-sm font-medium">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-mono text-xs sm:text-sm font-semibold">
                            ${item.price}
                          </span>
                          <button
                            onClick={() => handleRemoveFromCart(item.cartId)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* HOF Output Analytics */}
            {cart.length > 0 && (
              <div className="mt-5 border-t border-slate-800/85 pt-5 space-y-4">
                <h4 className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                  ⚡ Higher-Order Operations Summary
                </h4>
                
                {/* 1. MAP output */}
                <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                    <Percent size={14} />
                    <span>map() transform (Price + 10% tax)</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 max-h-[80px] overflow-y-auto pr-1">
                    {withTax.map((item) => (
                      <div key={item.cartId} className="flex justify-between py-0.5">
                        <span>{item.name}</span>
                        <span className="text-indigo-300">
                          ${item.price} <ArrowRight size={10} className="inline mx-1 text-slate-600" /> ${item.priceWithTax}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. FILTER output */}
                <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-pink-400">
                    <Filter size={14} />
                    <span>filter() subset (Expensive items &gt; $100)</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200">
                    {expensiveItems.length === 0 ? (
                      <span className="text-slate-550 italic text-[11px]">No items over $100</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 mt-0.5">
                        {expensiveItems.map((item) => (
                          <span
                            key={item.cartId}
                            className="text-[10px] font-mono bg-pink-500/10 border border-pink-500/20 text-pink-300 px-2 py-0.5 rounded-md"
                          >
                            {item.name} (${item.price})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. REDUCE output */}
                <div className="bg-gradient-to-br from-slate-950 to-indigo-950/20 border border-indigo-950/30 rounded-2xl p-4 grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                      reduce() total
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-emerald-400 font-mono mt-0.5 flex items-center">
                      <DollarSign size={18} />
                      {total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-slate-900 pl-4">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                      average price
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-slate-200 font-mono mt-0.5 flex items-center">
                      <DollarSign size={18} />
                      {avgPrice.toFixed(2)}
                    </span>
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
            title="array-processing-pipeline.ts"
          />
        </div>
      </div>
    </section>
  );
}
