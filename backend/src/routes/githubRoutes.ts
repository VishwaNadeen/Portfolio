import { Router } from "express";
import type { AnyBulkWriteOperation } from "mongoose";
import { GitHubProject, type IGitHubProject } from "../models/GitHubProject";

const router = Router();

function ghHeaders() {
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// GET /api/github/projects (from DB)
router.get("/projects", async (_req, res) => {
  try {
    const items = await GitHubProject.find({ isHidden: false })
      .sort({ featured: -1, displayOrder: 1, stars: -1 })
      .lean();

    return res.json(items);
  } catch (err: any) {
    console.error("GET /api/github/projects error:", err?.message || err);
    return res.status(500).json({ message: "Failed to load projects." });
  }
});

// POST /api/github/sync (pull from GitHub → save DB)
router.post("/sync", async (_req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME;
    if (!username) {
      return res.status(400).json({ message: "Missing GITHUB_USERNAME" });
    }

    const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
    const r = await fetch(url, { headers: ghHeaders() });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({
        message: "GitHub fetch failed",
        details: text,
      });
    }

    const repos: any[] = await r.json();

        const bulk: AnyBulkWriteOperation[] = repos
    .filter((repo) => !repo.fork)
    .map((repo) => ({
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
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            updatedAtGithub: repo.updated_at ? new Date(repo.updated_at) : undefined,
            pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : undefined,
            },
            $setOnInsert: {
            featured: false,
            displayOrder: 9999,
            isHidden: false,
            topics: [],
            },
        },
        upsert: true,
        },
    }));

    if (bulk.length) {
    await GitHubProject.bulkWrite(bulk);
    }

    return res.json({
      message: "Synced",
      totalFetched: repos.length,
      savedOrUpdated: bulk.length,
    });
    
  } catch (err: any) {
    console.error("POST /api/github/sync error:", err?.message || err);
    return res.status(500).json({ message: "Sync failed." });
  }
});

export default router;