import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

// Routes
import contactRoutes from "./routes/contactRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import githubRoutes from "./routes/githubRoutes";
import statsRoutes from "./routes/statsRoutes";
import githubWebhookRoutes from "./routes/githubWebhookRoutes";
import adminRoutes from "./routes/adminRoutes";
import cvRoutes from "./routes/cvRoutes";
import adminDashboardRoutes from "./routes/adminDashboardRoutes";
import visitRoutes from "./routes/visitRoutes";

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

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
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/public", visitRoutes);

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (
      typeof err?.message === "string" &&
      err.message.startsWith("CORS blocked")
    ) {
      return res.status(403).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
);

export default app;