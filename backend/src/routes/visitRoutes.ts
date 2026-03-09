import express from "express";
import Visit from "../models/Visit";

const router = express.Router();

router.post("/visit", async (_req, res) => {
  try {
    let visitDoc = await Visit.findOne();

    if (!visitDoc) {
      visitDoc = await Visit.create({ count: 1 });
    } else {
      visitDoc.count += 1;
      await visitDoc.save();
    }

    return res.json({ success: true, count: visitDoc.count });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Visit count failed" });
  }
});

export default router;