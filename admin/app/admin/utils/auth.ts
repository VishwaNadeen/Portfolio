import { adminLogout } from "../lib/adminApi";

export function getToken() {
  return null;
}

export async function logout() {
  await adminLogout();
}