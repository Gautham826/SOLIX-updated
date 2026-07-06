"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("prosumer");
  const [agree, setAgree] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (!agree) { setError("Please accept the Terms of Service to continue"); return; }
    setLoading(true);
    try {
      await registerUser({ name, email, password, role });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Could not create account");
      setLoading(false);
    }
  }

  const inputStyle = { backgroundColor: "#020617", borderColor: "rgba(255,255,255,0.15)" };

  return (
    <div className="h-screen flex items-stretch overflow-hidden text-white" style={{ backgroundColor: "#020617" }}>
      {/* Left: visual */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16" style={{ backgroundColor: "#060d1f" }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #3B82F6 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px]" style={{ backgroundColor: "rgba(59,130,246,0.15)" }} />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-[100px]" style={{ backgroundColor: "rgba(34,211,238,0.1)" }} />

        <div className="relative z-10 max-w-lg">
          <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full border" style={{ borderColor: "rgba(34,211,238,0.3)", backgroundColor: "rgba(34,211,238,0.08)" }}>
            <span className="w-2 h-2 rounded-full ai-pulse" style={{ backgroundColor: "#22D3EE" }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#22D3EE" }}>Now Live: AI Grid Engine</span>
          </div>
          <h1 className="text-[40px] xl:text-[48px] font-extrabold text-white mb-5 leading-tight">
            Join the next generation of <span style={{ color: "#3B82F6" }}>energy intelligence.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md">
            Deploy enterprise-scale solar grid management with AI-driven forecasting and real-time
            analytics.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="p-5 rounded-xl flex items-center gap-4 border border-white/10" style={{ backgroundColor: "#111827" }}>
              <span className="material-symbols-outlined text-3xl" style={{ color: "#3B82F6" }}>hub</span>
              <div>
                <div className="text-xl font-semibold text-white">Prophet</div>
                <div className="text-sm text-slate-500">+ LSTM Models</div>
              </div>
            </div>
            <div className="p-5 rounded-xl flex items-center gap-4 border border-white/10" style={{ backgroundColor: "#111827" }}>
              <span className="material-symbols-outlined text-3xl" style={{ color: "#22D3EE" }}>speed</span>
              <div>
                <div className="text-xl font-semibold text-white">Real-time</div>
                <div className="text-sm text-slate-500">IEX Insights</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right: form — scrolls internally only if needed */}
      <main className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto" style={{ backgroundColor: "#020617" }}>
        <div className="absolute top-6 left-6 lg:hidden">
          <span className="text-2xl font-extrabold tracking-tighter" style={{ color: "#3B82F6" }}>SOLIX</span>
        </div>

        <div className="w-full max-w-md space-y-5 py-4">
          <div className="text-center lg:text-left">
            <span className="hidden lg:block text-2xl font-extrabold tracking-tighter mb-4" style={{ color: "#3B82F6" }}>SOLIX</span>
            <h2 className="text-[28px] font-bold text-white mb-1">Create your account</h2>
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="hover:underline" style={{ color: "#3B82F6" }}>Login</Link>
            </p>
          </div>

          {error && (
            <div className="text-sm rounded-lg px-4 py-2.5 border" style={{ color: "#fca5a5", backgroundColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4" autoComplete="on">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                className="w-full border rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-0 outline-none text-white placeholder:text-slate-600 transition-colors" style={inputStyle} suppressHydrationWarning />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
              <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@organization.com"
                className="w-full border rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-0 outline-none text-white placeholder:text-slate-600 transition-colors" style={inputStyle} suppressHydrationWarning />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-0 outline-none text-white transition-colors appearance-none" style={inputStyle} suppressHydrationWarning>
                <option value="prosumer">Prosumer</option>
                <option value="industry">Industry</option>
                <option value="msme">MSME</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full border rounded-lg px-4 py-2.5 pr-10 focus:border-blue-500 focus:ring-0 outline-none text-white placeholder:text-slate-600 transition-colors" style={inputStyle} suppressHydrationWarning />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors" suppressHydrationWarning>
                    <span className="material-symbols-outlined text-[18px]">{showPw ? "visibility" : "visibility_off"}</span>
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm</label>
                <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••"
                  className="w-full border rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-0 outline-none text-white placeholder:text-slate-600 transition-colors" style={inputStyle} suppressHydrationWarning />
              </div>
            </div>

            <div className="flex items-start gap-3 pt-0.5">
              <input id="terms" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="w-4 h-4 mt-0.5 rounded" style={{ accentColor: "#3B82F6" }} suppressHydrationWarning />
              <label htmlFor="terms" className="text-xs text-slate-400 leading-tight">
                I agree to the <span style={{ color: "#3B82F6" }}>Terms of Service</span> and{" "}
                <span style={{ color: "#3B82F6" }}>Privacy Policy</span>.
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-lg text-white flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#3B82F6" }} suppressHydrationWarning>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>Create Account<span className="material-symbols-outlined">arrow_forward</span></>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}