"use client";
import { useEffect, useState } from "react";
import { fetchSurplus, fetchRecommendations } from "@/lib/api";

const priorityStyle: Record<string, string> = {
  high: "bg-tertiary/15 text-tertiary",
  medium: "bg-secondary/15 text-secondary",
  low: "bg-accent-cyan/15 text-accent-cyan",
};

export default function OptimizePage() {
  const [surplus, setSurplus] = useState<any>(null);
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSurplus(), fetchRecommendations()])
      .then(([s, r]) => {
        setSurplus(s);
        setRecs(r);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalSavings = recs.reduce((a, r) => a + (r.saving_amount || 0), 0);
  const solarUtil = surplus
    ? Math.min(100, Math.round((surplus.solar_generated / (surplus.solar_generated + 1)) * 100))
    : 0;

  const stats = [
    {
      label: "Today's Savings",
      value: loading ? "..." : `₹${totalSavings}`,
      icon: "trending_down",
      color: "text-tertiary",
      bg: "bg-tertiary/10",
    },
    {
      label: "Solar Utilization",
      value: loading ? "..." : `${solarUtil}%`,
      icon: "wb_sunny",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Surplus Available",
      value: loading ? "..." : `${surplus?.surplus ?? 0} kWh`,
      icon: "battery_charging_full",
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/10",
    },
    {
      label: "Actions Pending",
      value: loading ? "..." : `${recs.length}`,
      icon: "schedule",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
          <span className="material-symbols-outlined">tune</span>
        </div>
        <div>
          <h1 className="text-headline-md text-on-surface">Optimization Engine</h1>
          <p className="text-body-md text-on-surface-variant">
            AI-powered load scheduling and cost minimization
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
            </div>
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-on-surface-variant text-[20px]">
                progress_activity
              </span>
            ) : (
              <p className={`text-headline-md ${stat.color}`}>{stat.value}</p>
            )}
            <p className="text-body-md text-on-surface-variant mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action Schedule Table */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-headline-md text-on-surface">Optimized Action Schedule</h3>
          <span className="text-label-md px-3 py-1 rounded-full bg-tertiary/15 text-tertiary">
            Live from DB
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <span className="material-symbols-outlined animate-spin text-on-surface-variant text-[32px]">
              progress_activity
            </span>
          </div>
        ) : recs.length === 0 ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant">
              event_available
            </span>
            <p className="text-body-md text-on-surface-variant mt-2">No scheduled actions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  {["Time Slot", "Action", "Expected Saving", "Priority", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-label-md text-on-surface-variant uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {recs.map((rec, i) => (
                  <tr
                    key={i}
                    className="hover:bg-on-surface/5 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-label-md text-on-surface-variant">
                      {rec.action_time}
                    </td>
                    <td className="py-3 px-4 text-body-md text-on-surface font-medium max-w-xs">
                      {rec.recommendation}
                    </td>
                    <td className="py-3 px-4 text-label-md text-tertiary font-bold">
                      ₹{rec.saving_amount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-label-md px-2.5 py-0.5 rounded-full ${
                          priorityStyle[rec.priority] || "bg-primary/15 text-primary"
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-label-md px-2.5 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan">
                        Scheduled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Strip */}
      <div className="glass-card rounded-2xl p-5 border border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">summarize</span>
          <h3 className="text-headline-md text-on-surface">Optimization Summary</h3>
        </div>
        <p className="text-body-md text-on-surface-variant mb-4">
          Based on live DB data and AI recommendations
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              label: "Total Potential Savings",
              value: loading ? "..." : `₹${totalSavings}`,
              sub: "From all actions today",
              color: "text-secondary",
            },
            {
              label: "Solar Generated",
              value: loading ? "..." : `${surplus?.solar_generated ?? 0} kWh`,
              sub: "Live from meter",
              color: "text-secondary",
            },
            {
              label: "Surplus Available",
              value: loading ? "..." : `${surplus?.surplus ?? 0} kWh`,
              sub: "Ready to export",
              color: "text-tertiary",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-4 bg-surface-container-highest/40 border border-outline-variant/20"
            >
              <p className={`text-headline-md ${item.color}`}>{item.value}</p>
              <p className="text-body-md text-on-surface mt-1">{item.label}</p>
              <p className="text-label-md text-outline mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}