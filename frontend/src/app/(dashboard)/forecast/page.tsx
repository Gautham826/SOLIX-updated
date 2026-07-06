"use client";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { fetchForecasts, fetchHourlyForecast, fetchForecastAccuracy } from "@/lib/api";

export default function ForecastPage() {
  const [weekly, setWeekly] = useState<any[]>([]);
  const [hourly, setHourly] = useState<any[]>([]);
  const [accuracy, setAccuracy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"24h" | "7d">("24h");

  useEffect(() => {
    Promise.all([
      fetchForecasts(),
      fetchHourlyForecast(),
      fetchForecastAccuracy(),
    ])
      .then(([w, h, a]) => {
        setWeekly(w);
        setHourly(h);
        setAccuracy(a);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load forecast data");
        setLoading(false);
      });
  }, []);

  const totalSolar = weekly.reduce((a, r) => a + r.predicted_solar, 0).toFixed(1);
  const peakLoad = weekly.length ? Math.max(...weekly.map((r) => r.predicted_load)).toFixed(1) : "—";

  const stats = [
    {
      value: loading ? "..." : accuracy?.accuracy != null ? `${accuracy.accuracy}%` : "—",
      label: "Forecast Accuracy",
      sub: loading ? "" : accuracy?.message || accuracy?.model || "",
      icon: "verified",
      color: "text-tertiary",
      bg: "bg-tertiary/10",
    },
    {
      value: loading ? "..." : `${totalSolar} kWh`,
      label: "7-Day Solar Forecast",
      sub: "High confidence",
      icon: "wb_sunny",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      value: loading ? "..." : `${peakLoad} kWh`,
      label: "Peak Demand",
      sub: "Expected this week",
      icon: "bolt",
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/10",
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
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">trending_up</span>
        </div>
        <div>
          <h1 className="text-headline-md text-on-surface">Forecasting Engine</h1>
          <p className="text-body-md text-on-surface-variant">
            Prophet + historical-average powered predictions
          </p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-xl px-4 py-3 text-error text-body-md border-l-4 border-l-error">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center ${s.color}`}>
                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
              </div>
            </div>
            <p className={`text-headline-lg ${s.color}`}>{s.value}</p>
            <p className="text-body-md text-on-surface-variant mt-1">{s.label}</p>
            <p className="text-label-md text-outline mt-1 truncate">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Forecast Chart */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-headline-md text-on-surface">Energy Forecast</h3>
          <span className="text-label-md px-3 py-1 rounded-full bg-tertiary/15 text-tertiary">
            Live from API
          </span>
        </div>

        {loading ? (
          <p className="text-on-surface-variant text-body-md py-12 text-center">
            Loading forecast data...
          </p>
        ) : (
          <>
            {/* Tab toggle */}
            <div className="inline-flex bg-surface-container-highest/40 p-1 rounded-xl mb-4">
              <button
                onClick={() => setTab("24h")}
                className={`px-4 py-2 rounded-lg text-label-md transition-all ${
                  tab === "24h"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                suppressHydrationWarning
              >
                Next 24 Hours
              </button>
              <button
                onClick={() => setTab("7d")}
                className={`px-4 py-2 rounded-lg text-label-md transition-all ${
                  tab === "7d"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                suppressHydrationWarning
              >
                Next 7 Days
              </button>
            </div>

            {tab === "24h" && (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={hourly}>
                  <defs>
                    <linearGradient id="solar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffb95f" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ffb95f" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="load" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.3} />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }} interval={2} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="predicted_solar" stroke="#ffb95f" fill="url(#solar)" name="Solar (kWh)" strokeWidth={2} />
                  <Area type="monotone" dataKey="predicted_load" stroke="#22d3ee" fill="url(#load)" name="Load (kWh)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {tab === "7d" && (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={weekly}>
                    <defs>
                      <linearGradient id="solar7" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffb95f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ffb95f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.3} />
                    <XAxis dataKey="forecast_date" tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="predicted_solar" stroke="#ffb95f" fill="url(#solar7)" name="Solar (kWh)" strokeWidth={2} />
                    <Area type="monotone" dataKey="predicted_load" stroke="#22d3ee" fill="none" name="Load (kWh)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="mt-4 grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {weekly.map((d, i) => (
                    <div key={i} className="text-center p-3 rounded-xl bg-surface-container-highest/40 border border-outline-variant/20">
                      <p className="text-label-md text-outline">{d.forecast_date.slice(5)}</p>
                      <p className="text-headline-md text-secondary mt-1">{d.predicted_solar}</p>
                      <p className="text-label-md text-on-surface-variant">kWh</p>
                      <p className="text-label-md text-tertiary mt-1">{Math.round(d.confidence * 100)}%</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}