import { Router } from "express";
import { GitHubProject } from "../models/GitHubProject";
import { syncGitHubProjectsToDb } from "../jobs/githubSyncJob";

const router = Router();

/**
 * ✅ Public-only filter (private repos never show)
 */
const PUBLIC_FILTER = { isHidden: false, isPrivate: false };

/**
 * GET /api/github/projects
 * (DB → public projects only)
 */
router.get("/projects", async (_req, res) => {
  try {
    const items = await GitHubProject.find(PUBLIC_FILTER)
      .sort({ featured: -1, displayOrder: 1, stars: -1 })
      .lean();

    return res.json(items);
  } catch (err: any) {
    console.error("GET /api/github/projects error:", err?.message || err);
    return res.status(500).json({ message: "Failed to load projects." });
  }
});

/**
 * ✅ GET /api/github/featured?limit=3
 * Home page Featured Projects → latest 3 public projects
 */
router.get("/featured", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 3), 12);

    const items = await GitHubProject.find(PUBLIC_FILTER)
      .sort({
        pushedAt: -1,
        updatedAtGithub: -1,
        stars: -1,
      })
      .limit(limit)
      .lean();

    return res.json(items);
  } catch (err: any) {
    console.error("GET /api/github/featured error:", err?.message || err);
    return res.status(500).json({ message: "Failed to load featured projects." });
  }
});

/**
 * POST /api/github/sync
 * ✅ Uses shared job (same logic used by cron)
 */
router.post("/sync", async (_req, res) => {
  try {
    const result = await syncGitHubProjectsToDb();

    return res.json({
      message: "Synced (public repos only) + cleaned removed/private repos",
      ...result,
    });
  } catch (err: any) {
    console.error("POST /api/github/sync error:", err?.message || err);
    return res.status(500).json({ message: "Sync failed." });
  }
});

export default router;