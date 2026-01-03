import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SAMPLE_TRANSACTIONS from "../helper/mocktransactions";
import { Info, X, Receipt, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Tabs = ["all", "sent", "received"];

const CategoryColors = {
  "Food & Drink": "bg-emerald-50 text-emerald-700",
  Transport: "bg-sky-50 text-sky-700",
  Income: "bg-green-50 text-green-700",
  Transfer: "bg-indigo-50 text-indigo-700",
  Utilities: "bg-amber-50 text-amber-700",
  Entertainment: "bg-violet-50 text-violet-700",
  Interest: "bg-emerald-50 text-emerald-700",
  default: "bg-slate-50 text-slate-700",
};

function CategoryChip({ c }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-[11px] font-semibold ${CategoryColors[c] || CategoryColors.default
        }`}
    >
      {c}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = status.toLowerCase();
  if (s === "completed")
    return (
      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">
        Completed
      </span>
    );
  if (s === "pending")
    return (
      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">
        Pending
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
      Failed
    </span>
  );
}

const PAGE_SIZE = 8;

export default function TransactionsPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [drawerTx, setDrawerTx] = useState(null);

  const filtered = useMemo(() => {
    return SAMPLE_TRANSACTIONS.filter((tx) => {
      const q = search.toLowerCase();

      const matchesSearch =
        tx.title.toLowerCase().includes(q) ||
        tx.ref.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q);

      const isSent = tx.amount < 0;
      const isReceived = tx.amount > 0;

      if (tab === "sent" && !isSent) return false;
      if (tab === "received" && !isReceived) return false;

      return matchesSearch;
    });
  }, [search, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const prettyDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.15,
      },
    },
  };

  // Slide + fade preset generator
  const slide = (x = 0, y = 20) => ({
    hidden: { opacity: 0, x, y },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  });

  return (

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-slate-50 dark:bg-ink-900 text-slate-100 antialiased">
      <Header />

      <div className="flex pt-[100px]">
        <Sidebar />
        <motion.div variants={slide(0, 250)}>
          <main className="min-w-0 pl-[300px] w-full p-6">
            {/* TITLE */}
            <h1 className="text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-300">Transactions</h1>

            {/* TABS */}
            <div className="flex gap-4 mb-6">
              {Tabs.map((t) => {
                const count =
                  t === "all"
                    ? SAMPLE_TRANSACTIONS.length
                    : t === "sent"
                      ? SAMPLE_TRANSACTIONS.filter((x) => x.amount < 0).length
                      : SAMPLE_TRANSACTIONS.filter((x) => x.amount > 0).length;

                const active = tab === t;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      setTab(t);
                      setPage(1);
                    }}
                    className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${active
                        ? "bg-[#0F5F7F]"
                        : "dark:bg-white/10 bg-black/10 border dark:border-white/10 border-black/10 hover:bg-[#0F5F7F] text-slate-700 dark:text-slate-300"}
                  `}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)} ({count})
                  </button>
                );
              })}
            </div>

            {/* SEARCH */}
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search transactions..."
              className="px-4 py-2 rounded-lg dark:bg-white/10 bg-black/10 border dark:border-white/10 border-black/10 w-80 mb-6"
            />

            {/* TABLE HEADER */}
            <div className="
            hidden md:grid grid-cols-5 gap-4 px-4 py-2
            text-sm text-slate-700 dark:text-slate-300 border-b dark:border-white/10 border-black/15
          ">
              <div>To / From</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Type</div>
              <div>Status</div>
            </div>

            {/* TRANSACTION LIST */}
            <div className="mt-2 space-y-3">
              {paginated.map((tx) => {
                const initials = tx.title
                  .split(" ")
                  .slice(0, 2)
                  .map((s) => s[0])
                  .join("")
                  .toUpperCase();

                const isDebit = tx.amount < 0;

                return (
                  <div
                    key={tx.id}
                    onClick={() => setDrawerTx(tx)}
                    className="
                    grid grid-cols-1 md:grid-cols-5 gap-4 items-center
                    dark:bg-white/5 bg-black/5 hover:bg-white/10 border dark:border-white/10
                    border-black/10
                    p-4 rounded-xl cursor-pointer transition
                  "
                  >
                    {/* TO/FROM */}
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-10 h-10 rounded-lg bg-slate-700/40 flex justify-center items-center font-semibold">
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300">{tx.title}</p>
                        <p className="text-xs text-slate-400">{tx.ref}</p>
                      </div>
                    </div>

                    {/* AMOUNT */}
                    <div
                      className={`font-semibold ${isDebit ? "text-red-400" : "text-emerald-400"
                        }`}
                    >
                      {isDebit ? "-" : "+"}
                      {Math.abs(tx.amount).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </div>

                    {/* DATE */}
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      {prettyDate(tx.date)}
                    </div>

                    {/* TYPE */}
                    <div>
                      <CategoryChip c={tx.category} />
                    </div>

                    {/* STATUS */}
                    <div>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 dark:bg-white/10  bg-black/10 rounded hover:bg-white/20 disabled:opacity-40 text-slate-700 dark:text-slate-300"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`
                  px-3 py-1 rounded
                  ${page === i + 1
                      ? "bg-[#0F5F7F] text-white"
                      : "bg-white/10 hover:bg-white/20"}
                `}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 dark:bg-white/10  bg-black/10 rounded hover:bg-white/20 disabled:opacity-40 text-slate-700 dark:text-slate-300"
              >
                Next
              </button>
            </div>
          </main>
        </motion.div>


        {/* DRAWER */}
        <motion.div variants={slide(250, 0)}>

        <AnimatePresence>
          {drawerTx && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex justify-end bg-black/30 backdrop-blur-sm"
            >
              <motion.aside
                initial={{ x: 400 }}
                animate={{ x: 0 }}
                exit={{ x: 400 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="w-[380px] h-full bg-slate-50 dark:bg-ink-900 border-l border-white/10 p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Receipt className="w-5 h-5 text-emerald-400" />
                    Transaction Details
                  </h2>

                  <button
                    onClick={() => setDrawerTx(null)}
                    className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>


                </div>


                <p className="text-lg font-medium mt-16 mb-1 text-slate-700 dark:text-slate-300">{drawerTx.title}</p>
                <p className="text-slate-700 dark:text-slate-300 text-xs mb-6">{drawerTx.ref}</p>

                <div
                  className={`text-3xl font-bold mb-6 ${drawerTx.amount < 0 ? "text-red-400" : "text-emerald-400"
                    }`}
                >
                  {drawerTx.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-4 h-4 " />
                    {prettyDate(drawerTx.date)}
                  </div>

                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    Category: <CategoryChip c={drawerTx.category} />
                  </div>

                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    Status: <StatusBadge status={drawerTx.status} />
                  </div>
                </div>

                <hr className="my-6 dark:border-white/10 border-black/15" />

                <h3 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Notes</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-6 ">{drawerTx.note}</p>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>

      </div>
    </motion.div>
  );
}
