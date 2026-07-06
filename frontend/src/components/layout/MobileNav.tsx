"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "Home" },
  { href: "/forecast", icon: "trending_up", label: "Forecast" },
  { href: "/recommendations", icon: "auto_awesome", label: "AI", center: true },
  { href: "/surplus", icon: "battery_charging_full", label: "Surplus" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-low/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center py-3 md:hidden">
      {ITEMS.map((it) =>
        it.center ? (
          <Link key={it.href} href={it.href} className="relative -top-6">
            <span className="bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg neo-glow-primary">
              <span className="material-symbols-outlined">{it.icon}</span>
            </span>
          </Link>
        ) : (
          <Link
            key={it.href}
            href={it.href}
            className={`flex flex-col items-center gap-1 ${
              pathname === it.href ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined">{it.icon}</span>
            <span className="text-[10px]">{it.label}</span>
          </Link>
        )
      )}
    </nav>
  );
}