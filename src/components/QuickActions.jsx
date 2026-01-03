
import React, { useState } from "react";
import { ACTIONS } from "../helper/actions";

export default  function QuickActions() {
    const [qaExpanded, setQaExpanded] = useState(false);

    const visible = qaExpanded
      ? ACTIONS
      : ACTIONS.slice(0, 8); // show 8 by default (clean fintech standard)

    return (
      <section className="card p-5 md:p-6 rounded-2xl bg-white/60 dark:bg-ink-900/40 shadow-lg backdrop-blur-sm border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Quick Actions
          </h3>

          {ACTIONS.length > 8 && (
            <button
              onClick={() => setQaExpanded(v => !v)}
              className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              {qaExpanded ? "Less" : "More"}
            </button>
          )}
        </div>

        {/* Responsive Grid — NO JS */}
        <div
          className="
          grid gap-4
          grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8
        "
        >
          {visible.map(({ id, label, Icon }) => (
            <button
              key={id}
              aria-label={label}
              className="
              group flex flex-col items-center justify-center
              p-4 rounded-xl
              bg-white/70 dark:bg-ink-800/60
              backdrop-blur-sm border border-ink dark:border-ink-700
              shadow-sm hover:shadow-md transition-all
              hover:-translate-y-[2px] active:scale-95
            "
            >
              <div
                className="
                p-3 rounded-lg
                bg-slate-100 dark:bg-black/10
                shadow-sm mb-3 flex items-center justify-center
                transition-colors
                group-hover:bg-teal-50/80 dark:group-hover:bg-teal-900/20
              "
              >
                <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>

              <span
                className="
                text-xs font-medium tracking-wide text-slate-700 dark:text-slate-200
                text-center leading-tight
              "
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Smooth expansion animation */}
        <div className={`${qaExpanded ? "mt-4" : ""} transition-all`} />
      </section>
    );
  }