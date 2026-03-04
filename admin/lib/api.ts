export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001";

/* ---------------------------
 * Types
 * --------------------------- */
export type StatsResponse = {
  github: null | {
    username: string;
    followers: number;
    publicRepos: number;
    profileUrl: string;
  };
  youtube: null | {
    channelId: string;
    title: string;
    subscribers: number;
    videoCount: number;
    viewCount: number;
  };
  fetchedAt: { github: string | null; youtube: string | null };
};

export type GitHubProject = {
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

  updatedAtGithub?: string;
  pushedAt?: string;

  isPrivate: boolean;
  featured: boolean;
  displayOrder: number;
  isHidden: boolean;

  customTitle?: string;
  customDescription?: string;
  liveUrl?: string;

  createdAt: string;
  updatedAt: string;
};

/* ---------------------------
 * Stats
 * --------------------------- */
export async function getLatestStats(): Promise<StatsResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/stats/latest`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as StatsResponse;
  } catch {
    return null;
  }
}

/* ---------------------------
 * GitHub Projects (DB)
 * --------------------------- */

// All public projects (DB)
export async function getGitHubProjects(): Promise<GitHubProject[]> {
  try {
    const res = await fetch(`${API_BASE}/api/github/projects`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as GitHubProject[];
  } catch {
    return [];
  }
}

// ✅ Featured (latest 3 public) for Home page
export async function getFeaturedGitHubProjects(limit = 3): Promise<GitHubProject[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/github/featured?limit=${limit}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return (await res.json()) as GitHubProject[];
  } catch {
    return [];
  }
}