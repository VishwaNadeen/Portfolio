import cron from "node-cron";
import { syncAllPlatformStats } from "../services/platformSync";

export function startStatsCron() {
  // every 6 hours (recommended)
  cron.schedule("0 */6 * * *", async () => {
    try {
      await syncAllPlatformStats();
      console.log("✅ Auto sync done (GitHub + YouTube)");
    } catch (e) {
      console.error("❌ Auto sync failed:", e);
    }
  });

  // OPTIONAL: every 1 hour (more frequent, uses more API quota)
  // cron.schedule("0 * * * *", async () => { ... });
}