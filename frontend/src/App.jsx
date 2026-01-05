// App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pageu/Trasactions";
import CardComponent from "./pages/CardPage";
import AccountStatementPage from "./pageu/AccountStatement";
import LocalTransferPage from "./pageu/LocalTransfer";

import Header from "./componenta/Topbar";
import Sidebar from "./componenta/Sidebar";
import LoadingScreen from "./components/LoadingScreen";
import usePageLoader from "./hooks/usePageLoader";
import CheckDepositPage from "./pageu/ChequeDeposit";
import ProfileSettingsPage from "./pageu/ProfileSettings";
import SecurityPrivacyPage from "./pageu/SecurityPrivacy";
import LoginSignupPage from "./pageu/Auth";

/* ---------------- Scroll Controller ---------------- */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ---------------- Layout ---------------- */
function AppLayout() {
  const location = useLocation();
  const loading = usePageLoader();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthRoute = location.pathname.startsWith("/auth");

  // Block EVERYTHING until loading completes
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollToTop />

      {!isAuthRoute && (
        <Header onMenuClick={() => setSidebarOpen(true)} />
      )}

      <div className={`flex h-screen ${!isAuthRoute ? "pt-[64px]" : ""}`}>
        {!isAuthRoute && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-h-0 overflow-y-auto bg-slate-50 p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<LoginSignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account/history" element={<TransactionsPage />} />
            <Route path="/card" element={<CardComponent />} />
            <Route path="/account/statements" element={<AccountStatementPage />} />
            <Route path="/transfer/local" element={<LocalTransferPage />} />
            <Route path="/deposit/cheque" element={<CheckDepositPage />} />
            <Route path="/profile/settings" element={<ProfileSettingsPage />} />
            <Route path="/security/privacy" element={<SecurityPrivacyPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

/* ---------------- App Root ---------------- */
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
