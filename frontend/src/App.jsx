// App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

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

function PageWrapper({ children }) {
  const loading = usePageLoader();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  return (
    <div key={location.pathname} className="animate-slideFadeUp">
      {children}
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      {/* TOPBAR */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex min-h-screen pt-[64px]">
        {/* SIDEBAR */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-slate-50 p-4 sm:p-6">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              }
            />

            <Route
              path="/account/history"
              element={
                <PageWrapper>
                  <TransactionsPage />
                </PageWrapper>
              }
            />

            <Route
              path="/card"
              element={
                <PageWrapper>
                  <CardComponent />
                </PageWrapper>
              }
            />

            <Route
              path="/account/statements"
              element={
                <PageWrapper>
                  <AccountStatementPage />
                </PageWrapper>
              }
            />

            <Route
              path="/transfer/local"
              element={
                <PageWrapper>
                  <LocalTransferPage />
                </PageWrapper>
              }
            />
             <Route
              path="/deposit/cheque"
              element={
                <PageWrapper>
                  <CheckDepositPage />
                </PageWrapper>
              }
            />
            <Route
              path="/profile/settings"
              element={
                <PageWrapper>
                  <ProfileSettingsPage />
                </PageWrapper>
              }
            />
            <Route
              path="/security/privacy"
              element={
                <PageWrapper>
                  <SecurityPrivacyPage />
                </PageWrapper>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
