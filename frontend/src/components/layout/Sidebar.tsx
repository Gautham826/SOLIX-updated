"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/forecast", icon: "trending_up", label: "Forecast" },
  { href: "/surplus", icon: "battery_charging_full", label: "Surplus Analysis" },
  { href: "/optimization", icon: "tune", label: "Optimization" },
  { href: "/recommendations", icon: "auto_awesome", label: "Recommendations" },
  { href: "/ingestion", icon: "database", label: "Data Ingestion" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-50 bg-surface-container-low/60 backdrop-blur-xl border-r border-white/10 shadow-[0_0_20px_rgba(73,75,214,0.15)] hidden md:flex flex-col pt-8 pb-4">
      <div className="px-6 mb-10">
        <h1 className="text-headline-lg font-black text-tertiary">SOLIX AI</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-tertiary ai-pulse shadow-[0_0_8px_#4edea3]" />
          <span className="text-label-md text-on-surface-variant opacity-80 uppercase tracking-widest">
            System Active
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex items-center gap-3 bg-primary/20 text-primary border-l-4 border-primary px-6 py-4 transition-all duration-300"
                  : "flex items-center gap-3 text-on-surface-variant px-6 py-4 opacity-70 hover:bg-white/5 hover:opacity-100 transition-all border-l-4 border-transparent"
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <button
          onClick={() => router.push("/optimization")}
          className="w-full bg-primary text-on-primary text-label-md py-4 rounded-xl btn-spring flex items-center justify-center gap-2 neo-glow-primary"
          suppressHydrationWarning
        >
          Optimize Now
          <span className="material-symbols-outlined text-[18px]">bolt</span>
        </button>
      </div>
    </aside>
  );
}