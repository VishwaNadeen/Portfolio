export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001";

export async function getLatestStats() {
  const res = await fetch(`${API_BASE}/api/stats/latest`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}