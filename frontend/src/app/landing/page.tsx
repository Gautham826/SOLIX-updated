"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden text-white" style={{ backgroundColor: "#020617" }}>
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: "rgba(2,6,23,0.8)" }}>
        <nav className="flex justify-between items-center h-16 px-6 max-w-[1280px] mx-auto">
          <span className="text-[28px] font-extrabold tracking-tighter" style={{ color: "#3B82F6" }}>
            SOLIX
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-base text-slate-300 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link
              href="/register"
              className="text-white text-base px-6 py-2.5 rounded-full font-bold hover:brightness-110 active:scale-95 transition-all duration-200"
              style={{ backgroundColor: "#3B82F6" }}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative flex items-center overflow-hidden px-6 py-14">
          <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] rounded-full blur-[120px]" style={{ backgroundColor: "rgba(59,130,246,0.18)" }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px]" style={{ backgroundColor: "rgba(34,211,238,0.12)" }} />

          <div className="relative z-10 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full w-fit border" style={{ backgroundColor: "rgba(34,211,238,0.12)", borderColor: "rgba(34,211,238,0.3)" }}>
                <span className="flex h-2 w-2 rounded-full ai-pulse" style={{ backgroundColor: "#22D3EE" }} />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#22D3EE" }}>
                  Live AI Energy OS v2.4
                </span>
              </div>
              <h1 className="text-[44px] md:text-[52px] font-extrabold tracking-tight leading-[1.05] text-white">
                Transform rooftop solar into{" "}
                <span style={{ color: "#3B82F6" }}>intelligent energy revenue.</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                SOLIX AI is the operating system for solar energy — forecasting, surplus analysis,
                optimization and IEX-grade trading recommendations for industries, MSMEs, and
                prosumers.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/register"
                  className="text-white text-xl px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all"
                  style={{ backgroundColor: "#3B82F6" }}
                >
                  Start Trading
                  <span className="material-symbols-outlined">trending_up</span>
                </Link>
                <Link
                  href="/login"
                  className="text-xl px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-white/5 transition-all border border-white/15 text-white"
                  style={{ backgroundColor: "#111827" }}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_circle
                  </span>
                  Sign In
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 pt-5 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#3B82F6" }}>IEX DAM / RTM</span>
                  <span className="text-2xl font-semibold text-white">Integrated</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#22D3EE" }}>Prophet • LSTM</span>
                  <span className="text-2xl font-semibold text-white">AI Models</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#3B82F6" }}>TNEB Aligned</span>
                  <span className="text-2xl font-semibold text-white">Retrofit</span>
                </div>
              </div>
            </div>

            {/* Hero visual card */}
            <div className="relative lg:block hidden">
              <div className="absolute -inset-8 rounded-full blur-[80px]" style={{ backgroundColor: "rgba(59,130,246,0.18)" }} />
              <div className="p-6 rounded-3xl relative border border-white/15" style={{ backgroundColor: "#111827" }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full ai-pulse" style={{ backgroundColor: "#22D3EE" }} />
                    <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Live Grid Status</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: "#3B82F6" }}>solar_power</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border" style={{ backgroundColor: "rgba(34,211,238,0.08)", borderColor: "rgba(34,211,238,0.2)" }}>
                    <span className="text-slate-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]" style={{ color: "#22D3EE" }}>wb_sunny</span>
                      Solar Generation
                    </span>
                    <span className="font-bold" style={{ color: "#22D3EE" }}>+12.4 kWh</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl border" style={{ backgroundColor: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.2)" }}>
                    <span className="text-slate-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]" style={{ color: "#3B82F6" }}>battery_charging_full</span>
                      Surplus Available
                    </span>
                    <span className="font-bold" style={{ color: "#3B82F6" }}>Ready to export</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl border" style={{ backgroundColor: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.2)" }}>
                    <span className="text-slate-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]" style={{ color: "#3B82F6" }}>currency_rupee</span>
                      Revenue Potential
                    </span>
                    <span className="font-bold" style={{ color: "#3B82F6" }}>₹342 / day</span>
                  </div>
                  <div className="h-28 rounded-2xl border border-white/5 flex items-end p-3 gap-1.5" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                    {[40, 65, 55, 85, 70, 95, 80].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: "rgba(59,130,246,0.6)" }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="py-12 border-y border-white/10" style={{ backgroundColor: "#060d1f" }}>
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "savings", value: "15-25%", label: "Cost Reduction", color: "#22D3EE" },
              { icon: "query_stats", value: "94.2%", label: "Forecast Accuracy", color: "#3B82F6" },
              { icon: "currency_rupee", value: "₹342", label: "Daily Potential", color: "#3B82F6" },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-5 group">
                <div className="h-14 w-14 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${m.color}1a`, borderColor: `${m.color}33`, color: m.color }}>
                  <span className="material-symbols-outlined text-[28px]">{m.icon}</span>
                </div>
                <div>
                  <h4 className="text-[36px] font-extrabold" style={{ color: m.color }}>{m.value}</h4>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6 max-w-[1280px] mx-auto">
          <div className="flex flex-col items-center text-center mb-10 gap-3">
            <h2 className="text-[36px] font-extrabold text-white">
              The OS for the <span style={{ color: "#3B82F6" }}>New Grid</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl">
              An autonomous intelligence layer that bridges rooftop hardware and financial markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:auto-rows-[1fr]">
            <div className="md:col-span-8 rounded-3xl p-7 flex flex-col justify-between border border-white/10 transition-all duration-300 hover:border-white/20" style={{ backgroundColor: "#111827", borderTop: "2px solid rgba(59,130,246,0.5)" }}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold px-3 py-1 rounded-full w-fit" style={{ color: "#3B82F6", backgroundColor: "rgba(59,130,246,0.15)" }}>
                    Proprietary AI
                  </span>
                  <h3 className="text-[28px] font-bold text-white">Predictive Forecasting</h3>
                  <p className="text-base text-slate-400 max-w-md">
                    Hybrid Prophet + LSTM models process weather, historical generation, and grid
                    factors to predict output within a 2.4% error margin.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl" style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#3B82F6" }}>
                  <span className="material-symbols-outlined text-[36px]">timeline</span>
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl h-36 border border-white/5 flex items-end p-3 gap-1.5" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                {[30, 45, 38, 62, 50, 75, 60, 88, 70, 95, 82, 90].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: "rgba(59,130,246,0.6)" }} />
                ))}
              </div>
            </div>

            <div className="md:col-span-4 md:row-span-2 rounded-3xl p-7 flex flex-col justify-between border border-white/10 transition-all duration-300 hover:border-white/20" style={{ backgroundColor: "#111827", borderTop: "2px solid rgba(34,211,238,0.5)" }}>
              <div className="flex flex-col gap-3">
                <div className="p-3.5 rounded-2xl w-fit" style={{ backgroundColor: "rgba(34,211,238,0.1)", color: "#22D3EE" }}>
                  <span className="material-symbols-outlined text-[36px]">currency_exchange</span>
                </div>
                <h3 className="text-[28px] font-bold text-white">Surplus Monetization</h3>
                <p className="text-base text-slate-400">
                  Sell excess solar into the Day-Ahead (DAM) and Real-Time (RTM) markets via
                  aggregators, based on optimized yield strategies.
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center p-3.5 rounded-xl border" style={{ backgroundColor: "rgba(34,211,238,0.08)", borderColor: "rgba(34,211,238,0.2)" }}>
                  <span className="text-slate-300">Current Pool</span>
                  <span className="font-bold" style={{ color: "#22D3EE" }}>+12.4% yield</span>
                </div>
                <div className="flex justify-between items-center p-3.5 rounded-xl border" style={{ backgroundColor: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.2)" }}>
                  <span className="text-slate-300">Risk Factor</span>
                  <span className="font-bold" style={{ color: "#3B82F6" }}>Minimal</span>
                </div>
                <div className="h-28 rounded-xl border border-white/5 flex items-end p-3 gap-1.5 mt-3" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  {[50, 70, 60, 85, 75, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: "rgba(34,211,238,0.6)" }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 rounded-3xl p-7 flex flex-col justify-between border border-white/10 transition-all duration-300 hover:border-white/20" style={{ backgroundColor: "#111827", borderTop: "2px solid rgba(34,211,238,0.5)" }}>
              <div className="p-3.5 rounded-2xl w-fit mb-3" style={{ backgroundColor: "rgba(34,211,238,0.1)", color: "#22D3EE" }}>
                <span className="material-symbols-outlined text-[28px]">bolt</span>
              </div>
              <div>
                <h3 className="text-[28px] font-bold text-white">Grid Optimization</h3>
                <p className="text-base text-slate-400">
                  OR-Tools load balancing reduces peak-demand surcharges and maximizes
                  self-consumption.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 rounded-3xl p-7 flex flex-col justify-between border border-white/10 transition-all duration-300 hover:border-white/20" style={{ backgroundColor: "#111827", borderTop: "2px solid rgba(59,130,246,0.5)" }}>
              <div className="p-3.5 rounded-2xl w-fit mb-3" style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#3B82F6" }}>
                <span className="material-symbols-outlined text-[28px]">settings_input_component</span>
              </div>
              <div>
                <h3 className="text-[28px] font-bold text-white">TNEB Integration</h3>
                <p className="text-base text-slate-400">
                  Works with existing TNEB / TANGEDCO meter data and net-metering — no new hardware.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6">
          <div className="max-w-[1280px] mx-auto rounded-[32px] p-1" style={{ backgroundColor: "#3B82F6" }}>
            <div className="rounded-[30px] p-10 md:p-16 relative overflow-hidden flex flex-col items-center text-center" style={{ backgroundColor: "#020617" }}>
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[100px]" style={{ backgroundColor: "rgba(59,130,246,0.2)" }} />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-[100px]" style={{ backgroundColor: "rgba(34,211,238,0.15)" }} />
              <h2 className="relative z-10 text-[36px] md:text-[44px] font-extrabold mb-4 max-w-3xl text-white">
                Ready to turn <span style={{ color: "#22D3EE" }}>sunlight into capital?</span>
              </h2>
              <p className="relative z-10 text-lg text-slate-400 max-w-xl mb-8">
                Join SOLIX and start turning surplus solar into revenue. Setup works with your
                existing meter — no installation needed.
              </p>
              <div className="relative z-10 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="text-white text-xl px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                  style={{ backgroundColor: "#3B82F6" }}
                >
                  Get Started Now
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link
                  href="/login"
                  className="text-xl px-8 py-4 rounded-2xl font-bold hover:bg-white/5 transition-all border border-white/15 text-white"
                  style={{ backgroundColor: "#111827" }}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/10" style={{ backgroundColor: "#060d1f" }}>
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[22px] font-extrabold" style={{ color: "#3B82F6" }}>SOLIX</span>
          <p className="text-sm text-slate-500 text-center">
            © 2026 SOLIX • Built by NexaGrid — AI for Social Impact
          </p>
        </div>
      </footer>
    </div>
  );
}