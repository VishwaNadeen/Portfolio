import type { AnyBulkWriteOperation } from "mongoose";
import { GitHubProject } from "../models/GitHubProject";

function ghHeaders() {
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function syncGitHubProjectsToDb() {
  const username = process.env.GITHUB_USERNAME;
  if (!username) throw new Error("Missing GITHUB_USERNAME");

  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
  const r = await fetch(url, { headers: ghHeaders() });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(`GitHub fetch failed (${r.status}): ${text}`);
  }

  const repos: any[] = await r.json();

  // ✅ keep only public + non-fork
  const keepRepos = repos.filter((repo) => !repo.fork && repo.private === false);
  const keepRepoIds = keepRepos.map((repo) => repo.id);

  // ✅ delete removed OR turned private OR became fork
  const deleteResult = await GitHubProject.deleteMany({
    repoId: { $nin: keepRepoIds },
  });

  // ✅ upsert keep repos
  const bulk: AnyBulkWriteOperation[] = keepRepos.map((repo) => ({
    updateOne: {
      filter: { repoId: repo.id },
      update: {
        $set: {
          repoId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          htmlUrl: repo.html_url,

          description: repo.description || "",
          language: repo.language || "",
          topics: Array.isArray(repo.topics) ? repo.topics : [],

          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,

          isPrivate: !!repo.private,
          updatedAtGithub: repo.updated_at ? new Date(repo.updated_at) : undefined,
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : undefined,
        },
        $setOnInsert: {
          featured: false,
          displayOrder: 9999,
          isHidden: false,
        },
      },
      upsert: true,
    },
  }));

  if (bulk.length) await GitHubProject.bulkWrite(bulk);

  return {
    totalFetched: repos.length,
    keepPublicFetched: keepRepos.length,
    savedOrUpdated: bulk.length,
    deletedFromDb: deleteResult.deletedCount,
  };
}