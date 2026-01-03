import { CreditCard, Wallet, PiggyBank } from "lucide-react";

export const MOCK_ACCOUNTS = [
  {
    id: 1,
    type: "Checking",
    name: "Everyday Checking",
    suffix: "6016",
    balance: 894286.42,
    accent: "#0B62C3",
    recent: [
      { id: "a1", merchant: "Starbucks", date: "2025-10-02", amount: -5.75 },
      { id: "a2", merchant: "Amazon", date: "2025-09-30", amount: -120.45 },
      { id: "a3", merchant: "Stripe", date: "2025-09-28", amount: 1200.0 }
    ],
    Icon: Wallet
  },
  {
    id: 2,
    type: "Savings",
    name: "High-Yield Savings",
    suffix: "3019",
    balance: 299874.33,
    accent: "#1D4ED8",
    recent: [
      { id: "b1", merchant: "Auto Transfer", date: "2025-09-25", amount: -200.0 },
      { id: "b2", merchant: "Interest", date: "2025-09-01", amount: 5.76 }
    ],
    Icon: PiggyBank,
    goal: { target: 20000, saved: 9874.33 }
  },
  {
    id: 3,
    type: "Goal",
    name: "Travel Fund",
    suffix: "5303",
    balance: 133120.0,
    accent: "#8b5cf6",
    recent: [
      { id: "c1", merchant: "Delta Airlines", date: "2025-09-12", amount: -420.0 },
      { id: "c2", merchant: "Hotel Booking", date: "2025-08-18", amount: -280.0 }
    ],
    Icon: CreditCard,
    goal: { target: 5000, saved: 3120 }
  },
  {
    id: 4,
    type: "Credit",
    name: "Platinum Card",
    suffix: "1122",
    balance: -111250.0,
    accent: "#ef4444",
    recent: [
      { id: "d1", merchant: "Grocery Store", date: "2025-09-08", amount: -78.2 },
      { id: "d2", merchant: "Payment Received", date: "2025-09-15", amount: 300.0 }
    ],
    Icon: CreditCard
  }
];