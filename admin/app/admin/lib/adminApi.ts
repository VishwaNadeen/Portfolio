import { API_BASE } from "./api";

export type AdminGitHubProject = {
  _id: string;
  repoId: number;
  name: string;
  fullName: string;
  htmlUrl: string;

  description?: string;
  language?: string;
  topics: string[];

  stars: number;
  forks: number;

  pushedAt?: string;
  updatedAtGithub?: string;

  isPrivate: boolean;
  featured: boolean;
  displayOrder: number;
  isHidden: boolean;

  customTitle?: string;
  customDescription?: string;
  liveUrl?: string;

  // NEW
  type?: string;
  platform?: string;

  createdAt: string;
  updatedAt: string;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json() as Promise<{ token: string; expiresIn: string }>;
}

export async function adminGetProjects(): Promise<AdminGitHubProject[]> {
  const token = getToken();

  const res = await fetch(`${API_BASE}/api/admin/projects`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Failed to load projects");

  return res.json();
}

export async function adminUpdateProject(
  id: string,
  patch: Partial<
    Pick<
      AdminGitHubProject,
      | "featured"
      | "displayOrder"
      | "isHidden"
      | "customTitle"
      | "customDescription"
      | "liveUrl"
      | "type"
      | "platform"
    >
  >
) {
  const token = getToken();

  const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });

  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Update failed");

  return res.json() as Promise<AdminGitHubProject>;
}

export async function adminSyncGitHub() {
  const token = getToken();

  const res = await fetch(`${API_BASE}/api/admin/github/sync`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Sync failed");

  return res.json();
}

export function adminLogout() {
  if (typeof window !== "undefined") localStorage.removeItem("admin_token");
}