// src/data/transactions.data.js
const TRANSACTION_TYPES = [
  {
    title: "Acme Payroll",
    min: 220_000,
    max: 320_000,
    note: "Salary deposit",
    weight: 4, // bias toward credits
  },
  {
    title: "Interest Credit",
    min: 8_000,
    max: 22_000,
    note: "Savings interest credit",
    weight: 3,
  },
  {
    title: "Treasury Credit",
    min: 6_000,
    max: 18_000,
    note: "Federal interest adjustment",
    weight: 2,
  },
  {
    title: "GlobalX Transfer",
    min: -2_500,
    max: -4_200,
    note: "Residential lease payment",
    weight: 1,
  },
  {
    title: "Recur Energy",
    min: -9_000,
    max: -14_500,
    note: "Electricity & grid services",
    weight: 1,
  },
  {
    title: "Escrow Release",
    min: 300_000,
    max: 2_700_000,
    note: "Legal escrow settlement",
    weight: 1,
  },
];
const weightedTypes = TRANSACTION_TYPES.flatMap(t =>
  Array.from({ length: t.weight }, () => t)
);

const PREVIEW_TRANSACTIONS = [
  {
    id: "tx_2001",
    title: "Acme Payroll",
    ref: "PAY-1123",
    amount: 250000.0,
    status: "Completed",
    date: "2025-11-15T03:12:00Z",
    note: "Monthly salary deposit",
  },
  {
    id: "tx_2002",
    title: "Interest Credit",
    ref: "INT-901",
    amount: 15000.64,
    status: "Completed",
    date: "2025-11-13T00:00:00Z",
    note: "Savings account interest",
  },
  {
    id: "tx_2003",
    title: "Acme Payroll",
    ref: "PAY-1098",
    amount: 42000.0,
    status: "Completed",
    date: "2025-11-10T02:45:00Z",
    note: "Bonus adjustment",
  },
  {
    id: "tx_2004",
    title: "GlobalX Transfer",
    ref: "GX-7789",
    amount: -3000.0,
    status: "Completed",
    date: "2025-11-08T08:00:00Z",
    note: "Residential lease payment",
  },
  {
    id: "tx_2005",
    title: "Recur Energy",
    ref: "RN-556",
    amount: -12000.0,
    status: "Completed",
    date: "2025-11-06T04:30:00Z",
    note: "Electricity & grid services",
  },
  {
    id: "tx_2006",
    title: "Treasury Credit",
    ref: "TR-4482",
    amount: 8700.0,
    status: "Completed",
    date: "2025-11-04T01:00:00Z",
    note: "Federal interest adjustment",
  },
  {
    id: "tx_2007",
    title: "Acme Payroll",
    ref: "PAY-1044",
    amount: 250000.0,
    status: "Completed",
    date: "2025-11-01T03:10:00Z",
    note: "Salary deposit",
  },
];

// anchor history strictly BEFORE November
const NOVEMBER_CUTOFF = new Date("2025-11-01T00:00:00Z").getTime();
export const TOTAL_TRANSACTIONS = 237;
const GENERATED_TRANSACTIONS = Array.from(
  { length: TOTAL_TRANSACTIONS - PREVIEW_TRANSACTIONS.length },
  (_, i) => {
    const type =
      weightedTypes[i % weightedTypes.length];

    const rawAmount =
      Math.random() * (type.max - type.min) + type.min;

    return {
      id: `tx_${300000 + i}`,
      title: type.title,
      ref: `PB-${Math.floor(100000000 + Math.random() * 900000000)}`,
      amount: Number(rawAmount.toFixed(2)),
      status: i % 11 === 0 ? "Pending" : "Completed",
      date: new Date(
        NOVEMBER_CUTOFF - (i + 1) * 48 * 60 * 60 * 1000
      ).toISOString(),
      note: type.note,
    };
  }
);

export const resolveStatus = (status, isoDate) => {
  if (status !== "Pending") return status;

  const hoursElapsed =
    (Date.now() - new Date(isoDate).getTime()) / 36e5;

  if (hoursElapsed <= 24) return "Pending";

  // forced resolution after 24h
  return Math.random() > 0.4 ? "Reversed" : "Failed";
};

export const ALL_TRANSACTIONS = [
  ...PREVIEW_TRANSACTIONS,
  ...GENERATED_TRANSACTIONS,
];
