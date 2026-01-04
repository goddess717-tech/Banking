import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  FileText,
  ArrowLeftRight,
  Globe,
  RefreshCcw,
  Building2,
  ReceiptText,
  X,
  Plus,
  DollarSign,
  Headphones,
  ChevronRight
} from "lucide-react";


export default function Sidebar({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState('accounts');


  const navigation = [
  {
    section: "Dashboard",
    items: [
      {
        id: "overview",
        label: "Overview",
        icon: LayoutDashboard,
        path: "/dashboard"
      }
    ]
  },
  {
    section: "Account",
    items: [
      {
        id: "account-history",
        label: "History",
        icon: History,
        path: "/account/history"
      },
      {
        id: "statements",
        label: "Statements",
        icon: FileText,
        path: "/account/statements"
      }
    ]
  },
  {
    section: "Payments",
    items: [
      {
        id: "local-transfer",
        label: "Transfer",
        icon: ArrowLeftRight,
        path: "/transfer/local"
      },
      // {
      //   id: "international-transfer",
      //   label: "Pay Bills",
      //   icon: DollarSign,
      //   path: "/pay-bills"
      // }
    ]
  },
  {
    section: "Deposits",
    items: [
      {
        id: "cheque-deposit",
        label: "Cheque Deposit",
        icon: Building2,
        path: "/deposit/cheque"
      }
    ]
  }
];

const navigate = useNavigate();


  return (
    <>
      <style>{`

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 90;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .mobile-toggle {
          position: fixed;
          top: 76px;
          left: 16px;
          width: 44px;
          height: 44px;
          background: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.2s;
        }

        .mobile-toggle:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
        }

        .mobile-toggle:active {
          transform: scale(0.95);
        }

        .sidebar {
          position: fixed;
          top: 64px;
          left: 0;
          width: 280px;
          height: calc(100vh - 64px);
          background: #FAFAFA;
          border-right: 1px solid #E5E7EB;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          z-index: 95;
          transition: transform 0.3s ease;
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 24px 16px;
        }

        .sidebar-close {
          display: none;
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: #6B7280;
          transition: all 0.15s;
        }

        .sidebar-close:hover {
          background: #F3F4F6;
          color: #111827;
        }

        .balance-card {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .balance-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          border-radius: 50%;
        }

        .balance-label {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
          letter-spacing: 0.3px;
        }

        .balance-amount {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -1px;
          margin-bottom: 16px;
          font-variant-numeric: tabular-nums;
        }

        .balance-change {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(16, 185, 129, 0.15);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #10B981;
        }

        .nav-section {
          margin-bottom: 32px;
        }

        .nav-section-title {
          font-size: 11px;
          font-weight: 700;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 12px 12px 12px;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          color: #4B5563;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          position: relative;
        }

        .nav-item:hover {
          background: #F3F4F6;
          color: #111827;
        }

        .nav-item.active {
          background: #ffffff;
          color: #0F172A;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          background: #0F172A;
          border-radius: 0 4px 4px 0;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .nav-divider {
          height: 1px;
          background: #E5E7EB;
          margin: 24px 0;
        }

          .quick-actions {
            margin-top: auto;
            padding-top: 24px;
          }

        .action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          border: none;
          background: #0F172A;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #1E293B;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.25);
        }

        .action-btn:active {
          transform: translateY(0);
        }

        .action-btn-secondary {
          background: #ffffff;
          color: #0F172A;
          border: 1px solid #E5E7EB;
        }

        .action-btn-secondary:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .support-card {
          margin-top: 16px;
          padding: 20px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
        }

        .support-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .support-icon {
          width: 20px;
          height: 20px;
          color: #0F172A;
        }

        .support-title {
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
        }

        .support-text {
          font-size: 13px;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .support-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #0F172A;
          text-decoration: none;
          cursor: pointer;
          transition: gap 0.2s;
        }

        .support-link:hover {
          gap: 8px;
        }

        .support-link-icon {
          width: 16px;
          height: 16px;
        }

        @media (max-width: 1024px) {
          .mobile-toggle {
            display: flex;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
          }

          .sidebar-close {
            display: flex;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            max-width: 320px;
          }

          .mobile-toggle {
            top: 72px;
          }
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>

     

      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}

      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button 
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        <div className="sidebar-inner">
          {/* <div className="balance-card">
            <div className="balance-label">Available Balance</div>
            <div className="balance-amount">$24,891.52</div>
            <div className="balance-change">
              <TrendingUp size={14} strokeWidth={2.5} />
              +$1,247.83 (5.3%)
            </div>
          </div> */}

          <div className="nav-section">
            {navigation.map(section => (
  <div className="nav-section" key={section.section}>
    <div className="nav-section-title">{section.section}</div>

    <div className="nav-menu">
      {section.items.map(item => {
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            className={`nav-item ${activeItem === item.id ? "active" : ""}`}
            onClick={() => {
              setActiveItem(item.id);
              navigate(item.path);
              if (window.innerWidth <= 1024) onClose();
            }}
          >
            <Icon className="nav-icon" strokeWidth={2} />
            {item.label}
          </button>
        );
      })}
    </div>
  </div>
))}

          </div>

          <div className="nav-divider" />

          

          <div className="quick-actions">
            <div className="support-card">
              <div className="support-header">
                <Headphones className="support-icon" strokeWidth={2} />
                <span className="support-title">Need Help?</span>
              </div>
              <div className="support-text">
                Available 24/7 for any questions or assistance you need.
              </div>
              <a className="support-link">
                Contact Support
                <ChevronRight className="support-link-icon" strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}