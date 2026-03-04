import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { startStatsCron } from "./jobs/statsCron";
import { startGitHubSyncCron } from "./jobs/githubSyncCron";

const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env ❌ ");
  process.exit(1);
}

connectDB(MONGODB_URI)
  .then(() => {
    startStatsCron();
    startGitHubSyncCron();

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT} ✅ `);
      console.log("Allowed CORS Origins:", process.env.CORS_ORIGINS || "(none)");
    });
  })
  .catch((err) => {
    console.error("DB connection error: ❌ ", err);
    process.exit(1);
  });