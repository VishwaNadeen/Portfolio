import {
  getFeaturedGitHubProjects,
  getGitHubProjects,
  type GitHubProject,
} from "@/lib/api";

export type Project = {
  title: string;
  description?: string;
  link?: string;
  githubUrl?: string;
  tech?: string[];
  stars?: number;
  forks?: number;
  type?: string;
  platform?: string;
  imageUrl?: string;
};

function mapGitHubProjectToProject(item: GitHubProject): Project {
  return {
    title: item.customTitle?.trim() || item.name,
    description: item.customDescription?.trim() || item.description || "",
    link: item.liveUrl?.trim() || "",
    githubUrl: item.htmlUrl,
    tech: Array.isArray(item.topics) ? item.topics : [],
    stars: item.stars ?? 0,
    forks: item.forks ?? 0,
    type: item.type?.trim() || "",
    platform: item.platform?.trim() || "",
    imageUrl: item.imageUrl?.trim() || "",
  };
}

export async function getProjects(): Promise<Project[]> {
  const items = await getGitHubProjects();
  return items.map(mapGitHubProjectToProject);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const items = await getFeaturedGitHubProjects(limit);
  return items.map(mapGitHubProjectToProject);
}