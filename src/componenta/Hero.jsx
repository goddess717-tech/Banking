import { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Zap
} from 'lucide-react';

const MOCK_USER = {
  firstName: "John",
  lastName: "Doe",
  otherName: "John"
};

export default function Hero() {
  const [showBalance, setShowBalance] = useState(true);
  const [displayValue, setDisplayValue] = useState(0);
  
  const target = 24891.52;
  const today = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const step = 16;
    const increment = target / (duration / step);

    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setDisplayValue(start);
    }, step);

    return () => clearInterval(interval);
  }, []);

  const formattedBalance = displayValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
      <style>{`
        .hero-banner {
          position: relative;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%);
          padding: 32px 40px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-glow-1 {
          position: absolute;
          top: -80px;
          right: 10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
        }

        .hero-glow-2 {
          position: absolute;
          bottom: -60px;
          left: 15%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .hero-container {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
        }

        .hero-left {
          flex: 1;
          z-index: 1;
        }

        .hero-greeting {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-name {
          font-size: 36px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .hero-date {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 16px;
        }

        .hero-insights {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
        }

        .insight-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #10B981;
          backdrop-filter: blur(10px);
        }

        .insight-badge.warning {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.3);
          color: #F59E0B;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .hero-balance-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 28px 32px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          z-index: 1;
          min-width: 400px;
        }

        .balance-card-glow-1 {
          position: absolute;
          top: -50%;
          right: -20%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
          border-radius: 50%;
        }

        .balance-card-glow-2 {
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
          border-radius: 50%;
        }

        .balance-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .balance-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .balance-amount {
          font-size: 40px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -1.5px;
          font-variant-numeric: tabular-nums;
          position: relative;
          margin-bottom: 6px;
        }

        .balance-glow {
          position: absolute;
          inset: -4px;
          background: rgba(255, 255, 255, 0.1);
          filter: blur(20px);
          border-radius: 12px;
          animation: glow 3s ease-in-out infinite;
          z-index: -1;
        }

        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .balance-status {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(255, 255, 255, 0.6);
        }

        .balance-toggle {
          position: relative;
          z-index: 1;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffffff;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .balance-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .balance-toggle:active {
          transform: scale(0.95);
        }

        .quick-stats {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10B981;
        }

        .stat-icon.negative {
          color: #EF4444;
        }

        .stat-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        .stat-value {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          font-variant-numeric: tabular-nums;
        }

        @media (max-width: 1280px) {
          .hero-balance-card {
            min-width: 360px;
          }

          .balance-amount {
            font-size: 36px;
          }
        }

        @media (max-width: 1024px) {
          .hero-banner {
            margin-left: 0;
            padding: 24px 20px;
          }

          .hero-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }

          .hero-balance-card {
            width: 100%;
            min-width: unset;
          }

          .quick-stats {
            flex-direction: column;
            width: 100%;
          }

          .stat-item {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .hero-banner {
            padding: 20px 16px;
          }

          .hero-name {
            font-size: 28px;
          }

          .hero-balance-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 24px;
          }

          .balance-amount {
            font-size: 32px;
          }

          .balance-toggle {
            align-self: flex-end;
          }

          .hero-insights {
            flex-direction: column;
          }

          .insight-badge {
            width: fit-content;
          }
        }

        @media (max-width: 480px) {
          .hero-name {
            font-size: 24px;
          }

          .balance-amount {
            font-size: 28px;
          }

          .quick-stats {
            gap: 8px;
          }
        }
      `}</style>

      <section className="hero-banner">
        <div className="hero-bg-overlay" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-greeting">
              <Zap size={16} />
              {getGreeting()},
            </div>
            <h1 className="hero-name">{MOCK_USER.otherName}</h1>
            <p className="hero-date">Today is {today}</p>

           

            {/* <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
                <div className="stat-details">
                  <span className="stat-label">This Month</span>
                  <span className="stat-value">+$1,247.83</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon negative">
                  <ArrowDownLeft size={16} strokeWidth={2.5} />
                </div>
                <div className="stat-details">
                  <span className="stat-label">Spent</span>
                  <span className="stat-value">$3,892.45</span>
                </div>
              </div>
            </div> */}
          </div>

          <div className="hero-balance-card">
            <div className="balance-card-glow-1" />
            <div className="balance-card-glow-2" />
            
            <div className="balance-content">
              <div className="balance-label">Total Balance</div>
              <div className="balance-amount" aria-live="polite">
                <span className="balance-glow" />
                {showBalance ? formattedBalance : "••••••••"}
              </div>
              <div className="balance-status">Available</div>
            </div>

            <button
              onClick={() => setShowBalance(!showBalance)}
              className="balance-toggle"
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
           <div className="hero-insights">
              <div className="insight-badge">
                <span className="pulse-dot" />
                Spending trend ↑12% this month
              </div>
              {/* <div className="insight-badge warning">
                <TrendingUp size={14} strokeWidth={2.5} />
                Income up $2,400
              </div> */}
            </div>
        </div>
      </section>
    </>
  );
}