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
  type?: string;
  platform?: string;

  createdAt: string;
  updatedAt: string;
};

async function parseJsonSafe(res: Response) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  const data = await parseJsonSafe(res);

  if (res.status === 401) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return data;
}

export async function adminLogout() {
  const res = await fetch(`${API_BASE}/api/admin/logout`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Logout failed");
  }

  return data;
}

export async function adminGetProjects(): Promise<AdminGitHubProject[]> {
  const res = await fetch(`${API_BASE}/api/admin/projects`, {
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
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
  const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(patch),
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Update failed");

  return res.json() as Promise<AdminGitHubProject>;
}

export async function adminSyncGitHub() {
  const res = await fetch(`${API_BASE}/api/admin/github/sync`, {
    method: "POST",
    credentials: "include",
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Sync failed");

  return res.json();
}