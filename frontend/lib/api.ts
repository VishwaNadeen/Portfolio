export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001";

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
  type?: string;
  platform?: string;
  imageUrl?: string;
  imagePublicId?: string;
  hasCustomImage?: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getLatestStats(): Promise<StatsResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/stats/latest`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return (await res.json()) as StatsResponse;
  } catch {
    return null;
  }
}

/* ---------------------------
 * GitHub Projects (DB)
 * --------------------------- */

export async function getGitHubProjects(): Promise<GitHubProject[]> {
  try {
    const res = await fetch(`${API_BASE}/api/github/projects`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as GitHubProject[];

    return data.map((item) => ({
      ...item,
      customTitle: item.customTitle || "",
      customDescription: item.customDescription || "",
      liveUrl: item.liveUrl || "",
      type: item.type || "",
      platform: item.platform || "",
      imageUrl: item.imageUrl || "",
      imagePublicId: item.imagePublicId || "",
      hasCustomImage: item.hasCustomImage ?? Boolean(item.imagePublicId),
    }));
  } catch {
    return [];
  }
}

export async function getFeaturedGitHubProjects(
  limit = 3
): Promise<GitHubProject[]> {
  try {
    const res = await fetch(`${API_BASE}/api/github/featured?limit=${limit}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as GitHubProject[];

    return data.map((item) => ({
      ...item,
      customTitle: item.customTitle || "",
      customDescription: item.customDescription || "",
      liveUrl: item.liveUrl || "",
      type: item.type || "",
      platform: item.platform || "",
      imageUrl: item.imageUrl || "",
      imagePublicId: item.imagePublicId || "",
      hasCustomImage: item.hasCustomImage ?? Boolean(item.imagePublicId),
    }));
  } catch {
    return [];
  }
}