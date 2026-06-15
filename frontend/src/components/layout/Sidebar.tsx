"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Zap, TrendingUp,
  Lightbulb, Upload, Settings, Battery
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Forecast", href: "/forecast", icon: TrendingUp },
  { label: "Surplus Analysis", href: "/surplus", icon: Battery },
  { label: "Optimization", href: "/optimize", icon: Zap },
  { label: "Recommendations", href: "/recommendations", icon: Lightbulb },
  { label: "Data Ingestion", href: "/ingestion", icon: Upload },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-yellow-400">SOLIX</h1>
            <p className="text-xs text-slate-400">Energy Intelligence</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-yellow-400 text-slate-900"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}>
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">SOLIX v1.0 • NexaGrid</p>
      </div>
    </aside>
  );
}