import { useState, useMemo } from "react";
import { Download, Search, ChevronDown } from "lucide-react";

const MOCK_TRANSACTIONS = Array.from({ length: 240 }, (_, i) => {
  const credit = i % 3 === 0;
  const amount = (Math.random() * 900 + 20).toFixed(2);
  return {
    id: `TX-${100000 + i}`,
    date: new Date(Date.now() - i * 86400000).toISOString(),
    description: credit ? "Salary Payment" : "Card Purchase – Amazon",
    type: credit ? "Credit" : "Debit",
    amount: credit ? amount : `-${amount}`,
    balance: (8200 - i * 12.43).toFixed(2),
    status: "Completed",
    channel: credit ? "Transfer" : "Card",
  };
});

export default function AccountStatementPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 12;

  const filtered = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(tx => {
      const matchQuery = tx.description
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchType = typeFilter === "All" || tx.type === typeFilter;
      return matchQuery && matchType;
    });
  }, [query, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <section className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Account Statements</h1>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
            <Download size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Account" value="Checking •••• 4821" />
        <SummaryCard label="Available Balance" value="$8,245.22" />
        <SummaryCard label="Statement Period" value="Last 3 Months" />
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search transactions"
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>

        <div className="relative">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="appearance-none px-4 py-2 border rounded-lg text-sm pr-8"
          >
            <option>All</option>
            <option>Credit</option>
            <option>Debit</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-right px-4 py-3">Balance</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(tx => (
              <tr key={tx.id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">{tx.description}</td>
                <td className={`px-4 py-3 font-medium ${tx.type === "Credit" ? "text-emerald-600" : "text-rose-600"}`}>
                  {tx.type}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{tx.amount}</td>
                <td className="px-4 py-3 text-right tabular-nums">{tx.balance}</td>
                <td className="px-4 py-3">{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-sm text-slate-500">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-500 mt-10">
        This statement is generated electronically and is valid without a signature.
      </p>
    </section>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="border rounded-xl p-4 bg-white">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
