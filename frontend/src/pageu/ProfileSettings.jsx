import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  Globe,
  Bell,
  Download,
  LogOut,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  ChevronRight,
  Key,
  FileText,
  Settings,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';

export default function ProfileSettingsPage() {
  const [userData] = useState({
    fullName: 'Cindy Kaza',
    customerId: 'NAB-2025-478291',
    email: 'c****m@email.com',
    fullEmail: 'sarah.johnson@email.com',
    phone: '+1 (***) ***-4829',
    fullPhone: '+1 (555) 123-4829',
    kycStatus: 'Verified',
    kycDate: '2024-03-15T10:30:00Z',
    accountCreated: '2024-01-10T08:15:00Z',
    lastLogin: '2025-01-02T14:22:00Z',
    lastPasswordChange: '2024-11-20T09:45:00Z'
  });

  const [sessions] = useState([
    {
      id: 'sess_001',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      ip: '192.168.1.100',
      lastActive: '2025-01-02T14:22:00Z',
      current: true
    },
    {
      id: 'sess_002',
      device: 'Safari on iPhone 15',
      location: 'New York, NY',
      ip: '192.168.1.101',
      lastActive: '2025-01-01T18:30:00Z',
      current: false
    },
    {
      id: 'sess_003',
      device: 'Chrome on MacBook Pro',
      location: 'Brooklyn, NY',
      ip: '192.168.1.102',
      lastActive: '2024-12-30T12:15:00Z',
      current: false
    }
  ]);

  const [contactInfo, setContactInfo] = useState({
    newEmail: '',
    newPhone: '',
    emailPending: null,
    phonePending: null
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true
  });

  const [preferences, setPreferences] = useState({
    language: 'en-US',
    timezone: 'America/New_York',
    currency: 'USD',
    transactionAlerts: true,
    securityAlerts: true,
    marketingEmails: false
  });

  const [uiState, setUiState] = useState({
    showFullEmail: false,
    showFullPhone: false,
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    activeTab: 'identity',
    dirtyFields: new Set(),
    errors: {},
    success: null,
    loading: false
  });

  const [modals, setModals] = useState({
    verifyEmail: false,
    verifyPhone: false,
    changePassword: false,
    disable2FA: false,
    signOutAll: false,
    exportData: false,
    closeAccount: false,
    reAuth: null
  });

  const [verificationState, setVerificationState] = useState({
    emailOtp: '',
    phoneOtp: '',
    emailSent: false,
    phoneSent: false,
    reAuthPassword: '',
    countdown: 0
  });

  useEffect(() => {
    if (verificationState.countdown > 0) {
      const timer = setTimeout(() => {
        setVerificationState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [verificationState.countdown]);

  const markDirty = (field) => {
    setUiState(prev => ({
      ...prev,
      dirtyFields: new Set([...prev.dirtyFields, field])
    }));
  };

  const clearDirty = () => {
    setUiState(prev => ({
      ...prev,
      dirtyFields: new Set(),
      errors: {},
      success: null
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 12 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^A-Za-z0-9]/.test(password);
  };

  const requireReAuth = (action) => {
    setModals(prev => ({ ...prev, reAuth: action }));
  };

  const handleReAuth = async () => {
    if (!verificationState.reAuthPassword) {
      setUiState(prev => ({
        ...prev,
        errors: { ...prev.errors, reAuth: 'Password is required' }
      }));
      return;
    }

    setUiState(prev => ({ ...prev, loading: true }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (verificationState.reAuthPassword === 'wrongpassword') {
      setUiState(prev => ({
        ...prev,
        loading: false,
        errors: { ...prev.errors, reAuth: 'Incorrect password' }
      }));
      return;
    }

    setUiState(prev => ({ ...prev, loading: false, errors: {} }));
    setVerificationState(prev => ({ ...prev, reAuthPassword: '' }));

    const action = modals.reAuth;
    setModals(prev => ({ ...prev, reAuth: null }));

    if (action === 'changeEmail') {
      setModals(prev => ({ ...prev, verifyEmail: true }));
    } else if (action === 'changePhone') {
      setModals(prev => ({ ...prev, verifyPhone: true }));
    } else if (action === 'changePassword') {
      setModals(prev => ({ ...prev, changePassword: true }));
    } else if (action === 'closeAccount') {
      setModals(prev => ({ ...prev, closeAccount: true }));
    }
  };

  const handleEmailChange = async () => {
    if (!validateEmail(contactInfo.newEmail)) {
      setUiState(prev => ({
        ...prev,
        errors: { ...prev.errors, newEmail: 'Invalid email format' }
      }));
      return;
    }

    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));

    setVerificationState(prev => ({
      ...prev,
      emailSent: true,
      countdown: 60
    }));

    setUiState(prev => ({ ...prev, loading: false }));
  };

  const handleVerifyEmail = async () => {
    if (verificationState.emailOtp.length !== 6) {
      setUiState(prev => ({
        ...prev,
        errors: { ...prev.errors, emailOtp: 'Enter 6-digit code' }
      }));
      return;
    }

    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (verificationState.emailOtp !== '123456') {
      setUiState(prev => ({
        ...prev,
        loading: false,
        errors: { ...prev.errors, emailOtp: 'Invalid verification code' }
      }));
      return;
    }

    setContactInfo(prev => ({
      ...prev,
      emailPending: {
        newEmail: contactInfo.newEmail,
        requestedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      newEmail: ''
    }));

    setModals(prev => ({ ...prev, verifyEmail: false }));
    setVerificationState(prev => ({ ...prev, emailOtp: '', emailSent: false }));
    setUiState(prev => ({
      ...prev,
      loading: false,
      errors: {},
      success: 'Email change request submitted. Check your inbox to confirm.'
    }));

    setTimeout(() => {
      setUiState(prev => ({ ...prev, success: null }));
    }, 5000);
  };

  const handlePhoneChange = async () => {
    if (!validatePhone(contactInfo.newPhone)) {
      setUiState(prev => ({
        ...prev,
        errors: { ...prev.errors, newPhone: 'Invalid phone format' }
      }));
      return;
    }

    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));

    setVerificationState(prev => ({
      ...prev,
      phoneSent: true,
      countdown: 60
    }));

    setUiState(prev => ({ ...prev, loading: false }));
  };

  const handleVerifyPhone = async () => {
    if (verificationState.phoneOtp.length !== 6) {
      setUiState(prev => ({
        ...prev,
        errors: { ...prev.errors, phoneOtp: 'Enter 6-digit code' }
      }));
      return;
    }

    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (verificationState.phoneOtp !== '123456') {
      setUiState(prev => ({
        ...prev,
        loading: false,
        errors: { ...prev.errors, phoneOtp: 'Invalid verification code' }
      }));
      return;
    }

    setContactInfo(prev => ({
      ...prev,
      phonePending: {
        newPhone: contactInfo.newPhone,
        requestedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      newPhone: ''
    }));

    setModals(prev => ({ ...prev, verifyPhone: false }));
    setVerificationState(prev => ({ ...prev, phoneOtp: '', phoneSent: false }));
    setUiState(prev => ({
      ...prev,
      loading: false,
      errors: {},
      success: 'Phone change request submitted. Check your SMS to confirm.'
    }));

    setTimeout(() => {
      setUiState(prev => ({ ...prev, success: null }));
    }, 5000);
  };

  const handlePasswordChange = async () => {
    const errors = {};

    if (!securitySettings.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!validatePassword(securitySettings.newPassword)) {
      errors.newPassword = 'Password must be 12+ characters with uppercase, lowercase, number, and special character';
    }

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (securitySettings.currentPassword === securitySettings.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    if (Object.keys(errors).length > 0) {
      setUiState(prev => ({ ...prev, errors }));
      return;
    }

    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 2000));

    setModals(prev => ({ ...prev, changePassword: false }));
    setSecuritySettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    setUiState(prev => ({
      ...prev,
      loading: false,
      errors: {},
      success: 'Password changed successfully. You will be logged out of all devices.'
    }));

    setTimeout(() => {
      setUiState(prev => ({ ...prev, success: null }));
    }, 5000);
  };

  const handleToggle2FA = async (enabled) => {
    if (!enabled) {
      setModals(prev => ({ ...prev, disable2FA: true }));
      return;
    }

    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: true }));
    setUiState(prev => ({
      ...prev,
      loading: false,
      success: '2FA enabled successfully'
    }));

    setTimeout(() => {
      setUiState(prev => ({ ...prev, success: null }));
    }, 3000);
  };

  const handleDisable2FA = async () => {
    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: false }));
    setModals(prev => ({ ...prev, disable2FA: false }));
    setUiState(prev => ({
      ...prev,
      loading: false,
      success: '2FA disabled. Your account is less secure.'
    }));

    setTimeout(() => {
      setUiState(prev => ({ ...prev, success: null }));
    }, 3000);
  };

  const handleSignOutAll = async () => {
    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 1500));

    setModals(prev => ({ ...prev, signOutAll: false }));
    setUiState(prev => ({
      ...prev,
      loading: false,
      success: 'Signed out of all sessions. Redirecting to login...'
    }));

    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  const handleExportData = async () => {
    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 2000));

    setModals(prev => ({ ...prev, exportData: false }));
    setUiState(prev => ({
      ...prev,
      loading: false,
      success: 'Data export request submitted. You will receive an email within 72 hours.'
    }));

    setTimeout(() => {
      setUiState(prev => ({ ...prev, success: null }));
    }, 5000);
  };

  const handleCloseAccount = async () => {
    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 2000));

    setModals(prev => ({ ...prev, closeAccount: false }));
    setUiState(prev => ({
      ...prev,
      loading: false,
      success: 'Account closure request submitted. Our team will contact you within 3 business days.'
    }));

    setTimeout(() => {
      setUiState(prev => ({ ...prev, success: null }));
    }, 5000);
  };

  const handleSavePreferences = async () => {
    if (uiState.dirtyFields.size === 0) return;

    setUiState(prev => ({ ...prev, loading: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));

    clearDirty();
    setUiState(prev => ({
      ...prev,
      loading: false,
      success: 'Preferences saved successfully'
    }));

    setTimeout(() => {
      setUiState(prev => ({ ...prev, success: null }));
    }, 3000);
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (iso) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(iso);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .settings-page {
          min-height: 100vh;
          background: linear-gradient(to bottom, #F8F9FA 0%, #E9ECEF 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
        }

        .settings-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
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

        .alert-banner {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: slideDown 0.3s ease-out;
        }

        .alert-success {
          background: #D1FAE5;
          border: 1.5px solid #10B981;
        }

        .alert-error {
          background: #FEE2E2;
          border: 1.5px solid #EF4444;
        }

        .alert-text {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5;
        }

        .alert-success .alert-text {
          color: #065F46;
        }

        .alert-error .alert-text {
          color: #991B1B;
        }

        .tabs-nav {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid #E2E8F0;
          margin-bottom: 32px;
          overflow-x: auto;
        }

        .tab-button {
          padding: 14px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-size: 15px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-button:hover {
          color: #334155;
          background: #F8FAFC;
        }

        .tab-button.active {
          color: #0F172A;
          border-bottom-color: #0F172A;
        }

        .section-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 2px solid #F1F5F9;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
        }

        .section-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0F172A 0%, #334155 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }

        .field-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 20px;
          padding: 18px 0;
          border-bottom: 1px solid #F1F5F9;
          align-items: start;
        }

        .field-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .field-label {
          font-size: 14px;
          font-weight: 700;
          color: #475569;
          padding-top: 10px;
        }

        .field-value {
          font-size: 15px;
          font-weight: 600;
          color: #0F172A;
        }

        .field-value-muted {
          color: #64748B;
          font-weight: 500;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-verified {
          background: #D1FAE5;
          color: #065F46;
          border: 1.5px solid #10B981;
        }

        .badge-pending {
          background: #FEF3C7;
          color: #92400E;
          border: 1.5px solid #F59E0B;
        }

        .badge-restricted {
          background: #FEE2E2;
          color: #991B1B;
          border: 1.5px solid #EF4444;
        }

        .masked-field {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toggle-visibility {
          padding: 8px;
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          cursor: pointer;
          color: #475569;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-visibility:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 8px;
        }

        .form-label-required::after {
          content: '*';
          color: #EF4444;
          margin-left: 4px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          font-size: 15px;
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

        .form-input-error {
          border-color: #EF4444;
        }

        .form-input-error:focus {
          border-color: #EF4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .form-error {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #DC2626;
        }

        .form-hint {
          margin-top: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #64748B;
          line-height: 1.5;
        }

        .password-requirements {
          margin-top: 12px;
          padding: 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
        }

        .requirement-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #64748B;
          margin-bottom: 6px;
        }

        .requirement-item:last-child {
          margin-bottom: 0;
        }

        .requirement-met {
          color: #059669;
        }

        .button {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .button-primary {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }

        .button-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.3);
        }

        .button-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .button-secondary {
          background: #F1F5F9;
          color: #334155;
          border: 1.5px solid #CBD5E1;
        }

        .button-secondary:hover {
          background: #E2E8F0;
        }

        .button-danger {
          background: #FEE2E2;
          color: #991B1B;
          border: 1.5px solid #EF4444;
        }

        .button-danger:hover {
          background: #FEF2F2;
        }

        .button-ghost {
          background: transparent;
          color: #475569;
        }

        .button-ghost:hover {
          background: #F8FAFC;
        }

        .button-link {
          background: none;
          border: none;
          color: #0F172A;
          text-decoration: underline;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .button-link:hover {
          color: #334155;
        }

        .pending-change {
          padding: 16px;
          background: #FEF3C7;
          border: 1.5px solid #F59E0B;
          border-radius: 12px;
          margin-top: 12px;
        }

        .pending-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .pending-title {
          font-size: 14px;
          font-weight: 700;
          color: #92400E;
        }

        .pending-details {
          font-size: 13px;
          color: #92400E;
          line-height: 1.6;
        }

        .session-list {
          display: grid;
          gap: 12px;
        }

        .session-item {
          padding: 16px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .session-item-current {
          background: #DBEAFE;
          border-color: #3B82F6;
        }

        .session-info {
          flex: 1;
        }

        .session-device {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .session-meta {
          font-size: 13px;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .toggle-switch {
          position: relative;
          width: 48px;
          height: 28px;
          background: #CBD5E1;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .toggle-switch.active {
          background: #10B981;
        }

        .toggle-slider {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          background: #FFFFFF;
          border-radius: 50%;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-slider {
          transform: translateX(20px);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }
          .modal-content {
      background: #FFFFFF;
      border-radius: 20px;
      max-width: 520px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
      animation: slideUp 0.3s ease-out;
    }

    .modal-header {
      padding: 28px;
      border-bottom: 2px solid #F1F5F9;
    }

    .modal-title {
      font-size: 24px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 6px;
    }

    .modal-subtitle {
      font-size: 14px;
      color: #64748B;
      font-weight: 500;
    }

    .modal-body {
      padding: 28px;
    }

    .modal-footer {
      padding: 20px 28px;
      border-top: 2px solid #F1F5F9;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .countdown-text {
      font-size: 13px;
      font-weight: 600;
      color: #64748B;
      margin-top: 8px;
    }

    .info-banner {
      padding: 16px;
      background: #DBEAFE;
      border: 1.5px solid #3B82F6;
      border-radius: 12px;
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .info-banner-text {
      font-size: 13px;
      line-height: 1.6;
      color: #1E40AF;
      font-weight: 500;
    }

    .warning-banner {
      padding: 16px;
      background: #FEE2E2;
      border: 1.5px solid #EF4444;
      border-radius: 12px;
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .warning-banner-text {
      font-size: 13px;
      line-height: 1.6;
      color: #991B1B;
      font-weight: 600;
    }

    .otp-input {
      width: 100%;
      padding: 16px;
      border: 2px solid #CBD5E1;
      border-radius: 12px;
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      letter-spacing: 8px;
      font-family: 'SF Mono', 'Courier New', monospace;
    }

    .otp-input:focus {
      outline: none;
      border-color: #0F172A;
      box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes slideDown {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: 20px 16px;
      }

      .page-title {
        font-size: 28px;
      }

      .tabs-nav {
        overflow-x: scroll;
      }

      .field-row {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .field-label {
        padding-top: 0;
      }

      .modal-content {
        margin: 0;
        max-height: 100vh;
        border-radius: 0;
      }

      .session-item {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `}</style>

  <div className="settings-page">
    <div className="settings-container">
      <div className="page-header">
        <h1 className="page-title">Profile & Settings</h1>
        <p className="page-subtitle">Manage your account information, security, and preferences</p>
      </div>

      {uiState.success && (
        <div className="alert-banner alert-success">
          <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div className="alert-text">{uiState.success}</div>
        </div>
      )}

      {uiState.errors.global && (
        <div className="alert-banner alert-error">
          <XCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div className="alert-text">{uiState.errors.global}</div>
        </div>
      )}

      <div className="tabs-nav">
        <button
          className={`tab-button ${uiState.activeTab === 'identity' ? 'active' : ''}`}
          onClick={() => setUiState(prev => ({ ...prev, activeTab: 'identity' }))}
        >
          <User size={18} />
        </button>
        <button
          className={`tab-button ${uiState.activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setUiState(prev => ({ ...prev, activeTab: 'contact' }))}
        >
          <Mail size={18} />
        </button>
        <button
          className={`tab-button ${uiState.activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setUiState(prev => ({ ...prev, activeTab: 'security' }))}
        >
          <Shield size={18} />
        </button>
        <button
          className={`tab-button ${uiState.activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setUiState(prev => ({ ...prev, activeTab: 'preferences' }))}
        >
          <Settings size={18} />
        </button>
        <button
          className={`tab-button ${uiState.activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setUiState(prev => ({ ...prev, activeTab: 'privacy' }))}
        >
          <Lock size={18} />
        </button>
      </div>

      {uiState.activeTab === 'identity' && (
        <>
          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <User size={20} />
                </div>
                Account Identity
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Full Legal Name</div>
              <div className="field-value">{userData.fullName}</div>
            </div>

            <div className="field-row">
              <div className="field-label">Customer ID</div>
              <div className="field-value" style={{ fontFamily: 'SF Mono, monospace' }}>
                {userData.customerId}
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Email Address</div>
              <div className="masked-field">
                <div className="field-value" style={{ fontFamily: 'SF Mono, monospace' }}>
                  {uiState.showFullEmail ? userData.fullEmail : userData.email}
                </div>
                <button
                  className="toggle-visibility"
                  onClick={() => setUiState(prev => ({ ...prev, showFullEmail: !prev.showFullEmail }))}
                >
                  {uiState.showFullEmail ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Phone Number</div>
              <div className="masked-field">
                <div className="field-value" style={{ fontFamily: 'SF Mono, monospace' }}>
                  {uiState.showFullPhone ? userData.fullPhone : userData.phone}
                </div>
                <button
                  className="toggle-visibility"
                  onClick={() => setUiState(prev => ({ ...prev, showFullPhone: !prev.showFullPhone }))}
                >
                  {uiState.showFullPhone ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">KYC Status</div>
              <div>
                <span className={`badge ${
                  userData.kycStatus === 'Verified' ? 'badge-verified' :
                  userData.kycStatus === 'Pending' ? 'badge-pending' :
                  'badge-restricted'
                }`}>
                  {userData.kycStatus === 'Verified' && <CheckCircle2 size={14} />}
                  {userData.kycStatus}
                </span>
                <div className="field-value-muted" style={{ marginTop: 6, fontSize: 13 }}>
                  Verified on {formatDate(userData.kycDate)}
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Account Created</div>
              <div className="field-value-muted">{formatDate(userData.accountCreated)}</div>
            </div>

            <div className="field-row">
              <div className="field-label">Last Login</div>
              <div className="field-value-muted">{formatDate(userData.lastLogin)}</div>
            </div>
          </div>

          <div className="info-banner">
            <Info size={20} style={{ flexShrink: 0, marginTop: 2, color: '#3B82F6' }} />
            <div className="info-banner-text">
              <strong>Identity Information Cannot Be Changed Here.</strong> Your legal name, customer ID, and KYC status are locked for security and regulatory compliance. To update identity information, please contact our support team with government-issued identification.
            </div>
          </div>
        </>
      )}

      {uiState.activeTab === 'contact' && (
        <>
          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <Mail size={20} />
                </div>
                Change Email Address
              </div>
            </div>

            {contactInfo.emailPending && (
              <div className="pending-change">
                <div className="pending-header">
                  <div className="pending-title">Email Change Pending</div>
                  <button
                    className="button button-ghost"
                    style={{ padding: '4px 8px', fontSize: 13 }}
                    onClick={() => setContactInfo(prev => ({ ...prev, emailPending: null }))}
                  >
                    Cancel
                  </button>
                </div>
                <div className="pending-details">
                  New email: <strong>{contactInfo.emailPending.newEmail}</strong><br />
                  Requested: {formatDate(contactInfo.emailPending.requestedAt)}<br />
                  Check your inbox to confirm this change. Link expires {formatDate(contactInfo.emailPending.expiresAt)}.
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label form-label-required">New Email Address</label>
              <input
                type="email"
                className={`form-input ${uiState.errors.newEmail ? 'form-input-error' : ''}`}
                placeholder="your.email@example.com"
                value={contactInfo.newEmail}
                onChange={(e) => {
                  setContactInfo(prev => ({ ...prev, newEmail: e.target.value }));
                  setUiState(prev => ({
                    ...prev,
                    errors: { ...prev.errors, newEmail: null }
                  }));
                }}
              />
              {uiState.errors.newEmail && (
                <div className="form-error">
                  <AlertTriangle size={14} />
                  {uiState.errors.newEmail}
                </div>
              )}
              <div className="form-hint">
                You will need to verify your new email address before it becomes active.
              </div>
            </div>

            <button
              className="button button-primary"
              onClick={() => requireReAuth('changeEmail')}
              disabled={!contactInfo.newEmail || !!contactInfo.emailPending}
            >
              <Key size={18} />
              Request Email Change
            </button>
          </div>

          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <Phone size={20} />
                </div>
                Change Phone Number
              </div>
            </div>

            {contactInfo.phonePending && (
              <div className="pending-change">
                <div className="pending-header">
                  <div className="pending-title">Phone Change Pending</div>
                  <button
                    className="button button-ghost"
                    style={{ padding: '4px 8px', fontSize: 13 }}
                    onClick={() => setContactInfo(prev => ({ ...prev, phonePending: null }))}
                  >
                    Cancel
                  </button>
                </div>
                <div className="pending-details">
                  New phone: <strong>{contactInfo.phonePending.newPhone}</strong><br />
                  Requested: {formatDate(contactInfo.phonePending.requestedAt)}<br />
                  Check your SMS to confirm this change. Code expires {formatDate(contactInfo.phonePending.expiresAt)}.
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label form-label-required">New Phone Number</label>
              <input
                type="tel"
                className={`form-input ${uiState.errors.newPhone ? 'form-input-error' : ''}`}
                placeholder="+1 (555) 123-4567"
                value={contactInfo.newPhone}
                onChange={(e) => {
                  setContactInfo(prev => ({ ...prev, newPhone: e.target.value }));
                  setUiState(prev => ({
                    ...prev,
                    errors: { ...prev.errors, newPhone: null }
                  }));
                }}
              />
              {uiState.errors.newPhone && (
                <div className="form-error">
                  <AlertTriangle size={14} />
                  {uiState.errors.newPhone}
                </div>
              )}
              <div className="form-hint">
                You will receive an SMS verification code to confirm your new phone number.
              </div>
            </div>

            <button
              className="button button-primary"
              onClick={() => requireReAuth('changePhone')}
              disabled={!contactInfo.newPhone || !!contactInfo.phonePending}
            >
              <Key size={18} />
              Request Phone Change
            </button>
          </div>
        </>
      )}

      {uiState.activeTab === 'security' && (
        <>
          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <Lock size={20} />
                </div>
                Password & Authentication
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Password</div>
              <div>
                <div className="field-value">••••••••••••</div>
                <div className="field-value-muted" style={{ marginTop: 4, fontSize: 13 }}>
                  Last changed {formatDate(userData.lastPasswordChange)}
                </div>
                <button
                  className="button button-secondary"
                  style={{ marginTop: 12 }}
                  onClick={() => requireReAuth('changePassword')}
                >
                  <Key size={16} />
                  Change Password
                </button>
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Two-Factor Auth</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  className={`toggle-switch ${securitySettings.twoFactorEnabled ? 'active' : ''}`}
                  onClick={() => handleToggle2FA(!securitySettings.twoFactorEnabled)}
                >
                  <div className="toggle-slider" />
                </div>
                <div>
                  <div className="field-value">
                    {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                  <div className="field-value-muted" style={{ marginTop: 4, fontSize: 13 }}>
                    {securitySettings.twoFactorEnabled
                      ? 'Your account is protected with 2FA'
                      : 'Enable 2FA for enhanced security'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <Monitor size={20} />
                </div>
                Active Sessions
              </div>
              <button
                className="button button-danger"
                onClick={() => setModals(prev => ({ ...prev, signOutAll: true }))}
              >
                <LogOut size={16} />
                Sign Out All
              </button>
            </div>

            <div className="session-list">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`session-item ${session.current ? 'session-item-current' : ''}`}
                >
                  <div className="session-info">
                    <div className="session-device">
                      {session.device.includes('iPhone') || session.device.includes('Android') ? (
                        <Smartphone size={18} />
                      ) : (
                        <Monitor size={18} />
                      )}
                      {session.device}
                      {session.current && (
                        <span className="badge badge-verified" style={{ marginLeft: 8 }}>
                          Current
                        </span>
                      )}
                    </div>
                    <div className="session-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={14} />
                        {session.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} />
                        {formatRelativeTime(session.lastActive)}
                      </span>
                    </div>
                  </div>
                  {!session.current && (
                    <button className="button button-ghost">
                      <LogOut size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {uiState.activeTab === 'preferences' && (
        <>
          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <Globe size={20} />
                </div>
                Regional Settings
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Language</label>
              <select
                className="form-input"
                value={preferences.language}
                onChange={(e) => {
                  setPreferences(prev => ({ ...prev, language: e.target.value }));
                  markDirty('language');
                }}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
                <option value="de-DE">Deutsch</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select
                className="form-input"
                value={preferences.timezone}
                onChange={(e) => {
                  setPreferences(prev => ({ ...prev, timezone: e.target.value }));
                  markDirty('timezone');
                }}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Default Currency</label>
              <select
                className="form-input"
                value={preferences.currency}
                disabled
              >
                <option value="USD">USD ($)</option>
              </select>
              <div className="form-hint">
                Currency is determined by your account type and cannot be changed. Contact support for currency conversion options.
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <Bell size={20} />
                </div>
                Communication Preferences
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Transaction Alerts</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  className={`toggle-switch ${preferences.transactionAlerts ? 'active' : ''}`}
                  onClick={() => {
                    setPreferences(prev => ({ ...prev, transactionAlerts: !prev.transactionAlerts }));
                    markDirty('transactionAlerts');
                  }}
                >
                  <div className="toggle-slider" />
                </div>
                <div className="field-value-muted" style={{ fontSize: 13 }}>
                  Receive notifications for account transactions
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Security Alerts</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="toggle-switch active">
                  <div className="toggle-slider" />
                </div>
                <div className="field-value-muted" style={{ fontSize: 13 }}>
                  Required for account security (cannot be disabled)
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Marketing Emails</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  className={`toggle-switch ${preferences.marketingEmails ? 'active' : ''}`}
                  onClick={() => {
                    setPreferences(prev => ({ ...prev, marketingEmails: !prev.marketingEmails }));
                    markDirty('marketingEmails');
                  }}
                >
                  <div className="toggle-slider" />
                </div>
                <div className="field-value-muted" style={{ fontSize: 13 }}>
                  Receive product updates and promotional offers
                </div>
              </div>
            </div>
          </div>

          {uiState.dirtyFields.size > 0 && (
            <div style={{ display: 'flex', gap: 12, position: 'sticky', bottom: 0, padding: '20px 0', background: 'linear-gradient(to bottom, transparent, #F8F9FA 20%)' }}>
              <button
                className="button button-secondary"
                onClick={() => {
                  if (confirm('Discard all unsaved changes?')) {
                    setPreferences({
                      language: 'en-US',
                      timezone: 'America/New_York',
                      currency: 'USD',
                      transactionAlerts: true,
                      securityAlerts: true,
                      marketingEmails: false
                    });
                    clearDirty();
                  }
                }}
              >
                <X size={16} />
                Discard Changes
              </button>
              <button
                className="button button-primary"
                onClick={handleSavePreferences}
                disabled={uiState.loading}
              >
                {uiState.loading ? (
                  <>
                    <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {uiState.activeTab === 'privacy' && (
        <>
          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <FileText size={20} />
                </div>
                Data & Privacy
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Export Your Data</div>
              <div>
                <div className="field-value-muted" style={{ marginBottom: 12, fontSize: 14 }}>
                  Request a copy of all your personal data stored with New Apex Bank.
                </div>
                <button
                  className="button button-secondary"
                  onClick={() => setModals(prev => ({ ...prev, exportData: true }))}
                >
                  <Download size={16} />
                  Request Data Export
                </button>
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Activity Log</div>
              <div>
                <div className="field-value-muted" style={{ marginBottom: 12, fontSize: 14 }}>
                  View a complete history of all account activities and changes.
                </div>
                <button className="button button-secondary">
                  <FileText size={16} />
                  View Activity Log
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Regulatory Disclosures</div>
              <div>
                <div className="field-value-muted" style={{ marginBottom: 12, fontSize: 14 }}>
                  Review our privacy policy, terms of service, and regulatory compliance.
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="button button-ghost">
                    Privacy Policy
                    <ChevronRight size={14} />
                  </button>
                  <button className="button button-ghost">
                    Terms of Service
                    <ChevronRight size={14} />
                  </button>
                  <button className="button button-ghost">
                    GDPR Rights
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <Trash2 size={20} />
                </div>
                Account Closure
              </div>
            </div>

            <div className="warning-banner">
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2, color: '#DC2626' }} />
              <div className="warning-banner-text">
                <strong>This action is permanent and cannot be undone.</strong> Before closing your account, ensure all pending transactions are complete, all linked services are disconnected, and you have exported any data you wish to keep.
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Close Account</div>
              <div>
                <div className="field-value-muted" style={{ marginBottom: 12, fontSize: 14 }}>
                  Permanently close your New Apex Bank account and delete all associated data.
                </div>
                <button
                  className="button button-danger"
                  onClick={() => requireReAuth('closeAccount')}
                >
                  <Trash2 size={16} />
                  Request Account Closure
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>

  {/* Re-Authentication Modal */}
  {modals.reAuth && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Verify Your Identity</h2>
          <p className="modal-subtitle">Enter your password to continue with this action</p>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label form-label-required">Current Password</label>
            <input
              type="password"
              className={`form-input ${uiState.errors.reAuth ? 'form-input-error' : ''}`}
              value={verificationState.reAuthPassword}
              onChange={(e) => {
                setVerificationState(prev => ({ ...prev, reAuthPassword: e.target.value }));
                setUiState(prev => ({
                  ...prev,
                  errors: { ...prev.errors, reAuth: null }
                }));
              }}
            />
            {uiState.errors.reAuth && (
              <div className="form-error">
                <AlertTriangle size={14} />
                {uiState.errors.reAuth}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="button button-secondary"
            onClick={() => {
              setModals(prev => ({ ...prev, reAuth: null }));
              setVerificationState(prev => ({ ...prev, reAuthPassword: '' }));
              setUiState(prev => ({ ...prev, errors: {} }));
            }}
          >
            Cancel
          </button>
          <button
            className="button button-primary"
            onClick={handleReAuth}
            disabled={uiState.loading || !verificationState.reAuthPassword}
          >
            {uiState.loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Email Verification Modal */}
  {modals.verifyEmail && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Verify New Email</h2>
          <p className="modal-subtitle">Enter the 6-digit code sent to {contactInfo.newEmail}</p>
        </div>

        <div className="modal-body">
          {!verificationState.emailSent ? (
            <>
              <div className="info-banner">
                <Mail size={20} style={{ flexShrink: 0, marginTop: 2, color: '#3B82F6' }} />
                <div className="info-banner-text">
                  We will send a verification code to <strong>{contactInfo.newEmail}</strong>. This code expires in 10 minutes.
                </div>
              </div>

              <button
                className="button button-primary"
                style={{ width: '100%' }}
                onClick={handleEmailChange}
                disabled={uiState.loading}
              >
                {uiState.loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label form-label-required">Verification Code</label>
                <input
                  type="text"
                  className={`otp-input ${uiState.errors.emailOtp ? 'form-input-error' : ''}`}
                  maxLength={6}
                  value={verificationState.emailOtp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setVerificationState(prev => ({ ...prev, emailOtp: value }));
                    setUiState(prev => ({
                      ...prev,
                      errors: { ...prev.errors, emailOtp: null }
                    }));
                  }}
                  placeholder="000000"
                />
                {uiState.errors.emailOtp && (
                  <div className="form-error">
                    <AlertTriangle size={14} />
                    {uiState.errors.emailOtp}
                  </div>
                )}
              </div>

              {verificationState.countdown > 0 && (
                <div className="countdown-text">
                  Resend code in {verificationState.countdown}s
                </div>
              )}

              {verificationState.countdown === 0 && (
                <button
                  className="button-link"
                  onClick={handleEmailChange}
                >
                  Resend verification code
                </button>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="button button-secondary"
            onClick={() => {
              setModals(prev => ({ ...prev, verifyEmail: false }));
              setVerificationState(prev => ({ ...prev, emailOtp: '', emailSent: false }));
            }}
          >
            Cancel
          </button>
          {verificationState.emailSent && (
            <button
              className="button button-primary"
              onClick={handleVerifyEmail}
              disabled={uiState.loading || verificationState.emailOtp.length !== 6}
            >
              {uiState.loading ? 'Verifying...' : 'Verify Email'}
            </button>
          )}
        </div>
      </div>
    </div>
  )}

  {/* Phone Verification Modal */}
  {modals.verifyPhone && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Verify New Phone</h2>
          <p className="modal-subtitle">Enter the 6-digit code sent to {contactInfo.newPhone}</p>
        </div>

        <div className="modal-body">
          {!verificationState.phoneSent ? (
            <>
              <div className="info-banner">
                <Phone size={20} style={{ flexShrink: 0, marginTop: 2, color: '#3B82F6' }} />
                <div className="info-banner-text">
                  We will send a verification code via SMS to <strong>{contactInfo.newPhone}</strong>. This code expires in 10 minutes.
                </div>
              </div>

              <button
                className="button button-primary"
                style={{ width: '100%' }}
                onClick={handlePhoneChange}
                disabled={uiState.loading}
              >
                {uiState.loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label form-label-required">Verification Code</label>
                <input
                  type="text"
                  className={`otp-input ${uiState.errors.phoneOtp ? 'form-input-error' : ''}`}
                  maxLength={6}
                  value={verificationState.phoneOtp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setVerificationState(prev => ({ ...prev, phoneOtp: value }));
                    setUiState(prev => ({
                      ...prev,
                      errors: { ...prev.errors, phoneOtp: null }
                    }));
                  }}
                  placeholder="000000"
                />
                {uiState.errors.phoneOtp && (
                  <div className="form-error">
                    <AlertTriangle size={14} />
                    {uiState.errors.phoneOtp}
                  </div>
                )}
              </div>

              {verificationState.countdown > 0 && (
                <div className="countdown-text">
                  Resend code in {verificationState.countdown}s
                </div>
              )}

              {verificationState.countdown === 0 && (
                <button
                  className="button-link"
                  onClick={handlePhoneChange}
                >
                  Resend verification code
                </button>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="button button-secondary"
            onClick={() => {
              setModals(prev => ({ ...prev, verifyPhone: false }));
              setVerificationState(prev => ({ ...prev, phoneOtp: '', phoneSent: false }));
            }}
          >
            Cancel
          </button>
          {verificationState.phoneSent && (
            <button
              className="button button-primary"
              onClick={handleVerifyPhone}
              disabled={uiState.loading || verificationState.phoneOtp.length !== 6}
            >
              {uiState.loading ? 'Verifying...' : 'Verify Phone'}
            </button>
          )}
        </div>
      </div>
    </div>
  )}

  {/* Change Password Modal */}
  {modals.changePassword && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Change Password</h2>
          <p className="modal-subtitle">Create a strong, unique password for your account</p>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label form-label-required">Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={uiState.showCurrentPassword ? 'text' : 'password'}
                className={`form-input ${uiState.errors.currentPassword ? 'form-input-error' : ''}`}
                value={securitySettings.currentPassword}
                onChange={(e) => {
                  setSecuritySettings(prev => ({ ...prev, currentPassword: e.target.value }));
                  setUiState(prev => ({
                    ...prev,
                    errors: { ...prev.errors, currentPassword: null }
                  }));
                }}
              />
              <button
                className="toggle-visibility"
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                onClick={() => setUiState(prev => ({ ...prev, showCurrentPassword: !prev.showCurrentPassword }))}
              >
                {uiState.showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {uiState.errors.currentPassword && (
              <div className="form-error">
                <AlertTriangle size={14} />
                {uiState.errors.currentPassword}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label form-label-required">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={uiState.showNewPassword ? 'text' : 'password'}
                className={`form-input ${uiState.errors.newPassword ? 'form-input-error' : ''}`}
                value={securitySettings.newPassword}
                onChange={(e) => {
                  setSecuritySettings(prev => ({ ...prev, newPassword: e.target.value }));
                  setUiState(prev => ({
                    ...prev,
                    errors: { ...prev.errors, newPassword: null }
                  }));
                }}
              />
              <button
                className="toggle-visibility"
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                onClick={() => setUiState(prev => ({ ...prev, showNewPassword: !prev.showNewPassword }))}
              >
                {uiState.showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {uiState.errors.newPassword && (
              <div className="form-error">
                <AlertTriangle size={14} />
                {uiState.errors.newPassword}
              </div>
            )}

            <div className="password-requirements">
              <div className={`requirement-item ${securitySettings.newPassword.length >= 12 ? 'requirement-met' : ''}`}>
                {securitySettings.newPassword.length >= 12 ? <Check size={14} /> : <X size={14} />}
                At least 12 characters
              </div>
              <div className={`requirement-item ${/[A-Z]/.test(securitySettings.newPassword) ? 'requirement-met' : ''}`}>
                {/[A-Z]/.test(securitySettings.newPassword) ? <Check size={14} /> : <X size={14} />}
                One uppercase letter
              </div>
              <div className={`requirement-item ${/[a-z]/.test(securitySettings.newPassword) ? 'requirement-met' : ''}`}>
                {/[a-z]/.test(securitySettings.newPassword) ? <Check size={14} /> : <X size={14} />}
                One lowercase letter
              </div>
              <div className={`requirement-item ${/[0-9]/.test(securitySettings.newPassword) ? 'requirement-met' : ''}`}>
                {/[0-9]/.test(securitySettings.newPassword) ? <Check size={14} /> : <X size={14} />}
                One number
              </div>
              <div className={`requirement-item ${/[^A-Za-z0-9]/.test(securitySettings.newPassword) ? 'requirement-met' : ''}`}>
                {/[^A-Za-z0-9]/.test(securitySettings.newPassword) ? <Check size={14} /> : <X size={14} />}
                One special character
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label form-label-required">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={uiState.showConfirmPassword ? 'text' : 'password'}
                className={`form-input ${uiState.errors.confirmPassword ? 'form-input-error' : ''}`}
                value={securitySettings.confirmPassword}
                onChange={(e) => {
                  setSecuritySettings(prev => ({ ...prev, confirmPassword: e.target.value }));
                  setUiState(prev => ({
                    ...prev,
                    errors: { ...prev.errors, confirmPassword: null }
                  }));
                }}
              />
              <button
                className="toggle-visibility"
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                onClick={() => setUiState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
              >
                {uiState.showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {uiState.errors.confirmPassword && (
              <div className="form-error">
                <AlertTriangle size={14} />
                {uiState.errors.confirmPassword}
              </div>
            )}
          </div>

          <div className="warning-banner">
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2, color: '#DC2626' }} />
            <div className="warning-banner-text">
              Changing your password will sign you out of all devices. You will need to sign in again with your new password.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="button button-secondary"
            onClick={() => {
              setModals(prev => ({ ...prev, changePassword: false }));
              setSecuritySettings(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              }));
              setUiState(prev => ({ ...prev, errors: {} }));
            }}
          >
            Cancel
          </button>
          <button
            className="button button-primary"
            onClick={handlePasswordChange}
            disabled={uiState.loading}
          >
            {uiState.loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Disable 2FA Modal */}
  {modals.disable2FA && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Disable Two-Factor Authentication</h2>
          <p className="modal-subtitle">This will reduce your account security</p>
        </div>

        <div className="modal-body">
          <div className="warning-banner">
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2, color: '#DC2626' }} />
            <div className="warning-banner-text">
              <strong>Warning:</strong> Disabling 2FA makes your account significantly less secure. We strongly recommend keeping 2FA enabled to protect against unauthorized access.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="button button-secondary"
            onClick={() => setModals(prev => ({ ...prev, disable2FA: false }))}
          >
            Keep 2FA Enabled
          </button>
          <button
            className="button button-danger"
            onClick={handleDisable2FA}
            disabled={uiState.loading}
          >
            {uiState.loading ? 'Disabling...' : 'Disable 2FA'}
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Sign Out All Sessions Modal */}
  {modals.signOutAll && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Sign Out All Sessions</h2>
          <p className="modal-subtitle">You will be signed out from all devices</p>
        </div>

        <div className="modal-body">
          <div className="warning-banner">
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2, color: '#DC2626' }} />
            <div className="warning-banner-text">
              This will immediately sign you out from all devices and browsers, including this one. You will need to sign in again to access your account.
            </div>
          </div>

          <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>
            Active sessions to be terminated: <strong>{sessions.length}</strong>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="button button-secondary"
            onClick={() => setModals(prev => ({ ...prev, signOutAll: false }))}
          >
            Cancel
          </button>
          <button
            className="button button-danger"
            onClick={handleSignOutAll}
            disabled={uiState.loading}
          >
            {uiState.loading ? 'Signing Out...' : 'Sign Out All Sessions'}
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Export Data Modal */}
  {modals.exportData && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Request Data Export</h2>
          <p className="modal-subtitle">Download a copy of your personal data</p>
        </div>

        <div className="modal-body">
          <div className="info-banner">
            <Info size={20} style={{ flexShrink: 0, marginTop: 2, color: '#3B82F6' }} />
            <div className="info-banner-text">
              Your data export will include:<br />
              • Personal information and account details<br />
              • Transaction history and statements<br />
              • Communication preferences and settings<br />
              • Login and activity logs
            </div>
          </div>

          <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.8 }}>
            We will prepare your data export and email you a secure download link within 72 hours. The link will expire after 7 days. Your data will be provided in machine-readable JSON format.
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="button button-secondary"
            onClick={() => setModals(prev => ({ ...prev, exportData: false }))}
          >
            Cancel
          </button>
          <button
            className="button button-primary"
            onClick={handleExportData}
            disabled={uiState.loading}
          >
            {uiState.loading ? 'Requesting...' : 'Request Export'}
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Close Account Modal */}
  {modals.closeAccount && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Close Account</h2>
          <p className="modal-subtitle">This action cannot be undone</p>
        </div>

        <div className="modal-body">
          <div className="warning-banner">
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2, color: '#DC2626' }} />
            <div className="warning-banner-text">
              <strong>Account closure is permanent.</strong> All your data will be deleted after the regulatory retention period. This action cannot be reversed.
            </div>
          </div>

          <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.8, marginTop: 16 }}>
            Before closing your account, please ensure:<br />
            • Your account balance is $0.00<br />
            • All pending transactions are complete<br />
            • All linked services are disconnected<br />
            • You have exported any data you wish to keep<br />
            <br />
            Our team will contact you within 3 business days to confirm closure and address any outstanding items.
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="button button-secondary"
            onClick={() => setModals(prev => ({ ...prev, closeAccount: false }))}
          >
            Cancel
          </button>
          <button
            className="button button-danger"
            onClick={handleCloseAccount}
            disabled={uiState.loading}
          >
            {uiState.loading ? 'Submitting...' : 'Request Closure'}
          </button>
        </div>
      </div>
    </div>
  )}

  <style>{`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}</style>
  </>
  )
}