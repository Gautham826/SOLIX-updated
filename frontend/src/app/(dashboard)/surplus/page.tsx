"use client";
import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { fetchSurplus } from "@/lib/api";

const PIE_COLORS = ["#22d3ee", "#4edea3"]; // consumed=cyan, surplus=emerald

const surplusHistory = [
  { date: "Jun 9", surplus: 5.2 },
  { date: "Jun 10", surplus: 8.1 },
  { date: "Jun 11", surplus: 3.4 },
  { date: "Jun 12", surplus: 9.7 },
  { date: "Jun 13", surplus: 6.3 },
  { date: "Jun 14", surplus: 7.6 },
  { date: "Jun 15", surplus: 0 },
];

export default function SurplusPage() {
  const [surplus, setSurplus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSurplus()
      .then((data) => {
        setSurplus(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load surplus data");
        setLoading(false);
      });
  }, []);

  const pieData = surplus
    ? [
        { name: "Consumed", value: surplus.consumed },
        { name: "Surplus", value: surplus.surplus },
      ]
    : [];

  const kpis = [
    {
      label: "Solar Generated",
      value: loading ? "..." : `${surplus?.solar_generated} kWh`,
      icon: "wb_sunny",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Energy Consumed",
      value: loading ? "..." : `${surplus?.consumed} kWh`,
      icon: "bolt",
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/10",
    },
    {
      label: "Surplus Available",
      value: loading ? "..." : `${surplus?.surplus} kWh`,
      icon: "battery_charging_full",
      color: "text-tertiary",
      bg: "bg-tertiary/10",
    },
  ];

  const tooltipStyle = {
    background: "var(--surface-container-high)",
    border: "1px solid var(--outline-variant)",
    borderRadius: "12px",
    color: "var(--on-surface)",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
          <span className="material-symbols-outlined">battery_charging_full</span>
        </div>
        <div>
          <h1 className="text-headline-md text-on-surface">Surplus Analysis</h1>
          <p className="text-body-md text-on-surface-variant">
            Track and monetise your excess solar energy
          </p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-xl px-4 py-3 text-error text-body-md border-l-4 border-l-error">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {kpis.map((item) => (
          <div key={item.label} className="glass-card rounded-xl p-5">
            <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mb-3 ${item.color}`}>
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </div>
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-on-surface-variant">progress_activity</span>
            ) : (
              <p className={`text-headline-lg ${item.color}`}>{item.value}</p>
            )}
            <p className="text-body-md text-on-surface-variant mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Formula Banner */}
      {surplus && (
        <div className="glass-card rounded-xl p-4 flex items-center justify-between border-l-4 border-l-tertiary">
          <div className="min-w-0">
            <p className="text-label-md text-on-surface">
              Surplus = Solar Generated − Energy Consumed
            </p>
            <p className="text-body-md text-on-surface-variant mt-1">
              {surplus.solar_generated} kWh − {surplus.consumed} kWh ={" "}
              <span className="text-tertiary font-bold">{surplus.surplus} kWh surplus</span> • Est.
              Revenue: <span className="text-secondary font-bold">₹{surplus.export_revenue_estimate}</span>
            </p>
          </div>
          <span className="ml-3 shrink-0 text-label-md px-3 py-1 rounded-full bg-tertiary/15 text-tertiary">
            Live from DB
          </span>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-headline-md text-on-surface mb-4">Today&apos;s Energy Distribution</h3>
          {loading ? (
            <div className="flex items-center justify-center h-[230px]">
              <span className="material-symbols-outlined animate-spin text-on-surface-variant text-[32px]">progress_activity</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value} kWh`}
                  labelLine={{ stroke: "var(--outline-variant)" }}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} stroke="var(--surface)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-headline-md text-on-surface mb-4">7-Day Surplus Trend</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={surplusHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--on-surface)", opacity: 0.05 }} />
              <Bar dataKey="surplus" fill="#4edea3" name="Surplus (kWh)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}