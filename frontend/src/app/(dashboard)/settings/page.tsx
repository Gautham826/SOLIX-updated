"use client";
import { useState, useEffect } from "react";

const DEFAULTS = {
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "600001",
  capacity: "5",
  panels: "20",
  install: "2024-01-15",
  importTariff: "6.50",
  exportRate: "4.50",
  discom: "TANGEDCO",
};

function Field({
  label,
  id,
  value,
  type = "text",
  step,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  type?: string;
  step?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <label
        htmlFor={id}
        className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-widest"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3.5 text-[15px] text-on-surface outline-none transition-colors border focus:ring-2 focus:ring-primary"
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          borderColor: "rgba(255,255,255,0.14)",
        }}
        suppressHydrationWarning
      />
    </div>
  );
}

export default function SettingsPage() {
  const [form, setForm] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("solix_settings");
    if (stored) setForm(JSON.parse(stored));
  }, []);

  function handleChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    localStorage.setItem("solix_settings", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  // calc viewport height minus topbar(~64px) and layout padding
  const contentHeight = "calc(100vh - 64px - 40px)";

  return (
    <div className="flex flex-col gap-4" style={{ height: contentHeight }}>

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">settings</span>
          </div>
          <div>
            <h1 className="text-headline-md text-on-surface">Settings</h1>
            <p className="text-body-md text-on-surface-variant">
              Configure your energy profile and preferences
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="px-7 py-3 bg-primary text-on-primary text-[14px] font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 neo-glow-primary"
          suppressHydrationWarning
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          Save Settings
        </button>
      </div>

      {/* Success banner */}
      {saved && (
        <div
          className="rounded-xl px-4 py-3 text-tertiary text-[14px] flex items-center gap-2 shrink-0"
          style={{
            backgroundColor: "rgba(78,222,163,0.08)",
            border: "1px solid rgba(78,222,163,0.2)",
            borderLeft: "4px solid #4edea3",
          }}
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          Settings saved successfully!
        </div>
      )}

      {/* Top row — fills remaining height */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">

        {/* Location card */}
        <div
          className="rounded-2xl p-7 flex flex-col gap-6 h-full"
          style={{
            background: "rgba(19,27,46,0.75)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "3px solid #22d3ee",
            boxShadow: "0 4px 32px rgba(34,211,238,0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(34,211,238,0.12)" }}>
              <span className="material-symbols-outlined text-[22px]" style={{ color: "#22d3ee" }}>
                location_on
              </span>
            </div>
            <h2 className="text-[18px] font-bold text-on-surface">Location</h2>
          </div>

          <div className="flex flex-col gap-5 flex-1 justify-evenly">
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" id="city" value={form.city}
                onChange={(v) => handleChange("city", v)} />
              <Field label="State" id="state" value={form.state}
                onChange={(v) => handleChange("state", v)} />
            </div>
            <Field label="Pincode" id="pincode" value={form.pincode}
              onChange={(v) => handleChange("pincode", v)} />
          </div>
        </div>

        {/* Solar card */}
        <div
          className="rounded-2xl p-7 flex flex-col gap-6 h-full"
          style={{
            background: "rgba(19,27,46,0.75)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "3px solid #ffb95f",
            boxShadow: "0 4px 32px rgba(255,185,95,0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,185,95,0.12)" }}>
              <span className="material-symbols-outlined text-[22px]" style={{ color: "#ffb95f" }}>
                wb_sunny
              </span>
            </div>
            <h2 className="text-[18px] font-bold text-on-surface">Solar Configuration</h2>
          </div>

          <div className="flex flex-col gap-5 flex-1 justify-evenly">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Solar Capacity (kW)" id="capacity" value={form.capacity}
                type="number" onChange={(v) => handleChange("capacity", v)} />
              <Field label="Number of Panels" id="panels" value={form.panels}
                type="number" onChange={(v) => handleChange("panels", v)} />
            </div>
            <Field label="Installation Date" id="install" value={form.install}
              type="date" onChange={(v) => handleChange("install", v)} />
          </div>
        </div>
      </div>

      {/* Bottom card — Energy Tariff */}
      <div
        className="rounded-2xl p-7 flex flex-col gap-5 shrink-0"
        style={{
          background: "rgba(19,27,46,0.75)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "3px solid #4edea3",
          boxShadow: "0 4px 32px rgba(78,222,163,0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(78,222,163,0.12)" }}>
            <span className="material-symbols-outlined text-[22px]" style={{ color: "#4edea3" }}>
              currency_rupee
            </span>
          </div>
          <h2 className="text-[18px] font-bold text-on-surface">Energy Tariff</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Field label="Import Tariff (₹/kWh)" id="import" value={form.importTariff}
            type="number" step="0.01" onChange={(v) => handleChange("importTariff", v)} />
          <Field label="Export Rate (₹/kWh)" id="export" value={form.exportRate}
            type="number" step="0.01" onChange={(v) => handleChange("exportRate", v)} />
          <Field label="DISCOM Provider" id="discom" value={form.discom}
            onChange={(v) => handleChange("discom", v)} />
        </div>
      </div>

      {/* Info strip */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3 shrink-0"
        style={{
          background: "rgba(192,193,255,0.05)",
          border: "1px solid rgba(192,193,255,0.1)",
          borderLeft: "3px solid #c0c1ff",
        }}
      >
        <span className="material-symbols-outlined text-primary text-[18px]">info</span>
        <p className="text-[12px] text-on-surface-variant">
          Settings are saved locally and used to personalise forecasts, tariff calculations, and recommendations.
        </p>
      </div>

    </div>
  );
}