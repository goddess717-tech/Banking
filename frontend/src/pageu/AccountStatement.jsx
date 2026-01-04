import { useState, useMemo } from "react";
import { 
  Download, 
  Search, 
  ChevronDown, 
  Calendar,
  Filter,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
  X,
  Receipt,
  Clock,
  Building2
} from "lucide-react";

const AMOUNT_RULES = {
  salary:       { min: 8_000,  max: 50_000,  type: "Credit", channel: "ACH" },
  transfer:     { min: 500,    max: 250_000, type: "Both",   channel: "Wire" },
  purchase:     { min: 10,     max: 2_500,   type: "Debit",  channel: "Card" },
  subscription: { min: 5,      max: 120,     type: "Debit",  channel: "Card" },
  withdrawal:   { min: 20,     max: 1_000,   type: "Debit",  channel: "ATM" },
  refund:       { min: 5,      max: 5_000,   type: "Credit", channel: "ACH" },
  payment:      { min: 30,     max: 5_000,   type: "Debit",  channel: "ACH" }
};

const CATEGORY_META = {
  salary: {
    merchants: ["Apex Holdings Inc"],
    descriptions: [
      "ACH Payroll Credit – Apex Holdings Inc",
      "Direct Deposit – Monthly Salary"
    ]
  },
  purchase: {
    merchants: ["Amazon", "Apple", "Costco", "Star Market", "Coffee & Co"],
    descriptions: [
      "Card Purchase"
    ]
  },
  subscription: {
    merchants: ["Netflix", "Microsoft 365"],
    fixedAmounts: {
      Netflix: 15.99,
      "Microsoft 365": 9.99
    },
    descriptions: [
      "Subscription Billing"
    ]
  },
  transfer: {
    merchants: ["External Account"],
    descriptions: [
      "Domestic Wire Transfer",
      "ACH Transfer"
    ]
  },
  withdrawal: {
    merchants: ["Chase ATM", "Bank of America ATM"],
    descriptions: [
      "ATM Cash Withdrawal"
    ]
  },
  refund: {
    merchants: ["Amazon", "Apple"],
    descriptions: [
      "Card Refund"
    ]
  },
  payment: {
    merchants: ["Comcast", "Con Edison"],
    descriptions: [
      "Bill Payment"
    ]
  }
};



const randomBetween = (min, max) =>
  Number((Math.random() * (max - min) + min).toFixed(2));

const resolveStatus = (iso) => {
  const hours = (Date.now() - new Date(iso)) / 36e5;
  if (hours < 24) return "Pending";
  return Math.random() > 0.03 ? "Completed" : "Failed";
};

const RAW_TRANSACTIONS = Array.from({ length: 240 }, (_, i) => {
  const categories = Object.keys(AMOUNT_RULES);
  const category = categories[i % categories.length];
  const rule = AMOUNT_RULES[category];
  const meta = CATEGORY_META[category];

  const merchant =
    meta.merchants[Math.floor(Math.random() * meta.merchants.length)];

  const description =
    category === "purchase"
      ? `Card Purchase – ${merchant}`
      : meta.descriptions[Math.floor(Math.random() * meta.descriptions.length)];

  const date = new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString();

  let amount;

  // Subscription = fixed pricing
  if (category === "subscription") {
    amount = meta.fixedAmounts[merchant];
  } else {
    amount = randomBetween(rule.min, rule.max);
  }

  const isCredit =
    rule.type === "Credit" ||
    (rule.type === "Both" && Math.random() > 0.5);

  return {
    id: `TXN-${100000000 + i}`,
    date,
    description,
    merchant,
    category,
    type: isCredit ? "Credit" : "Debit",
    channel: rule.channel,
    amount: isCredit ? amount : -amount,
    status: resolveStatus(date)
  };
});






export default function AccountStatementPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("3months");
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState(null);

const TARGET_AVAILABLE_BALANCE = 7_356_300.00;

const settledTotals = RAW_TRANSACTIONS.reduce(
  (acc, tx) => {
    if (tx.status === "Completed") {
      if (tx.amount > 0) acc.credits += tx.amount;
      else acc.debits += Math.abs(tx.amount);
    }
    return acc;
  },
  { credits: 0, debits: 0 }
);

const OPENING_BALANCE =
  TARGET_AVAILABLE_BALANCE - (settledTotals.credits - settledTotals.debits);


const TRANSACTIONS_WITH_BALANCE = (() => {
  let runningBalance = OPENING_BALANCE;
  let availableBalance = OPENING_BALANCE;

  return [...RAW_TRANSACTIONS]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(tx => {
      // Ledger balance always moves
      runningBalance += tx.amount;

      // Available balance only moves for completed txns
      if (tx.status === "Completed") {
        availableBalance += tx.amount;
      }

      return {
        ...tx,
        ledgerBalance: Number(runningBalance.toFixed(2)),
        availableBalance: Number(availableBalance.toFixed(2))
      };
    })
    .reverse();
})();

  

  const PAGE_SIZE = 15;

  const dateRangeFiltered = useMemo(() => {
    const now = Date.now();
    const ranges = {
      '7days': 7 * 24 * 60 * 60 * 1000,
      '30days': 30 * 24 * 60 * 60 * 1000,
      '3months': 90 * 24 * 60 * 60 * 1000,
      '6months': 180 * 24 * 60 * 60 * 1000,
      'all': Infinity
    };

    



    return TRANSACTIONS_WITH_BALANCE.filter(tx => {
      const txDate = new Date(tx.date).getTime();
      return now - txDate <= ranges[dateRange];
    });
  }, [dateRange]);

  const filtered = useMemo(() => {
    return dateRangeFiltered.filter(tx => {
      const matchQuery = 
        tx.description.toLowerCase().includes(query.toLowerCase()) ||
        tx.id.toLowerCase().includes(query.toLowerCase()) ||
        tx.merchant.toLowerCase().includes(query.toLowerCase());
      const matchType = typeFilter === "All" || tx.type === typeFilter;
      const matchStatus = statusFilter === "All" || tx.status === statusFilter;
      return matchQuery && matchType && matchStatus;
    });
  }, [dateRangeFiltered, query, typeFilter, statusFilter]);

 


  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const summary = useMemo(() => {
  const settled = filtered.filter(tx => tx.status === "Completed");

  const totalCredit = settled
    .filter(tx => tx.amount > 0)
    .reduce((s, tx) => s + tx.amount, 0);

  const totalDebit = settled
    .filter(tx => tx.amount < 0)
    .reduce((s, tx) => s + Math.abs(tx.amount), 0);

  return {
    totalCredit,
    totalDebit,
    netChange: totalCredit - totalDebit,
  };
}, [filtered]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Type', 'Category', 'Amount', 'Balance', 'Status', 'Transaction ID'];
    const rows = filtered.map(tx => [
      new Date(tx.date).toLocaleDateString(),
      tx.description,
      tx.type,
      tx.category,
      tx.amount,
      tx.balance,
      tx.status,
      tx.id
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statement-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .statement-page {
          min-height: 100vh;
          background: linear-gradient(to bottom, #F8F9FA 0%, #E9ECEF 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
          padding: 32px 24px;
        }

        .statement-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 36px;
          font-weight: 900;
          color: #0F172A;
          letter-spacing: -1px;
          margin-bottom: 8px;
        }

        .page-subtitle {
          font-size: 16px;
          color: #64748B;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn {
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.3);
        }

        .btn-secondary {
          background: #FFFFFF;
          color: #334155;
          border: 1.5px solid #CBD5E1;
        }

        .btn-secondary:hover {
          background: #F8FAFC;
          border-color: #94A3B8;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .summary-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .summary-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .summary-value {
          font-size: 28px;
          font-weight: 900;
          color: #0F172A;
          font-variant-numeric: tabular-nums;
          letter-spacing: -1px;
        }

        .summary-value.positive {
          color: #059669;
        }

        .summary-value.negative {
          color: #DC2626;
        }

        .summary-change {
          font-size: 13px;
          font-weight: 600;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filters-section {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 16px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1.5px solid #CBD5E1;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          color: #0F172A;
          background: #F8FAFC;
          transition: all 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #0F172A;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1);
        }

        .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #CBD5E1;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #0F172A;
          background: #F8FAFC;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 40px;
        }

        .form-select:focus {
          outline: none;
          border-color: #0F172A;
          background-color: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1);
        }

        .transactions-section {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .transactions-header {
          padding: 20px 24px;
          background: linear-gradient(to bottom, #F8FAFC 0%, #F1F5F9 100%);
          border-bottom: 2px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .transactions-title {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .transactions-count {
          padding: 4px 12px;
          background: #0F172A;
          color: #FFFFFF;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
        }

        .transactions-table thead {
          background: #F8FAFC;
          border-bottom: 2px solid #E2E8F0;
        }

        .transactions-table th {
          padding: 16px 20px;
          text-align: left;
          font-size: 12px;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .transactions-table th.text-right {
          text-align: right;
        }

        .transactions-table tbody tr {
          border-bottom: 1px solid #F1F5F9;
          transition: all 0.15s;
          cursor: pointer;
        }

        .transactions-table tbody tr:hover {
          background: #F8FAFC;
        }

        .transactions-table tbody tr:last-child {
          border-bottom: none;
        }

        .transactions-table td {
          padding: 18px 20px;
          font-size: 14px;
          color: #334155;
        }

        .tx-date {
          font-weight: 600;
          color: #0F172A;
        }

        .tx-time {
          font-size: 12px;
          color: #94A3B8;
          margin-top: 2px;
        }

        .tx-description {
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 4px;
        }

        .tx-merchant {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
        }

        .tx-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .tx-type-credit {
          background: #D1FAE5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .tx-type-debit {
          background: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }

        .tx-amount {
          font-size: 16px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          text-align: right;
        }

        .tx-amount.credit {
          color: #059669;
        }

        .tx-amount.debit {
          color: #0F172A;
        }

        .tx-balance {
          font-size: 14px;
          font-weight: 700;
          color: #334155;
          font-variant-numeric: tabular-nums;
          text-align: right;
        }

        .tx-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
        }

        .tx-status-completed {
          background: #D1FAE5;
          color: #065F46;
        }

        .tx-status-pending {
          background: #FEF3C7;
          color: #92400E;
        }

        .mobile-tx-list {
          display: none;
        }

        .mobile-tx-card {
          padding: 20px;
          border-bottom: 1px solid #F1F5F9;
          transition: all 0.2s;
        }

        .mobile-tx-card:hover {
          background: #F8FAFC;
        }

        .mobile-tx-card:last-child {
          border-bottom: none;
        }

        .mobile-tx-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .mobile-tx-amount {
          font-size: 20px;
          font-weight: 900;
          font-variant-numeric: tabular-nums;
        }

        .mobile-tx-details {
          display: grid;
          gap: 8px;
        }

        .mobile-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .mobile-detail-label {
          color: #64748B;
          font-weight: 600;
        }

        .mobile-detail-value {
          color: #0F172A;
          font-weight: 700;
        }

        .pagination {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 2px solid #F1F5F9;
        }

        .pagination-info {
          font-size: 14px;
          font-weight: 600;
          color: #64748B;
        }

        .pagination-controls {
          display: flex;
          gap: 8px;
        }

        .pagination-btn {
          padding: 10px 16px;
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #E2E8F0;
          border-color: #94A3B8;
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          gap: 6px;
        }

        .page-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid transparent;
        }

        .page-number:hover {
          background: #F8FAFC;
        }

        .page-number.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }

        .statement-footer {
          margin-top: 32px;
          padding: 24px;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          text-align: center;
        }

        .footer-text {
          font-size: 13px;
          color: #64748B;
          line-height: 1.8;
        }

        .footer-legal {
          font-size: 11px;
          color: #94A3B8;
          margin-top: 12px;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .statement-page {
            padding: 20px 16px;
          }

          .page-title {
            font-size: 28px;
          }

          .header-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .summary-value {
            font-size: 24px;
          }

          .table-wrapper {
            display: none;
          }

          .mobile-tx-list {
            display: block;
          }

          .pagination {
            flex-direction: column;
            gap: 16px;
          }

          .page-numbers {
            display: none;
          }
        }
      `}</style>

      <div className="statement-page">
        <div className="statement-container">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Account Statements</h1>
            <p className="page-subtitle">View and export your complete transaction history</p>
            
            {/* <div className="header-actions">
              <button className="btn btn-secondary" onClick={exportCSV}>
                <Download size={18} />
                Export CSV
              </button>
              <button className="btn btn-secondary">
                <FileText size={18} />
                Export PDF
              </button>
              <button className="btn btn-primary">
                <RefreshCw size={18} />
                Refresh
              </button>
            </div> */}
          </div>

          {/* Summary Cards */}
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-label">
                <Building2 size={16} />
                Account Balance
              </div>
              <div className="summary-value">
                ${TRANSACTIONS_WITH_BALANCE[0]?.availableBalance.toLocaleString()}
              </div>
              <div className="summary-change" style={{ color: '#059669' }}>
                <TrendingUp size={14} />
                Active
              </div>
            </div>

            {/* <div className="summary-card">
              <div className="summary-label">
                <ArrowDownLeft size={16} />
                Total Spent
              </div>
              <div className="summary-value negative">
                {formatCurrency(summary.totalDebit)}
              </div>
              <div className="summary-change" style={{ color: '#64748B' }}>
                {filtered.filter(tx => tx.amount < 0).length} transactions
              </div>
            </div> */}

            {/* <div className="summary-card">
              <div className="summary-label">
                <ArrowUpRight size={16} />
                Total Received
              </div>
              <div className="summary-value positive">
                +{formatCurrency(summary.totalCredit)}
              </div>
              <div className="summary-change" style={{ color: '#64748B' }}>
                {filtered.filter(tx => tx.amount > 0).length} transactions
              </div>
            </div> */}

            {/* <div className="summary-card">
              <div className="summary-label">
                <TrendingUp size={16} />
                Net Change
              </div>
              <div className={`summary-value ${summary.netChange >= 0 ? 'positive' : 'negative'}`}>
                {summary.netChange >= 0 ? '+' : ''}{formatCurrency(summary.netChange)}
              </div>
              <div className="summary-change" style={{ color: '#64748B' }}>
                This period
              </div>
            </div> */}
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filters-grid">
              {/* <div className="input-wrapper">
                <Search size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search transactions, merchants, or IDs..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div> */}

              {/* <select
                className="form-select"
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  setPage(1);
                }}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="all">All Time</option>
              </select> */}

              {/* <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Types</option>
                <option value="Credit">Credit Only</option>
                <option value="Debit">Debit Only</option>
              </select> */}

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="transactions-section">
            <div className="transactions-header">
              <div className="transactions-title">
                <Receipt size={20} />
                Transaction History
                {/* <span className="transactions-count">{filtered.length}</span> */}
              </div>
            </div>

            {/* Desktop Table */}
            <div className="table-wrapper">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((tx) => (
                    <tr key={tx.id} onClick={() => setSelectedTx(tx)}>
                      <td>
                        <div className="tx-date">{formatDate(tx.date)}</div>
                        <div className="tx-time">{tx.time}</div>
                      </td>
                      <td>
                        <div className="tx-description">{tx.description}</div>
                        <div className="tx-merchant">{tx.channel} • {tx.id}</div>
                      </td>
                      <td>
                        <span className={`tx-type-badge ${tx.type === 'Credit' ? 'tx-type-credit' : 'tx-type-debit'}`}>
                          {tx.type === 'Credit' ? (
                            <ArrowDownLeft size={12} />
                          ) : (
                            <ArrowUpRight size={12} />
                          )}
                          {tx.type}
                        </span>
                      </td>
                      <td>
                        <div className={`tx-amount ${tx.amount > 0 ? 'credit' : 'debit'}`}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                        </div>
                      </td>
                      <td>
                        <div className="tx-balance">${tx.ledgerBalance.toLocaleString()}</div>
                      </td>
                      <td>
                        <span className={`tx-status ${tx.status === 'Completed' ? 'tx-status-completed' : 'tx-status-pending'}`}>
                          {tx.status === 'Completed' ? <Check size={12} /> : <Clock size={12} />}
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="mobile-tx-list">
              {paginated.map((tx) => (
                <div key={tx.id} className="mobile-tx-card" onClick={() => setSelectedTx(tx)}>
                  <div className="mobile-tx-details">
                <div className="mobile-detail-row">
                  <span className="mobile-detail-label">Type</span>
                  <span className={`tx-type-badge ${tx.type === 'Credit' ? 'tx-type-credit' : 'tx-type-debit'}`}>
                    {tx.type}
                  </span>
                </div>
                <div className="mobile-detail-row">
                  <span className="mobile-detail-label">Description</span>
                  <span className="mobile-detail-value">{tx.description}</span>
                </div>
                <div className="mobile-detail-row">
                  <span className="mobile-detail-label">Amount</span>
                  <span className={`tx-amount ${tx.amount > 0 ? 'credit' : 'debit'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </span>
                </div>
                <div className="mobile-detail-row">
                  <span className="mobile-detail-label">Balance</span>
                  <span className="mobile-detail-value">${tx.ledgerBalance.toLocaleString()}</span>
                </div>
                <div className="mobile-detail-row">
                  <span className="mobile-detail-label">Status</span>
                  <span className={`tx-status ${tx.status === 'Completed' ? 'tx-status-completed' : 'tx-status-pending'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          {/* <div className="pagination-info">
            Showing {((page - 1) * PAGE_SIZE) + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} 
            of {filtered.length} transactions
          </div> */}

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`page-number ${page === pageNum ? 'active' : ''}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="pagination-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="statement-footer">
        <div className="footer-text">
          This statement is generated electronically and is valid without a signature. For any discrepancies or inquiries, please contact New Apex Bank customer service at 1-800-NEW-APEX or support@newapex.bank.
        </div>
        <div className="footer-legal">
          © 2025 New Apex Bank. All rights reserved. Member FDIC. Equal Housing Lender. Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.
        </div>
      </div> */}
    </div>
  </div>
</>
  )
}