import { useEffect, useState } from "react";

const STEPS = {
  FORM: "FORM",
  REVIEW: "REVIEW",
  RESULT: "RESULT"
};

export default function TransferPage() {
  const [step, setStep] = useState(STEPS.FORM);
  const [loading, setLoading] = useState(false);

  const [fromAccount] = useState({
    id: "acc_001",
    balance: 250000
  });

  const [recipient, setRecipient] = useState({
    accountNumber: "",
    bankName: "",
    bankCode: "",
    accountName: "",
    verified: false
  });

  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  /* ----------------------------------
     ACCOUNT RESOLUTION
  -----------------------------------*/
  const resolveAccount = async (accountNumber) => {
    if (accountNumber.length !== 10) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/resolve-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber })
      });

      const data = await res.json();

      if (!data.valid) {
        throw new Error("Account not found");
      }

      setRecipient({
        accountNumber,
        bankName: data.bankName,
        bankCode: data.bankCode,
        accountName: data.accountName,
        verified: true
      });
    } catch {
      setRecipient({
        accountNumber,
        bankName: "",
        bankCode: "",
        accountName: "",
        verified: false
      });
      setError("Unable to verify account");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     SUBMIT TRANSFER
  -----------------------------------*/
  const submitTransfer = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId: fromAccount.id,
          toAccountNumber: recipient.accountNumber,
          toBankCode: recipient.bankCode,
          amount: Number(amount),
          narration
        })
      });

      const data = await res.json();
      setResult(data);
      setStep(STEPS.RESULT);
    } catch {
      setError("Transfer failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     VALIDATION
  -----------------------------------*/
  const canProceed =
    recipient.verified &&
    Number(amount) > 0 &&
    Number(amount) <= fromAccount.balance;

  /* ----------------------------------
     UI
  -----------------------------------*/
  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-6">Transfer</h1>

      {step === STEPS.FORM && (
        <>
          {/* FROM */}
          <section className="mb-6">
            <div className="text-sm text-gray-500">From</div>
            <div className="flex justify-between items-center mt-1">
              <span>Main Account</span>
              <span className="font-mono">
                ₦{fromAccount.balance.toLocaleString()}
              </span>
            </div>
          </section>

          {/* RECIPIENT */}
          <section className="mb-6">
            <label className="text-sm">Account Number</label>
            <input
              type="text"
              maxLength={10}
              className="w-full border rounded px-3 py-2 mt-1"
              value={recipient.accountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setRecipient({ ...recipient, accountNumber: value });
                if (value.length === 10) resolveAccount(value);
              }}
            />

            {loading && <div className="text-sm mt-1">Verifying…</div>}

            {recipient.verified && (
              <div className="mt-2 text-sm">
                <div className="font-medium">{recipient.accountName}</div>
                <div className="text-gray-500">{recipient.bankName}</div>
              </div>
            )}
          </section>

          {/* AMOUNT */}
          <section className="mb-6">
            <label className="text-sm">Amount</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mt-1 text-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {Number(amount) > fromAccount.balance && (
              <div className="text-sm text-red-600 mt-1">
                Insufficient balance
              </div>
            )}
          </section>

          {/* NARRATION */}
          <section className="mb-6">
            <label className="text-sm">Narration (optional)</label>
            <input
              className="w-full border rounded px-3 py-2 mt-1"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </section>

          {error && <div className="text-red-600 mb-4">{error}</div>}

          <button
            disabled={!canProceed}
            onClick={() => setStep(STEPS.REVIEW)}
            className="w-full bg-black text-white py-3 rounded disabled:opacity-40"
          >
            Continue
          </button>
        </>
      )}

      {step === STEPS.REVIEW && (
        <>
          <h2 className="font-medium mb-4">Review Transfer</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>To</span>
              <span>{recipient.accountName}</span>
            </div>
            <div className="flex justify-between">
              <span>Bank</span>
              <span>{recipient.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount</span>
              <span className="font-mono">₦{Number(amount).toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Transfers cannot be reversed once completed.
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(STEPS.FORM)}
              className="flex-1 border py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={submitTransfer}
              className="flex-1 bg-black text-white py-2 rounded"
            >
              Confirm
            </button>
          </div>
        </>
      )}

      {step === STEPS.RESULT && result && (
        <>
          <h2 className="font-medium mb-4">Transfer Submitted</h2>

          <div className="space-y-2 text-sm">
            <div>Status: {result.status}</div>
            <div>Reference: {result.reference}</div>
            <div>Date: {new Date(result.createdAt).toLocaleString()}</div>
          </div>
        </>
      )}
    </div>
  );
}
