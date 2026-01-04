import { useState, useRef } from 'react';
import { Camera, Upload, X, Check, AlertCircle, ChevronRight, ChevronLeft, FileText, Shield, Clock, CheckCircle2, XCircle } from 'lucide-react';

const ACCOUNTS = [
  { id: 'CHK-4829', name: 'Checking Account', balance: 12847.29, available: 12847.29 },
  { id: 'SAV-7102', name: 'Savings Account', balance: 8544.23, available: 8544.23 }
];

const LIMITS = {
  maxFileSize: 10485760,
  maxDailyDeposit: 25000,
  maxSingleDeposit: 10000
};

const DISCLOSURES = [
  'I certify that this is an original check and has not been previously deposited.',
  'I understand that depositing the same check more than once is a federal crime.',
  'I agree to retain the original check for 14 days and then securely destroy it.',
  'I understand that funds may be held per the Funds Availability Policy.',
  'I authorize New Apex Bank to debit my account if this deposit is returned unpaid.'
];

export default function CheckDepositPage() {
  const [step, setStep] = useState(1);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [amount, setAmount] = useState('');
  const [ocrAmount, setOcrAmount] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [endorsementConfirmed, setEndorsementConfirmed] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return 'No file selected';
    if (!['image/jpeg', 'image/png'].includes(file.type)) return 'Only JPG and PNG files are accepted';
    if (file.size > LIMITS.maxFileSize) return 'File size must be under 10MB';
    return null;
  };

  const handleFileSelect = (file, side) => {
    const error = validateFile(file);
    if (error) {
      setErrors(prev => ({ ...prev, [side]: error }));
      return;
    }

    setErrors(prev => ({ ...prev, [side]: null }));
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === 'front') {
        setFrontImage(file);
        setFrontPreview(reader.result);
        setTimeout(() => setOcrAmount((Math.random() * 1000 + 100).toFixed(2)), 800);
      } else {
        setBackImage(file);
        setBackPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const parseAmount = () => parseFloat(amount) || 0;

  const validateAmount = () => {
    const amt = parseAmount();
    if (!amt || amt <= 0) return 'Enter a valid amount';
    if (amt > LIMITS.maxSingleDeposit) return `Single deposit limit is ${formatCurrency(LIMITS.maxSingleDeposit)}`;
    if (amt > LIMITS.maxDailyDeposit) return `Daily deposit limit is ${formatCurrency(LIMITS.maxDailyDeposit)}`;
    return null;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const canProceedStep1 = frontImage && backImage && endorsementConfirmed;
  const canProceedStep2 = amount && !validateAmount() && selectedAccount;
  const canProceedStep3 = legalAccepted;

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const outcomes = ['success', 'blurry', 'duplicate', 'limit'];
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      
      if (outcome === 'success') {
        setResult({
          status: 'success',
          referenceId: `CHK${Date.now().toString().slice(-10)}`,
          timestamp: new Date().toISOString(),
          amount: parseAmount(),
          account: selectedAccount
        });
      } else if (outcome === 'blurry') {
        setResult({ status: 'error', message: 'Check image quality is insufficient. Please retake with better lighting and focus.' });
      } else if (outcome === 'duplicate') {
        setResult({ status: 'error', message: 'This check has already been deposited. Duplicate deposits are prohibited by federal law.' });
      } else {
        setResult({ status: 'error', message: 'Daily deposit limit exceeded. Please try again tomorrow or contact support.' });
      }
      
      setStep(4);
    } catch (error) {
      setResult({ status: 'error', message: 'System error. Please try again.' });
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setFrontImage(null);
    setBackImage(null);
    setFrontPreview(null);
    setBackPreview(null);
    setAmount('');
    setOcrAmount(null);
    setSelectedAccount(null);
    setEndorsementConfirmed(false);
    setLegalAccepted(false);
    setResult(null);
    setErrors({});
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#F8F9FA', padding: '12px 10px' }}>
      <style>{`
        @media (max-width: 1024px) {
          .check-deposit-container { margin-left: 0 !important; padding: 24px 20px !important; }
        }
        @media (max-width: 768px) {
          .step-indicator { font-size: 11px !important; }
          .image-preview { height: 140px !important; }
        }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }} className="check-deposit-container">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Deposit Check
          </h1>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>
            Deposit a check using your device camera or upload an image
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', left: 0, right: 0, height: '2px', background: '#E5E7EB', zIndex: 0 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#0F172A', width: step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '100%', transition: 'width 0.3s' }} />
          </div>
          
          {[1, 2, 3, 4].map(num => (
            <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= num ? '#0F172A' : '#E5E7EB', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', color: step >= num ? '#fff' : '#9CA3AF' }}>
                {step > num ? <Check size={16} /> : num}
              </div>
              <span className="step-indicator" style={{ fontSize: '12px', fontWeight: 600, color: step >= num ? '#0F172A' : '#9CA3AF' }}>
                {num === 1 ? 'Capture' : num === 2 ? 'Amount' : num === 3 ? 'Review' : 'Complete'}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>
              Capture Check Images
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px', display: 'block' }}>
                  Front of Check *
                </label>
                
                {!frontPreview ? (
                  <div 
                    onClick={() => frontInputRef.current?.click()}
                    style={{ border: '2px dashed #D1D5DB', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: '#F9FAFB', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#9CA3AF'}
                    onMouseOut={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                  >
                    <Camera size={32} style={{ color: '#9CA3AF', margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '4px' }}>Capture or Upload</p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF' }}>JPG or PNG, max 10MB</p>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <img src={frontPreview} alt="Front" className="image-preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                    <button
                      onClick={() => { setFrontImage(null); setFrontPreview(null); setOcrAmount(null); }}
                      style={{ position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={e => handleFileSelect(e.target.files[0], 'front')}
                  style={{ display: 'none' }}
                />
                
                {errors.front && (
                  <p style={{ fontSize: '13px', color: '#DC2626', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} /> {errors.front}
                  </p>
                )}
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px', display: 'block' }}>
                  Back of Check *
                </label>
                
                {!backPreview ? (
                  <div 
                    onClick={() => backInputRef.current?.click()}
                    style={{ border: '2px dashed #D1D5DB', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: '#F9FAFB', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#9CA3AF'}
                    onMouseOut={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                  >
                    <Upload size={32} style={{ color: '#9CA3AF', margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '4px' }}>Capture or Upload</p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF' }}>JPG or PNG, max 10MB</p>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <img src={backPreview} alt="Back" className="image-preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                    <button
                      onClick={() => { setBackImage(null); setBackPreview(null); }}
                      style={{ position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                
                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={e => handleFileSelect(e.target.files[0], 'back')}
                  style={{ display: 'none' }}
                />
                
                {errors.back && (
                  <p style={{ fontSize: '13px', color: '#DC2626', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} /> {errors.back}
                  </p>
                )}
              </div>
            </div>

            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
              <AlertCircle size={20} style={{ color: '#92400E', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#92400E' }}>
                <strong>Endorsement Required:</strong> Sign the back of the check with "For Mobile Deposit Only at New Apex Bank" above your signature.
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
              <input
                type="checkbox"
                checked={endorsementConfirmed}
                onChange={e => setEndorsementConfirmed(e.target.checked)}
                style={{ marginTop: '2px', width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                I confirm that I have properly endorsed the back of this check as required.
              </span>
            </label>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                style={{ flex: 1, padding: '16px', background: canProceedStep1 ? '#0F172A' : '#E5E7EB', color: canProceedStep1 ? '#fff' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: canProceedStep1 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
              >
                Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>
              Enter Check Details
            </h2>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>
                Check Amount *
              </label>
              <input
                type="text"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                style={{ width: '100%', padding: '20px', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '28px', fontWeight: 700, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}
              />
              
              {validateAmount() && (
                <p style={{ fontSize: '13px', color: '#DC2626', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} /> {validateAmount()}
                </p>
              )}

              {ocrAmount && amount && Math.abs(parseFloat(amount) - parseFloat(ocrAmount)) > 1 && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', fontSize: '13px', color: '#92400E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  Detected amount ${ocrAmount} differs from entered amount. Verify check carefully.
                </div>
              )}

              <div style={{ marginTop: '12px', fontSize: '13px', color: '#6B7280', display: 'flex', justifyContent: 'space-between' }}>
                <span>Single deposit limit: {formatCurrency(LIMITS.maxSingleDeposit)}</span>
                <span>Daily limit: {formatCurrency(LIMITS.maxDailyDeposit)}</span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px', display: 'block' }}>
                Deposit To *
              </label>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {ACCOUNTS.map(account => (
                  <div
                    key={account.id}
                    onClick={() => setSelectedAccount(account)}
                    style={{ padding: '16px 20px', background: selectedAccount?.id === account.id ? '#EFF6FF' : '#F9FAFB', border: selectedAccount?.id === account.id ? '2px solid #3B82F6' : '1px solid #E5E7EB', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>{account.name}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'monospace' }}>{account.id}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: '2px' }}>Available</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{formatCurrency(account.available)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '16px', background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
              <Clock size={20} style={{ color: '#1E40AF', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#1E40AF' }}>
                Funds typically available within 1-2 business days. First $225 may be available immediately.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(1)}
                style={{ padding: '16px 24px', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                style={{ flex: 1, padding: '16px', background: canProceedStep2 ? '#0F172A' : '#E5E7EB', color: canProceedStep2 ? '#fff' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: canProceedStep2 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Review
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>
              Review & Confirm
            </h2>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
              <div style={{ padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>Deposit Amount</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{formatCurrency(parseAmount())}</span>
              </div>

              <div style={{ padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>Destination</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{selectedAccount?.name}</span>
              </div>

              <div style={{ padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>Expected Availability</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>1-2 business days</span>
              </div>
            </div>

            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Shield size={20} style={{ color: '#0F172A' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Legal Disclosures</h3>
              </div>

              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px', padding: '16px', background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                {DISCLOSURES.map((disclosure, idx) => (
                  <div key={idx} style={{ marginBottom: idx < DISCLOSURES.length - 1 ? '12px' : 0, paddingBottom: idx < DISCLOSURES.length - 1 ? '12px' : 0, borderBottom: idx < DISCLOSURES.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                    <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#374151' }}>{disclosure}</p>
                  </div>
                ))}
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={legalAccepted}
                  onChange={e => setLegalAccepted(e.target.checked)}
                  style={{ marginTop: '2px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: '#0F172A', lineHeight: '1.6', fontWeight: 600 }}>
                  I have read and agree to all disclosures above. I certify that this information is accurate.
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(2)}
                style={{ padding: '16px 24px', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canProceedStep3 || loading}
                style={{ flex: 1, padding: '16px', background: canProceedStep3 && !loading ? '#0F172A' : '#E5E7EB', color: canProceedStep3 && !loading ? '#fff' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: canProceedStep3 && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? 'Processing...' : 'Submit Deposit'}
                {!loading && <CheckCircle2 size={18} />}
              </button>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '50%', background: result.status === 'success' ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: result.status === 'success' ? '#059669' : '#DC2626' }}>
              {result.status === 'success' ? <CheckCircle2 size={40} strokeWidth={2.5} /> : <XCircle size={40} strokeWidth={2.5} />}
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              {result.status === 'success' ? 'Deposit Submitted' : 'Deposit Failed'}
            </h2>

            <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '32px' }}>
              {result.status === 'success' 
                ? 'Your check deposit has been submitted for processing.' 
                : result.message}
            </p>

            {result.status === 'success' && (
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Reference ID</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{result.referenceId}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Amount</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{formatCurrency(result.amount)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Deposited To</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{result.account.name}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Date & Time</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    {new Date(result.timestamp).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
            )}

            {result.status === 'success' && (
              <div style={{ padding: '16px', background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '12px', marginBottom: '24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Clock size={20} style={{ color: '#1E40AF', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF', marginBottom: '4px' }}>
                      What happens next?
                    </div>
                    <ul style={{ fontSize: '13px', lineHeight: '1.8', color: '#1E40AF', margin: 0, paddingLeft: '20px' }}>
                      <li>We'll process your deposit within 1-2 business days</li>
                      <li>First $225 may be available immediately</li>
                      <li>Keep the original check for 14 days, then securely destroy it</li>
                      <li>You'll receive a confirmation email shortly</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{ padding: '16px 32px', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#E5E7EB'}
                onMouseOut={e => e.currentTarget.style.background = '#F3F4F6'}
              >
                {result.status === 'success' ? 'Deposit Another Check' : 'Try Again'}
              </button>

              {result.status === 'success' && (
                <button
                  style={{ padding: '16px 32px', background: '#0F172A', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#1E293B';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.3)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#0F172A';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View Account
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tips Sidebar */}
        {step <= 3 && (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <FileText size={20} style={{ color: '#3B82F6' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Tips for Best Results</h3>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '10px' }}>
                <div style={{ width: '24px', height: '24px', background: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                  1
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>Good Lighting</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
                    Take photos in well-lit area without shadows or glare
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '10px' }}>
                <div style={{ width: '24px', height: '24px', background: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                  2
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>Flat Surface</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
                    Place check on dark, contrasting background
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '10px' }}>
                <div style={{ width: '24px', height: '24px', background: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                  3
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>Steady Hands</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
                    Hold camera steady to avoid blurry images
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '10px' }}>
                <div style={{ width: '24px', height: '24px', background: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                  4
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>Full Check Visible</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
                    Ensure all four corners are visible in the frame
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '10px' }}>
                <div style={{ width: '24px', height: '24px', background: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                  5
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>Proper Endorsement</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
                    Sign back with "For Mobile Deposit Only" and bank name
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', border: '1px solid #BFDBFE', borderRadius: '16px', padding: '20px', marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', background: '#3B82F6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1E40AF', marginBottom: '6px' }}>
                Your Security is Our Priority
              </div>
              <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#1E40AF' }}>
                All check deposits are processed through secure, encrypted channels. Your personal and financial information is protected with bank-grade security. Mobile check deposit is subject to verification and approval.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}