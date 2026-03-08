import express, { Request, Response } from "express";
import multer from "multer";
import Cv from "../models/Cv";
import { adminAuth } from "../middleware/adminAuth";

const router = express.Router();

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only PDF, JPG, JPEG, PNG, and WEBP files are allowed")
      );
    }

    cb(null, true);
  },
});

function mapCv(cv: any) {
  return {
    _id: String(cv._id),
    filename: cv.filename,
    contentType: cv.contentType,
    size: cv.size,
    uploadedAt: cv.uploadedAt,
    viewUrl: "/api/cv/public/view",
    downloadUrl: "/api/cv/public/download",
  };
}

/**
 * TEMP TEST ROUTE
 * browser: http://localhost:5001/api/cv/test
 */
router.get("/test", (_req: Request, res: Response) => {
  return res.json({ ok: true, route: "cvRoutes working" });
});

/**
 * PUBLIC - get current CV metadata
 */
router.get("/public", async (_req: Request, res: Response) => {
  try {
    const cv = await Cv.findOne({})
      .sort({ uploadedAt: -1 })
      .exec();

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    return res.json(mapCv(cv));
  } catch {
    return res.status(500).json({ message: "Failed to fetch CV" });
  }
});

/**
 * PUBLIC - view CV in browser
 */
router.get("/public/view", async (_req: Request, res: Response) => {
  try {
    const cv = await Cv.findOne({})
      .sort({ uploadedAt: -1 })
      .exec();

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.setHeader("Content-Type", cv.contentType);
    res.setHeader("Content-Length", String(cv.size));
    res.setHeader("Content-Disposition", `inline; filename="${cv.filename}"`);

    return res.send(cv.data);
  } catch {
    return res.status(500).json({ message: "Failed to view CV" });
  }
});

/**
 * PUBLIC - download CV
 */
router.get("/public/download", async (_req: Request, res: Response) => {
  try {
    const cv = await Cv.findOne({})
      .sort({ uploadedAt: -1 })
      .exec();

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.setHeader("Content-Type", cv.contentType);
    res.setHeader("Content-Length", String(cv.size));
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${cv.filename}"`
    );

    return res.send(cv.data);
  } catch {
    return res.status(500).json({ message: "Failed to download CV" });
  }
});

/**
 * ADMIN - get current CV metadata
 */
router.get("/admin", adminAuth, async (_req: Request, res: Response) => {
  try {
    const cv = await Cv.findOne({})
      .sort({ uploadedAt: -1 })
      .exec();

    if (!cv) {
      return res.json(null);
    }

    return res.json(mapCv(cv));
  } catch {
    return res.status(500).json({ message: "Failed to fetch CV" });
  }
});

/**
 * helper for multer single upload
 */
function runUpload(req: Request, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    upload.single("cv")(req, res, (err: any) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

/**
 * ADMIN - upload new CV
 */
router.post("/admin", adminAuth, async (req: Request, res: Response) => {
  try {
    await runUpload(req, res);

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "CV file is required" });
    }

    // keep only one CV
    await Cv.deleteMany({}).exec();

    const newCv = await Cv.create({
      filename: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      data: file.buffer,
      uploadedAt: new Date(),
    });

    return res.status(201).json({
      message: "CV uploaded successfully",
      cv: mapCv(newCv),
    });
  } catch (err: any) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File size must be 5MB or less" });
      }

      return res.status(400).json({
        message: err.message || "Upload failed",
      });
    }

    if (err instanceof Error) {
      return res.status(400).json({
        message: err.message || "Invalid file upload",
      });
    }

    return res.status(500).json({
      message: "Failed to upload CV",
    });
  }
});

/**
 * ADMIN - replace current CV
 */
router.put("/admin/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    await runUpload(req, res);

    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "CV file is required" });
    }

    const existingCv = await Cv.findById(id).exec();

    if (!existingCv) {
      return res.status(404).json({ message: "CV not found" });
    }

    existingCv.filename = file.originalname;
    existingCv.contentType = file.mimetype;
    existingCv.size = file.size;
    existingCv.data = file.buffer;
    existingCv.uploadedAt = new Date();

    await existingCv.save();

    return res.json({
      message: "CV replaced successfully",
      cv: mapCv(existingCv),
    });
  } catch (err: any) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File size must be 5MB or less" });
      }

      return res.status(400).json({
        message: err.message || "Upload failed",
      });
    }

    if (err instanceof Error) {
      return res.status(400).json({
        message: err.message || "Invalid file upload",
      });
    }

    return res.status(500).json({
      message: "Failed to update CV",
    });
  }
});

/**
 * ADMIN - delete current CV
 */
router.delete("/admin/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedCv = await Cv.findByIdAndDelete(id).exec();

    if (!deletedCv) {
      return res.status(404).json({ message: "CV not found" });
    }

    return res.json({ message: "CV deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Failed to delete CV" });
  }
});

export default router;