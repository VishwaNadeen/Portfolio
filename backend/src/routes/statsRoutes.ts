import { Router } from "express";
import { PlatformStats } from "../models/PlatformStats";
import { syncAllPlatformStats } from "../services/platformSync";

const router = Router();

// GET /api/stats/latest  -> returns latest github + youtube stats from DB
router.get("/latest", async (_req, res) => {
  const [githubDoc, youtubeDoc] = await Promise.all([
    PlatformStats.findOne({ platform: "github" }).sort({ fetchedAt: -1 }).lean(),
    PlatformStats.findOne({ platform: "youtube" }).sort({ fetchedAt: -1 }).lean(),
  ]);

  return res.json({
    github: githubDoc?.data || null,
    youtube: youtubeDoc?.data || null,
    fetchedAt: {
      github: githubDoc?.fetchedAt || null,
      youtube: youtubeDoc?.fetchedAt || null,
    },
  });
});

// POST /api/stats/sync -> fetch from APIs and save into DB
router.post("/sync", async (_req, res) => {
  try {
    const data = await syncAllPlatformStats();
    return res.json({ message: "Synced", data });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: "Sync failed", error: e?.message || "Unknown" });
  }
});

export default router;