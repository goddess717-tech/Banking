import { useState, useMemo } from 'react';
import { 
  Download, 
  ChevronRight, 
  X,
  Calendar,
  Hash,
  MapPin,
  FileText,
  Copy,
  Check,
  Receipt,
  Clock,
  Building2,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  MoreVertical,
  Share2,
  AlertCircle
} from 'lucide-react';

const SAMPLE_TRANSACTIONS = [
  { 
    id: "TXN2025010112345", 
    title: "Apple Store", 
    ref: "APL-8347-2025", 
    note: "MacBook Pro 16-inch M3 Max", 
    category: "Electronics", 
    status: "Completed", 
    amount: -2499.00, 
    date: "2025-01-01T14:22:00Z", 
    merchant: "Apple Inc.", 
    merchantId: "MERCHANT_APL_001",
    location: "Fifth Avenue, New York, NY 10022",
    paymentMethod: "New Apex Card ****4829",
    authCode: "AUTH-7829KL",
    description: "In-store purchase at Apple Retail"
  },
  { 
    id: "TXN2025010109876", 
    title: "Whole Foods Market", 
    ref: "WFM-2145-2025", 
    note: "Weekly grocery shopping", 
    category: "Groceries", 
    status: "Completed", 
    amount: -187.43, 
    date: "2025-01-01T10:15:00Z", 
    merchant: "Whole Foods Market", 
    merchantId: "MERCHANT_WFM_443",
    location: "Columbus Circle, New York, NY 10019",
    paymentMethod: "New Apex Card ****4829",
    authCode: "AUTH-9043MN",
    description: "Contactless payment"
  },
  { 
    id: "TXN2024123198765", 
    title: "Direct Deposit", 
    ref: "SAL-1123-2024", 
    note: "Monthly salary - December 2024", 
    category: "Income", 
    status: "Completed", 
    amount: 5750.00, 
    date: "2024-12-31T09:00:00Z", 
    merchant: "Acme Corporation", 
    merchantId: "EMPLOYER_ACM_001",
    location: "New York, NY",
    paymentMethod: "ACH Transfer",
    authCode: "ACH-DD-5750",
    description: "Bi-weekly payroll deposit"
  },
  { 
    id: "TXN2024123087654", 
    title: "Uber", 
    ref: "UBR-9932-2024", 
    note: "Ride to JFK Airport", 
    category: "Transportation", 
    status: "Completed", 
    amount: -52.30, 
    date: "2024-12-30T16:05:00Z", 
    merchant: "Uber Technologies Inc.", 
    merchantId: "MERCHANT_UBR_773",
    location: "Manhattan to JFK Airport, NY",
    paymentMethod: "New Apex Card ****4829",
    authCode: "AUTH-4421PR",
    description: "UberX ride"
  },
  { 
    id: "TXN2024122976543", 
    title: "Con Edison", 
    ref: "PWR-556-2024", 
    note: "Electric bill - December 2024", 
    category: "Utilities", 
    status: "Pending", 
    amount: -234.67, 
    date: "2024-12-29T08:30:00Z", 
    merchant: "Consolidated Edison", 
    merchantId: "UTILITY_CON_001",
    location: "New York, NY",
    paymentMethod: "Bank Transfer",
    authCode: "PENDING",
    description: "Monthly electricity service"
  },
  { 
    id: "TXN2024122865432", 
    title: "Landlord Properties LLC", 
    ref: "RNT-7789-2024", 
    note: "January 2025 rent payment", 
    category: "Housing", 
    status: "Completed", 
    amount: -2800.00, 
    date: "2024-12-28T08:00:00Z", 
    merchant: "Metropolitan Property Management", 
    merchantId: "LANDLORD_MPM_034",
    location: "New York, NY 10011",
    paymentMethod: "Bank Transfer",
    authCode: "ACH-RNT-2800",
    description: "Monthly rent - Unit 4B"
  },
  { 
    id: "TXN2024122754321", 
    title: "Interest Payment", 
    ref: "INT-9001-2024", 
    note: "Savings account interest", 
    category: "Income", 
    status: "Completed", 
    amount: 47.23, 
    date: "2024-12-27T00:01:00Z", 
    merchant: "New Apex Bank", 
    merchantId: "BANK_NAB_001",
    location: "New York, NY",
    paymentMethod: "Interest Credit",
    authCode: "INT-CREDIT",
    description: "Monthly savings interest at 2.5% APY"
  },
  { 
    id: "TXN2024122643210", 
    title: "Netflix", 
    ref: "NTX-3092-2024", 
    note: "Premium plan subscription", 
    category: "Entertainment", 
    status: "Completed", 
    amount: -22.99, 
    date: "2024-12-26T20:05:00Z", 
    merchant: "Netflix Inc.", 
    merchantId: "MERCHANT_NFX_892",
    location: "Los Gatos, CA",
    paymentMethod: "New Apex Card ****4829",
    authCode: "AUTH-1092NF",
    description: "Monthly subscription renewal"
  }
];

const CATEGORY_CONFIG = {
  "Electronics": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "📱" },
  "Groceries": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "🛒" },
  "Income": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "💰" },
  "Transportation": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "🚗" },
  "Utilities": { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: "⚡" },
  "Housing": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", icon: "🏠" },
  "Entertainment": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", icon: "🎬" },
  "default": { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: "📄" }
};

function CategoryChip({ label }) {
  const config = CATEGORY_CONFIG[label] || CATEGORY_CONFIG.default;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      <span>{config.icon}</span>
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const configs = {
    "Completed": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    "Pending": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    "Failed": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" }
  };
  const config = configs[status] || configs.Failed;
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}

function DetailsDrawer({ tx, onClose }) {
  const [copied, setCopied] = useState(null);

  if (!tx) return null;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadReceipt = () => {
    const content = `
═══════════════════════════════════════════════════
                   NEW APEX BANK
              Official Transaction Receipt
═══════════════════════════════════════════════════

TRANSACTION DETAILS
───────────────────────────────────────────────────
Transaction ID:    ${tx.id}
Reference Number:  ${tx.ref}
Authorization:     ${tx.authCode}

DATE & TIME
───────────────────────────────────────────────────
${formatDate(tx.date)}

MERCHANT INFORMATION
───────────────────────────────────────────────────
Merchant:          ${tx.merchant}
Merchant ID:       ${tx.merchantId}
Location:          ${tx.location}

PAYMENT DETAILS
───────────────────────────────────────────────────
Amount:            ${formatCurrency(tx.amount)}
Payment Method:    ${tx.paymentMethod}
Category:          ${tx.category}
Status:            ${tx.status}

DESCRIPTION
───────────────────────────────────────────────────
${tx.description}

Note: ${tx.note}

═══════════════════════════════════════════════════
This is an official receipt from New Apex Bank.
For inquiries, contact support@newapex.bank
Available 24/7 | 1-800-NEW-APEX

Generated: ${new Date().toLocaleString()}
═══════════════════════════════════════════════════
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${tx.ref}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareTransaction = () => {
    const text = `Transaction from ${tx.merchant}\nAmount: ${formatCurrency(tx.amount)}\nRef: ${tx.ref}`;
    if (navigator.share) {
      navigator.share({ title: 'Transaction Details', text });
    }
  };

  return (
    <>
      <style>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          z-index: 1000;
          animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .drawer-container {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 560px;
          background: #ffffff;
          box-shadow: -8px 0 40px rgba(0, 0, 0, 0.2);
          z-index: 1001;
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer-header {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #ffffff;
          padding: 32px 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .drawer-close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #ffffff;
        }

        .drawer-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .amount-hero {
          font-size: 56px;
          font-weight: 800;
          letter-spacing: -3px;
          font-variant-numeric: tabular-nums;
          margin: 24px 0 16px 0;
          line-height: 1;
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
        }

        .info-card {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          transition: all 0.2s;
        }

        .info-card:hover {
          background: #F3F4F6;
          border-color: #D1D5DB;
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #6B7280;
          margin-bottom: 10px;
        }

        .info-value {
          font-size: 15px;
          font-weight: 600;
          color: #0F172A;
          line-height: 1.5;
        }

        .copy-btn {
          padding: 6px 12px;
          background: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
        }

        .copy-btn:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
        }

        .copy-btn.copied {
          background: #D1FAE5;
          border-color: #A7F3D0;
          color: #059669;
        }

        .action-btn {
          width: 100%;
          padding: 16px 20px;
          background: #0F172A;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .action-btn:hover {
          background: #1E293B;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.3);
        }

        .action-btn:active {
          transform: translateY(0);
        }

        .action-btn-secondary {
          background: #F3F4F6;
          color: #0F172A;
          border: 1px solid #E5E7EB;
        }

        .action-btn-secondary:hover {
          background: #E5E7EB;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .support-banner {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          border-radius: 12px;
          padding: 20px;
          color: #ffffff;
          margin-top: 24px;
        }

        .support-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .support-text {
          font-size: 13px;
          line-height: 1.6;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .drawer-container {
            max-width: 100%;
          }

          .amount-hero {
            font-size: 44px;
          }

          .drawer-body {
            padding: 20px;
          }
        }
      `}</style>

      <div className="drawer-overlay" onClick={onClose} />
      
      <div className="drawer-container">
        <div className="drawer-header">
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>

          <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '8px' }}>
            Transaction Details
          </div>
          
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.5px' }}>
            {tx.merchant}
          </h2>
          
          <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>
            {tx.title}
          </p>

          <div className={`amount-hero ${tx.amount > 0 ? 'amount-positive' : 'amount-negative'}`} style={{ color: tx.amount > 0 ? '#10B981' : '#ffffff' }}>
            {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <StatusBadge status={tx.status} />
            <CategoryChip label={tx.category} />
          </div>
        </div>

        <div className="drawer-body">
          <div className="info-card">
            <div className="info-label">
              <Calendar size={14} />
              Date & Time
            </div>
            <div className="info-value">{formatDate(tx.date)}</div>
          </div>

          <div className="info-card">
            <div className="info-label">
              <Hash size={14} />
              Transaction ID
            </div>
            <div className="info-value" style={{ fontFamily: 'ui-monospace, monospace', fontSize: '13px', wordBreak: 'break-all' }}>
              {tx.id}
            </div>
            <button 
              className={`copy-btn ${copied === 'id' ? 'copied' : ''}`}
              onClick={() => copyToClipboard(tx.id, 'id')}
            >
              {copied === 'id' ? <Check size={14} /> : <Copy size={14} />}
              {copied === 'id' ? 'Copied!' : 'Copy ID'}
            </button>
          </div>

          <div className="info-card">
            <div className="info-label">
              <Hash size={14} />
              Reference Number
            </div>
            <div className="info-value">{tx.ref}</div>
            <button 
              className={`copy-btn ${copied === 'ref' ? 'copied' : ''}`}
              onClick={() => copyToClipboard(tx.ref, 'ref')}
            >
              {copied === 'ref' ? <Check size={14} /> : <Copy size={14} />}
              {copied === 'ref' ? 'Copied!' : 'Copy Reference'}
            </button>
          </div>

          <div className="info-card">
            <div className="info-label">
              <Building2 size={14} />
              Merchant Details
            </div>
            <div className="info-value" style={{ marginBottom: '6px' }}>
              {tx.merchant}
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
              ID: {tx.merchantId}
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">
              <MapPin size={14} />
              Location
            </div>
            <div className="info-value">{tx.location}</div>
          </div>

          <div className="info-card">
            <div className="info-label">
              <CreditCard size={14} />
              Payment Method
            </div>
            <div className="info-value">{tx.paymentMethod}</div>
          </div>

          <div className="info-card">
            <div className="info-label">
              <Clock size={14} />
              Authorization Code
            </div>
            <div className="info-value" style={{ fontFamily: 'ui-monospace, monospace', fontSize: '14px' }}>
              {tx.authCode}
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">
              <FileText size={14} />
              Description
            </div>
            <div className="info-value" style={{ marginBottom: '6px' }}>
              {tx.description}
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic' }}>
              {tx.note}
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <button className="action-btn" onClick={downloadReceipt}>
              <Receipt size={20} />
              Download Receipt
            </button>

            <button className="action-btn action-btn-secondary" onClick={shareTransaction}>
              <Share2 size={18} />
              Share Transaction
            </button>
          </div>

          <div className="support-banner">
            <div className="support-title">
              <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Need Help?
            </div>
            <div className="support-text">
              If you have questions about this transaction or notice any unauthorized activity, contact our support team immediately at 1-800-NEW-APEX or support@newapex.bank. We're available 24/7.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TransactionsPreview({ transactions = SAMPLE_TRANSACTIONS, onShowAll }) {
  const [selectedTx, setSelectedTx] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    let result = transactions || SAMPLE_TRANSACTIONS;
    
    if (searchTerm) {
      result = result.filter(tx => 
        tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.ref.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [transactions, searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) {
      const hours = Math.floor((now - d) / (1000 * 60 * 60));
      if (hours === 0) {
        const mins = Math.floor((now - d) / (1000 * 60));
        return `${mins}m ago`;
      }
      return `${hours}h ago`;
    }
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const exportCSV = () => {
    const rows = filteredTransactions.map(t => ({
      id: t.id,
      date: t.date,
      merchant: t.merchant,
      title: t.title,
      amount: t.amount,
      category: t.category,
      status: t.status,
      ref: t.ref
    }));
    
    const keys = Object.keys(rows[0] || {});
    const csv = [
      keys.join(','),
      ...rows.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalIncome = filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <>
      <style>{`
        .transactions-container {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #E5E7EB;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .tx-header-section {
          padding: 28px 28px 24px 28px;
          border-bottom: 1px solid #F3F4F6;
          background: linear-gradient(to bottom, #ffffff 0%, #F9FAFB 100%);
        }

        .tx-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .tx-main-title {
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .tx-main-subtitle {
          font-size: 14px;
          color: #6B7280;
        }

        .tx-header-actions {
          display: flex;
          gap: 10px;
        }

        .header-btn {
          padding: 10px 16px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-btn:hover {
          background: #F3F4F6;
          border-color: #D1D5DB;
          transform: translateY(-1px);
        }

        .header-btn-primary {
          background: #0F172A;
          color: #ffffff;
          border-color: #0F172A;
        }

        .header-btn-primary:hover {
          background: #1E293B;
        }

        .tx-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 16px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
          font-variant-numeric: tabular-nums;
        }

        .stat-value.positive {
          color: #059669;
        }

        .stat-value.negative {
          color: #DC2626;
        }

        .search-wrapper {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          background: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          font-size: 14px;
          color: #0F172A;
          transition: all 0.15s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          pointer-events: none;
        }

        .tx-list {
          padding: 0;
          margin: 0;
        }

        .tx-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px;
          border-bottom: 1px solid #F3F4F6;
          cursor: pointer;
          transition: all 0.15s;
          gap: 16px;
        }

        .tx-row:last-child {
          border-bottom: none;
        }

        .tx-row:hover {
          background: #F9FAFB;
        }

        .tx-row:active {
          background: #F3F4F6;
        }

        .tx-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 0;
        }

        .tx-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          border: 1px solid;
        }

        .tx-details {
          flex: 1;
          min-width: 0;
        }

        .tx-merchant {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tx-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #6B7280;
        }

        .tx-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .tx-amount-block {
          text-align: right;
        }

        .tx-amount {
          font-size: 16px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          margin-bottom: 4px;
        }

        .tx-amount.positive {
          color: #059669;
        }

        .tx-amount.negative {
          color: #0F172A;
        }

        .tx-category-small {
          font-size: 11px;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tx-chevron {
          color: #D1D5DB;
          transition: all 0.15s;
        }

        .tx-row:hover .tx-chevron {
          color: #9CA3AF;
          transform: translateX(4px);
        }

        .tx-empty {
          padding: 80px 28px;
          text-align: center;
        }

        .tx-empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: #F3F4F6;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9CA3AF;
        }

        .tx-empty-title {
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 8px;
        }

        .tx-empty-text {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.5;
        }

        .tx-footer {
          padding: 20px 28px;
          background: #F9FAFB;
          border-top: 1px solid #E5E7EB;
          display: flex;
          justify-content: center;
        }

        .show-all-btn {
          padding: 12px 24px;
          background: #0F172A;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .show-all-btn:hover {
          background: #1E293B;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.2);
        }

        @media (max-width: 1024px) {
          .tx-stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .tx-header-section {
            padding: 20px 16px;
          }

          .tx-title-row {
            flex-direction: column;
            gap: 16px;
          }

          .tx-header-actions {
            width: 100%;
            flex-direction: column;
          }

          .header-btn {
            width: 100%;
            justify-content: center;
          }

          .tx-stats-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .stat-card {
            padding: 14px;
          }

          .stat-value {
            font-size: 20px;
          }

          .tx-row {
            padding: 16px;
            gap: 12px;
          }

          .tx-left {
            gap: 12px;
          }

          .tx-icon {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }

          .tx-merchant {
            font-size: 14px;
          }

          .tx-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .tx-right {
            gap: 8px;
          }

          .tx-amount {
            font-size: 15px;
          }

          .tx-chevron {
            display: none;
          }

          .tx-footer {
            padding: 16px;
          }

          .show-all-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="transactions-container">
        <div className="tx-header-section">
          <div className="tx-title-row">
            <div>
              <h2 className="tx-main-title">Recent Transactions</h2>
              <p className="tx-main-subtitle">View and manage your account activity</p>
            </div>
            <div className="tx-header-actions">
              <button className="header-btn" onClick={exportCSV}>
                <Download size={16} />
                Export
              </button>
              <button className="header-btn header-btn-primary" onClick={onShowAll}>
                View All
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="tx-stats-row">
            <div className="stat-card">
              <div className="stat-label">Total Transactions</div>
              <div className="stat-value">{filteredTransactions.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Income</div>
              <div className="stat-value positive">+{formatCurrency(totalIncome)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Expenses</div>
              <div className="stat-value negative">-{formatCurrency(totalExpenses)}</div>
            </div>
          </div>

          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search transactions by merchant, reference, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="tx-list">
            {filteredTransactions.map((tx) => {
              const config = CATEGORY_CONFIG[tx.category] || CATEGORY_CONFIG.default;
              return (
                <div key={tx.id} className="tx-row" onClick={() => setSelectedTx(tx)}>
                  <div className="tx-left">
                    <div className={`tx-icon ${config.bg} ${config.border}`} style={{ borderColor: config.border.replace('border-', '') }}>
                      {config.icon}
                    </div>
                    <div className="tx-details">
                      <div className="tx-merchant">{tx.title}</div>
                      <div className="tx-meta">
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span>{tx.ref}</span>
                      </div>
                    </div>
                  </div>
                  <div className="tx-right">
                    <div className="tx-amount-block">
                      <div className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </div>
                      <div className="tx-category-small">{tx.category}</div>
                    </div>
                    <ChevronRight size={20} className="tx-chevron" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="tx-empty">
            <div className="tx-empty-icon">
              <Search size={36} />
            </div>
            <div className="tx-empty-title">No transactions found</div>
            <div className="tx-empty-text">
              Try adjusting your search terms or filters
            </div>
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="tx-footer">
            <button className="show-all-btn" onClick={onShowAll}>
              View All Transactions
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {selectedTx && (
        <DetailsDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </>
  );
}