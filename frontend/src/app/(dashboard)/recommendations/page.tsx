"use client";
import { useEffect, useState } from "react";
import { fetchRecommendations } from "@/lib/api";

const iconMap: Record<string, string> = {
  high: "trending_up",
  medium: "bolt",
  low: "battery_charging_full",
};

const priorityStyle: Record<string, string> = {
  high: "bg-tertiary/15 text-tertiary",
  medium: "bg-secondary/15 text-secondary",
  low: "bg-accent-cyan/15 text-accent-cyan",
};

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<any[]>([]);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecommendations()
      .then((data) => {
        setRecs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load recommendations");
        setLoading(false);
      });
  }, []);

  function handleApply(id: number) {
    setApplied((prev) => new Set([...prev, id]));
  }

  const pendingRecs = recs.filter((r) => !applied.has(r.id));
  const totalSavings = pendingRecs.reduce((a, r) => a + (r.saving_amount || 0), 0);

  const stats = [
    {
      label: "Total Potential Savings",
      value: `₹${totalSavings}`,
      sub: "From pending actions",
      color: "text-secondary",
      icon: "savings",
      bg: "bg-secondary/10",
    },
    {
      label: "Actions Available",
      value: pendingRecs.length.toString(),
      sub: "Pending review",
      color: "text-accent-cyan",
      icon: "task_alt",
      bg: "bg-accent-cyan/10",
    },
    {
      label: "Implemented This Week",
      value: (12 + applied.size).toString(),
      sub: "Actions taken",
      color: "text-tertiary",
      icon: "check_circle",
      bg: "bg-tertiary/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <div>
          <h1 className="text-headline-md text-on-surface">Smart Recommendations</h1>
          <p className="text-body-md text-on-surface-variant">
            AI-generated actions to maximise savings and revenue
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
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color}`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
            </div>
            <p className={`text-headline-lg ${stat.color}`}>{stat.value}</p>
            <p className="text-body-md text-on-surface-variant mt-1">{stat.label}</p>
            <p className="text-label-md text-outline mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recommendations List */}
      {loading ? (
        <p className="text-on-surface-variant text-body-md py-8 text-center">
          Loading recommendations...
        </p>
      ) : recs.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-2">
            lightbulb
          </span>
          <p className="text-body-md text-on-surface-variant">
            No recommendations available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recs.map((rec) => {
            const isApplied = applied.has(rec.id);
            return (
              <div
                key={rec.id}
                className={`glass-card rounded-2xl p-5 transition-all ${
                  isApplied
                    ? "opacity-50 border border-tertiary/20"
                    : "hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isApplied ? "bg-tertiary/10 text-tertiary" : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {isApplied ? "check_circle" : (iconMap[rec.priority] || "lightbulb")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className={`text-headline-md ${isApplied ? "text-on-surface-variant line-through" : "text-on-surface"}`}>
                        {rec.recommendation}
                      </h3>
                      <span
                        className={`text-label-md px-2.5 py-0.5 rounded-full ${
                          isApplied
                            ? "bg-tertiary/15 text-tertiary"
                            : (priorityStyle[rec.priority] || "bg-primary/15 text-primary")
                        }`}
                      >
                        {isApplied ? "applied" : rec.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <span className="text-label-md text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {rec.action_time}
                      </span>
                      <span className="text-label-md text-tertiary font-bold">
                        Expected Saving: ₹{rec.saving_amount}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => !isApplied && handleApply(rec.id)}
                    disabled={isApplied}
                    className={`px-4 py-2 text-label-md rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                      isApplied
                        ? "bg-tertiary/15 text-tertiary cursor-default"
                        : "bg-primary text-on-primary hover:brightness-110 active:scale-95"
                    }`}
                    suppressHydrationWarning
                  >
                    {isApplied ? (
                      <>
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        Applied
                      </>
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Applied summary — shows when at least one is applied */}
      {applied.size > 0 && (
        <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 border-l-4 border-l-tertiary">
          <span className="material-symbols-outlined text-tertiary">check_circle</span>
          <p className="text-body-md text-on-surface">
            <span className="text-tertiary font-bold">{applied.size} recommendation{applied.size > 1 ? "s" : ""} applied</span>
            {" "}— savings updated in the stats above.
          </p>
        </div>
      )}
    </div>
  );
}