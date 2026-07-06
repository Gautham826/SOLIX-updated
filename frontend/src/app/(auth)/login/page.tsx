"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("solix_token", data.access_token);
      localStorage.setItem("solix_user", JSON.stringify(data.user));
      document.cookie = `solix_token=${data.access_token}; path=/; max-age=86400`;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Could not connect to server");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col md:flex-row overflow-hidden text-white" style={{ backgroundColor: "#020617" }}>
      {/* Left: visual */}
      <section className="relative w-full md:w-1/2 h-[300px] md:h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#020617" }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #3B82F6 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px]" style={{ backgroundColor: "rgba(59,130,246,0.15)" }} />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-[100px]" style={{ backgroundColor: "rgba(34,211,238,0.1)" }} />

        <div className="absolute top-8 left-8 z-30">
          <span className="text-2xl font-extrabold tracking-tighter" style={{ color: "#3B82F6" }}>SOLIX</span>
        </div>

        <div className="relative z-20 px-6 md:px-10 text-center md:text-left max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1 rounded-full border" style={{ borderColor: "rgba(34,211,238,0.3)", backgroundColor: "rgba(34,211,238,0.08)" }}>
            <span className="w-2 h-2 rounded-full ai-pulse" style={{ backgroundColor: "#22D3EE" }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#22D3EE" }}>System Online</span>
          </div>
          <h1 className="text-[44px] md:text-[52px] font-extrabold mb-6 leading-tight text-white">
            The future of energy management, <span style={{ color: "#3B82F6" }}>lit by AI.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md">
            Unlocking predictive grid intelligence and real-time efficiency through the SOLIX neural
            core.
          </p>
        </div>
      </section>

      {/* Right: form */}
      <section className="relative w-full md:w-1/2 min-h-[560px] md:h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#060d1f" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: "rgba(59,130,246,0.1)" }} />

        <div className="w-full max-w-md rounded-xl p-8 md:p-12 z-10 border border-white/10" style={{ backgroundColor: "#111827" }}>
          <header className="mb-10 text-center md:text-left">
            <h2 className="text-[32px] font-bold text-white mb-2">Welcome back</h2>
            <p className="text-base text-slate-400">Sign in to your SOLIX Control Dashboard</p>
          </header>

          {error && (
            <div className="text-sm rounded-lg px-4 py-3 mb-6 border" style={{ color: "#fca5a5", backgroundColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" autoComplete="on">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-white uppercase tracking-wider">Email</label>
              <div className="relative border-b border-white/20 focus-within:border-blue-500 transition-colors group">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">mail</span>
                <input
                  id="email" name="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-transparent border-none py-3 pl-10 focus:ring-0 outline-none text-white placeholder:text-slate-600"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-semibold text-white uppercase tracking-wider">Password</label>
                <span className="text-sm opacity-60" style={{ color: "#3B82F6" }}>Forgot Password?</span>
              </div>
              <div className="relative border-b border-white/20 focus-within:border-blue-500 transition-colors group">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">lock</span>
                <input
                  id="password" name="password" type={showPw ? "text" : "password"} autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none py-3 pl-10 pr-10 focus:ring-0 outline-none text-white placeholder:text-slate-600"
                  suppressHydrationWarning
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors" suppressHydrationWarning>
                  <span className="material-symbols-outlined">{showPw ? "visibility" : "visibility_off"}</span>
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-lg text-sm text-white uppercase tracking-[0.1em] font-bold mt-2 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#3B82F6" }}
              suppressHydrationWarning
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>Sign In<span className="material-symbols-outlined text-[20px]">login</span></>
              )}
            </button>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold hover:underline" style={{ color: "#3B82F6" }}>Register here</Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}