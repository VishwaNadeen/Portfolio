import { Router } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { adminAuth } from "../middleware/adminAuth";
import { GitHubProject } from "../models/GitHubProject";
import { syncGitHubProjectsToDb } from "../jobs/githubSyncJob";

const router = Router();

/**
 * POST /api/admin/login
 * body: { username, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};

    const adminUser    = process.env.ADMIN_USER;
    const adminPass    = process.env.ADMIN_PASS;
    const jwtSecretRaw = process.env.JWT_SECRET;           // keep raw for check
    const tokenExpire  = process.env.ADMIN_TOKEN_EXPIRES || "2h";

    if (!adminUser || !adminPass || !jwtSecretRaw) {
      return res.status(500).json({
        message: "Server misconfigured (.env missing admin/JWT settings)",
      });
    }

    // Now TypeScript knows these are strings
    const jwtSecret: string = jwtSecretRaw;

    // validate login
    if (username !== adminUser || password !== adminPass) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create JWT token – now type-safe
    const token = jwt.sign(
      { role: "admin", username },
      jwtSecret,                                 // string → matches Secret
      { expiresIn: tokenExpire as any }          // ← temporary escape hatch
      // or better – see alternatives below
    );

    return res.json({
      token,
      expiresIn: tokenExpire,
    });
  } catch (err: any) {
    console.error("POST /api/admin/login error:", err?.message || err);
    return res.status(500).json({ message: "Login failed" });
  }
});

/**
 * GET /api/admin/projects
 * includes hidden/private projects (admin view)
 */
router.get("/projects", adminAuth, async (_req, res) => {
  try {
    const items = await GitHubProject.find({})
      .sort({
        featured: -1,
        displayOrder: 1,
        stars: -1,
        pushedAt: -1,
      })
      .lean();

    return res.json(items);
  } catch (err: any) {
    console.error("GET /api/admin/projects error:", err?.message || err);
    return res.status(500).json({ message: "Failed to load admin projects" });
  }
});

/**
 * PATCH /api/admin/projects/:id
 * allowed fields:
 * featured
 * displayOrder
 * isHidden
 * customTitle
 * customDescription
 * liveUrl
 */
router.patch("/projects/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const allowed = [
      "featured",
      "displayOrder",
      "isHidden",
      "customTitle",
      "customDescription",
      "liveUrl",
    ] as const;

    const update: Record<string, any> = {};

    for (const k of allowed) {
      if (k in (req.body || {})) {
        update[k] = (req.body as any)[k];
      }
    }

    // minimal validation
    if ("displayOrder" in update) {
      const n = Number(update.displayOrder);
      update.displayOrder = Number.isFinite(n) ? n : 9999;
    }

    if ("featured" in update) update.featured = Boolean(update.featured);
    if ("isHidden" in update) update.isHidden = Boolean(update.isHidden);

    const saved = await GitHubProject.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!saved) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json(saved);
  } catch (err: any) {
    console.error("PATCH /api/admin/projects/:id error:", err?.message || err);
    return res.status(500).json({ message: "Update failed" });
  }
});

/**
 * POST /api/admin/github/sync
 * manual GitHub sync trigger
 */
router.post("/github/sync", adminAuth, async (_req, res) => {
  try {
    const result = await syncGitHubProjectsToDb();

    return res.json({
      message: "Synced successfully",
      ...result,
    });
  } catch (err: any) {
    console.error("POST /api/admin/github/sync error:", err?.message || err);
    return res.status(500).json({ message: "Sync failed" });
  }
});

export default router;