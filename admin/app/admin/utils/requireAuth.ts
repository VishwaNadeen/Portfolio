export function requireAuth() {
  if (typeof window === "undefined") return true;
  const token = localStorage.getItem("admin_token");
  return Boolean(token);
}