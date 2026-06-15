"use client";
import { Bell, User, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWeather } from "@/lib/api";

export default function Navbar() {
  const [userName, setUserName] = useState("User");
  const [weather, setWeather] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
  const stored = localStorage.getItem("solix_user");
  if (stored) {
    try {
      const user = JSON.parse(stored);
      setUserName(user.name);
    } catch {}
  }
  fetchWeather()
      .then((data) => {
        console.log("Weather data:", data);
        setWeather(data);
      })
      .catch((err) => console.error("Weather error:", err));
  }, []);

  function handleLogout() {
    localStorage.removeItem("solix_token");
    localStorage.removeItem("solix_user");
    document.cookie = "solix_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Good Morning, {userName} ☀️
        </h2>
        <p className="text-xs text-slate-500">
          Solar Output: Optimal • Grid: Stable
        </p>
      </div>

      <div className="flex items-center gap-3">

        {/* Weather Widget */}
        {weather && weather.main ? (
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <Sun className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-blue-700">
              {Math.round(weather.main.temp)}°C • {weather.weather[0].description}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
            <Sun className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Loading weather...</span>
          </div>
        )}

        {/* Solar Generated */}
        <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
          <Sun className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-green-700">18.4 kWh Generated</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs bg-red-500">
            3
          </Badge>
        </Button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <User className="w-4 h-4" />
          Logout
        </button>

      </div>
    </header>
  );
}

