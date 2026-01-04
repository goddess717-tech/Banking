import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Send, 
  Download, 
  CreditCard, 
  Repeat, 
  FileText, 
  Settings, 
  Users, 
  Smartphone,
  DollarSign,
  TrendingUp,
  Shield,
  Gift
} from "lucide-react";

const ACTIONS = [
  {
    id: 1,
    label: "Send Money",
    icon: Send,
    path: "/transfer/local",
    color: "#2563EB", // blue-600
  },
  {
    id: 2,
    label: "Deposit",
    icon: Download,
    path: "/deposit/cheque",
    color: "#16A34A", // green-600
  },
  {
    id: 5,
    label: "Statements",
    icon: FileText,
    path: "/account/statements",
    color: "#475569", // slate-600
  },
  {
    id: 6,
    label: "Settings",
    icon: Settings,
    path: "/profile/settings",
    color: "#D97706", // amber-600
  },
];


export default function QuickActions() {
  const navigate = useNavigate();
  const [qaExpanded, setQaExpanded] = useState(false);

  const visible = qaExpanded ? ACTIONS : ACTIONS.slice(0, 4);

  return (
    <>
      <style>{`
        .quick-actions-section {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #E5E7EB;
          padding: 24px;
          margin-bottom: 24px;
        }

        .qa-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .qa-title {
          font-size: 15px;
          font-weight: 700;
          color: #363638ff;
        }

        .qa-toggle-btn {
          font-size: 14px;
          font-weight: 600;
          color: #0F172A;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.15s;
        }

        .qa-toggle-btn:hover {
          background: #F3F4F6;
        }

       .qa-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  justify-items: center;
  align-items: center;
}


        .qa-button {
          width: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 8px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          gap: 10px;
        }

        .qa-button:hover {
          background: #F3F4F6;
          border-color: #D1D5DB;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .qa-button:active {
          transform: translateY(0);
        }

        .qa-icon-wrapper {
          width: 44px;
          height: 44px;
          background: #ffffff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          border: 1px solid #E5E7EB;
        }

        .qa-button:hover .qa-icon-wrapper {
  background: var(--qa-color);
  border-color: var(--qa-color);
}




        .qa-icon {
          width: 20px;
          height: 20px;
          color: #374151;
          transition: color 0.2s;
        }

       .qa-button:hover .qa-icon {
  color: #ffffff;
}

        .qa-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-align: center;
          line-height: 1.3;
          transition: color 0.2s;
        }

        .qa-button:hover .qa-label {
          color: #0F172A;
        }

        @media (max-width: 1024px) {
           .qa-grid {
    grid-template-columns: repeat(4, 1fr);
  }
        }

        @media (max-width: 768px) {
          .quick-actions-section {
            padding: 20px;
          }

          .qa-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }

          .qa-button {
            padding: 14px 6px;
          }

          .qa-icon-wrapper {
            width: 40px;
            height: 40px;
          }

          .qa-icon {
            width: 18px;
            height: 18px;
          }

          .qa-label {
            font-size: 12px;
          }
        }

        @media (max-width: 640px) {
  .qa-grid {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
    justify-content: center;
    align-items: center;
  }
     .qa-button {
    padding: 16px 8px;
  }
}


        @media (max-width: 480px) {
          .quick-actions-section {
            padding: 16px;
          }

          .qa-grid {
            gap: 10px;
          }

          .qa-button {
            padding: 12px 4px;
          }

          .qa-label {
            font-size: 11px;
          }
        }
      `}</style>

      <section className="quick-actions-section">
        <div className="qa-header">
          <h3 className="qa-title">Quick Actions</h3>

          {/* {ACTIONS.length > 8 && (
            <button
              onClick={() => setQaExpanded(v => !v)}
              className="qa-toggle-btn"
            >
              {qaExpanded ? "Show Less" : "Show More"}
            </button>
          )} */}
        </div>

        <div className="qa-grid">
       {visible.map(({ id, label, icon: Icon, path, color }) => (
  <button
    key={id}
    className="qa-button"
    aria-label={label}
    onClick={() => navigate(path)}
  >
    <div
      className="qa-icon-wrapper"
      style={{ borderColor: color }}
    >
      <Icon
        className="qa-icon"
        strokeWidth={2}
        style={{ "--qa-color": color }}
      />
    </div>
    <span className="qa-label">{label}</span>
  </button>
))}

        </div>
      </section>
    </>
  );
}