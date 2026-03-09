import { Router } from "express";
import Visit from "../models/Visit";

const router = Router();

router.post("/", async (req, res) => {
  const { page, referrer, device, country, city, sessionId } = req.body ?? {};

  if (!page || !sessionId) {
    return res.status(400).json({ message: "page and sessionId are required." });
  }

  await Visit.create({
    page,
    referrer,
    device: device || "unknown",
    country,
    city,
    sessionId,
  });

  return res.status(201).json({ message: "Tracked" });
});

export default router;