"use client";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { fetchSurplus, fetchHourlyForecast } from "@/lib/api";

const weeklyData = [
  { day: "Mon", generated: 42, consumed: 31, exported: 11 },
  { day: "Tue", generated: 38, consumed: 29, exported: 9 },
  { day: "Wed", generated: 51, consumed: 34, exported: 17 },
  { day: "Thu", generated: 45, consumed: 32, exported: 13 },
  { day: "Fri", generated: 39, consumed: 35, exported: 4 },
  { day: "Sat", generated: 55, consumed: 28, exported: 27 },
  { day: "Sun", generated: 48, consumed: 25, exported: 23 },
];

export default function DashboardPage() {
  const [surplus, setSurplus] = useState<any>(null);
  const [hourly, setHourly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSurplus(), fetchHourlyForecast()])
      .then(([s, h]) => {
        setSurplus(s);
        setHourly(h);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const solar = surplus?.solar_generated ?? 0;
  const consumed = surplus?.consumed ?? 0;
  const surplusKwh = surplus?.surplus ?? 0;
  const revenue = surplus?.export_revenue_estimate ?? 0;

  const kpis = [
    {
      title: "Solar Generated",
      value: loading ? "..." : `${solar} kWh`,
      change: "Live from DB",
      trend: "up",
      icon: "wb_sunny",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      title: "Current Consumption",
      value: loading ? "..." : `${consumed} kWh`,
      change: "Live from DB",
      trend: "down",
      icon: "bolt",
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/10",
    },
    {
      title: "Surplus Available",
      value: loading ? "..." : `${surplusKwh} kWh`,
      change: surplusKwh > 0 ? "Ready to export" : "No surplus yet",
      trend: surplusKwh > 0 ? "up" : "down",
      icon: "battery_charging_full",
      color: "text-tertiary",
      bg: "bg-tertiary/10",
    },
    {
      title: "Est. Revenue",
      value: loading ? "..." : `₹ ${revenue}`,
      change: "From IEX export",
      trend: "up",
      icon: "currency_rupee",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
  ];

  const energyData = hourly.map((h) => ({
    time: h.hour,
    solar: h.predicted_solar,
    consumption: h.predicted_load,
    surplus: Math.max(0, h.predicted_solar - h.predicted_load),
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">Energy Overview</h1>
          <p className="text-body-md text-on-surface-variant">
            Today&apos;s real-time energy intelligence •{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-tertiary rounded-full ai-pulse" />
          <span className="text-label-md text-tertiary">Live</span>
        </div>
      </div>

      {/* Forecast Update Banner */}
      <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 border-l-4 border-l-tertiary">
        <div className="w-9 h-9 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
        </div>
        <div className="min-w-0">
          <p className="text-label-md text-on-surface">Forecast Update</p>
          <p className="text-body-md text-on-surface-variant truncate">
            Tomorrow&apos;s solar forecast: 46.8 kWh — 94.2% confidence (Prophet + LSTM)
          </p>
        </div>
        <span className="ml-auto shrink-0 text-label-md px-3 py-1 rounded-full bg-tertiary/15 text-tertiary">
          AI Forecast
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${kpi.bg} rounded-lg flex items-center justify-center ${kpi.color}`}>
                <span className="material-symbols-outlined text-[20px]">{kpi.icon}</span>
              </div>
              <span
                className={`material-symbols-outlined text-[20px] ${
                  kpi.trend === "up" ? "text-tertiary" : "text-error"
                }`}
              >
                {kpi.trend === "up" ? "trending_up" : "trending_down"}
              </span>
            </div>
            <p className="text-headline-md text-on-surface">{kpi.value}</p>
            <p className="text-body-md text-on-surface-variant">{kpi.title}</p>
            <p className="text-label-md text-tertiary mt-1.5">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-headline-md text-on-surface">Today&apos;s Energy Flow</h3>
            <span className="text-label-md px-3 py-1 rounded-full bg-accent-cyan/15 text-accent-cyan">
              Live
            </span>
          </div>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-on-surface-variant text-body-md">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={energyData}>
                <defs>
                  <linearGradient id="solar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffb95f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffb95f" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="consumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.3} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }} interval={2} />
                <YAxis tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface-container-high)",
                    border: "1px solid var(--outline-variant)",
                    borderRadius: "12px",
                    color: "var(--on-surface)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="solar" stroke="#ffb95f" fill="url(#solar)" name="Solar (kWh)" strokeWidth={2} />
                <Area type="monotone" dataKey="consumption" stroke="#22d3ee" fill="url(#consumption)" name="Consumption (kWh)" strokeWidth={2} />
                <Area type="monotone" dataKey="surplus" stroke="#4edea3" fill="none" name="Surplus (kWh)" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-headline-md text-on-surface">Weekly Energy Summary</h3>
            <span className="text-label-md px-3 py-1 rounded-full bg-primary/15 text-primary">
              7 Days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-container-high)",
                  border: "1px solid var(--outline-variant)",
                  borderRadius: "12px",
                  color: "var(--on-surface)",
                }}
                cursor={{ fill: "var(--on-surface)", opacity: 0.05 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="generated" fill="#ffb95f" name="Generated (kWh)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="consumed" fill="#22d3ee" name="Consumed (kWh)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exported" fill="#4edea3" name="Exported (kWh)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "CO₂ Saved", value: loading ? "..." : `${(solar * 0.82).toFixed(1)} kg`, sub: "Today", color: "text-tertiary" },
          { label: "Trees Equivalent", value: loading ? "..." : `${(solar * 0.04).toFixed(1)}`, sub: "Trees saved", color: "text-tertiary" },
          { label: "Grid Independence", value: loading ? "..." : `${consumed > 0 ? Math.min(100, Math.round((solar / consumed) * 100)) : 0}%`, sub: "Self-sufficient", color: "text-accent-cyan" },
          { label: "Monthly Savings", value: "₹8,240", sub: "This month", color: "text-secondary" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 bg-surface-container-lowest/60">
            <p className={`text-headline-md ${stat.color}`}>{stat.value}</p>
            <p className="text-body-md text-on-surface-variant">{stat.label}</p>
            <p className="text-label-md text-outline mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}