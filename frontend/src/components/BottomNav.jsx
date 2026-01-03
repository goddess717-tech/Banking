// components/BottomNav.jsx
import React from "react";
import { Home, CreditCard, BarChart3, Settings } from "lucide-react";

export default function BottomNav() {
  const links = [
    { id: 1, label: "Home", Icon: Home },
    { id: 2, label: "Cards", Icon: CreditCard },
    { id: 3, label: "Analytics", Icon: BarChart3 },
    { id: 4, label: "Settings", Icon: Settings },
  ];

  return (
    <nav className="flex justify-around bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2">
      {links.map(({ id, label, Icon }) => (
        <button
          key={id}
          className="flex flex-col items-center text-xs text-slate-700 dark:text-slate-300"
        >
          <Icon className="w-5 h-5 mb-0.5" />
          {label}
        </button>
      ))}
    </nav>
  );
}
