import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';


export default function Topbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const location = useLocation();

useEffect(() => {
  setShowProfile(false);
}, [location.pathname]);


  return (
    <>
      <style>{`
        .topbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #E5E7EB;
          z-index: 100;
        }

        .topbar-container {
          height: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .topbar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          cursor: pointer;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: #111827;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .logo-text {
          font-size: 17px;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.3px;
        }

        .topbar-search {
          position: relative;
          width: 320px;
        }

        .topbar-search-input {
          width: 100%;
          height: 40px;
          padding: 0 16px 0 40px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 14px;
          color: #111827;
          background: #F9FAFB;
          transition: all 0.2s;
        }

        .topbar-search-input:focus {
          outline: none;
          border-color: #3B82F6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .topbar-search-input::placeholder {
          color: #9CA3AF;
        }

        .topbar-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #6B7280;
          pointer-events: none;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .topbar-icon-btn {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          color: #374151;
          transition: all 0.15s;
        }

        .topbar-icon-btn:hover {
          background: #F3F4F6;
          color: #111827;
        }

        .topbar-icon-btn:active {
          background: #E5E7EB;
        }

        .notification-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: #EF4444;
          border: 2px solid #ffffff;
          border-radius: 50%;
        }

        .topbar-profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 40px;
          padding: 0 8px 0 4px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .topbar-profile-btn:hover {
          background: #F3F4F6;
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #050D1F 0%, #1D4ED8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
        }

        .profile-name {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
        }

        .profile-chevron {
          width: 16px;
          height: 16px;
          color: #6B7280;
          transition: transform 0.2s;
        }

        .topbar-profile-btn:hover .profile-chevron {
          color: #374151;
        }
        .mobile-menu-btn {
        color: #374151;
        }


        .dropdown {
          position: absolute;
          top: 56px;
          right: 24px;
          width: 280px;
          background: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 8px;
          display: none;
          animation: dropdownSlide 0.2s ease;
        }

        .dropdown.show {
          display: block;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .dropdown-item:hover {
          background: #F3F4F6;
          color: #111827;
        }

        .dropdown-divider {
          height: 1px;
          background: #E5E7EB;
          margin: 8px 0;
        }

        @media (max-width: 1024px) {
          .topbar-search {
            width: 240px;
          }
        }

        @media (max-width: 768px) {
          .topbar-container {
            padding: 0 16px;
          }

          .topbar-search {
            display: none;
          }

          .topbar-left {
            gap: 0;
          }

          .profile-name {
            display: none;
          }
        }
      `}</style>

      <header className="topbar">
        <div className="topbar-container">
          <div className="topbar-left">
            <Link to='/dashboard'>
              <img  src="/logo.png" alt="" style={{height:'50px'}} />
            </Link>

            <div className="topbar-search">
              <svg className="topbar-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="topbar-search-input"
                placeholder="Search transactions, payees..."
              />
            </div>
          </div>

          <div className="topbar-right">
            <button className="topbar-icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="notification-badge"></span>
            </button>

            {/* <button className="topbar-icon-btn">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button> */}

            <button className="topbar-profile-btn" onClick={() => setShowProfile(!showProfile)}>
              <div className="profile-avatar">CK</div>
              <span className="profile-name">CINDY KAZA</span>
              <svg className="profile-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              className="mobile-menu-btn"
              onClick={onMenuClick}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        <div className={`dropdown ${showProfile ? 'show' : ''}`}>
          <Link to='/profile/settings' className="dropdown-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile Settings
          </Link>
          <Link to='/security/privacy' className="dropdown-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security & Privacy
          </Link>
          <div className="dropdown-divider"></div>
          <Link to='/auth' className="dropdown-item" style={{ color: '#b82d2dff' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </Link>
        </div>
      </header>
    </>
  );
}