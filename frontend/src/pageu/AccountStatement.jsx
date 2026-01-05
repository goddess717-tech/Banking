import { useMemo } from "react";
import { ALL_TRANSACTIONS, resolveStatus } from "../data/transaction.data";

const TARGET_AVAILABLE_BALANCE = 7_356_300.86;

export default function AccountStatement() {
  /* ---------------------------------------
     STEP 1: Resolve final statuses
  --------------------------------------- */
  const resolvedTxs = useMemo(() => {
    return ALL_TRANSACTIONS.map(tx => ({
      ...tx,
      finalStatus: resolveStatus(tx.status, tx.date),
    }));
  }, []);

  /* ---------------------------------------
     STEP 2: Calculate opening balance
     (reverse-engineered so final balance matches)
  --------------------------------------- */
  const settledDelta = resolvedTxs.reduce((sum, tx) => {
    if (tx.finalStatus === "Completed") {
      return sum + tx.amount;
    }
    return sum;
  }, 0);

  const OPENING_BALANCE = TARGET_AVAILABLE_BALANCE - settledDelta;

  /* ---------------------------------------
     STEP 3: Build ledger + available balances
  --------------------------------------- */
  const statementRows = useMemo(() => {
    let ledger = OPENING_BALANCE;
    let available = OPENING_BALANCE;

    return [...resolvedTxs]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(tx => {
        ledger += tx.amount;

        if (tx.finalStatus === "Completed") {
          available += tx.amount;
        }

        return {
          ...tx,
          ledgerBalance: Number(ledger.toFixed(2)),
          availableBalance: Number(available.toFixed(2)),
        };
      })
      .reverse();
  }, [resolvedTxs, OPENING_BALANCE]);

  /* ---------------------------------------
     UI HELPERS
  --------------------------------------- */
  const money = v =>
    v.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  const dateFmt = iso =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  /* ---------------------------------------
     RENDER
  --------------------------------------- */
  return (
    <section className="p-6 bg-white rounded-xl border flex flex-col h-full overflow-hidden">
      <h1 className="text-xl font-semibold mb-4">Account Statement</h1>

      {/* BALANCE HEADER */}
      <div className="mb-6 p-4 rounded-lg bg-slate-50 border">
        <div className="text-sm text-slate-500">Available Balance</div>
        <div className="text-3xl font-bold">
          {money(statementRows[0]?.availableBalance ?? TARGET_AVAILABLE_BALANCE)}
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100 text-xs uppercase text-slate-600">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-right">Ledger Balance</th>
              <th className="p-3 text-right">Available Balance</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {statementRows.map(tx => (
              <tr key={tx.id} className="border-b text-sm">
                <td className="p-3">{dateFmt(tx.date)}</td>

                <td className="p-3">
                  <div className="font-medium">{tx.title}</div>
                  <div className="text-xs text-slate-500">
                    {tx.ref} · {tx.note}
                  </div>
                </td>

                <td
                  className={`p-3 text-right font-semibold ${
                    tx.amount < 0 ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {money(tx.amount)}
                </td>

                <td className="p-3 text-right font-mono">
                  {money(tx.ledgerBalance)}
                </td>

                <td className="p-3 text-right font-mono">
                  {money(tx.availableBalance)}
                </td>

                <td className="p-3">
                  <span className="text-xs font-medium">
                    {tx.finalStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
