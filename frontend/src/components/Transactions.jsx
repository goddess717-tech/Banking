// components/TransactionsPreview.jsx
import React, { useMemo, useState } from "react";
import { Info, Download, Eye, ChevronRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";


/**
 * Production-ready TransactionsPreview
 * - Self-contained sample data (falls back if you pass `transactions` prop)
 * - Matches the dashboard screenshot style: initials avatar, subtitle, timestamp, ref
 * - Category chips + status badges
 * - Amounts color-coded and formatted
 * - Row hover, subtle lift, accessible focus states
 * - Detail drawer with receipt download
 *
 * Usage:
 * <TransactionsPreview transactions={MOCK_TRANSACTIONS} onShowAll={() => navigate("/transactions")} />
 */

/* ---------------------------
   Utilities & sample dataset
   --------------------------- */
const currencyFmt = (v) =>
  v == null
    ? "-"
    : v.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const prettyDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const SAMPLE_TRANSACTIONS = [
  { id: "tx_1001", title: "Star Market", ref: "SM-8347", note: "Weekly groceries", category: "Food & Drink", status: "Completed", amount: -4222.95, date: "2025-11-16T12:22:00Z" },
  { id: "tx_1005", title: "Coffee & Co", ref: "CFC-21", note: "Espresso", category: "Food & Drink", status: "Completed", amount: -45.5, date: "2025-11-16T01:50:00Z" },
  { id: "tx_1003", title: "Uber", ref: "UB-9932", note: "Ride to office", category: "Transport", status: "Completed", amount: -150.74, date: "2025-11-15T16:05:00Z" },
  { id: "tx_1002", title: "Acme Payroll", ref: "PAY-1123", note: "Salary Nov", category: "Income", status: "Completed", amount: 250000.0, date: "2025-11-15T03:12:00Z" },
  { id: "tx_1006", title: "GlobalX Transfer", ref: "GX-7789", note: "Rent payment", category: "Transfer", status: "Completed", amount: -3000.0, date: "2025-11-14T08:00:00Z" },
  { id: "tx_1004", title: "Recur Energy", ref: "RN-556", note: "Electricity bill", category: "Utilities", status: "Pending", amount: -12000.0, date: "2025-11-14T04:30:00Z" },
  { id: "tx_1007", title: "Interest Payment", ref: "INT-90", note: "Savings interest", category: "Interest", status: "Completed", amount: 15000.64, date: "2025-11-13T00:00:00Z" },
  { id: "tx_1008", title: "Netflix", ref: "NF-3092", note: "Monthly subscription", category: "Entertainment", status: "Completed", amount: -99.99, date: "2025-11-12T20:05:00Z" }
];

/* Small color mapping for categories */
const CATEGORY_COLORS = {
  "Food & Drink": "bg-emerald-700/10 text-emerald-300",
  Transport: "bg-sky-700/10 text-sky-300",
  Income: "bg-emerald-700/10 text-emerald-300",
  Transfer: "bg-indigo-700/10 text-indigo-300",
  Utilities: "bg-amber-700/10 text-amber-300",
  Entertainment: "bg-violet-700/10 text-violet-300",
  Interest: "bg-emerald-700/10 text-emerald-300",
  default: "bg-slate-700/10 text-slate-300",
};

/* ---------------------------
   Small UI atoms
   --------------------------- */
function CategoryChip({ label }) {
  const cls = CATEGORY_COLORS[label] || CATEGORY_COLORS.default;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>{label}</span>;
}

function StatusBadge({ status }) {
  if (status === "Completed") return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">Completed</span>;
  if (status === "Pending") return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">Pending</span>;
  return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">Failed</span>;
}


/* ---------------------------
   Main component
   --------------------------- */
export default function TransactionsPreview({ transactions = SAMPLE_TRANSACTIONS, onShowAll = () => {} }) {
  const [drawerTx, setDrawerTx] = useState(null);

  const preview = useMemo(() => {
    // show most recent by date
    return (transactions || SAMPLE_TRANSACTIONS).slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  }, [transactions]);

  return (
    <>
      <section className="card p-5 rounded-2xl bg-white/6 dark:bg-ink-800/60 border border-white/6 shadow-card">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title text-slate-700 dark:text-slate-300">Recent Activity</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* <button
              onClick={() => {
                // quick export of preview
                const rows = preview.map(t => ({ id: t.id, title: t.title, ref: t.ref, date: t.date, amount: t.amount, status: t.status, category: t.category }));
                const keys = Object.keys(rows[0] || {});
                const csv = [keys.join(","), ...rows.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `transactions-preview-${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="icon-btn text-slate-700 dark:text-slate-300"
              title="Export preview"
            >
              <Download className="w-4 h-4" />
            </button> */}
          </div>
        </div>

        {/* list */}
        <ul className="space-y-3">
          {preview.map(tx => {
            const isDebit = Number(tx.amount) < 0;

            return (
              <li
                key={tx.id}
                tabIndex={0}
                onDoubleClick={() => setDrawerTx(tx)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/3 dark:bg-ink-800/50 hover:shadow-lg transition transform-gpu hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 border-b
    border-ink dark:border-white/10 text-slate-700 dark:text-slate-300"
                aria-labelledby={`tx-${tx.id}-label`}
              >
                {/* left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
  className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0
    ${isDebit ? "bg-red-500/10" : "bg-emerald-500/10"}`}
  aria-hidden
>
  {isDebit ? (
    <ArrowDownLeft className="w-5 h-5 text-red-400" strokeWidth={2.2} />
  ) : (
    <ArrowUpRight className="w-5 h-5 text-emerald-400 drop-shadow-sm" />

  )}
</div>


                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div id={`tx-${tx.id}-label`} className="truncate font-medium text-sm">{tx.title}</div>
                      <div className="text-xs text-slate-400 truncate">{tx.ref}</div>
                    </div>

                    <div className="text-xs text-slate-500 truncate max-w-xs">{tx.note}</div>

                    <div className="text-xs text-slate-400 mt-1">
                      {prettyDate(tx.date)}
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className="flex flex-col items-end ml-4 gap-2">
                  <div className={`font-semibold text-sm ${isDebit ? "text-red-400" : "text-emerald-400"}`}>
                    {isDebit ? "-" : "+"}{Math.abs(tx.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* <div className="mr-1"><CategoryChip label={tx.category} /></div>x */}
                    <div><StatusBadge status={tx.status} /></div>

                    <button
                      aria-label="Details"
                      onClick={() => setDrawerTx(tx)}
                      className="p-1 rounded-md text-slate-300 hover:text-white focus:outline-none"
                      title="Open details"
                    >
                      <Info className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* <button onClick={onShowAll} className="text-sm text-emerald-400 hover:underline flex items-center justify-center gap-2 mt-6 w-full">
              Show all <ChevronRight size={16} />
            </button> */}
      </section>
    </>
  );
}
