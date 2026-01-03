// components/SpendingOverview.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area
} from "recharts";
import { motion } from "framer-motion";
import { currency } from "../utils/format";

function useInViewOnce(options = { threshold: 0.12 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      });
    }, options);

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}

const CATEGORIES = [
  { id: "c1", label: "Food & Dining", value: 1200, color: "#4F46E5" },
  { id: "c2", label: "Shopping", value: 800, color: "#0EA5E9" },
  { id: "c3", label: "Transport", value: 400, color: "#14B8A6" },
  { id: "c4", label: "Bills", value: 650, color: "#F43F5E" }
];

export default function SpendingOverview() {
  const [ref, inView] = useInViewOnce();
  const [categories] = useState(CATEGORIES);

  const areaData = [
    { name: "Apr", value: 1200 },
    { name: "May", value: 1500 },
    { name: "Jun", value: 1100 },
    { name: "Jul", value: 1750 },
    { name: "Aug", value: 1290 },
    { name: "Sep", value: 1450 }
  ];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="card p-6 rounded-2xl shadow-lg dark:bg-ink-900/40"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="section-title text-slate-700 dark:text-slate-300">Spending Overview</h3>
        <span className="text-xs text-slate-500">This month vs last month</span>
      </div>

      {/* AREA CHART */}
      <div className="h-56 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="gradSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: 12, fill: "#64748b" }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => currency(v)}
              style={{ fontSize: 12, fill: "#64748b" }}
              orientation="left"
            />

            <Tooltip formatter={(v) => currency(v)} />

            <Area
              dataKey="value"
              type="monotone"
              stroke="#60A5FA"
              strokeWidth={2.4}
              fill="url(#gradSpending)"
              animationDuration={900}
              activeDot={{ r: 6, fill: "#60A5FA", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* PIE + CATEGORY LIST (SIDE BY SIDE) */}
      <div className="flex items-center gap-8">
        {/* Donut Pie */}
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="label"
                innerRadius={55}
                outerRadius={80}
                cornerRadius={8}
                paddingAngle={4}
                labelLine={false}
                label={false} 
              >
                {categories.map((c) => (
                  <Cell key={c.id} fill={c.color} />
                ))}
              </Pie>

              <Tooltip formatter={(v) => currency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category List */}
        <div className=" space-y-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: c.color }}
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{c.label}</span>
              </div>

              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {currency(c.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
