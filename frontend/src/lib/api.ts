const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://solix-swys.onrender.com";

const cache = new Map<string, { data: any; ts: number }>();
const inflight = new Map<string, Promise<any>>();
const CACHE_TTL = 300_000; // 5 minutes

function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("solix_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || `Request failed (${res.status})`);
  }
  return data;
}

// Fetches fresh data and updates cache (deduped so concurrent calls share one request)
function revalidate(url: string): Promise<any> {
  if (inflight.has(url)) return inflight.get(url)!;
  const p = fetch(url, { headers: authHeaders() })
    .then(parseOrThrow)
    .then((data) => {
      cache.set(url, { data, ts: Date.now() });
      inflight.delete(url);
      return data;
    })
    .catch((err) => {
      inflight.delete(url);
      throw err;
    });
  inflight.set(url, p);
  return p;
}

// Stale-while-revalidate: return cached instantly if present; refresh in background when stale
async function cachedFetch(url: string) {
  const cached = cache.get(url);
  if (cached) {
    const isStale = Date.now() - cached.ts >= CACHE_TTL;
    if (isStale) {
      // refresh in background, but return stale data now (don't await)
      revalidate(url).catch(() => {});
    }
    return cached.data;
  }
  // nothing cached yet — must wait for the first fetch
  return revalidate(url);
}

export async function fetchSurplus() {
  return cachedFetch(`${API_BASE}/meter/surplus`);
}

export async function fetchForecasts(days = 7) {
  return cachedFetch(`${API_BASE}/forecast/?days=${days}`);
}

export async function fetchHourlyForecast() {
  return cachedFetch(`${API_BASE}/forecast/hourly`);
}

export async function fetchForecastAccuracy() {
  return cachedFetch(`${API_BASE}/forecast/accuracy`);
}

export async function fetchRecommendations() {
  return cachedFetch(`${API_BASE}/recommendations/`);
}

export async function fetchWeather() {
  return cachedFetch(`${API_BASE}/forecast/weather`);
}

export async function uploadMeterCsv(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  cache.clear(); // clear cache after upload so fresh data loads everywhere
  const res = await fetch(`${API_BASE}/meter/upload-csv`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return parseOrThrow(res);
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseOrThrow(res);
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseOrThrow(res);
}

export function warmupBackend() {
  fetch(`${API_BASE}/health`).catch(() => {});
}