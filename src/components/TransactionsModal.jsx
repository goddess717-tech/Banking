// ShowAllTransactions.jsx
import { useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

// Generate realistic mock data (40 items = 4 pages)
const MOCK_TRANSACTIONS = Array.from({ length: 40 }).map((_, i) => ({
  id: i + 1,
  merchant: ["Amazon", "Uber", "Netflix", "Spotify", "Apple", "Bolt"][i % 6],
  ref: `TX-${10000 + i}`,
  desc: ["Online payment", "Subscription", "Ride fare", "Food order"][i % 4],
  category: ["Shopping", "Transport", "Entertainment", "Bills"][i % 4],
  status: ["Completed", "Pending", "Failed"][i % 3],
  amount: (Math.random() * 300 * (i % 2 ? 1 : -1)).toFixed(2),
  date: new Date(Date.now() - i * 86400000).toISOString()
}));

export default function ShowAllTransactions({
  onClose,
  page,
  setPage,
}) {

  const maxPage = Math.ceil(MOCK_TRANSACTIONS.length / PAGE_SIZE);

  const paginatedTx = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return MOCK_TRANSACTIONS.slice(start, start + PAGE_SIZE);
  }, [page]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-ink-900 rounded-2xl w-full max-w-2xl shadow-xl p-6 relative" style={{height:'50vh'}}>

        {/* Header */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black dark:hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold mb-4">All Transactions</h2>

        {/* LIST */}
        <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">

          {paginatedTx.map(tx => {
            const credit = Number(tx.amount) > 0;

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-ink-800 rounded-xl border dark:border-ink-700"
              >
                {/* Left */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">{tx.merchant}</span>
                    <span className="text-xs text-gray-400 truncate">{tx.ref}</span>
                  </div>

                  <div className="text-xs text-gray-500 truncate">{tx.desc}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(tx.date).toLocaleString()}
                  </div>
                </div>

                {/* Right */}
                <div className="text-right">
                  <div className={`font-semibold text-sm ${credit ? "text-emerald-600" : "text-red-600"}`}>
                    {credit ? "+" : ""}{tx.amount}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                    tx.status === "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : tx.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}

        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between mt-6">
          <button
            className="flex items-center gap-1 text-sm px-3 py-2 rounded-md bg-gray-100 dark:bg-ink-700 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <div className="text-sm font-medium">
            Page {page} / {maxPage}
          </div>

          <button
            className="flex items-center gap-1 text-sm px-3 py-2 rounded-md bg-gray-100 dark:bg-ink-700 disabled:opacity-40"
            disabled={page === maxPage}
            onClick={() => setPage(prev => prev + 1)}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
