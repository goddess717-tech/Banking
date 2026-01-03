import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Smartphone, Key, Bell, MapPin, Globe, Fingerprint, CreditCard, AlertTriangle, Check, ChevronRight, Settings, Clock, Activity, Database, UserCheck, FileText, MoreVertical, X, Mail, MessageSquare, Phone } from 'lucide-react';

export default function SecurityPrivacyPage() {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const securityScore = 92;

  const devices = [
    { id: 1, name: 'iPhone 15 Pro', location: 'New York, NY', lastActive: '2 minutes ago', current: true, icon: 'phone' },
    { id: 2, name: 'MacBook Pro 16"', location: 'New York, NY', lastActive: '1 hour ago', current: false, icon: 'laptop' },
    { id: 3, name: 'iPad Air', location: 'Brooklyn, NY', lastActive: '2 days ago', current: false, icon: 'tablet' }
  ];

  const recentActivity = [
    { id: 1, action: 'Login successful', device: 'iPhone 15 Pro', location: 'New York, NY', time: '2 minutes ago', status: 'success' },
    { id: 2, action: 'Password changed', device: 'MacBook Pro 16"', location: 'New York, NY', time: '3 days ago', status: 'success' },
    { id: 3, action: 'Failed login attempt', device: 'Unknown device', location: 'San Francisco, CA', time: '1 week ago', status: 'warning' },
    { id: 4, action: '2FA code generated', device: 'iPhone 15 Pro', location: 'New York, NY', time: '2 weeks ago', status: 'success' }
  ];

  const privacySettings = [
    { id: 'data-sharing', title: 'Data Sharing', desc: 'Control how your data is shared', enabled: false },
    { id: 'marketing', title: 'Marketing Communications', desc: 'Receive updates and offers', enabled: true },
    { id: 'analytics', title: 'Usage Analytics', desc: 'Help improve our services', enabled: true },
    { id: 'third-party', title: 'Third-party Access', desc: 'Connected apps and services', enabled: false }
  ];

  return (
    <>
      <style>{`

        .security-privacy-wrapper {
          min-height: 100vh;
          background: linear-gradient(to bottom, #F8FAFC 0%, #F1F5F9 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
          padding-bottom: 60px;
        }

        /* Header Section */
        .security-header {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          padding: 32px 24px 40px;
          position: relative;
          overflow: hidden;
        }

        .security-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .back-button {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #ffffff;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(-2px);
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .header-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #ffffff;
        }

        .header-icon-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .page-title-section {
          margin-bottom: 28px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.8px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .page-subtitle {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          padding-left: 60px;
        }

        /* Security Score Card */
        .security-score-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
          backdrop-filter: blur(20px);
          border: 1.5px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .score-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .score-info {
          flex: 1;
        }

        .score-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .score-value-wrapper {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .score-value {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
        }

        .score-max {
          font-size: 24px;
          font-weight: 700;
          color: #94A3B8;
        }

        .score-visual {
          width: 100px;
          height: 100px;
          position: relative;
        }

        .score-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(
            #10B981 0deg ${props => props.score * 3.6}deg,
            #E2E8F0 ${props => props.score * 3.6}deg 360deg
          );
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .score-circle::before {
          content: '';
          width: 76px;
          height: 76px;
          background: #ffffff;
          border-radius: 50%;
          position: absolute;
        }

        .score-icon {
          position: relative;
          z-index: 2;
          color: #10B981;
        }

        .score-status {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #E2E8F0;
        }

        .status-text {
          font-size: 14px;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 8px;
        }

        .status-desc {
          font-size: 13px;
          color: #64748B;
          line-height: 1.5;
        }

        /* Main Content */
        .security-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          margin-top: -20px;
          position: relative;
          z-index: 3;
        }

        .content-section {
          margin-bottom: 28px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 0 4px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.4px;
        }

        .section-link {
          font-size: 14px;
          font-weight: 600;
          color: #3B82F6;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }

        .section-link:hover {
          color: #2563EB;
        }

        /* Settings Card */
        .settings-card {
          background: #ffffff;
          border: 1.5px solid #E5E7EB;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .setting-item {
          padding: 18px 20px;
          border-bottom: 1px solid #F3F4F6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.15s;
          cursor: pointer;
        }

        .setting-item:last-child {
          border-bottom: none;
        }

        .setting-item:hover {
          background: #F9FAFB;
        }

        .setting-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
        }

        .setting-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .setting-icon-wrapper.success {
          background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
        }

        .setting-icon-wrapper.warning {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
        }

        .setting-icon-wrapper.danger {
          background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
        }

        .setting-info {
          flex: 1;
          min-width: 0;
        }

        .setting-title {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 3px;
          letter-spacing: -0.2px;
        }

        .setting-desc {
          font-size: 13px;
          color: #64748B;
          font-weight: 500;
          line-height: 1.4;
        }

        .setting-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .setting-badge {
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .setting-badge.active {
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
        }

        .setting-badge.inactive {
          background: #FEE2E2;
          color: #DC2626;
          border: 1px solid #FECACA;
        }

        /* Toggle Switch */
        .toggle-switch {
          width: 51px;
          height: 31px;
          background: #E2E8F0;
          border-radius: 999px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
        }

        .toggle-switch.active {
          background: #10B981;
        }

        .toggle-knob {
          width: 27px;
          height: 27px;
          background: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-knob {
          left: 22px;
        }

        /* Device Card */
        .device-card {
          background: #ffffff;
          border: 1.5px solid #E5E7EB;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .device-card:hover {
          border-color: #3B82F6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
          transform: translateY(-2px);
        }

        .device-card.current {
          border-color: #10B981;
          background: linear-gradient(to bottom, #ECFDF5 0%, #ffffff 100%);
        }

        .device-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .device-left {
          display: flex;
          gap: 12px;
          flex: 1;
        }

        .device-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .device-card.current .device-icon-wrapper {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: #ffffff;
        }

        .device-info-wrapper {
          flex: 1;
        }

        .device-name {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 4px;
          letter-spacing: -0.2px;
        }

        .device-location {
          font-size: 13px;
          color: #64748B;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .device-menu-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .device-menu-btn:hover {
          background: #E5E7EB;
        }

        .device-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #F3F4F6;
        }

        .device-last-active {
          font-size: 12px;
          color: #64748B;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .current-badge {
          padding: 4px 10px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #059669;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Activity Item */
        .activity-item {
          padding: 16px;
          background: #ffffff;
          border: 1.5px solid #E5E7EB;
          border-radius: 14px;
          margin-bottom: 10px;
          transition: all 0.2s;
        }

        .activity-item:hover {
          border-color: #CBD5E1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .activity-left {
          display: flex;
          gap: 12px;
          flex: 1;
        }

        .activity-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-icon-wrapper.success {
          background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
          color: #059669;
        }

        .activity-icon-wrapper.warning {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          color: #D97706;
        }

        .activity-action {
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 4px;
          letter-spacing: -0.2px;
        }

        .activity-device {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
        }

        .activity-time {
          font-size: 12px;
          color: #94A3B8;
          font-weight: 600;
        }

        .activity-details {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #F3F4F6;
        }

        .activity-location {
          font-size: 12px;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Action Buttons */
        .action-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 24px;
        }

        .action-btn {
          padding: 16px 20px;
          background: #ffffff;
          border: 1.5px solid #E5E7EB;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
        }

        .action-btn:hover {
          border-color: #3B82F6;
          background: #F9FAFB;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .action-btn-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3B82F6;
        }

        .action-btn-content {
          flex: 1;
          text-align: left;
        }

        .action-btn-title {
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 2px;
          letter-spacing: -0.2px;
        }

        .action-btn-desc {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content {
          background: #ffffff;
          border-radius: 24px;
          max-width: 480px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          padding: 24px 24px 20px;
          border-bottom: 1.5px solid #E5E7EB;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.4px;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .modal-close:hover {
          background: #E5E7EB;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-section {
          margin-bottom: 24px;
        }

        .modal-section:last-child {
          margin-bottom: 0;
        }

        .modal-section-title {
          font-size: 14px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .modal-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #F3F4F6;
        }

        .modal-info-item:last-child {
          border-bottom: none;
        }

        .modal-info-label {
          font-size: 14px;
          color: #64748B;
          font-weight: 600;
        }

        .modal-info-value {
          font-size: 14px;
          color: #0F172A;
          font-weight: 700;
          text-align: right;
        }

        .modal-actions {
          padding: 20px 24px;
          border-top: 1.5px solid #E5E7EB;
          display: flex;
          gap: 12px;
        }

        .modal-btn {
          flex: 1;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .modal-btn-primary {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .modal-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .modal-btn-secondary {
          background: #F3F4F6;
          color: #0F172A;
        }

        .modal-btn-secondary:hover {
          background: #E5E7EB;
        }

        .modal-btn-danger {
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .modal-btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .security-header {
            padding: 24px 20px 32px;
          }

          .page-title {
            font-size: 28px;
          }

          .title-icon {
            width: 44px;
            height: 44px;
          }

          .page-subtitle {
            padding-left: 56px;
            font-size: 14px;
          }

          .security-content {
            padding: 0 20px;
          }

          .score-value {
            font-size: 42px;
          }

          .score-visual {
            width: 90px;
            height: 90px;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .modal-content {
            max-height: 85vh;
          }
        }

        @media (max-width: 480px) {
          .security-header {
            padding: 20px 16px 28px;
          }

          .page-title {
            font-size: 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .page-subtitle {
            padding-left: 0;
          }

          .security-content {
            padding: 0 16px;
          }

          .security-score-card {
            padding: 20px;
          }

          .score-header {
            flex-direction: column;
            gap: 20px;
          }

          .score-visual {
            margin: 0 auto;
          }
        }
      `}</style>

      <div className="security-privacy-wrapper">
        {/* Header */}
        <div className="security-header">
          <div className="header-content">
            <div className="page-title-section">
              <div className="page-title">
                <div className="title-icon">
                  <Shield size={24} strokeWidth={2.5} />
                </div>
                Security & Privacy
              </div>
              <div className="page-subtitle">
                Manage your account security and privacy settings
              </div>
            </div>

            {/* Security Score Card */}
            <div className="security-score-card">
              <div className="score-header">
                <div className="score-info">
                  <div className="score-label">Security Score</div>
                  <div className="score-value-wrapper">
                    <div className="score-value">{securityScore}</div>
                    <div className="score-max">/100</div>
                  </div>
                </div>
                <div className="score-visual">
                  <div 
                    className="score-circle" 
                    style={{
                      background: `conic-gradient(
                        #10B981 0deg ${securityScore * 3.6}deg,
                        #E2E8F0 ${securityScore * 3.6}deg 360deg
                      )`
                    }}
                  >
                    <Check className="score-icon" size={32} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
              <div className="score-status">
                <div className="status-text">Excellent Security</div>
                <div className="status-desc">
                  Your account is well protected. Enable location tracking to reach 100% security score.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="security-content">
          {/* Authentication Section */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-title">Authentication</div>
            </div>
            <div className="settings-card">
              <div className="setting-item" onClick={() => setActiveModal('password')}>
                <div className="setting-left">
                  <div className="setting-icon-wrapper">
                    <Lock size={20} strokeWidth={2} color="#3B82F6" />
                  </div>
                  <div className="setting-info">
                    <div className="setting-title">Password</div>
                    <div className="setting-desc">Last changed 3 days ago</div>
                  </div>
                </div>
                <div className="setting-right">
                  <ChevronRight size={20} strokeWidth={2} color="#94A3B8" />
                </div>
              </div>

              <div className="setting-item" onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}>
                <div className="setting-left">
                  <div className="setting-icon-wrapper success">
                    <Key size={20} strokeWidth={2} color="#059669" />
                  </div>
                  <div className="setting-info">
                    <div className="setting-title">Two-Factor Authentication</div>
                    <div className="setting-desc">Extra layer of security</div>
                  </div>
                </div>
                <div className="setting-right">
                  <div className={`toggle-switch ${twoFactorEnabled ? 'active' : ''}`}>
                    <div className="toggle-knob" />
                  </div>
                </div>
              </div>

              <div className="setting-item" onClick={() => setBiometricEnabled(!biometricEnabled)}>
                <div className="setting-left">
                  <div className="setting-icon-wrapper success">
                    <Fingerprint size={20} strokeWidth={2} color="#059669" />
                  </div>
                  <div className="setting-info">
                    <div className="setting-title">Biometric Login</div>
                    <div className="setting-desc">Face ID and Touch ID</div>
                  </div>
                </div>
                <div className="setting-right">
                  <div className={`toggle-switch ${biometricEnabled ? 'active' : ''}`}>
                    <div className="toggle-knob" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Preferences */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-title">Security Preferences</div>
            </div>
            <div className="settings-card">
              <div className="setting-item" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                <div className="setting-left">
                  <div className="setting-icon-wrapper success">
                    <Bell size={20} strokeWidth={2} color="#059669" />
                  </div>
                  <div className="setting-info">
                    <div className="setting-title">Security Alerts</div>
                    <div className="setting-desc">Get notified of suspicious activity</div>
                  </div>
                </div>
                <div className="setting-right">
                  <div className={`toggle-switch ${notificationsEnabled ? 'active' : ''}`}>
                    <div className="toggle-knob" />
                  </div>
                </div>
              </div>

              <div className="setting-item" onClick={() => setLocationEnabled(!locationEnabled)}>
                <div className="setting-left">
                  <div className="setting-icon-wrapper warning">
                    <MapPin size={20} strokeWidth={2} color="#D97706" />
                  </div>
                  <div className="setting-info">
                    <div className="setting-title">Location Tracking</div>
                    <div className="setting-desc">Helps detect unusual login locations</div>
                  </div>
                </div>
                <div className="setting-right">
                  <div className={`toggle-switch ${locationEnabled ? 'active' : ''}`}>
                    <div className="toggle-knob" />
                  </div>
                </div>
              </div>

              <div className="setting-item" onClick={() => setActiveModal('sessions')}>
                <div className="setting-left">
                  <div className="setting-icon-wrapper">
                    <Globe size={20} strokeWidth={2} color="#3B82F6" />
                  </div>
                  <div className="setting-info">
                    <div className="setting-title">Active Sessions</div>
                    <div className="setting-desc">Manage logged in devices</div>
                  </div>
                </div>
                <div className="setting-right">
                  <div className="setting-badge active">{devices.length} Active</div>
                  <ChevronRight size={20} strokeWidth={2} color="#94A3B8" />
                </div>
              </div>
            </div>
          </div>

          {/* Connected Devices */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-title">Connected Devices</div>
              <div className="section-link" onClick={() => setActiveModal('devices')}>
                View All
                <ChevronRight size={16} strokeWidth={2.5} />
              </div>
            </div>
            {devices.slice(0, 2).map(device => (
              <div 
                key={device.id} 
                className={`device-card ${device.current ? 'current' : ''}`}
                onClick={() => {
                  setSelectedDevice(device);
                  setActiveModal('device-detail');
                }}
              >
                <div className="device-header">
                  <div className="device-left">
                    <div className="device-icon-wrapper">
                      <Smartphone size={20} strokeWidth={2} />
                    </div>
                    <div className="device-info-wrapper">
                      <div className="device-name">{device.name}</div>
                      <div className="device-location">
                        <MapPin size={12} strokeWidth={2} />
                        {device.location}
                      </div>
                    </div>
                  </div>
                  <button className="device-menu-btn" onClick={(e) => {
                    e.stopPropagation();
                  }}>
                    <MoreVertical size={16} strokeWidth={2} />
                  </button>
                </div>
                <div className="device-footer">
                  <div className="device-last-active">
                    <Clock size={12} strokeWidth={2} />
                    {device.lastActive}
                  </div>
                  {device.current && (
                    <div className="current-badge">This Device</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-title">Recent Activity</div>
              <div className="section-link" onClick={() => setActiveModal('activity')}>
                View All
                <ChevronRight size={16} strokeWidth={2.5} />
              </div>
            </div>
            {recentActivity.slice(0, 3).map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-header">
                  <div className="activity-left">
                    <div className={`activity-icon-wrapper ${activity.status}`}>
                      {activity.status === 'success' ? (
                        <Check size={18} strokeWidth={2.5} />
                      ) : (
                        <AlertTriangle size={18} strokeWidth={2.5} />
                      )}
                    </div>
                    <div>
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-device">{activity.device}</div>
                    </div>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
                <div className="activity-details">
                  <div className="activity-location">
                    <MapPin size={12} strokeWidth={2} />
                    {activity.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Privacy Settings */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-title">Privacy Settings</div>
            </div>
            <div className="settings-card">
              <div className="setting-item" onClick={() => setActiveModal('data-privacy')}>
                <div className="setting-left">
                  <div className="setting-icon-wrapper">
                    <Database size={20} strokeWidth={2} color="#3B82F6" />
                  </div>
                  <div className="setting-info">
                    <div className="setting-title">Data & Privacy</div>
                    <div className="setting-desc">Control your personal information</div>
                  </div>
                </div>
                <div className="setting-right">
                  <ChevronRight size={20} strokeWidth={2} color="#94A3B8" />
                </div>
              </div>

              <div className="setting-item" onClick={() => setActiveModal('permissions')}>
                <div className="setting-left">
                  <div className="setting-icon-wrapper">
                    <UserCheck size={20} strokeWidth={2} color="#3B82F6" />
                  </div>
                  <div className="setting-info">
                    <div className="setting-title">App Permissions</div>
                    <div className="setting-desc">Manage third-party access</div>
                  </div>
                </div>
                <div className="setting-right">
                  <div className="setting-badge inactive">2 Apps</div>
                  <ChevronRight size={20} strokeWidth={2} color="#94A3B8" />
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-left">
                  <div className="setting-icon-wrapper">
                    <FileText size={20} strokeWidth={2} color="#3B82F6" />
                  </div>
                  <div className="setting-info">
                    <div className="setting-title">Privacy Policy</div>
                    <div className="setting-desc">View our privacy practices</div>
                  </div>
                </div>
                <div className="setting-right">
                  <ChevronRight size={20} strokeWidth={2} color="#94A3B8" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="action-buttons">
            <button className="action-btn" onClick={() => setActiveModal('export-data')}>
              <div className="action-btn-icon">
                <Database size={20} strokeWidth={2} />
              </div>
              <div className="action-btn-content">
                <div className="action-btn-title">Export Data</div>
                <div className="action-btn-desc">Download your information</div>
              </div>
            </button>

            <button className="action-btn" onClick={() => setActiveModal('delete-account')}>
              <div className="action-btn-icon" style={{ background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', color: '#DC2626' }}>
                <AlertTriangle size={20} strokeWidth={2} />
              </div>
              <div className="action-btn-content">
                <div className="action-btn-title">Delete Account</div>
                <div className="action-btn-desc">Permanently remove</div>
              </div>
            </button>
          </div>
        </div>

        {/* Modals */}
        {activeModal === 'device-detail' && selectedDevice && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Device Details</div>
                <button className="modal-close" onClick={() => setActiveModal(null)}>
                  <X size={18} strokeWidth={2} />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-section">
                  <div className="modal-section-title">Information</div>
                  <div className="modal-info-item">
                    <div className="modal-info-label">Device Name</div>
                    <div className="modal-info-value">{selectedDevice.name}</div>
                  </div>
                  <div className="modal-info-item">
                    <div className="modal-info-label">Location</div>
                    <div className="modal-info-value">{selectedDevice.location}</div>
                  </div>
                  <div className="modal-info-item">
                    <div className="modal-info-label">Last Active</div>
                    <div className="modal-info-value">{selectedDevice.lastActive}</div>
                  </div>
                  <div className="modal-info-item">
                    <div className="modal-info-label">IP Address</div>
                    <div className="modal-info-value">192.168.1.1</div>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="modal-btn modal-btn-secondary" onClick={() => setActiveModal(null)}>
                  Close
                </button>
                {!selectedDevice.current && (
                  <button className="modal-btn modal-btn-danger">
                    Sign Out Device
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeModal === 'password' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Change Password</div>
                <button className="modal-close" onClick={() => setActiveModal(null)}>
                  <X size={18} strokeWidth={2} />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-section">
                  <div className="modal-section-title">Password Requirements</div>
                  <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6' }}>
                    • Minimum 12 characters<br/>
                    • At least one uppercase letter<br/>
                    • At least one number<br/>
                    • At least one special character<br/>
                    • Not previously used
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="modal-btn modal-btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button className="modal-btn modal-btn-primary">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}