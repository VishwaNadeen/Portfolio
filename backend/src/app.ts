import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import contactRoutes from "./routes/contactRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import githubRoutes from "./routes/githubRoutes";
import statsRoutes from "./routes/statsRoutes";
import githubWebhookRoutes from "./routes/githubWebhookRoutes";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

// basic rate limit (avoid spam)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200
  })
);

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/contact", contactRoutes);
app.use("/api/track", analyticsRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/github", githubWebhookRoutes);

export default app;