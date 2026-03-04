import cron from "node-cron";
import { syncGitHubProjectsToDb } from "./githubSyncJob";

export function startSchedulers() {
  // ✅ every 6 hours (recommended)
  cron.schedule("0 */6 * * *", async () => {
    try {
      const result = await syncGitHubProjectsToDb();
      console.log("✅ GitHub auto-sync success:", result);
    } catch (err: any) {
      console.error("❌ GitHub auto-sync failed:", err?.message || err);
    }
  });

  // ✅ optional: run once at startup (nice)
  (async () => {
    try {
      const result = await syncGitHubProjectsToDb();
      console.log("✅ GitHub initial sync:", result);
    } catch (err: any) {
      console.error("❌ GitHub initial sync failed:", err?.message || err);
    }
  })();
}