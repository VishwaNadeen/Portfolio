import { Router } from "express";
import crypto from "crypto";
import { syncGitHubStats } from "../services/platformSync";

const router = Router();

function verifySignature(req: any, secret: string) {
  const sig = req.headers["x-hub-signature-256"];
  if (!sig) return false;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(req.rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(sig));
}

// IMPORTANT: need raw body middleware for this route
router.post("/", async (req: any, res) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET || "";
  if (!secret) return res.status(500).json({ message: "Missing webhook secret" });

  if (!verifySignature(req, secret)) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  // for repo create/delete/push, just sync github stats
  await syncGitHubStats();
  return res.json({ message: "GitHub synced via webhook" });
});

export default router;