import { useState } from 'react';
import { Copy, Check, Eye, EyeOff, CreditCard, Wifi } from 'lucide-react';

export default function CardComponent() {
  const [showNumber, setShowNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const cardNumber = "4479 1122 9001 8997";
  const cardHolder = "Muhammad Haseeb";
  const expiryDate = "12/28";
  const cvv = "842";
  const bankName = "New Apex Bank";

  const copyCardNumber = () => {
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCardNumber = (number) => {
    if (!showNumber) {
      return number.split(' ').map((group, i) => 
        i < 3 ? '••••' : group
      ).join('  ');
    }
    return number.split(' ').join('  ');
  };

  return (
    <>
      <style>{`
        .card-wrapper {
          max-width: 480px;
          margin: 0 auto;
          padding: 24px;
        }

        .card-scene {
          perspective: 1200px;
          width: 100%;
          margin-bottom: 24px;
        }

        .card-container {
          position: relative;
          width: 100%;
          padding-bottom: 63.5%;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .card-container.flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 24px;
          overflow: hidden;
        }

        .card-front {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .card-back {
          background: linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #1E293B 100%);
          transform: rotateY(180deg);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .card-content {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-glow {
          position: absolute;
          top: -50%;
          right: -20%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .card-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.02) 35px, rgba(255,255,255,.02) 70px);
          pointer-events: none;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }

        .bank-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          position: relative;
          overflow: hidden;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 100%);
        }

        .logo-shape {
          width: 24px;
          height: 24px;
          background: white;
          clip-path: polygon(0% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%);
        }

        .bank-name {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .chip-icon {
          width: 52px;
          height: 42px;
          background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          position: relative;
          overflow: hidden;
        }

        .chip-icon::before {
          content: '';
          position: absolute;
          inset: 8px;
          border: 1.5px solid rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .chip-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          width: 18px;
          height: 18px;
        }

        .chip-cell {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 1px;
        }

        .card-middle {
          position: relative;
          z-index: 1;
        }

        .card-number {
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 3px;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          margin-bottom: 8px;
          font-family: 'Courier New', monospace;
        }

        .card-number.hidden {
          letter-spacing: 6px;
        }

        .wireless-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          margin-top: 4px;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          position: relative;
          z-index: 1;
        }

        .cardholder-section {
          flex: 1;
        }

        .card-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 6px;
        }

        .card-value {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .expiry-section {
          text-align: left;
          margin-right: 24px;
        }

        .card-network {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .network-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .mastercard-red {
          background: #EB001B;
        }

        .mastercard-orange {
          background: #FF5F00;
          margin-left: -20px;
        }

        .visa-logo {
          background: white;
          padding: 8px 14px;
          border-radius: 6px;
          font-weight: 900;
          font-size: 22px;
          color: #1434CB;
          font-style: italic;
          letter-spacing: -1px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* Card Back */
        .magnetic-stripe {
          width: 100%;
          height: 56px;
          background: linear-gradient(180deg, #1F2937 0%, #111827 100%);
          margin-top: 28px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4) inset;
        }

        .signature-panel {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          padding: 12px 16px;
          margin: 28px 32px 20px 32px;
          position: relative;
        }

        .signature-text {
          font-family: 'Brush Script MT', cursive;
          font-size: 24px;
          color: #1F2937;
        }

        .cvv-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px 0 32px;
          margin-bottom: 20px;
        }

        .cvv-box {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 12px 20px;
          backdrop-filter: blur(10px);
        }

        .cvv-label {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 6px;
        }

        .cvv-value {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          font-family: 'Courier New', monospace;
          letter-spacing: 3px;
        }

        .back-notice {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          padding: 0 32px 28px 32px;
          line-height: 1.5;
        }

        /* Controls */
        .card-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .control-btn {
          flex: 1;
          min-width: 140px;
          padding: 14px 20px;
          background: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .control-btn:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .control-btn:active {
          transform: translateY(0);
        }

        .control-btn.active {
          background: #0F172A;
          color: #ffffff;
          border-color: #0F172A;
        }

        .control-btn.copied {
          background: #D1FAE5;
          border-color: #A7F3D0;
          color: #059669;
        }

        .card-info {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 20px;
          margin-top: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #E5E7EB;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 13px;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          font-family: 'Courier New', monospace;
        }

        @media (max-width: 640px) {
          .card-wrapper {
            padding: 16px;
          }

          .card-content {
            padding: 20px 24px;
          }

          .bank-name {
            font-size: 16px;
          }

          .logo-icon {
            width: 40px;
            height: 40px;
          }

          .logo-shape {
            width: 20px;
            height: 20px;
          }

          .chip-icon {
            width: 44px;
            height: 36px;
          }

          .card-number {
            font-size: 20px;
            letter-spacing: 2px;
          }

          .card-number.hidden {
            letter-spacing: 4px;
          }

          .card-value {
            font-size: 14px;
          }

          .network-circle {
            width: 36px;
            height: 36px;
          }

          .visa-logo {
            font-size: 18px;
            padding: 6px 12px;
          }

          .control-btn {
            min-width: 100%;
          }

          .signature-panel,
          .cvv-section,
          .back-notice {
            padding-left: 24px;
            padding-right: 24px;
          }
        }
      `}</style>

      <div className="card-wrapper">
        <div className="card-scene">
          <div className={`card-container ${isFlipped ? 'flipped' : ''}`}>
            {/* Front Face */}
            <div className="card-face card-front">
              <div className="card-glow" />
              <div className="card-pattern" />
              <div className="card-content">
                <div className="card-header">
                  <div className="bank-logo">
                    <div className="logo-icon">
                      <div className="logo-shape" />
                    </div>
                    <div className="bank-name">{bankName}</div>
                  </div>
                  <div className="chip-icon">
                    <div className="chip-grid">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="chip-cell" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-middle">
                  <div className={`card-number ${!showNumber ? 'hidden' : ''}`}>
                    {formatCardNumber(cardNumber)}
                  </div>
                  <div className="wireless-icon">
                    <Wifi size={20} color="white" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="card-footer">
                  <div className="cardholder-section">
                    <div className="card-label">Card Holder</div>
                    <div className="card-value">{cardHolder}</div>
                  </div>
                  <div className="expiry-section">
                    <div className="card-label">Expires</div>
                    <div className="card-value">{expiryDate}</div>
                  </div>
                  <div className="card-network">
                    <div className="network-circle mastercard-red" />
                    <div className="network-circle mastercard-orange" />
                  </div>
                </div>
              </div>
            </div>

            {/* Back Face */}
            <div className="card-face card-back">
              <div className="card-pattern" />
              <div className="magnetic-stripe" />
              
              <div className="signature-panel">
                <div className="signature-text">{cardHolder}</div>
              </div>

              <div className="cvv-section">
                <div className="cvv-box">
                  <div className="cvv-label">CVV</div>
                  <div className="cvv-value">{cvv}</div>
                </div>
                <div className="card-network">
                  <div className="network-circle mastercard-red" />
                  <div className="network-circle mastercard-orange" />
                </div>
              </div>

              <div className="back-notice">
                This card is property of {bankName}. If found, please return to any branch or call 1-800-NEW-APEX. Unauthorized use is prohibited and may be illegal.
              </div>
            </div>
          </div>
        </div>

        <div className="card-controls">
          <button
            className={`control-btn ${showNumber ? 'active' : ''}`}
            onClick={() => setShowNumber(!showNumber)}
          >
            {showNumber ? <EyeOff size={18} /> : <Eye size={18} />}
            {showNumber ? 'Hide Number' : 'Show Number'}
          </button>

          <button
            className={`control-btn ${copied ? 'copied' : ''}`}
            onClick={copyCardNumber}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Number'}
          </button>

          <button
            className="control-btn"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <CreditCard size={18} />
            {isFlipped ? 'Show Front' : 'Show Back'}
          </button>
        </div>

        <div className="card-info">
          <div className="info-row">
            <span className="info-label">Card Number</span>
            <span className="info-value">
              {showNumber ? cardNumber : '•••• •••• •••• ' + cardNumber.slice(-4)}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Card Type</span>
            <span className="info-value">Mastercard Platinum</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className="info-value" style={{ color: '#059669' }}>Active</span>
          </div>
          <div className="info-row">
            <span className="info-label">Daily Limit</span>
            <span className="info-value">$10,000.00</span>
          </div>
        </div>
      </div>
    </>
  );
}