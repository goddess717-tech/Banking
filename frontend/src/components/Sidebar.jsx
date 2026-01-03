// components/Sidebar.jsx
import React, { useState } from "react";
import {
  Gauge,
  CreditCard,
  BarChart3,
  Settings,
  Wallet,
  ArrowRightLeft,
  HandHelping,
  MessageCircleHeart,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_ACCOUNTS } from "../helper/mockaccount";
import { NavLink, useLocation } from "react-router-dom";

// Sidebar slide-in animation
const sidebarVariants = {
  hidden: { opacity: 0, x: -32 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: .55,
      ease: "easeOut",
      delay: 0.25, // matches Dashboard entry timing
    },
  },
};

export default function Sidebar() {
  const [accounts] = useState(MOCK_ACCOUNTS);
  const { pathname } = useLocation();

  const main = [
    { label: "Dashboard", Icon: Gauge, path: "/dashboard", badge: null },
    { label: "Accounts", Icon: Wallet, path: "/accounts", badge: accounts.length },
    { label: "Transactions", Icon: ArrowRightLeft, path: "/transactions", badge: null },
    { label: "Cards", Icon: CreditCard, path: "/cards", badge: 2 },
    { label: "Insights", Icon: BarChart3, path: "/insights", badge: null },
  ];

  const support = [
    { label: "Help", Icon: HandHelping },
    { label: "Feedback", Icon: MessageCircleHeart },
  ];

  const bottomside = [
    { label: "Settings", Icon: Settings },
    { label: "Logout", Icon: LogOut },
  ];

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="show"
      className="
        hidden lg:flex lg:flex-col
        w-64 h-screen fixed left-0 top-0
        bg-white/60 dark:bg-ink-800/60
        backdrop-blur-xl
        border-r border-black/15 dark:border-white/10
      "
      style={{ paddingTop: "100px" }}
    >
      {/* Scrollable area */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scroll space-y-8">
        {/* Section: Main */}
        <div>
          <h6 className="uppercase tracking-wide text-xs text-slate-500 dark:text-slate-400 mb-3">
            Main
          </h6>

          <div className="space-y-1.5">
            {main.map((n) => {
              const isActive = pathname.startsWith(n.path);

              return (
                <NavLink
                  key={n.label}
                  to={n.path}
                  className={`
                    group relative w-full flex items-center justify-between 
                    px-3 py-2 rounded-xl transition-all
                    text-[15px] font-medium
                    ${
                      isActive
                        ? "bg-[#0C1F3F]/10 dark:bg-[#0C1F3F] text-[#0F5F7F] shadow-inner"
                        : "text-slate-700 dark:text-slate-300 hover:bg-white/5"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-[#0F5F7F] rounded-r-xl"></div>
                  )}

                  <div className="flex items-center gap-3">
                    <n.Icon
                      className={`
                        w-5 h-5 transition-colors
                        ${
                          isActive
                            ? "text-[#0F5F7F]"
                            : "text-slate-500 dark:text-slate-400 group-hover:text-[#0F5F7F]"
                        }
                      `}
                    />
                    <span>{n.label}</span>
                  </div>

                  {n.badge && (
                    <span
                      className="
                        text-xs px-2 py-0.5 rounded-full 
                        bg-slate-200 dark:bg-ink-700 
                        text-slate-600 dark:text-slate-300
                      "
                    >
                      {n.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Support Section */}
      <div
        className="
          px-4 py-5 border-t
          border-black/15 dark:border-white/10
          bg-white/30 dark:bg-ink-900/40
          backdrop-blur-xl
          absolute left-0 bottom-[200px] w-full
        "
      >
        <h6 className="uppercase tracking-wide text-xs text-slate-500 dark:text-slate-400 mb-3">
          Support
        </h6>

        <div className="space-y-1.5">
          {support.map((n) => (
            <button
              key={n.label}
              className="
                w-full flex items-center justify-between font-medium
                px-3 py-2 rounded-xl transition 
                text-[15px] text-slate-700 dark:text-slate-300 
                hover:bg-black/5 dark:hover:bg-white/5
              "
            >
              <div className="flex items-center gap-3">
                <n.Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span>{n.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div
        className="
          px-4 py-5 border-t
          border-black/15 dark:border-white/10
          bg-white/30 dark:bg-ink-900/40
          backdrop-blur-xl
          absolute bottom-0 left-0 w-full
        "
      >
        <div className="space-y-1.5">
          {bottomside.map((n) => (
            <button
              key={n.label}
              className="
                w-full flex items-center gap-3 
                px-3 py-2 rounded-xl 
                text-[15px] 
                text-slate-700 dark:text-slate-300
                hover:bg-black/5 dark:hover:bg-white/5 font-medium
              "
            >
              <n.Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
