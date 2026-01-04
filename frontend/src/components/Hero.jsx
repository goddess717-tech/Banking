import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import MOCK_USER from "../helper/mockuser";
import dayjs from "dayjs";

export default function Hero() {
  const [showBalance, setShowBalance] = useState(true);
  const [user] = useState(MOCK_USER);

  // Count-up animation
  const target = 7356300.86;
  const [displayValue, setDisplayValue] = useState(0);

  const today = dayjs().format('MMM D, YYYY')

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const step = 16;

    const increment = target / (duration / step);

    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setDisplayValue(start);
    }, step);

    return () => clearInterval(interval);
  }, []);

  // Format with commas
  const formattedBalance = displayValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#050D1F] via-[#071633] to-[#0A2242] text-white py-8 shadow-xl">

      {/* Soft depth glow */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none" />

      {/* Sparkles / energy */}
      <div className="absolute -top-10 left-1/3 w-40 h-40 bg-teal-400/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute top-1/2 right-10 w-32 h-32 bg-blue-400/10 blur-2xl rounded-full animate-ping" />

      <div className="relative mx-auto max-w-7xl px-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* LEFT — Greeting */}
        <div className="space-y-1">
          <p className="text-white/80 text-sm flex items-center gap-1">Good morning,</p>

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight uppercase">
            {user.otherName}
          </h1>

          <p className="text-[12px] text-white/60">Today is {today}</p>

          {/* Intelligent spending insight */}
          <p className="text-teal-300/80 text-[11px] font-medium mt-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" />
            Spending trend ↑12% this month
          </p>
        </div>

        {/* RIGHT — Balance */}
      
<div className="
  relative flex items-center gap-4
  px-6 py-5 rounded-3xl
  bg-white/15 backdrop-blur-xl
  border border-white/20 shadow-2xl
  overflow-hidden
  transition-all  w-[300px]
">

  {/* Asymmetric Apple-style highlight */}
  <div className="absolute -top-10 right-0 w-40 h-40 bg-white/25 blur-3xl rounded-full pointer-events-none" />
  <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-300/20 blur-3xl rounded-full pointer-events-none" />

  {/* Subtle inner glass stroke */}
  <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />

  <div className="relative z-10">
    <p className="text-[10px] uppercase tracking-wide text-white/70">
      Total Balance
    </p>

    {/* Number container */}
    <div aria-live="polite" className="text-3xl font-semibold relative">

      {/* Glow behind number */}
      <span className="absolute inset-0 blur-xl bg-white/10 rounded-xl animate-pulse" />

      {/* Count-up OR hidden */}
      {showBalance ? formattedBalance : "•••••••••"}
    </div>

    <p className="text-[10px] uppercase tracking-wide text-white/70 text-right">
      Available
    </p>
  </div>

  {/* Hide/Show Button */}
  <button
    onClick={() => setShowBalance(prev => !prev)}
    aria-label={showBalance ? "Hide balance" : "Show balance"}
    className="
      relative z-10
      p-2 rounded-xl
      bg-white/20 hover:bg-white/25
      transition-all backdrop-blur-md
      border border-white/20
    "
  >
    {showBalance ? (
      <EyeOff className="w-5 h-5" />
    ) : (
      <Eye className="w-5 h-5" />
    )}
  </button>
</div>

      </div>
    </section>
  );
}
