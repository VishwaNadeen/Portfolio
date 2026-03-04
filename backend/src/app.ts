import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Routes
import contactRoutes from "./routes/contactRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import githubRoutes from "./routes/githubRoutes";
import statsRoutes from "./routes/statsRoutes";
import githubWebhookRoutes from "./routes/githubWebhookRoutes";

// Admin routes
import adminRoutes from "./routes/adminRoutes";

const app = express();

// Middleware
app.use(helmet());

// ONE CORS ONLY (portfolio + admin)
app.use(
  cors({
    origin: [
      "http://localhost:3000", // portfolio frontend
      "http://localhost:3001", // admin panel
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// basic rate limit (avoid spam)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
  })
);

// Health check endpoint
app.get("/health", (_req, res) => res.json({ ok: true }));

// Public routes
app.use("/api/contact", contactRoutes);
app.use("/api/track", analyticsRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/github", githubWebhookRoutes);

// Admin routes (require adminAuth middleware)
app.use("/api/admin", adminRoutes);

export default app;