// components/FavoriteAccounts.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useInViewOnce } from "../utils/viewonce.js";
import { MOCK_ACCOUNTS } from "../helper/mockaccount.js";
import { currency } from "../utils/format.js";

export default function FavoriteAccounts() {
  const [ref, inView] = useInViewOnce();

  // FIX: Start closed on page load
  const [open, setOpen] = useState(false);

  const [accounts] = useState(MOCK_ACCOUNTS);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="card p-6 rounded-2xl mt-6 shadow-premium dark:bg-ink-900/40"
    >
      {/* Header */}
      <header
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-lg font-semibold tracking-tight text-slate-700 dark:text-slate-300">Accounts</h3>
        <ChevronDown
          className={`w-5 h-5 text-slate-700 dark:text-slate-300 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </header>

      {/* Account List */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="fav-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-3 pt-3"
          >
            {accounts.map((acc) => {
              const isGoal = !!acc.goal;
              const pct = isGoal
                ? Math.min(100, Math.round((acc.goal.saved / acc.goal.target) * 100))
                : null;

              return (
                <motion.div
                  key={acc.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="p-4 rounded-xl card-hover bg-white/25 dark:bg-white/5 
                             backdrop-blur-xl shadow-glass flex items-center justify-between"
                >
                  {/* Left Block */}
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Icon Capsule */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium shadow-inner"
                      style={{ background: acc.accent }}
                    >
                      <acc.Icon className="w-6 h-6" />
                    </div>

                    {/* Snippet Left */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate text-slate-700 dark:text-slate-300">{acc.name}</span>
                        <span className="text-xs text-slate-400">•• {acc.suffix}</span>
                      </div>

                      <span className="text-[13px] text-slate-500 block mt-0.5 truncate">
                        {acc.type}
                      </span>

                      {/* Goal Progress */}
                      {isGoal && (
                        <div className="mt-2">
                          <div className="progress-track h-2 w-full">
                            <div
                              className="progress-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {currency(acc.goal.saved)} / {currency(acc.goal.target)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Block: Balance */}
                  <div className="text-right min-w-[110px]">
                    <div
                      className={`text-base font-bold ${
                        acc.balance < 0 ? "text-loss" : "text-profit"
                      }`}
                    >
                      {currency(acc.balance)}
                    </div>

                    <span className="text-xs text-slate-500">Available</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
