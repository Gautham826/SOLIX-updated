"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";

const PAGES = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Forecast", href: "/forecast", icon: "trending_up" },
  { label: "Surplus Analysis", href: "/surplus", icon: "battery_charging_full" },
  { label: "Optimization", href: "/optimization", icon: "tune" },
  { label: "Recommendations", href: "/recommendations", icon: "auto_awesome" },
  { label: "Data Ingestion", href: "/ingestion", icon: "database" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export default function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const results = query
    ? PAGES.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
    : PAGES;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function go(href: string) {
    setQuery("");
    setOpen(false);
    router.push(href);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active].href);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("solix_token");
    localStorage.removeItem("solix_user");
    document.cookie = "solix_token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <header className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-xl border-b border-on-surface/10 shadow-sm md:pl-64">
      <div className="flex justify-between items-center px-4 md:px-8 h-16">
        <div className="flex items-center gap-4">
          <span className="md:hidden text-primary text-2xl font-extrabold">SOLIX</span>

          {/* Search */}
          <div className="relative hidden sm:block" ref={searchRef}>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setActive(0);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKey}
              className="bg-surface-container-highest/40 border-none rounded-full pl-10 pr-4 py-2 text-label-md text-on-surface focus:ring-1 focus:ring-primary w-64 outline-none"
              placeholder="Search pages..."
              suppressHydrationWarning
            />

            {open && results.length > 0 && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl py-2 z-50 shadow-2xl border border-outline-variant/40 bg-surface-container-high max-h-80 overflow-y-auto">
                {results.map((p, i) => (
                  <button
                    key={p.href}
                    onClick={() => go(p.href)}
                    onMouseEnter={() => setActive(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-label-md transition-colors ${
                      i === active
                        ? "bg-primary/15 text-primary"
                        : "text-on-surface-variant hover:bg-on-surface/5"
                    }`}
                    suppressHydrationWarning
                  >
                    <span className="material-symbols-outlined text-[20px]">{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <ThemeToggle />
          <button
            className="text-on-surface-variant hover:text-primary transition-colors"
            suppressHydrationWarning
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            className="text-on-surface-variant hover:text-primary transition-colors hidden sm:inline-flex"
            suppressHydrationWarning
          >
            <span className="material-symbols-outlined">settings_suggest</span>
          </button>

          {/* Profile + logout */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="h-10 w-10 rounded-full border border-primary/30 bg-primary/20 flex items-center justify-center text-primary hover:border-primary/60 transition-colors"
              suppressHydrationWarning
            >
              <span className="material-symbols-outlined">person</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-48 rounded-xl py-2 z-50 shadow-2xl border border-outline-variant/40 bg-surface-container-high">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-label-md text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface transition-colors"
                  suppressHydrationWarning
                >
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                  Settings
                </button>
                <div className="h-px bg-outline-variant/30 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-label-md text-error hover:bg-error/10 transition-colors"
                  suppressHydrationWarning
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}