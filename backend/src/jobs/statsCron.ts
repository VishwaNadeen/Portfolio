import cron from "node-cron";
import { syncAllPlatformStats } from "../services/platformSync";

export function startStatsCron() {

  console.log("Stats cron scheduled: every 6 hours ⏱️ ");

  // ✅ Run once immediately when server starts
  (async () => {
    try {
      await syncAllPlatformStats();
      console.log("Initial sync done (GitHub + YouTube) ✅ ");
    } catch (e) {
      console.error("❌ Initial sync failed:", e);
    }
  })();

  // ✅ Run every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    try {
      await syncAllPlatformStats();
      console.log("Auto sync done (GitHub + YouTube) ✅ ");
    } catch (e) {
      console.error("❌ Auto sync failed:", e);
    }
  });

}