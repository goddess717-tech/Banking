import React, { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { ALL_TRANSACTIONS, TOTAL_TRANSACTIONS, resolveStatus } from "../data/transaction.data";

/* -----------------------------
   CONFIG
----------------------------- */
const PAGE_SIZE = 10;





const STATUS_STYLES = {
  Completed: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-600/20",
  },
  Pending: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-600/20",
  },
  Reversed: {
    bg: "bg-slate-500/10",
    text: "text-slate-600",
    border: "border-slate-600/20",
  },
  Failed: {
    bg: "bg-red-500/10",
    text: "text-red-600",
    border: "border-red-600/20",
  },
};










/* -----------------------------
   MOCK DATA
----------------------------- */







/* -----------------------------
   UTILITIES
----------------------------- */
const money = (v) =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const dateFmt = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/* -----------------------------
   DRAWER
----------------------------- */
function TransactionDrawer({ tx, onClose }) {
  if (!tx) return null;

  const debit = tx.amount < 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Transaction Details</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                debit ? "bg-red-100" : "bg-emerald-100"
              }`}
            >
              {debit ? (
                <ArrowDownLeft className="text-red-500" />
              ) : (
                <ArrowUpRight className="text-emerald-600" />
              )}
            </div>
            <div>
              <div className="font-medium">{tx.title}</div>
              <div className="text-xs text-gray-500">{tx.ref}</div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <Row label="Amount">{money(tx.amount)}</Row>
            <Row label="Status">{tx.status}</Row>
            <Row label="Date">{dateFmt(tx.date)}</Row>
            <Row label="Note">{tx.note}</Row>
          </div>
        </div>
      </aside>
    </>
  );
}

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-500">{label}</span>
    <span>{children}</span>
  </div>
);

/* -----------------------------
   MAIN PAGE
----------------------------- */
export default function Transactions() {
  const [page, setPage] = useState(1);
  const [activeTx, setActiveTx] = useState(null);

  const totalPages = Math.ceil(TOTAL_TRANSACTIONS / PAGE_SIZE);

  const pageData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return ALL_TRANSACTIONS.slice(start, start + PAGE_SIZE);
  }, [page]);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <section className="p-4 sm:p-6 bg-white rounded-xl border">
        <h1 className="text-xl font-semibold mb-4">Transactions</h1>

        {/* LIST */}
        <div className="space-y-2">
          {pageData.map((tx) => {
            const debit = tx.amount < 0;
      const finalStatus = resolveStatus(tx.status, tx.date);
const statusStyle = STATUS_STYLES[finalStatus];





            return (
              <div
                key={tx.id}
                onClick={() => setActiveTx(tx)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      debit ? "bg-red-100" : "bg-emerald-100"
                    }`}
                  >
                    {debit ? (
                      <ArrowDownLeft className="text-red-500" />
                    ) : (
                      <ArrowUpRight className="text-emerald-600" />
                    )}
                  </div>

                  <div>
                    <div className="font-medium">{tx.title}</div>
                    <div className="text-xs text-gray-500">
                      {tx.ref} · {dateFmt(tx.date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span
                    className={`font-semibold ${
                      debit ? "text-red-500" : "text-emerald-600"
                    }`}
                  >
                    {money(tx.amount)}
                  </span>
                  <span
  className={`text-xs px-2 py-1 rounded-full border font-medium
    ${statusStyle.bg}
    ${statusStyle.text}
    ${statusStyle.border}
  `}
>
  {finalStatus}
</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 border rounded disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          {pages.slice(Math.max(0, page - 3), page + 2).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded border ${
                p === page ? "bg-gradient-to-br from-[#050D1F] via-[#071633] to-[#0A2242] text-white" : ""
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 border rounded disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      </section>

      <TransactionDrawer tx={activeTx} onClose={() => setActiveTx(null)} />
    </>
  );
}
