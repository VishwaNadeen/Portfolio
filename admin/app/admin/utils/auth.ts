export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem("admin_token");
}