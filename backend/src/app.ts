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
import adminRoutes from "./routes/adminRoutes";

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server / curl / postman (no origin)
      if (!origin) return cb(null, true);

      // allow if in list
      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/contact", contactRoutes);
app.use("/api/track", analyticsRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/github", githubWebhookRoutes);

app.use("/api/admin", adminRoutes);

export default app;